import { useState } from "react";
import type { LoaderFunction } from "remix";

import BuySearch from "~/components/BuySearch";

export const loader: LoaderFunction = async ({ request }) => {
  return null;
};

export default function IndexRoute() {
  const [activeTab, setActiveTab] = useState("buy");

  return (
    <main className="flex flex-col items-center m-10 p-4 bg-white rounded-lg h-80">
      <div className="tabs mb-12">
        <a
          onClick={() => setActiveTab("buy")}
          className={`w-48 tab tab-lg tab-bordered ${
            activeTab === "buy" ? "tab-active text-indigo-700" : ""
          } font-medium`}
          role="tab"
        >
          Buy
        </a>
        <a
          onClick={() => setActiveTab("sell")}
          className={`w-48 tab tab-lg tab-bordered ${
            activeTab === "sell" ? "tab-active text-indigo-700" : ""
          } font-medium`}
          role="tab"
        >
          Sell
        </a>
      </div>

      {activeTab === "buy" ? <BuySearch /> : <h1>Sell</h1>}
    </main>
  );
}
