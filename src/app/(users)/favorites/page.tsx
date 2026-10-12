import React from "react";
import TabsComponent from "@/components/favoritesPage/client/TabsComponent";
import GoToTop from "@/components/ui/GoToTop";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PROTIPPZ - FAVORITES",
  description:
    "Manage your favorite collegiate athletes & official teams. Track their achievements and tip them directly.",
};

const FavoritePage: React.FC = () => {
  return (
    <div className="w-full max-w-355 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-16">
      <GoToTop />
      <TabsComponent />
    </div>
  );
};

export default FavoritePage;
