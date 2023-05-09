import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import formatPrice from '@/utils/formatPrice';

export default function ProductTab(props: any) {
    const { cart, setCart } = useContext(AppContext);

    const subTotal = cart.reduce((acc: any, item: any) => acc + item.price, 0);
    const lowOrderFee =
        subTotal < 15 ? (15 - subTotal > 5 ? 5 : 15 - subTotal) : 0;
    const deliverFee = 3;
    const total = subTotal + lowOrderFee + deliverFee;

    return (
        <>
            <div
                className={`absolute transition-all duration-500 right-5 top-5 w-72 border-black z-1 bg-white border-2 rounded p-5 ${
                    props.isVisible ? null : 'opacity-0 pointer-events-none'
                }`}
            >
                <h2 className="text-3xl text-center">Cart</h2>
                <ul className="py-5">
                    {cart.map((e: any, i: number) => (
                        <li key={i} className="flex justify-between">
                            <span>{e.product}</span>
                            <span>£{formatPrice(e.price)}</span>
                        </li>
                    ))}
                </ul>
                <span className="block text-end">
                    Sub-Total: £{formatPrice(subTotal)}
                </span>
                {lowOrderFee ? (
                    <span className="block text-end">
                        Low Order Fee: £{formatPrice(lowOrderFee)}
                    </span>
                ) : null}
                <span className="block text-end">
                    Delivery Fee: £{formatPrice(deliverFee)}
                </span>
                <span className="block text-end">
                    Total: £{formatPrice(total)}
                </span>
            </div>
        </>
    );
}

// import { useContext } from 'react';
// import { AppContext } from '../context/AppContext';
// import formatPrice from '@/utils/formatPrice';

// export default function ProductTab(props: any) {
//     const { cart, setCart } = useContext(AppContext);

//     return (
//         <>
//             <div
//                 className={`absolute transition-all duration-500 right-5 top-5 w-72 border-black z-1 bg-white border-2 rounded p-5 ${
//                     props.isVisible ? null : 'opacity-0 pointer-events-none'
//                 }`}
//             >
//                 <h2 className="text-3xl text-center">Cart</h2>
//                 <ul className="py-5">
//                     {cart.map((e: any, i: number) => (
//                         <li key={i} className="flex justify-between">
//                             <span>{e.product}</span>
//                             <span className="s">£{formatPrice(e.price)}</span>
//                         </li>
//                     ))}
//                 </ul>
//                 <span className="block text-end">
//                     Sub-Total: £
//                     {formatPrice(
//                         cart.reduce(
//                             (acc: any, item: any) => acc + item.price,
//                             0
//                         )
//                     )}
//                 </span>
//                 {cart.reduce((acc: any, item: any) => acc + item.price, 0) >
//                 15 ? (
//                     <></>
//                 ) : (
//                     <span className="block text-end">Low Order Fee: £5.00</span>
//                 )}
//                 <span className="block text-end">Delivery Fee: £3.00</span>
//                 <span className="block text-end">
//                     Total: £
//                     {formatPrice(
//                         cart.reduce(
//                             (acc: any, item: any) => acc + item.price,
//                             0
//                         ) +
//                             3 +
//                             (cart.reduce(
//                                 (acc: any, item: any) => acc + item.price,
//                                 0
//                             ) > 15
//                                 ? 0
//                                 : 5)
//                     )}
//                 </span>
//             </div>
//         </>
//     );
// }
