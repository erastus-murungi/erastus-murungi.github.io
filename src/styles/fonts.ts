import {
    Satisfy,
    Indie_Flower,
    Reenie_Beanie,
    Space_Mono,
    Space_Grotesk,
} from 'next/font/google';

const satisfy = Satisfy({
    weight: '400',
    subsets: ['latin'],
});

const indie_flower = Indie_Flower({
    weight: '400',
    subsets: ['latin'],
});

const spaceMono = Space_Mono({
    weight: '400',
    subsets: ['latin'],
});

const reenie_beanie = Reenie_Beanie({
    weight: '400',
    subsets: ['latin'],
});

const primaryFont = Space_Grotesk({
    weight: '400',
    subsets: ['latin'],
});

export { satisfy, indie_flower, spaceMono, reenie_beanie, primaryFont };
