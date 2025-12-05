'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GiPenguin } from 'react-icons/gi';

const Header: React.FC<{ titleHeading?: string }> = ({ titleHeading }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 shadow-lg shadow-blue-200/50">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <GiPenguin size="2em" className="text-white" />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <span className="text-2xl font-semibold text-white">
                        {titleHeading}
                    </span>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Link
                        href="/"
                        className="text-sm font-semibold text-white transition-colors hover:text-blue-100"
                    >
                        Chama!
                    </Link>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div className="lg:hidden" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 z-10 bg-blue-900/20"></div>
                    <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gradient-to-br from-blue-500 to-cyan-600 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-blue-400/50">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <GiPenguin size="2em" className="text-white" />
                            </Link>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-blue-400/30">
                                <div className="space-y-2 py-6">
                                    <Link
                                        href="/"
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-blue-400/30"
                                    >
                                        Features
                                    </Link>
                                </div>
                                <div className="py-6">
                                    <Link
                                        href="/"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white hover:bg-blue-400/30"
                                    >
                                        Chama!
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
