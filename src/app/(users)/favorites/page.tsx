import TabsComponent from "@/components/favoritesPage/client/TabsComponent";
import Heading from "@/components/Shared/Heading";
import React from "react";

const FavoritePage: React.FC = () => {
  return (
    <div className="max-w-355 mx-auto">
      <Heading
        headingText="FAVORITES"
        subHeadingText="Your favorite players & teams"
      />
      <div className="mt-4">
        <TabsComponent />
      </div>
    </div>
  );
};

export default FavoritePage;
