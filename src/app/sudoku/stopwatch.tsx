"use client";
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { useStopwatch } from "react-timer-hook";

export type StopWatchAction = "START" | "PAUSE" | "RESET" | "NOT_STARTED";

export const StopWatch: React.FC<{
  stopwatchAction: StopWatchAction;
  setStopwatchAction: (stopwatchAction: StopWatchAction) => void;
}> = React.memo(({ stopwatchAction, setStopwatchAction }) => {
  const { seconds, minutes, hours, pause, start, reset } = useStopwatch({
    autoStart: false,
  });

  React.useEffect(() => {
    switch (stopwatchAction) {
      case "START":
        start();
        break;
      case "PAUSE":
        pause();
        break;
      case "RESET":
        reset();
        break;
    }
  }, [stopwatchAction]);

  return (
    <div className="inline-flex flex-row w-[100px] justify-between items-center space-x-2">
      <Button
        className="rounded-full w-4 h-4 hover:border-2 hover:border-black"
        variant="secondary"
        onClick={() =>
          stopwatchAction === "START"
            ? setStopwatchAction("PAUSE")
            : setStopwatchAction("START")
        }
      >
        {stopwatchAction === "START" ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <p className="text-xs">
        {hours} : {minutes.toString().padStart(2, "0")} :{" "}
        {seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
});

StopWatch.displayName = "StopWatch";
