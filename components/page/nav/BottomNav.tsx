// React/Next
import React, { useState } from 'react';
import { NextRouter, useRouter } from 'next/router';

export default function BottomNav(): JSX.Element {
    const router: NextRouter = useRouter();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const navButtons: string[][] = [
        ['Home', '/'],
        ['Menu', '/menu'],
        ['Reviews', '/reviews'],
        ['Catering', '/#catering'],
        ['Cart', '/'],
    ];

    const transition: string = 'transition ease transform duration-200';
    const genericHamburgerLine: string =
        'h-1 w-6 my-1 rounded-full bg-black ' + transition;

    return (
        <>
            <nav className="bg-white shadow-md">
                <div className="flex h-20 items-center justify-around sm:justify-between">
                    <div className="flex w-full justify-around sm:hidden">
                        <ul className="flex w-80 justify-between">
                            {navButtons.map(
                                (navButton: string[], index: number) => (
                                    <li
                                        onClick={(): Promise<boolean> =>
                                            router.push(navButton[1])
                                        }
                                        key={navButton[0]}
                                        className={`cursor-pointer ${
                                            index === navButtons.length - 1
                                                ? 'hidden'
                                                : null
                                        }`}
                                    >
                                        {navButton[0]}
                                    </li>
                                )
                            )}
                        </ul>
                        <div>
                            <button
                                onClick={(): Promise<boolean> =>
                                    router.push(navButtons[-1][1])
                                }
                            >
                                {navButtons[navButtons.length - 1][0]}
                            </button>
                        </div>
                    </div>
                    <div className="mr-10 hidden w-full sm:flex sm:justify-end">
                        <button
                            className="group flex h-12 w-12 flex-col items-center justify-center rounded"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <div
                                className={`${genericHamburgerLine} ${
                                    menuOpen
                                        ? 'translate-y-3 rotate-45 opacity-50 group-hover:opacity-100'
                                        : 'opacity-50 group-hover:opacity-100'
                                }`}
                            />
                            <div
                                className={`${genericHamburgerLine} ${
                                    menuOpen
                                        ? 'opacity-0'
                                        : 'opacity-50 group-hover:opacity-100'
                                }`}
                            />
                            <div
                                className={`${genericHamburgerLine} ${
                                    menuOpen
                                        ? '-translate-y-3 -rotate-45 opacity-50 group-hover:opacity-100'
                                        : 'opacity-50 group-hover:opacity-100'
                                }`}
                            />
                        </button>
                    </div>
                </div>
                {menuOpen && (
                    <div className="hidden sm:block">
                        <ul className="flex flex-col items-center">
                            {navButtons.map((navButton: string[]) => (
                                <li
                                    onClick={(): Promise<boolean> =>
                                        router.push(navButton[1])
                                    }
                                    key={navButton[0]}
                                    className={`mb-2 cursor-pointer opacity-50 transition hover:text-black hover:opacity-100 ${transition}`}
                                >
                                    {navButton[0]}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </nav>
        </>
    );
}
