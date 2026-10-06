"use client";
import React, { memo, useState } from "react";
import { Modal, Form, Input, Radio, Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { imageUrl, post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import { Player } from "@/app/(default)/playerz/page";
import { useContextData } from "@/provider/ContextProvider";
import Swal from "sweetalert2";
import PlayerDetailsServer from "./PlayerDetailsServer";

interface SendTipsButtonProps {
  item: Player;
  token: string | undefined | null;
  className?: string;
  buttonText?: React.ReactNode;
}

const SendTipsButton: React.FC<SendTipsButtonProps> = ({
  item,
  token,
  className,
  buttonText,
}) => {
  const [form] = Form.useForm();
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsModal, showDetailsModal] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isOopsModalOpen, setIsOopsModalOpen] = useState(false);
  const data = useContextData();
  const router = useRouter();

  const showModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!data?.userData?.user) {
      return Swal.fire({
        title: "You need to log in!",
        text: "Please log in to access this feature.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigateToLogin();
        }
      });
    }
    const targetId = e.currentTarget.id;
    if (targetId === 'details') {
      showDetailsModal(true);
    } else if (targetId === 'tippz') {
      setIsModalOpen(true);
    }
  };

  const navigateToLogin = () => {
    router.push("/sign-in");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsPaymentModalOpen(false);
    setIsOopsModalOpen(false);
  };
  // first modal handler
  const handleFormSubmit = (values: any) => {
    toast.dismiss();
    const amount = Object.entries(values)
      .filter(([key, val]) => !!val)
      .map(([key, val]) => val)
      .join();
    if (Number(amount) < 0 || !amount)
      return toast.error("please select amount");
    setAmount(amount);
    setIsModalOpen(false);
    setIsPaymentModalOpen(true);
  };
  // 2nd modal handler
  const handlePaymentSubmit = async (value: any) => {
    if (value?.paymentMethod == "deposit") {
      try {
        const MakeTip = await post(
          "/tip/create",
          {
            entityId: item?._id,
            entityType: "Player",
            amount: Number(amount),
            tipBy: "Profile balance",
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        if (MakeTip?.success) {
          toast.success(MakeTip?.message);
          setIsPaymentModalOpen(false);
        } else {
          toast.error(MakeTip.message);
          setIsPaymentModalOpen(false);
          setIsOopsModalOpen(true);
        }
      } catch (error) { }
    } else {
      router.push(
        `/send-tip?amount=${amount}&entityType=Player&entityId=${item?._id}`
      );
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* <button
          id='details'
          onClick={(e) => showModal(e)}
          className="bg-[#37C86D] text-white font-bold py-2 px-4 rounded-md hover:bg-[#184eb9]/90 focus:outline-none"
        >
          See Details
        </button> */}
        <button
          id='tippz'
          onClick={(e) => showModal(e)}
          className={
            className ||
            "bg-[#053697] text-white font-bold py-2 px-4 rounded-md hover:bg-[#184eb9]/90 focus:outline-none"
          }
        >
          {buttonText || "Send Tippz"}
        </button>
      </div>
      <Modal
        title=""
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={400}
      >
        <div className="text-center">
          <Image
            src={imageUrl(item?.player_image)}
            alt={item?.name}
            width={100}
            height={100}
            className="rounded-full border-2 mx-auto mb-4"
            unoptimized
          />
          <h2 className="text-xl font-bold text-[#053697]">{item?.name}</h2>
          {/* <p><span className="text-green-500 font-semibold">League:</span> NCAA</p> */}
          <p>
            <span className="text-green-500 font-semibold">Team:</span>{" "}
            {item?.team?.name}
          </p>
          <p>
            <span className="text-green-500 font-semibold">Position:</span>{" "}
            {item?.position}
          </p>
        </div>
        <Form
          requiredMark={false}
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
          className="mt-6"
        >
          <Form.Item label="Select Your Amount" name="amountOption">
            <Radio.Group
              onChange={() => form.setFieldValue("customAmount", "")}
            >
              <Radio value={5}>$5</Radio>
              <Radio value={25}>$25</Radio>
              <Radio value={100}>$100</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Enter Your Amount" name="customAmount">
            <Input
              onChange={() => {
                form.setFieldValue("amountOption", 0);
              }}
              placeholder="Enter amount"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#053697] w-full"
            >
              Send Tippz
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        title="Select your payment method"
        visible={isPaymentModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={400}
      >
        <Form onFinish={handlePaymentSubmit} layout="vertical">
          <Form.Item name="paymentMethod">
            <Radio.Group className="w-full">
              <Radio value="deposit">Send From Deposit Account</Radio>
              <Radio value="credit">Send From Credit Card/Paypal</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#053697] w-full"
            >
              Continue
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Oops Modal */}
      <Modal
        title="Oops!"
        visible={isOopsModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={400}
      >
        <div className="text-center">
          <p className="text-green-500 font-semibold">
            You don’t have enough funds to continue payment.
            <br />
            Please deposit fund to continue.
          </p>
          <Button
            type="primary"
            onClick={() => router.push("/deposit")}
            className="bg-[#053697] w-full mt-4"
          >
            Deposit Fund
          </Button>
        </div>
      </Modal>
      <PlayerDetailsServer token={token} id={item?._id} detailsModal={detailsModal} showDetailsModal={showDetailsModal} />
    </>
  );
};

export default memo(SendTipsButton);
