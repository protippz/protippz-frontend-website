import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import logo from "@/Assets/logo.png";

const Footer = () => {
  return (
    <>
      {/* <hr className="h-[4px] w-full bg-[#2FC191]" /> */}
      {/* <hr className="h-[4px] w-full -mt-[1px] bg-[#053697]" /> */}
      <footer className="bg-white shadow-md px-2 pb-24 mt-10">
        <div className="container mx-auto text-center flex justify-between items-end md:items-center">
          <div className="flex justify-center mb-4">
            <Image src={logo} alt="PROTIPPZ" width={150} height={50} />
          </div>
          <div className="flex justify-center text-xs md:text-base space-x-8 mb-6 text-[#053697]">
            <Link href="/terms">
              <span className="capitalize hover:text-[#053697] cursor-pointer">
                Terms
              </span>
            </Link>
            <Link href="/privacy">
              <span className="capitalize hover:text-[#053697] cursor-pointer">
                Privacy
              </span>
            </Link>
            <Link href="/contact">
              <span className="capitalize hover:text-[#053697] cursor-pointer">
                contact
              </span>
            </Link>
          </div>
        </div>
        <hr className="border-t border-[#053697] mb-6" />
        <div className="container mx-auto flex justify-between items-center pb-6">
          <p className="text-[#053697] text-sm">
            © {new Date().getFullYear()} PROTIPPZ. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 text-[#2FC191] ">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="text-xl transition-all hover:text-[#06389f]" />
            </a>
            <a
              href="https://www.youtube.com/@PROTIPPZ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="text-xl transition-all hover:text-[#06389f]" />
            </a>
            <a
              href="https://www.tiktok.com/@protippz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="text-xl transition-all hover:text-[#06389f]" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-xl transition-all hover:text-[#06389f]" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-xl transition-all hover:text-[#06389f]" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="text-xl transition-all hover:text-[#06389f]" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
