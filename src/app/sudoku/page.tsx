'use client';

import * as React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sudoku } from './sudoku';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
    return (
        <TooltipProvider>
            <>
                <Sudoku />
                <Toaster position="top-center" />
            </>
        </TooltipProvider>
    );
}
