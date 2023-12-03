// React/Next
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Database Models
import Order from '@/database/models/Order';

// Utils
import getDateFromTimestamp from '@/utils/getDateFromTimestamp';
import getTimeFromTimestamp from '@/utils/getTimeFromTimestamp';
import convertCompactedProducts from '@/utils/convertCompactedProducts';
import fetchWithToken from '@/utils/JWT/fetchWithToken';

// Components
import ListItemsWithPrice from '@/components/ListItemsWithPrice';
import BottomNav from '@/components/page/nav/BottomNav';
import Footer from '@/components/page/Footer';

// Types/Interfaces
import { config } from '@/interfaces/config';
import { NextRouter } from 'next/router';

// Assets
import { HiStar } from 'react-icons/hi';
import tailwindConfig from '@/tailwind.config';

interface props {
    configData: config;
}

interface getServerSideProps {
    props: props;
}

export async function getServerSideProps(): Promise<getServerSideProps> {
    const configRes: Response = await fetch(
        process.env.NEXT_PUBLIC_URL + '/api/config'
    );
    const configData: config = await configRes.json();
    return {
        props: {
            configData,
        },
    };
}

export default function OrderId(props: props): JSX.Element {
    const [order, setOrder] = useState<Order | null>();
    const [products, setProducts] = useState([]);
    const router: NextRouter = useRouter();
    const [token, setToken] = useState<string | null>();
    const [rating, setRating] = useState<number | null>(null);
    const [starHover, setStarHover] = useState<number | null>(null);
    const tailwindColors: any = tailwindConfig.theme?.colors;

    useEffect((): void => console.log(rating), [rating]);

    useEffect((): void => {
        const token = localStorage.getItem('token');
        if (token) setToken(token);
    }, []);

    useEffect((): void => {
        async function fetchOrder(): Promise<void> {
            const response: Response = await fetchWithToken(
                process.env.NEXT_PUBLIC_URL + '/api/getOrderFromId',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: router.query.orderId,
                    }),
                }
            );
            const responseJson = await response.json();
            if (!response.ok) {
                console.error(responseJson.error);
                return;
            }
            setOrder(responseJson.order);

            const result = await convertCompactedProducts(
                responseJson.order.products
            );
            setProducts(result);
        }
        fetchOrder();
    }, []);
    if (token)
        if (order)
            return (
                <>
                    <BottomNav />
                    <section className="my-10 text-center">
                        <h2 className="text-4xl">Your order is:</h2>
                        <h1 className="text-[80px]">
                            {order.status.toUpperCase()}
                        </h1>
                        {order.status !== 'delivered' && (
                            <>
                                <h2>Estimated Delivery Time:</h2>
                                <h2>
                                    {getTimeFromTimestamp(
                                        parseInt(order.timestamp) +
                                            props.configData.delivery
                                                .estimatedTimeOffset *
                                                60000
                                    )}
                                </h2>
                            </>
                        )}
                    </section>
                    <div
                        className={`flex w-screen items-center justify-center ${
                            order.status !== 'delivered' && 'hidden'
                        }`}
                    >
                        <section className=" w-1/3 rounded bg-white p-10">
                            <div className="grid place-items-center">
                                <h2 className=" text-xl text-grey2">
                                    Hi {order.user.forename}, how was your meal?
                                </h2>
                                <form className="my-5 flex w-96 justify-center">
                                    {new Array(5)
                                        .fill(0)
                                        .map((star: unknown, index: number) => {
                                            const currentRating: number =
                                                index + 1;

                                            return (
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="rating"
                                                        value={currentRating}
                                                        onClick={(): void =>
                                                            setRating(
                                                                currentRating
                                                            )
                                                        }
                                                        className="hidden"
                                                    />
                                                    <HiStar
                                                        color={
                                                            currentRating <=
                                                            ((starHover as number) ||
                                                                (rating as number))
                                                                ? tailwindColors.yellow
                                                                : tailwindColors.lightergrey
                                                        }
                                                        className="cursor-pointer"
                                                        size={32}
                                                        onMouseEnter={(): void =>
                                                            setStarHover(
                                                                currentRating
                                                            )
                                                        }
                                                        onMouseLeave={(): void =>
                                                            setStarHover(null)
                                                        }
                                                    />
                                                </label>
                                            );
                                        })}
                                </form>
                                <textarea
                                    className="mb-5 h-32 w-96 resize-none rounded-sm bg-lightergrey p-2 focus:outline-none"
                                    placeholder="Tell us more about your experience"
                                />
                                <button
                                    type="submit"
                                    className="mr-2 h-16 rounded-sm bg-lightergrey px-3 text-grey transition-all hover:bg-lightgrey hover:text-white 3xs:h-12 3xs:px-2"
                                >
                                    Leave Review
                                </button>
                            </div>
                        </section>
                    </div>

                    <div className="mb-10 flex justify-around">
                        <section className="my-5 h-[720px] w-[480px] rounded bg-white p-5 shadow-lg">
                            <ul className="text-2xl leading-10">
                                <li>
                                    <p>
                                        Date:{' '}
                                        {getDateFromTimestamp(
                                            parseInt(order.timestamp)
                                        )}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Time:
                                        {getTimeFromTimestamp(
                                            parseInt(order.timestamp)
                                        )}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Email:
                                        {order.user.email}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Name:
                                        {order.user.forename +
                                            ' ' +
                                            order.user.surname}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Phone Number:
                                        {order.user.phoneNumber}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        City/Town:
                                        {order.user.cityTown}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Address Line 1:
                                        {order.user.addressLine1}
                                    </p>
                                </li>
                                {order.user.addressLine2 ? (
                                    <li>
                                        <p>
                                            Address Line 2:
                                            {order.user.addressLine2}
                                        </p>
                                    </li>
                                ) : null}
                                <li>
                                    <p>
                                        Postcode:
                                        {order.user.postcode}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Order Id:
                                        {order.orderId}
                                    </p>
                                </li>
                                {order.orderNote ? (
                                    <li>
                                        <p>
                                            Order Note:
                                            {order.orderNote}
                                        </p>
                                    </li>
                                ) : null}
                            </ul>
                        </section>
                        <ListItemsWithPrice
                            cart={products}
                            config={props.configData}
                        />
                    </div>
                    <Footer />
                </>
            );
        else
            return (
                <>
                    <h1>Order not found or you have invalid permissions</h1>
                </>
            );
    else
        return (
            <>
                <h1>You are not logged in</h1>
            </>
        );
}
