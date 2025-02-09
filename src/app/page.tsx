'use client';

import * as React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image-utils';
import { BiMath } from 'react-icons/bi';
import { GiPenguin } from 'react-icons/gi';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import Header from './header';

function WelcomeTitle() {
    return <div className="mb-4 text-4xl">Pepi Pepi 💕</div>;
}

function WelcomeImage() {
    return (
        <Image
            src={getImageUrl('pingu.gif')}
            alt="Pingu Pingu"
            width={300}
            height={300}
            className="mx-4 mb-8 border-4 border-t-gray-50 shadow-lg"
        />
    );
}

function WelcomeAudio() {
    return (
        <div className="inline-flex flex-row items-center justify-center">
            <audio controls className="mb-8">
                <source src={getImageUrl('pingu.m4a')} type="audio/x-m4a" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

function WelcomeMessage() {
    return (
        <p className="mb-8">
            Welcome to your playground! 🎉
            <br />I hope you enjoy your stay! 🏡
        </p>
    );
}

function Navigation() {
    return (
        <div className="flex flex-row space-x-4">
            <Link
                href="/memories"
                className={`h-12 w-32 rounded-3xl text-4xl ${buttonVariants({
                    variant: 'outline',
                })}`}
            >
                <GiPenguin />
                Memories
            </Link>
            <Link
                href="/sudoku"
                className={`h-12 w-32 rounded-3xl ${buttonVariants({
                    variant: 'outline',
                })}`}
            >
                <BiMath />
                Sudoku
            </Link>
        </div>
    );
}

export default function Home() {
    return (
        <div>
            <Header titleHeading="" />
            <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
                <WelcomeTitle />
                <WelcomeMessage />
                <WelcomeImage />
                <WelcomeAudio />
                <Navigation />
            </div>
        </div>
    );
}
