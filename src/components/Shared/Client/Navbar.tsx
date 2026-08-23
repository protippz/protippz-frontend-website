// "use client";
// import React, { useEffect, useState } from "react";
// import { Button, Drawer, Dropdown, Menu } from "antd";
// import { IoIosNotificationsOutline, IoMdMenu } from "react-icons/io";
// import logo from "@/Assets/logo.png";
// import Image from "next/image";
// import Link from "next/link";
// import { FaDollarSign, FaRegUserCircle, FaStar } from "react-icons/fa";
// import { useContextData } from "@/provider/ContextProvider";
// import Cookies from "js-cookie";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// const Navbar: React.FC = () => {
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [activeMenu, setActiveMenu] = useState("");
//   const data = useContextData();
//   const router = useRouter();
//   const showDrawer = () => {
//     setDrawerVisible(true);
//   };

//   const handleChnagePassword = () => {
//     router.push("/change-password");
//   };
//   const closeDrawer = () => {
//     setDrawerVisible(false);
//   };
//   const navItems = [
//     { href: "/tippz", text: "TIPPZ" },
//     { href: "/playerz", text: "PLAYERZ" },
//     { href: "/teamz", text: "TEAMZ" },
//     { href: "/community", text: "MEDIA & COMMUNITY" },
//     { href: "/rewardz", text: "REWARDZ" },
//     { href: "https://protippz.store", text: "STORE" },
//   ];
//   const handleMenuClick = (href: string) => {
//     setActiveMenu(href);
//     closeDrawer();
//   };
//   // Dropdown menu for user options
//   const [userMenu, setUserMenu] = useState(
//     <Menu>
//       <Menu.Item key="1">
//         <Link
//           href={
//             data?.userData?.user?.role == "player" ||
//             data?.userData?.user?.role == "team"
//               ? `home`
//               : "/profile"
//           }
//         >
//           My Profile
//         </Link>
//       </Menu.Item>
//       <Menu.Item key="11">
//         <button
//           onClick={() => {
//             Cookies.remove("token");
//             localStorage.removeItem("token");
//             window.location.href = "/sign-in";
//           }}
//         >
//           Sign out
//         </button>
//       </Menu.Item>
//     </Menu>,
//   );

//   useEffect(() => {
//     if (
//       data?.userData?.user?.role != "player" &&
//       data?.userData?.user?.role != "team"
//     ) {
//       setUserMenu(
//         <Menu>
//           <Menu.Item key="1">
//             <Link
//               href={
//                 data?.userData?.user?.role == "player" ||
//                 data?.userData?.user?.role == "team"
//                   ? `home`
//                   : "/profile"
//               }
//             >
//               My Profile
//             </Link>
//           </Menu.Item>

//           <Menu.Item key="2">
//             <Link href="/deposit">Deposit Funds</Link>
//           </Menu.Item>
//           {/* <Menu.Item key="3">
//             <Link href="/withdraw">Withdraw Funds</Link>
//           </Menu.Item> */}
//           <Menu.Item key="4">
//             <Link href="/tippz-history">Tippz History</Link>
//           </Menu.Item>
//           <Menu.Item key="5">
//             <Link href="/transaction-log">Transaction Log</Link>
//           </Menu.Item>
//           <Menu.Item key="6">
//             <Link href="/favorites">Favorites</Link>
//           </Menu.Item>
//           <Menu.Item key="7">
//             <Link href="/faqs">FAQs</Link>
//           </Menu.Item>
//           {/* <Menu.Item key="8">
//                 <Link href="/settings">Settings</Link>
//             </Menu.Item> */}
//           <Menu.Item key="9">
//             <Link href="/invite-friends">Invite Friends</Link>
//           </Menu.Item>
//           <Menu.Item key="10">
//             <Link href="/contact">Contact Us</Link>
//           </Menu.Item>
//           <Menu.Item key="11">
//             <h1 onClick={() => handleChnagePassword()}>Change Password</h1>
//           </Menu.Item>
//           <Menu.Item key="12">
//             <button
//               onClick={() => {
//                 Cookies.remove("token");
//                 localStorage.removeItem("token");
//                 window.location.href = "sign-in";
//               }}
//             >
//               Sign Out
//             </button>
//           </Menu.Item>
//         </Menu>,
//       );
//     } else {
//       setUserMenu(
//         <Menu>
//           <Menu.Item key="1">
//             <Link
//               href={
//                 data?.userData?.user?.role == "player" ||
//                 data?.userData?.user?.role == "team"
//                   ? `home`
//                   : "/profile"
//               }
//             >
//               My Profile
//             </Link>
//           </Menu.Item>
//           <Menu.Item key="11">
//             <h1 onClick={() => handleChnagePassword()}>Change Password</h1>
//           </Menu.Item>
//           <Menu.Item key="12">
//             <button
//               onClick={() => {
//                 Cookies.remove("token");
//                 localStorage.removeItem("token");
//                 window.location.href = "sign-in";
//               }}
//             >
//               Sign Out
//             </button>
//           </Menu.Item>
//         </Menu>,
//       );
//     }
//   }, [data?.userData]);
//   return (
//     <div className="p-4 bg-white shadow-md z-999">
//       <nav className="flex items-center justify-between max-w-355 mx-auto">
//         <Link href={`/`}>
//           <Image
//             src={logo}
//             height={900}
//             width={900}
//             alt="logo"
//             className="w-fit h-14"
//           />
//         </Link>

//         {/* Desktop Navigation Links */}
//         <ul className="hidden md:flex space-x-6 text-[#06389F]">
//           {navItems.map((item) => (
//             <motion.li
//               key={item.href}
//               className={`cursor-pointer hover:text-[#053697] transition-all ${
//                 activeMenu === item.href
//                   ? "text-[#053697] font-semibold px-2"
//                   : ""
//               } relative`}
//               onClick={() => handleMenuClick(item.href)}
//               // whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               {activeMenu === item.href && (
//                 <div className="w-full h-[2px] bg-[#053697] absolute bottom-0 left-0"></div>
//               )}
//               <Link
//                 target={
//                   item?.href === "https://protippz.store" ? "_blank" : "_self"
//                 }
//                 href={item.href}
//               >
//                 {item.text}
//               </Link>
//             </motion.li>
//           ))}
//         </ul>

//         {/* Action Buttons for Desktop */}
//         <div className="hidden md:flex items-center space-x-4">
//           {data?.userData?._id ? (
//             <>
//               <div className="flex flex-col space-y-2">
//                 {data?.userData?.user?.role != "player" &&
//                   data?.userData?.user?.role != "team" && (
//                     <>
//                       <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100">
//                         <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-green-500">
//                           <FaDollarSign className="text-green-500" />
//                         </span>
//                         <span className="text-green-800 font-semibold">
//                           {data?.userData?.totalAmount?.toFixed(2)}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100">
//                         <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-green-500">
//                           <FaStar className="text-green-500" />
//                         </span>
//                         <span className="text-green-800 font-semibold">
//                           {data?.userData?.totalPoint?.toFixed(2)}
//                         </span>
//                       </div>
//                     </>
//                   )}
//               </div>
//               <div className="flex space-x-2">
//                 <Link
//                   href={`/notification`}
//                   className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100"
//                 >
//                   <IoIosNotificationsOutline
//                     className="text-green-500"
//                     style={{ fontSize: "18px" }}
//                   />
//                 </Link>
//                 <Dropdown overlay={userMenu} trigger={["click"]}>
//                   <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 cursor-pointer">
//                     <FaRegUserCircle
//                       className="text-green-500"
//                       style={{ fontSize: "18px" }}
//                     />
//                   </div>
//                 </Dropdown>
//               </div>
//             </>
//           ) : (
//             <Link
//               href={`/sign-in`}
//               className="bg-[#2FC191] hover:bg-[#55ddb0] p-[6px] px-4 rounded-md text-white transition-all whitespace-nowrap"
//             >
//               Sign In
//             </Link>
//           )}
//         </div>

//         {/* Drawer for Mobile */}
//         <div className="md:hidden flex items-center">
//           <Button icon={<IoMdMenu />} onClick={showDrawer} />
//         </div>
//         <Drawer
//           title={
//             <Image
//               src={logo}
//               height={900}
//               width={900}
//               alt="logo"
//               className="w-fit h-14"
//             />
//           }
//           placement="right"
//           onClose={closeDrawer}
//           open={drawerVisible}
//           className="text-[#053697]"
//         >
//           <ul className="space-y-4">
//             {navItems.map((item) => (
//               <li key={item.href}>
//                 <Link
//                   target={
//                     item?.href === "https://protippz.store" ? "_blank" : "_self"
//                   }
//                   href={item.href}
//                   onClick={closeDrawer}
//                   className="hover:text-[#053697] cursor-pointer font-semibold"
//                 >
//                   {item.text}
//                 </Link>
//               </li>
//             ))}
//           </ul>

//           {data?.userData?._id ? (
//             <>
//               <div className="flex flex-col space-y-2 my-2">
//                 <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100">
//                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-green-500">
//                     <FaDollarSign className="text-green-500" />
//                   </span>
//                   <span className="text-green-800 font-semibold">
//                     {data?.userData?.totalAmount}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100">
//                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-green-500">
//                     <FaStar className="text-green-500" />
//                   </span>
//                   <span className="text-green-800 font-semibold">
//                     {data?.userData?.totalPoint}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4 mt-4">
//                 <Link
//                   href={`/notification`}
//                   className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100"
//                 >
//                   <IoIosNotificationsOutline
//                     className="text-green-500"
//                     style={{ fontSize: "18px" }}
//                   />
//                 </Link>
//                 <Dropdown overlay={userMenu} trigger={["click"]}>
//                   <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 cursor-pointer">
//                     <FaRegUserCircle
//                       className="text-green-500"
//                       style={{ fontSize: "18px" }}
//                     />
//                   </div>
//                 </Dropdown>
//               </div>
//             </>
//           ) : (
//             <Link
//               href={`/sign-in`}
//               onClick={closeDrawer}
//               className="block w-full mt-3 bg-[#2FC191] hover:bg-[#55ddb0] p-[6px] px-4 rounded-md text-white transition-all"
//             >
//               Sign In
//             </Link>
//           )}
//         </Drawer>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;

"use client";

import React, { useState } from "react";
import { Drawer, Dropdown } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Wallet,
  History,
  ReceiptText,
  Heart,
  CircleHelp,
  UserPlus,
  Mail,
  Lock,
  LogOut,
  DollarSign,
  Star,
  Bell,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import { useContextData } from "@/provider/ContextProvider";
import Cookies from "js-cookie";
import { IMAGE } from "@/constant/image.index";

const isRouteActive = (
  pathname: string | null,
  href: string,
  external?: boolean,
) => {
  if (external || !pathname || !href) return false;

  const cleanPathname = pathname.split("?")[0].replace(/\/$/, "") || "/";
  const cleanHref = href.split("?")[0].replace(/\/$/, "") || "/";

  if (cleanPathname === cleanHref) return true;

  if (cleanHref !== "/" && cleanPathname.startsWith(`${cleanHref}/`)) {
    return true;
  }

  return false;
};

const Navbar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const data = useContextData();
  const router = useRouter();
  const pathname = usePathname();

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const navItems = [
    { href: "/tippz", text: "TIPPZ" },
    { href: "/playerz", text: "PLAYERZ" },
    { href: "/teamz", text: "TEAMZ" },
    { href: "/community", text: "MEDIA & COMMUNITY" },
    { href: "/rewardz", text: "REWARDZ" },
    { href: "https://protippz.store", text: "STORE", external: true },
  ];

  const mobileNavItems = [{ href: "/", text: "HOME" }, ...navItems];

  const handleSignOut = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    window.location.href = "/sign-in";
  };

  const handlePasswordChange = () => {
    setDropdownOpen(false);
    router.push("/change-password");
  };

  const isPlayerOrTeam =
    data?.userData?.user?.role === "player" ||
    data?.userData?.user?.role === "team";

  const profileHref = isPlayerOrTeam ? "/home" : "/profile";

  // Single-color unified User Dropdown Popover Card
  const userDropdownContent = (
    <div className="w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
      {/* Header Profile Info */}
      <div className="p-3 bg-emerald-50/60 rounded-xl mb-2 border border-emerald-100/60">
        <div className="flex items-center gap-3">
          {data?.userData?.profile_image ? (
            <Image
              src={data.userData.profile_image}
              alt="Profile"
              width={38}
              height={38}
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#308D6F] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {data?.userData?.name ? data.userData.name[0].toUpperCase() : "U"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-[#154098] truncate leading-tight">
              {data?.userData?.name || "My Account"}
            </h4>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {data?.userData?.email ||
                data?.userData?.user?.email ||
                "Fan Account"}
            </p>
          </div>
        </div>

        {/* Quick balance summary inside header */}
        {!isPlayerOrTeam && (
          <div className="mt-2.5 pt-2 border-t border-emerald-200/40 flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-[#308D6F]">
              <DollarSign className="w-3.5 h-3.5" /> $
              {data?.userData?.totalAmount
                ? data.userData.totalAmount.toFixed(2)
                : "0.00"}
            </span>
            <span className="flex items-center gap-1 text-[#308D6F]">
              <Star className="w-3.5 h-3.5 fill-[#308D6F]" />{" "}
              {data?.userData?.totalPoint
                ? data.userData.totalPoint.toFixed(0)
                : "0"}{" "}
              Pts
            </span>
          </div>
        )}
      </div>

      {/* Menu Links with Single Unified Icon Color (#308D6F) */}
      <div className="space-y-0.5 text-xs font-medium">
        <Link
          href={profileHref}
          onClick={() => setDropdownOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#308D6F] transition-colors group"
        >
          <User className="w-4 h-4 text-[#308D6F]" />
          <span>My Profile</span>
        </Link>

        {!isPlayerOrTeam && (
          <>
            <Link
              href="/deposit"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#308D6F] transition-colors"
            >
              <Wallet className="w-4 h-4 text-[#308D6F]" />
              <span>Deposit Funds</span>
            </Link>

            <Link
              href="/tippz-history"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#308D6F] transition-colors"
            >
              <History className="w-4 h-4 text-[#308D6F]" />
              <span>Tippz History</span>
            </Link>

            <Link
              href="/transaction-log"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#308D6F] transition-colors"
            >
              <ReceiptText className="w-4 h-4 text-[#308D6F]" />
              <span>Transaction Log</span>
            </Link>

            <Link
              href="/favorites"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#308D6F] transition-colors"
            >
              <Heart className="w-4 h-4 text-[#308D6F]" />
              <span>Favorites</span>
            </Link>

            <Link
              href="/faqs"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#308D6F] transition-colors"
            >
              <CircleHelp className="w-4 h-4 text-[#308D6F]" />
              <span>FAQs</span>
            </Link>

            <Link
              href="/invite-friends"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#308D6F] transition-colors"
            >
              <UserPlus className="w-4 h-4 text-[#308D6F]" />
              <span>Invite Friends</span>
            </Link>

            <Link
              href="/contact"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#308D6F] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#308D6F]" />
              <span>Contact Us</span>
            </Link>
          </>
        )}

        <button
          onClick={handlePasswordChange}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#308D6F] transition-colors text-left cursor-pointer"
        >
          <Lock className="w-4 h-4 text-[#308D6F]" />
          <span>Change Password</span>
        </button>

        <div className="my-1 border-t border-slate-100" />

        <button
          onClick={() => {
            setDropdownOpen(false);
            handleSignOut();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left font-semibold cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all duration-200">
      <nav className="flex items-center justify-between max-w-355 mx-auto px-4 py-3">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center group transition-transform duration-200 hover:scale-[1.02]"
        >
          <Image
            src={IMAGE.logo}
            height={42}
            width={140}
            alt="PROTIPPZ Logo"
            className="w-auto h-8 object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center space-x-7 text-sm font-semibold tracking-wide">
          {navItems.map((item) => {
            const isActive = isRouteActive(pathname, item.href, item.external);

            return (
              <li key={item.href} className="relative py-1">
                <Link
                  target={item.external ? "_blank" : "_self"}
                  href={item.href}
                  className={`transition-colors duration-200 flex items-center ${
                    isActive
                      ? "text-[#308D6F] font-bold"
                      : "text-[#154098] hover:text-[#308D6F]"
                  }`}
                >
                  {item.text}
                </Link>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#308D6F] rounded-full" />
                )}
              </li>
            );
          })}
        </ul>

        {/* Action Buttons for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {data?.loading ? (
            <div className="flex items-center space-x-2.5">
              <div className="w-24 h-8 rounded-full bg-slate-200/80 animate-pulse" />
              <div className="w-20 h-8 rounded-full bg-slate-200/80 animate-pulse" />
              <div className="w-9 h-9 rounded-full bg-slate-200/80 animate-pulse" />
              <div className="w-9 h-9 rounded-full bg-slate-200/80 animate-pulse" />
            </div>
          ) : data?.userData?._id ? (
            <div className="flex items-center space-x-3">
              {/* User Balance Badges */}
              {!isPlayerOrTeam && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#308D6F]/10 border border-[#308D6F]/20 text-[#308D6F] text-xs font-bold shadow-xs">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#308D6F] text-white">
                      <DollarSign className="w-3 h-3" />
                    </span>
                    <span>
                      $
                      {data?.userData?.totalAmount
                        ? data.userData.totalAmount.toFixed(2)
                        : "0.00"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#308D6F]/10 border border-[#308D6F]/20 text-[#308D6F] text-xs font-bold shadow-xs">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#308D6F] text-white">
                      <Star className="w-3 h-3 fill-white text-white" />
                    </span>
                    <span>
                      {data?.userData?.totalPoint
                        ? data.userData.totalPoint.toFixed(0)
                        : "0"}{" "}
                      Pts
                    </span>
                  </div>
                </div>
              )}

              {/* Notification Icon */}
              <Link
                href="/notification"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-[#308D6F]/15 hover:text-[#308D6F] text-slate-700 transition-all duration-200"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-700" />
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative">
                <Dropdown
                  dropdownRender={() => userDropdownContent}
                  trigger={["click"]}
                  placement="bottomRight"
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                  getPopupContainer={(triggerNode) =>
                    triggerNode.parentElement || document.body
                  }
                >
                  <button className="flex items-center justify-center w-9 h-9 rounded-full bg-[#308D6F] text-white hover:opacity-90 transition-all duration-200 cursor-pointer shadow-xs">
                    {data?.userData?.profile_image ? (
                      <Image
                        src={data.userData.profile_image}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-sm">
                        {data?.userData?.name
                          ? data.userData.name[0].toUpperCase()
                          : "U"}
                      </span>
                    )}
                  </button>
                </Dropdown>
              </div>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="bg-[#308D6F] hover:bg-[#257259] text-white font-semibold text-sm px-5 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 whitespace-nowrap active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={showDrawer}
            className="p-2 rounded-lg bg-slate-100 text-[#154098] hover:bg-[#308D6F]/10 hover:text-[#308D6F] transition-all cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            <MenuIcon className="w-5 h-5 text-[#154098]" />
          </button>
        </div>
      </nav>

      {/* Slide-over Drawer for Mobile */}
      <Drawer
        title={
          <div className="flex items-center justify-between py-1">
            <Image
              src={IMAGE.logo}
              height={36}
              width={130}
              alt="PROTIPPZ"
              className="w-auto h-8 object-contain"
            />
          </div>
        }
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        closeIcon={<CloseIcon className="w-5 h-5 text-[#154098]" />}
        className="mobile-nav-drawer"
        width={300}
      >
        <div className="flex flex-col h-full justify-between pb-6">
          <div className="space-y-6">
            {/* User Stats Card on Mobile */}
            {data?.loading ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="h-7 rounded-lg bg-slate-200/80 animate-pulse" />
                <div className="h-7 rounded-lg bg-slate-200/80 animate-pulse" />
              </div>
            ) : data?.userData?._id && !isPlayerOrTeam ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 text-[#308D6F] text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Balance
                  </span>
                  <span>
                    $
                    {data?.userData?.totalAmount
                      ? data.userData.totalAmount.toFixed(2)
                      : "0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 text-[#308D6F] text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#308D6F]" /> Points
                  </span>
                  <span>
                    {data?.userData?.totalPoint
                      ? data.userData.totalPoint.toFixed(0)
                      : "0"}{" "}
                    Pts
                  </span>
                </div>
              </div>
            ) : null}

            {/* Mobile Nav Links */}
            <ul className="space-y-2 font-semibold text-base">
              {mobileNavItems.map((item) => {
                const isActive = isRouteActive(
                  pathname,
                  item.href,
                  item.external,
                );

                return (
                  <li key={item.href}>
                    <Link
                      target={item.external ? "_blank" : "_self"}
                      href={item.href}
                      onClick={closeDrawer}
                      style={
                        isActive
                          ? { backgroundColor: "#308D6F", color: "#ffffff" }
                          : undefined
                      }
                      className={`block px-4 py-3 rounded-xl transition-all duration-200 font-bold ${
                        isActive
                          ? "shadow-md text-white"
                          : "text-[#154098] hover:bg-slate-100 hover:text-[#308D6F]"
                      }`}
                    >
                      {item.text}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom Actions on Mobile */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            {data?.loading ? (
              <div className="w-full h-11 rounded-xl bg-slate-200/80 animate-pulse" />
            ) : data?.userData?._id ? (
              <div className="space-y-2">
                <Link
                  href={profileHref}
                  onClick={closeDrawer}
                  className="block text-center w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#154098] font-semibold rounded-xl text-sm transition-all"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    closeDrawer();
                    handleSignOut();
                  }}
                  className="block text-center w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-xl text-sm transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                onClick={closeDrawer}
                className="block text-center w-full py-3 px-4 bg-[#308D6F] hover:bg-[#257259] text-white font-semibold rounded-xl shadow-xs text-sm transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
