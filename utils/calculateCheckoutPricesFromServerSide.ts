import { product } from '@/interfaces/products';

export default async function calculateCheckoutPricesFromServerSide(
    idOfElementsInCart: number[]
): Promise<number> {
    const productsRes = await fetch('http://localhost:3000/api/products');
    const productsData = await productsRes.json();

    let subTotal = 0;

    idOfElementsInCart.forEach((element: number) => {
        productsData.forEach((secondElement: product) => {
            if (element === secondElement.id) subTotal += secondElement.price;
        });
    });

    const configRes = await fetch('http://localhost:3000/api/config');
    const configData = await configRes.json();

    const lowOrderFee =
        subTotal < configData.lowOrder.feeLimit
            ? configData.lowOrder.feeLimit - subTotal >
              configData.lowOrder.maxFee
                ? configData.lowOrder.maxFee
                : configData.lowOrder.feeLimit - subTotal
            : 0;
    const deliveryFee = configData.delivery.fee;
    const total = subTotal + lowOrderFee + deliveryFee;

    return total;
}
