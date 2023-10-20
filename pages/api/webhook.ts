// React/Next
import { NextApiRequest, NextApiResponse, NextConfig } from 'next';

// Packages
import { buffer } from 'micro';
import Stripe from 'stripe';
import sequelize from '@/database/sequelize';

// Database Models
import Order from '@/database/models/Order';

// Utils
import sendCustomerEmail from '@/utils/sendCustomerEmail';

interface stripeSession extends Stripe.Event.Data.Object {
    metadata?: any;
    id?: string;
    amount?: number;
}

export const config: NextConfig = {
    api: {
        bodyParser: false,
    },
};

export default async function webhookHandler(
    request: NextApiRequest,
    response: NextApiResponse
): Promise<void> {
    if (!process.env.STRIPE_PRIVATE_KEY) {
        console.error('Stripe private key undefined');
        return;
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('Stripe webhook key undefined');
        return;
    }
    const stripePrivateKey: string = process.env.STRIPE_PRIVATE_KEY;
    const stripeWebhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET;

    const stripe: Stripe = new Stripe(stripePrivateKey, {
        apiVersion: '2022-11-15',
    });

    if (request.method === 'POST') {
        const buf: Buffer = await buffer(request);
        if (!request.headers['stripe-signature']) {
            console.error('Signature undefined');
            return;
        }
        const signature: string | string[] =
            request.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                buf.toString(),
                signature,
                stripeWebhookSecret
            );
        } catch (error: any) {
            console.error(`Webhook error: ${error.message}`);
            return response.status(400).send(`Webhook Error: ${error.message}`);
        }

        if (event.type === 'payment_intent.succeeded') {
            const session: stripeSession = event.data.object;
            const customer: Stripe.Response<
                Stripe.Customer | Stripe.DeletedCustomer
            > = await stripe.customers.retrieve(session.metadata.customerId);
            createOrder(customer, session);
        }

        response.status(200).json({ received: true });
    } else {
        response.setHeader('Allow', 'POST');
        response.status(405).end('Method Not Allowed');
    }
}

async function createOrder(
    customer: any,
    session: stripeSession
): Promise<void> {
    if (!session.id) {
        console.error('Stripe payment id is undefined');
        return;
    }
    if (!session.amount) {
        console.error('Stripe total price is undefined');
        return;
    }
    await sequelize.sync();
    const newOrder: Order = Order.build({
        email: customer.email,
        name: customer.name,
        phoneNumber: customer.phone,
        cityTown: customer.address.city,
        addressLine1: customer.address.line1,
        addressLine2: customer.address.line2,
        postCode: customer.address.postal_code,
        orderNote: customer.metadata.orderNote,
        stripeCustomerId: session.metadata.customerId,
        stripePaymentId: session.id,
        products: session.metadata.cart,
        totalPayment: session.amount,
    } as Order);

    await newOrder
        .save()
        .then((order: Order) => sendCustomerEmail(order.orderId))
        .catch((error: string) => {
            console.error('Error inserting order:', error);
        });
}
