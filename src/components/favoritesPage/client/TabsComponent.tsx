"use client";
import TeamzCards from "@/components/Teamz/TeamzCards";
import React, { useState } from "react";
import FavoriteTeamz from "../FavoriteTeamz";
import FavoritePlayerz from "../FavoritePlayerz";

const TabsComponent: React.FC = () => {
  const options = ["playerz", "Teamz"];
  const [activeTab, setActiveTab] = useState("playerz");
  return (
    <>
      <div className="max-w-355 mx-auto grid grid-cols-2">
        {options?.map((item) => (
          <button
            style={{
              transition: "1s",
            }}
            onClick={() => setActiveTab(item)}
            className={`w-full h-10 border-b-4 ${activeTab == item ? "bg-green-100 text-green-600 font-bold border-b-green-600" : ""}`}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {activeTab === "playerz" ? <FavoritePlayerz /> : <FavoriteTeamz />}
      </div>
    </>
  );
};

export default TabsComponent;
