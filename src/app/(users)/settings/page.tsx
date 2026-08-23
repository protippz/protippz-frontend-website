import React from "react";
import { Divider, Switch } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

const SettingPage: React.FC = () => {
  return (
    <div className="max-w-355 mx-auto px-4 py-8">
      {/* Page Title */}
      <h3 className="text-center text-[#053697] text-4xl font-bold">
        Settings
      </h3>

      {/* Password and Security Section */}
      <div className="my-8">
        <h4 className="text-[#053697] text-lg font-semibold">
          Password and Security
        </h4>
        <Link
          href={"/change-password"}
          className="flex justify-between items-center cursor-pointer"
        >
          <p className="text-[#053697] -mb-4">Change Password</p>
          <IoIosArrowForward className="text-[#053697]" />
        </Link>
        <Divider style={{ borderColor: "#00c96d" }} />
      </div>

      <div className="my-8">
        <h4 className="text-[#053697] text-lg font-semibold">
          Notification Settings
        </h4>
        <div className="flex justify-between items-center my-4">
          <p className="text-[#053697]">Alerts for tipping activity</p>
          <Switch defaultChecked style={{ backgroundColor: "#00c96d" }} />
        </div>
        <div className="flex justify-between items-center my-4">
          <p className="text-[#053697]">Alerts for earning rewards</p>
          <Switch defaultChecked style={{ backgroundColor: "#00c96d" }} />
        </div>
        <div className="flex justify-between items-center my-4">
          <p className="text-[#053697]">Email or SMS notifications</p>
          <Switch style={{ backgroundColor: "#c0c0c0" }} />
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
