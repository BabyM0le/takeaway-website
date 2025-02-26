// Types/Interfaces
import { product, products } from '@/interfaces/products';

export default async function convertCompactedProducts(products: string) {
    type oldProduct = [number, string[][]];
    type oldProducts = oldProduct[];

    const productsRes = await fetch(
        process.env.NEXT_PUBLIC_URL + '/api/products'
    );
    const productsData: products = await productsRes.json();
    const oldProducts: oldProducts = JSON.parse(products);
    let newItemArr: any = [];

    oldProducts.forEach((element: oldProduct): void => {
        productsData.forEach((element2: product): void => {
            if (element[0] === element2.id)
                newItemArr.push({ ...element2, options: element[1] });
        });
    });

    await newItemArr;
    return newItemArr;
}
