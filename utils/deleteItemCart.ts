import { cart, setCart } from '@/interfaces/cart';
export default function deleteItemCart(
    index: number,
    cart: cart,
    setCart: setCart
) {
    const updatedCart = cart.filter(
        (item: any, index: number) => index !== index
    );
    setCart(updatedCart);
    if (updatedCart.length === 0) localStorage.removeItem('cart');
}
