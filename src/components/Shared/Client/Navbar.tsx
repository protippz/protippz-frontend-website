"use client";

import React, { useState } from "react";
import { Dropdown } from "antd";
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
  Home,
  Zap,
  Users,
  Shield,
  Gift,
  ShoppingBag,
  Menu,
  Users2,
} from "lucide-react";
import { useContextData } from "@/provider/ContextProvider";
import Cookies from "js-cookie";
import { IMAGE } from "@/constant/image.index";
import { oneSignalLogout } from "@/components/OneSignal/OneSignalHandler";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const data = useContextData();
  const router = useRouter();
  const pathname = usePathname();

  const isPlayerOrTeam =
    data?.userData?.user?.role === "player" ||
    data?.userData?.user?.role === "team";

  const profileHref = isPlayerOrTeam ? "/home" : "/profile";

  const navItems = [
    ...(data?.userData ? [] : [{ href: "/tippz", text: "TIPPZ" }]),
    ...(!isPlayerOrTeam
      ? [
        { href: "/playerz", text: "PLAYERZ" },
        { href: "/teamz", text: "TEAMZ" },
      ]
      : []),
    { href: "/community", text: "MEDIA & COMMUNITY" },
    { href: "/rewardz", text: "REWARDZ" },
    { href: "https://protippz.store", text: "STORE", external: true },
  ];

  const mobileNavItems = [{ href: data?.userData ? "/community" : "/", text: "HOME" }, ...navItems];

  const handleSignOut = async () => {
    try {
      await oneSignalLogout();
    } catch (err) {
      console.warn("[OneSignal] Logout error:", err);
    } finally {
      Cookies.remove("token");
      Cookies.remove("token", { path: "/" });
      localStorage.removeItem("token");
      window.location.href = "/sign-in";
    }
  };

  const handlePasswordChange = () => {
    setDropdownOpen(false);
    router.push("/change-password");
  };

  // Single-color unified User Dropdown Popover Card
  const userDropdownContent = (
    <div className="w-64 bg-white rounded-2xl border border-slate-100 p-2.5 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
      {/* Header Profile Info */}
      <div className="p-3 bg-emerald-50/60 rounded-xl mb-2 border border-emerald-100/60">
        <div className="flex items-center gap-2">
          {data?.userData?.profile_image ? (
            <Image
              src={data.userData.profile_image}
              alt="Profile"
              width={38}
              height={38}
              className="w-9 h-9 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#2FC191] text-white flex items-center justify-center font-bold text-sm">
              {data?.userData?.name ? data.userData.name[0].toUpperCase() : "U"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-[#053697] truncate leading-tight">
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
            <span className="flex items-center gap-1 text-[#2FC191]">
              <DollarSign className="w-3.5 h-3.5" /> $
              {data?.userData?.totalAmount
                ? data.userData.totalAmount.toFixed(2)
                : "0.00"}
            </span>
            <span className="flex items-center gap-1 text-[#2FC191]">
              <Star className="w-3.5 h-3.5 fill-[#2FC191]" />{" "}
              {data?.userData?.totalPoint
                ? data.userData.totalPoint.toFixed(0)
                : "0"}{" "}
              Pts
            </span>
          </div>
        )}
      </div>

      {/* Menu Links with Single Unified Icon Color (#2FC191) */}
      <div className="space-y-0.5 text-xs font-medium">
        <Link
          href={profileHref}
          onClick={() => setDropdownOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#2FC191] transition-colors group"
        >
          <User className="w-4 h-4 text-[#2FC191]" />
          <span>My Profile</span>
        </Link>
        {isPlayerOrTeam && <Link
          href={"/my-tip-history"}
          onClick={() => setDropdownOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#2FC191] transition-colors group"
        >
          <Wallet className="w-4 h-4 text-[#2FC191]" />
          <span>Tipz History</span>
        </Link>}
        {!isPlayerOrTeam && (
          <>
            <Link
              href="/deposit"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#2FC191] transition-colors"
            >
              <Wallet className="w-4 h-4 text-[#2FC191]" />
              <span>Deposit Funds</span>
            </Link>

            <Link
              href="/tippz-history"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#2FC191] transition-colors"
            >
              <History className="w-4 h-4 text-[#2FC191]" />
              <span>Tippz History</span>
            </Link>

            <Link
              href="/transaction-log"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#2FC191] transition-colors"
            >
              <ReceiptText className="w-4 h-4 text-[#2FC191]" />
              <span>Transaction Log</span>
            </Link>

            <Link
              href="/favorites"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#2FC191] transition-colors"
            >
              <Heart className="w-4 h-4 text-[#2FC191]" />
              <span>Favorites</span>
            </Link>

            <Link
              href="/faqs"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#2FC191] transition-colors"
            >
              <CircleHelp className="w-4 h-4 text-[#2FC191]" />
              <span>FAQs</span>
            </Link>

            <Link
              href="/invite-friends"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#2FC191] transition-colors"
            >
              <UserPlus className="w-4 h-4 text-[#2FC191]" />
              <span>Invite Friends</span>
            </Link>

            <Link
              href="/contact"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#2FC191] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#2FC191]" />
              <span>Contact Us</span>
            </Link>
          </>
        )}

        <button
          onClick={handlePasswordChange}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50/80 hover:text-[#2FC191] transition-colors text-left cursor-pointer"
        >
          <Lock className="w-4 h-4 text-[#2FC191]" />
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
    <>
      <header className="sticky top-0 z-999 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-200">
        <nav className="flex items-center justify-between max-w-355 mx-auto px-4 py-3">
          {/* Brand Logo */}
          <Link
            href={data?.userData ? "/community" : "/"}
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
                    className={`transition-colors duration-200 flex items-center ${isActive
                      ? "text-[#2FC191] font-bold"
                      : "text-[#053697] hover:text-[#2FC191]"
                      }`}
                  >
                    {item.text}
                  </Link>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2FC191] rounded-full" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Action Buttons for Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
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
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#2FC191]/10 border border-[#2FC191]/20 text-[#2FC191] text-xs font-bold">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#2FC191] text-white">
                        <DollarSign className="w-3 h-3" />
                      </span>
                      <span>
                        $
                        {data?.userData?.totalAmount
                          ? data.userData.totalAmount.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>

                    <Link href={"/rewardz"}>
                      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#2FC191]/10 border border-[#2FC191]/20 text-[#2FC191] text-xs font-bold">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#2FC191] text-white">
                          <Star className="w-3 h-3 fill-white text-white" />
                        </span>
                        <span>
                          {data?.userData?.totalPoint
                            ? data?.userData.totalPoint.toFixed(0)
                            : "0"}{" "}
                          Pts
                        </span>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Notification Icon */}
                <Link
                  href="/notification"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-[#2FC191]/15 hover:text-[#2FC191] text-slate-700 transition-all duration-200"
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
                    <button className="flex items-center justify-center w-9 h-9 rounded-full bg-[#2FC191] text-white hover:opacity-90 transition-all duration-200 cursor-pointer">
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
                className="bg-[#2FC191] hover:bg-[#2FC191]/90 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-all duration-200 whitespace-nowrap active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>

        </nav>

      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[999] lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 h-14">
        <div className="flex items-center justify-around px-1 h-full">
          {/* Bottom tabs */}
          {[
            ...(isPlayerOrTeam
              ? [
                {
                  href: "/home",
                  icon: Home,
                  label: "Dashboard",
                },
                {
                  href: "/community",
                  icon: Users2,
                  label: "Community",
                },
                {
                  href: "/rewardz",
                  icon: Gift,
                  label: "Rewardz",
                },
              ]
              : [
                {
                  href: data?.userData ? "/community" : "/",
                  icon: Home,
                  label: data?.userData ? "Community" : "Home",
                },
                ...(data?.userData
                  ? [{ href: "/rewardz", icon: Gift, label: "Rewardz" }]
                  : [{ href: "/tippz", icon: Zap, label: "Tippz" }]),
                { href: "/playerz", icon: Users, label: "Playerz" },
                { href: "/teamz", icon: Shield, label: "Teamz" },
              ]),
          ].map(({ href, icon: Icon, label }) => {
            const active = isRouteActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-xl transition-colors active:scale-[0.96] ${active ? "text-[#2FC191]" : "text-slate-400 hover:text-[#053697]"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span className={`text-[9px] uppercase tracking-wider ${active ? "font-extrabold" : "font-semibold"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
          {/* Hamburger — opens slide-up panel */}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-xl transition-colors text-slate-400 hover:text-[#053697] active:scale-[0.96] cursor-pointer"
            aria-label="More menu"
          >
            <Menu className="w-5 h-5" strokeWidth={1.8} />
            <span className="text-[9px] font-semibold uppercase tracking-wider">More</span>
          </button>
        </div>
      </nav>

      {/* Slide-up More Panel */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[2px] lg:hidden"
            onClick={() => setMoreOpen(false)}
          />
          {/* Panel */}
          <div className="fixed bottom-0 left-0 right-0 z-[1001] lg:hidden bg-white rounded-t-[28px] border-t border-slate-200/80 pb-safe">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>
            <div className="px-5 pt-2 pb-5">
              {/* User info strip (if logged in) */}
              {data?.userData?._id && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-slate-50 rounded-2xl border border-slate-100">
                  {data?.userData?.profile_image ? (
                    <Image
                      src={data.userData.profile_image}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#2FC191] text-white flex items-center justify-center font-bold text-sm">
                      {data?.userData?.name ? data.userData.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#053697] truncate">{data?.userData?.name || "My Account"}</p>
                    <p className="text-[11px] text-slate-400 truncate">{data?.userData?.email || ""}</p>
                  </div>
                  {!isPlayerOrTeam && (
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-[#2FC191]">${data?.userData?.totalAmount ? data.userData.totalAmount.toFixed(2) : "0.00"}</p>
                      <p className="text-[10px] text-slate-400">{data?.userData?.totalPoint ?? 0} Pts</p>
                    </div>
                  )}
                </div>
              )}

              {/* More nav links */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { href: "/rewardz", icon: Gift, label: "Rewardz" },
                  { href: "/community", icon: Users2, label: "Community" },
                  { href: "https://protippz.store", icon: ShoppingBag, label: "Store", external: true },
                ].map(({ href, icon: Icon, label, external }) => {
                  const active = isRouteActive(pathname, href, external);
                  return (
                    <Link
                      key={href}
                      href={href}
                      target={external ? "_blank" : "_self"}
                      onClick={() => setMoreOpen(false)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-colors active:scale-[0.97] ${active
                        ? "bg-[#2FC191]/10 border-[#2FC191]/30 text-[#2FC191]"
                        : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:text-[#053697]"
                        }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                      <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Account actions */}
              <div className="border-t border-slate-100 pt-4 space-y-1">
                {data?.userData?._id ? (
                  <>
                    <Link
                      href={profileHref}
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#2FC191] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#2FC191]" />
                      <span className="text-sm font-semibold">My Profile</span>
                    </Link>
                    {!isPlayerOrTeam && (
                      <Link
                        href="/deposit"
                        onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#2FC191] transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-[#2FC191]" />
                        <span className="text-sm font-semibold">Deposit Funds</span>
                      </Link>
                    )}
                    <Link
                      href="/my-tip-history"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#2FC191] transition-colors"
                    >
                      <Wallet className="w-4 h-4 text-[#2FC191]" />
                      <span className="text-sm font-semibold">Tipz History</span>
                    </Link>
                    <Link
                      href="/notification"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#2FC191] transition-colors"
                    >
                      <Bell className="w-4 h-4 text-[#2FC191]" />
                      <span className="text-sm font-semibold">Notifications</span>
                    </Link>
                    <button
                      onClick={() => { setMoreOpen(false); handleSignOut(); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span className="text-sm font-semibold">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setMoreOpen(false)}
                    className="block text-center w-full py-3 px-4 bg-[#2FC191] text-white font-semibold rounded-2xl text-sm transition-all active:scale-[0.98]"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
