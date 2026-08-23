"use client";
import React, { useState } from "react";
import { Modal } from "antd";
import { post } from "@/ApisRequests/server";
import { FiClipboard } from "react-icons/fi";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

const InviteFriendsPage: React.FC = () => {
  const [inviteLink, setInviteLink] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const inviteHandler = async () => {
    const res = await post(
      "/invite/invite-friend",
      {},
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      },
    );
    if (res?.success) {
      setInviteLink(res?.data?.link);
      setOpenModal(true);
    } else {
      toast.error(res?.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        toast.success("The invite link has been copied to your clipboard.");
      })
      .catch(() => {
        toast.error("There was an error copying the invite link.");
      });
  };

  const openGmail = () => {
    const subject = "Join me on PROTIPPZ!";
    const body = `Hey, join PROTIPPZ using this link: ${inviteLink}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <div className="max-w-355 mx-auto px-4 py-8">
      <h2 className="text-center text-[#053697] text-4xl font-bold mb-2">
        Invite Friends
      </h2>
      <p className="text-center text-green-500 mb-8">
        Bring Friends, Earn Rewards!
      </p>

      <div className="mb-12 max-w-screen-lg mx-auto">
        <h3 className="text-[#053697] text-2xl font-semibold mb-3">
          How It Works
        </h3>
        <div className="mb-8 ">
          <p className="text-[#053697] font-bold mb-3">1. Invite</p>
          <p className=" ml-4 text-green-500">
            Use the “Invite Friends” button below to share your unique referral
            link via text, email, or social media.
          </p>
        </div>
        <div className="mb-8 ">
          <p className="text-[#053697] font-bold mb-3">2. Sign Up</p>
          <p className=" ml-4 text-green-500">
            When your friends sign up using your link, they’ll join the PROTIPPZ
            community where they can Tippz, win rewards, and participate in
            exclusive fan events.
          </p>
        </div>
        <div className="mb-8 ">
          <p className="text-[#053697] font-bold mb-3">3. Earn Rewards</p>
          <p className=" ml-4 text-green-500">
            For each friend who joins, you'll earn 10 points that you can redeem
            under our Rewardz tab.
          </p>
        </div>
      </div>
      <div className="text-center mb-12">
        <h3 className="text-[#053697] text-2xl font-semibold">
          Ready to Get Started?
        </h3>
        <p className="font-semibold mb-2 text-[#053697]">Invite Friends Now</p>
        <p className="text-green-500 mb-6">
          Click below to start inviting friends and watch your rewards grow!
        </p>
        <button
          onClick={inviteHandler}
          className="bg-green-500 hover:bg-green-400 h-[42px] text-white font-semibold px-8 py-2 rounded-md"
        >
          Invite Friends
        </button>
      </div>
      <Modal
        centered
        footer={false}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        width={500}
      >
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-semibold text-green-600 mb-6 text-center">
            Invite Link Created Successfully!
          </h3>
          <div className="flex items-center w-full mb-6">
            <p className="text-center w-full">{inviteLink}</p>
            <button onClick={handleCopy}>
              <FiClipboard
                size={24}
                className="ml-2 cursor-pointer text-green-600 hover:text-green-700 transition-all duration-300 ease-in-out"
              />
            </button>
          </div>

          <div className="flex space-x-4">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                inviteLink,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600 transition-all duration-300 ease-in-out"
            >
              <FaWhatsapp size={24} />
            </a>

            <Link
              href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
                "Join me on PROTIPPZ!",
              )}&body=${encodeURIComponent(
                `Hi,\n\nJoin me on PROTIPPZ using this link: ${inviteLink}\n\nCheers!`,
              )}`}
              target="_blank"
            >
              <button className="text-green-500 hover:text-green-600 transition-all duration-300 ease-in-out">
                <MdEmail size={24} />
              </button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InviteFriendsPage;
