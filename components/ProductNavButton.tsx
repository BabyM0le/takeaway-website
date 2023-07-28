import capitaliseFirstChar from '@/utils/capitaliseFirstChar';
import { activeProductNav, productNavButtons } from '@/interfaces/productNav';

interface props {
    activeProductNav: activeProductNav;
    title: productNavButtons;
}

export default function ProductNavButton(props: props) {
    const [activeProductNav, setActiveProductNav] = props.activeProductNav;

    return (
        <button
            onClick={() => setActiveProductNav(props.title)}
            className={`mx-3 border-2 border-black p-3 ${
                activeProductNav == props.title ? 'bg-slate-500' : null
            }`}
        >
            {capitaliseFirstChar(props.title)}
        </button>
    );
}
