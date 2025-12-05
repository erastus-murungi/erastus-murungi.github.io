'use client';

import * as React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image-utils';
import { BiMath } from 'react-icons/bi';
import { GiPenguin } from 'react-icons/gi';
import Link from 'next/link';
import Header from './header';
import { BirthdayPopup } from '@/components/birthday-popup';

function WelcomeTitle() {
    return (
        <div className="mb-4 text-4xl font-bold text-blue-700">
            Pepi Pepi 💕
        </div>
    );
}

function WelcomeImage() {
    return (
        <Image
            src={getImageUrl('pingu.gif')}
            alt="Pingu Pingu"
            width={300}
            height={300}
            className="mx-4 mb-8 border-4 border-blue-400 shadow-lg shadow-blue-200"
        />
    );
}

function WelcomeAudio() {
    return (
        <div className="inline-flex flex-row items-center justify-center">
            <audio controls className="mb-8">
                <track kind="captions" />
                <source src={getImageUrl('pingu.m4a')} type="audio/x-m4a" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

function WelcomeMessage() {
    return (
        <p className="mb-8 text-blue-600">
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
                className="inline-flex h-12 w-32 items-center justify-center rounded-3xl border-2 border-blue-400 bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
                <GiPenguin className="text-4xl" />
            </Link>
            <Link
                href="/sudoku"
                className="inline-flex h-12 w-32 items-center justify-center rounded-3xl border-2 border-blue-400 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
                <BiMath className="text-4xl" />
            </Link>
        </div>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100">
            <BirthdayPopup />
            <Header titleHeading="" />
            <div className="flex h-screen flex-col items-center justify-center">
                <WelcomeTitle />
                <WelcomeMessage />
                <WelcomeImage />
                <WelcomeAudio />
                <Navigation />
            </div>
        </div>
    );
}
