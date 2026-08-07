"use client";
import React, { useEffect, useState } from "react";
import { Button, Drawer, Dropdown, Menu } from "antd";
import { IoIosNotificationsOutline, IoMdMenu } from "react-icons/io";
import logo from "@/Assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { FaDollarSign, FaRegUserCircle, FaStar } from "react-icons/fa";
import { useContextData } from "@/provider/ContextProvider";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
const Header: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const data = useContextData();
  const router = useRouter();
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const handleChnagePassword = () => {
    router.push("/change-password");
  };
  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  const navItems = [
    { href: "/tippz", text: "TIPPZ" },
    { href: "/playerz", text: "PLAYERZ" },
    { href: "/teamz", text: "TEAMZ" },
    { href: "/community", text: "MEDIA & COMMUNITY" },
    { href: "/rewardz", text: "REWARDZ" },
    { href: "https://protippz.store", text: "STORE" },
  ];
  const handleMenuClick = (href: string) => {
    setActiveMenu(href);
    closeDrawer();
  };
  // Dropdown menu for user options
  const [userMenu, setUserMenu] = useState(
    <Menu>
      <Menu.Item key="1">
        <Link
          href={
            data?.userData?.user?.role == "player" ||
            data?.userData?.user?.role == "team"
              ? `home`
              : "/profile"
          }
        >
          My Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="11">
        <button
          onClick={() => {
            Cookies.remove("token");
            localStorage.removeItem("token");
            window.location.href = "/sign-in";
          }}
        >
          Sign out
        </button>
      </Menu.Item>
    </Menu>,
  );

  useEffect(() => {
    if (
      data?.userData?.user?.role != "player" &&
      data?.userData?.user?.role != "team"
    ) {
      setUserMenu(
        <Menu>
          <Menu.Item key="1">
            <Link
              href={
                data?.userData?.user?.role == "player" ||
                data?.userData?.user?.role == "team"
                  ? `home`
                  : "/profile"
              }
            >
              My Profile
            </Link>
          </Menu.Item>

          <Menu.Item key="2">
            <Link href="/deposit">Deposit Funds</Link>
          </Menu.Item>
          {/* <Menu.Item key="3">
            <Link href="/withdraw">Withdraw Funds</Link>
          </Menu.Item> */}
          <Menu.Item key="4">
            <Link href="/tippz-history">Tippz History</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link href="/transaction-log">Transaction Log</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link href="/favorites">Favorites</Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link href="/faqs">FAQs</Link>
          </Menu.Item>
          {/* <Menu.Item key="8">
                <Link href="/settings">Settings</Link>
            </Menu.Item> */}
          <Menu.Item key="9">
            <Link href="/invite-friends">Invite Friends</Link>
          </Menu.Item>
          <Menu.Item key="10">
            <Link href="/contact">Contact Us</Link>
          </Menu.Item>
          <Menu.Item key="11">
            <h1 onClick={() => handleChnagePassword()}>Change Password</h1>
          </Menu.Item>
          <Menu.Item key="12">
            <button
              onClick={() => {
                Cookies.remove("token");
                localStorage.removeItem("token");
                window.location.href = "sign-in";
              }}
            >
              Sign Out
            </button>
          </Menu.Item>
        </Menu>,
      );
    } else {
      setUserMenu(
        <Menu>
          <Menu.Item key="1">
            <Link
              href={
                data?.userData?.user?.role == "player" ||
                data?.userData?.user?.role == "team"
                  ? `home`
                  : "/profile"
              }
            >
              My Profile
            </Link>
          </Menu.Item>
          <Menu.Item key="11">
            <h1 onClick={() => handleChnagePassword()}>Change Password</h1>
          </Menu.Item>
          <Menu.Item key="12">
            <button
              onClick={() => {
                Cookies.remove("token");
                localStorage.removeItem("token");
                window.location.href = "sign-in";
              }}
            >
              Sign Out
            </button>
          </Menu.Item>
        </Menu>,
      );
    }
  }, [data?.userData]);
  return (
    <div className="p-4 bg-white">
      <nav className="flex items-center justify-between container mx-auto">
        <Link href={`/`}>
          <Image
            src={logo}
            height={900}
            width={900}
            alt="logo"
            className="w-fit h-14"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-[#06389F]">
          {navItems.map((item) => (
            <motion.li
              key={item.href}
              className={`cursor-pointer hover:text-[#053697] transition-all ${
                activeMenu === item.href
                  ? "text-[#053697] font-semibold px-2"
                  : ""
              } relative`}
              onClick={() => handleMenuClick(item.href)}
              // whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {activeMenu === item.href && (
                <div className="w-full h-[2px] bg-[#053697] absolute bottom-0 left-0"></div>
              )}
              <Link
                target={
                  item?.href === "https://protippz.store" ? "_blank" : "_self"
                }
                href={item.href}
              >
                {item.text}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Action Buttons for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {data?.userData?._id ? (
            <>
              <div className="flex flex-col space-y-2">
                {data?.userData?.user?.role != "player" &&
                  data?.userData?.user?.role != "team" && (
                    <>
                      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-green-500">
                          <FaDollarSign className="text-green-500" />
                        </span>
                        <span className="text-green-800 font-semibold">
                          {data?.userData?.totalAmount?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-green-500">
                          <FaStar className="text-green-500" />
                        </span>
                        <span className="text-green-800 font-semibold">
                          {data?.userData?.totalPoint?.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/notification`}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100"
                >
                  <IoIosNotificationsOutline
                    className="text-green-500"
                    style={{ fontSize: "18px" }}
                  />
                </Link>
                <Dropdown overlay={userMenu} trigger={["click"]}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 cursor-pointer">
                    <FaRegUserCircle
                      className="text-green-500"
                      style={{ fontSize: "18px" }}
                    />
                  </div>
                </Dropdown>
              </div>
            </>
          ) : (
            <Link
              href={`/sign-in`}
              className="bg-[#2FC191] hover:bg-[#55ddb0] p-[6px] px-4 rounded-md text-white transition-all whitespace-nowrap"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Drawer for Mobile */}
        <div className="md:hidden flex items-center">
          <Button icon={<IoMdMenu />} onClick={showDrawer} />
        </div>
        <Drawer
          title={
            <Image
              src={logo}
              height={900}
              width={900}
              alt="logo"
              className="w-fit h-14"
            />
          }
          placement="right"
          onClose={closeDrawer}
          open={drawerVisible}
          className="text-[#053697]"
        >
          <ul className="space-y-4">
            <li>
              <Link
                href="/tippz"
                className="hover:text-[#053697] cursor-pointer"
              >
                Tippz
              </Link>
            </li>
            <li>
              <Link
                href="/playerz"
                className="hover:text-[#053697] cursor-pointer"
              >
                Playerz
              </Link>
            </li>
            <li>
              <Link
                href="/teamz"
                className="hover:text-[#053697] cursor-pointer"
              >
                Teamz
              </Link>
            </li>
            <li>
              <Link
                href="/rewardz"
                className="hover:text-[#053697] cursor-pointer"
              >
                Rewardz
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href="https://protippz.store"
                className="hover:text-[#053697] cursor-pointer"
              >
                Store
              </Link>
            </li>
          </ul>

          {data?.userData?._id ? (
            <>
              <div className="flex flex-col space-y-2 my-2">
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-green-500">
                    <FaDollarSign className="text-green-500" />
                  </span>
                  <span className="text-green-800 font-semibold">
                    {data?.userData?.totalAmount}
                  </span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-green-500">
                    <FaStar className="text-green-500" />
                  </span>
                  <span className="text-green-800 font-semibold">
                    {data?.userData?.totalPoint}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <Link
                  href={`/notification`}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100"
                >
                  <IoIosNotificationsOutline
                    className="text-green-500"
                    style={{ fontSize: "18px" }}
                  />
                </Link>
                <Dropdown overlay={userMenu} trigger={["click"]}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 cursor-pointer">
                    <FaRegUserCircle
                      className="text-green-500"
                      style={{ fontSize: "18px" }}
                    />
                  </div>
                </Dropdown>
              </div>
            </>
          ) : (
            <Link
              href={`/sign-in`}
              onClick={closeDrawer}
              className="block w-full mt-3 bg-[#2FC191] hover:bg-[#55ddb0] p-[6px] px-4 rounded-md text-white transition-all"
            >
              Sign In
            </Link>
          )}
        </Drawer>
      </nav>
    </div>
  );
};

export default Header;
