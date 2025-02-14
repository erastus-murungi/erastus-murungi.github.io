import {
    Satisfy,
    Indie_Flower,
    Reenie_Beanie,
    Open_Sans,
    Space_Mono,
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

const primaryFont = Open_Sans({
    weight: '400',
    subsets: ['latin'],
});

export { satisfy, indie_flower, spaceMono, reenie_beanie, primaryFont };
