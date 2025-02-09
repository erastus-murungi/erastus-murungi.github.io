"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon, ResetIcon } from "@radix-ui/react-icons";
import { useStopwatch } from "react-timer-hook";
import { spaceMono } from "@/styles/fonts";
import type { StopWatchAction } from "./types";

export const StopWatch: React.FC<{
  stopwatchAction: StopWatchAction;
  setStopwatchAction: (stopwatchAction: StopWatchAction) => void;
  setTotalSeconds: (totalSeconds: number) => void;
}> = React.memo(({ stopwatchAction, setStopwatchAction, setTotalSeconds }) => {
  const { seconds, minutes, hours, pause, start, reset, totalSeconds } =
    useStopwatch({
      autoStart: false,
    });

  React.useEffect(() => {
    switch (stopwatchAction) {
      case "start": {
        start();
        break;
      }
      case "pause": {
        pause();
        break;
      }
      case "reset": {
        reset();
        break;
      }
    }
  }, [stopwatchAction]);

  React.useEffect(() => {
    setTotalSeconds(totalSeconds);
  }, [totalSeconds]);

  return (
    <div className="inline-flex flex-row w-44 h-12 justify-between items-center space-x-2 bg-white border-2 border-gray-50 rounded-2xl px-2">
      <div className="flex flex-row justify-center items-center">
        <Button
          className="rounded-full w-8 h-8 opacity-90 hover:opacity-100 m-2"
          variant="outline"
          onClick={() =>
            stopwatchAction === "start"
              ? setStopwatchAction("pause")
              : setStopwatchAction("start")
          }
        >
          {stopwatchAction === "start" ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Button
          className="rounded-full w-8 h-8 opacity-90 hover:opacity-100"
          variant="outline"
          onClick={() => setStopwatchAction("reset")}
        >
          <ResetIcon />
        </Button>
      </div>
      <p className={`${spaceMono.className} text-base`}>
        {hours > 0 ? `${hours} : ` : ""}
        {minutes.toString()}:{seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
});

StopWatch.displayName = "StopWatch";
