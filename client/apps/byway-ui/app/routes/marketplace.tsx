import { Input } from "@mantine/core";
import { Search } from "tabler-icons-react";

const Marketplace = () => {
  return (
    <main
      className="flex justify-center items-center"
      style={{ height: "70vh" }}
    >
      <div className="max-w-2xl w-full">
        <Input
          icon={<Search size={16} />}
          size="xl"
          placeholder="Search...."
          rightSectionWidth={70}
          styles={{ rightSection: { pointerEvents: "none" } }}
        />
      </div>
    </main>
  );
};

export default Marketplace;
