import { LayoutGrid, Table } from "tabler-icons-react";

export type ResultLayoutButtonsProps = {
  onLayoutChange: (layout: string) => void;
  active: string;
};

const ResultLayoutButtons = ({
  active,
  onLayoutChange,
}: ResultLayoutButtonsProps) => {
  const handleOnclick = (layout: string) => {
    onLayoutChange(layout);
  };
  return (
    <div className="flex gap-2">
      <button
        className={active === "cards" ? "text-black" : ""}
        onClick={() => handleOnclick("cards")}
      >
        <LayoutGrid />
      </button>
      <button
        className={active === "table" ? "text-black" : ""}
        onClick={() => handleOnclick("table")}
      >
        <Table />
      </button>
    </div>
  );
};

ResultLayoutButtons.defaultProps = {
  active: "cards",
  onLayoutChange: () => {},
};

export default ResultLayoutButtons;
