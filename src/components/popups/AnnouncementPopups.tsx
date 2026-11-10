import Image from "next/image";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { X } from "lucide-react";
import popup from "@/../public/win-250.jpeg";
import { useRouter } from "next/navigation";

const COOKIE_NAME = "announcement_popup_dismissed";
const SHOW_LATER_COOKIE = "show_announcement_after";

function AnnouncementPopups() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const isDismissed = Cookies.get(COOKIE_NAME) === "true";
    const showAfter = Cookies.get(SHOW_LATER_COOKIE);
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    if (showAfter) {
      const showAfterDate = new Date(showAfter);
      if (new Date() < showAfterDate) return;
      Cookies.remove(SHOW_LATER_COOKIE);
    }

    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDontShowAgain = () => {
    Cookies.set(COOKIE_NAME, "true", { expires: 365 });
    setIsVisible(false);
  };

  const handleShowLater = () => {
    if (!token) {
      router.push("/sign-in");
    }
    // const in48Hours = new Date();
    // in48Hours.setHours(in48Hours.getHours() + 48);
    // Cookies.set(SHOW_LATER_COOKIE, in48Hours.toISOString(), { expires: 2 });
    setIsVisible(false);
  };

  const handleClose = () => setIsVisible(false);

  if (!isVisible) return null;

  return token ? null : (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden relative flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white text-gray-500 hover:text-gray-700  transition z-10"
          aria-label="Close announcement"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Left Side */}
        <div className="relative w-full md:w-1/3 h-64 md:h-auto">
          <Image
            src={popup}
            alt="Win $250 Announcement"
            fill
            className="object-contain md:rounded-l-3xl"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Right Side Content */}
        <div className="flex flex-col w-full justify-center items-center md:items-start p-6 md:p-10 md:w-3/4 text-center md:text-left gap-2">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
            Win <span className="text-green-500">$250</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Don't miss your chance to win $250 – join PROTIPPZ today!
          </p>

          <div className="flex flex-col w-full  sm:flex-row gap-2 justify-center md:justify-start mt-4">
            <button
              onClick={handleShowLater}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:opacity-90 transition-transform "
            >
              Join Now
            </button>
            <button
              onClick={handleDontShowAgain}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors "
            >
              Dismiss Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementPopups;
