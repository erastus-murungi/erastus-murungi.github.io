import React from 'react';
import { Button } from '@/components/ui/button';
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons';
import { useStopwatch } from 'react-timer-hook';
import { spaceMono } from '@/styles/fonts';
import type { StopwatchCommand } from './types';

export const StopWatch: React.FC<{
    stopwatchCommand: StopwatchCommand;
    setStopwatchCommand: (command: StopwatchCommand) => void;
    setElapsedSeconds: (elapsedSeconds: number) => void;
}> = React.memo(
    ({
        stopwatchCommand,
        setStopwatchCommand: setStopwatchAction,
        setElapsedSeconds,
    }) => {
        const { seconds, minutes, hours, pause, start, reset, totalSeconds } =
            useStopwatch({
                autoStart: true,
            });

        React.useEffect(() => {
            switch (stopwatchCommand) {
                case 'start': {
                    start();
                    break;
                }
                case 'pause': {
                    pause();
                    break;
                }

                case 'reset': {
                    reset();
                    setStopwatchAction('start');
                    break;
                }
            }
        }, [stopwatchCommand]);

        React.useEffect(() => {
            setElapsedSeconds(totalSeconds);
        }, [totalSeconds]);

        return (
            <div className="inline-flex h-12 w-44 flex-row items-center justify-between rounded-2xl border-2 border-gray-50 bg-white px-2">
                <div className="flex flex-row items-center justify-center">
                    <Button
                        className="m-2 h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                        variant="outline"
                        onClick={() =>
                            stopwatchCommand === 'start'
                                ? setStopwatchAction('pause')
                                : setStopwatchAction('start')
                        }
                    >
                        {stopwatchCommand === 'start' ? (
                            <PauseIcon />
                        ) : (
                            <PlayIcon />
                        )}
                    </Button>
                </div>
                <p className={`${spaceMono.className} text-base`}>
                    {hours > 0 ? `${hours} : ` : ''}
                    {minutes.toString()}:{seconds.toString().padStart(2, '0')}
                </p>
            </div>
        );
    }
);

StopWatch.displayName = 'StopWatch';
