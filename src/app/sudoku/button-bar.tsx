import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";

export type ButtonValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | "check";
type Row = React.FC<{ onClick: (value: ButtonValue) => void }>;

const FirstRow: Row = ({ onClick }) => {
  return (
    <div className="space-x-3 m-6">
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick(1)}
      >
        1
      </Button>
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick(2)}
      >
        2
      </Button>
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick(3)}
      >
        3
      </Button>
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick(4)}
      >
        4
      </Button>
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick(5)}
      >
        5
      </Button>
    </div>
  );
};

const SecondRow: Row = ({ onClick }) => {
  return (
    <div className="space-x-3 m-6">
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick(6)}
      >
        6
      </Button>
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick(7)}
      >
        7
      </Button>
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick(8)}
      >
        8
      </Button>
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick(9)}
      >
        9
      </Button>
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick(0)}
      >
        0
      </Button>
    </div>
  );
};

const ThirdRow: Row = ({ onClick }) => {
  return (
    <div className="space-x-3 m-6">
      <Button
        className="text-2xl"
        variant="secondary"
        onClick={() => onClick("check")}
      >
        <CheckIcon />
      </Button>
    </div>
  );
};
export const ButtonBar: Row = ({ onClick }) => {
  return (
    <div className="items-center justify-center">
      <FirstRow onClick={onClick} />
      <SecondRow onClick={onClick} />
      <ThirdRow onClick={onClick} />
    </div>
  );
};
