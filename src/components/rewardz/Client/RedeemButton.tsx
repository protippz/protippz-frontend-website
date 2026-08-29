"use client";
import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import check from "@/Assets/check.png";
import Image from "next/image";
import Title from "antd/es/typography/Title";
import { post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import { RewardInterface } from "@/app/(default)/rewardz/page";

interface SendTipsButtonProps {
  item: RewardInterface;
}

const RedeemButton: React.FC<SendTipsButtonProps> = ({ item }) => {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] =
    useState(false);
  const [isEmailVerifiedModalOpen, setIsEmailVerifiedModalOpen] =
    useState(false);
  const [isShippingAddressModalOpen, setIsShippingAddressModalOpen] =
    useState(false);
  const [
    isEmailVerificationCodeModalOpen,
    setIsEmailVerificationCodeModalOpen,
  ] = useState(false);
  const [email, setEmail] = useState("");
  const [redeemId, setRedeemId] = useState("");
  const handleGuideModalOk = () => {
    setIsGuideModalOpen(false);
  };

  const handleGuideModalCancel = () => {
    setIsGuideModalOpen(false);
  };

  const showGuideModal = () => {
    setIsGuideModalOpen(true);
  };

  const handleGuideModalNext = () => {
    setIsGuideModalOpen(false);
    item?.category?.deliveryOption == "Email"
      ? setIsEmailVerificationModalOpen(true)
      : setIsShippingAddressModalOpen(true);
  };

  const handleEmailVerificationModalOk = async () => {
    setIsEmailVerificationModalOpen(false);
    setIsEmailVerifiedModalOpen(true);
  };

  const handleEmailVerificationModalCancel = () => {
    setIsEmailVerificationModalOpen(false);
  };

  const handleEmailVerifiedModalOk = () => {
    setIsEmailVerifiedModalOpen(false);
  };

  const handleShippingAddressModalOk = () => {
    setIsShippingAddressModalOpen(false);
  };

  const handleShippingAddressModalCancel = () => {
    setIsShippingAddressModalOpen(false);
  };

  const showShippingAddressModalSubmit = async (value: any) => {
    const res = await post(
      "/redeem-request/create",
      {
        reward: item?._id,
        category: item?.category?._id,
        ...value,
      },
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
    if (res?.success) {
      toast.success(res?.message);
      handleShippingAddressModalCancel();
    } else {
      toast.error(res?.message);
    }
    // setIsShippingAddressModalOpen(true);
  };
  // send email verification mail
  const handleEmailVerificationCodeModalOk = async () => {
    const res = await post(
      "/redeem-request/create",
      {
        reward: item?._id,
        category: item?.category?._id,
        email: email,
      },
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
    if (res?.success) {
      setRedeemId(res?.data?._id);
      toast.success(res?.message);
      handleEmailVerificationModalCancel();
      setIsEmailVerificationCodeModalOpen(true);
    } else {
      toast.error(res?.message);
      handleEmailVerificationModalCancel();
    }
  };
  // email verify
  const onOtpInput = async (value: any) => {
    const res = await post(
      `/redeem-request/verify-redeem-email/${redeemId}`,
      { verifyCode: Number(value?.verifyCode) },
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
    if (res?.success) {
      toast.success(res?.message);
      setIsEmailVerifiedModalOpen(true);
      handleEmailVerificationCodeModalCancel();
    } else {
      toast.error(res?.message);
    }
  };
  const handleEmailVerificationCodeModalCancel = () => {
    setIsEmailVerificationCodeModalOpen(false);
  };
  return (
    <>
      <button
        onClick={showGuideModal}
        className="bg-[#053697] text-white font-bold py-2 px-4 rounded-md hover:bg-[#053697]/90 focus:outline-none"
      >
        Redeem
      </button>
      {/* Guide Modal */}
      <Modal
        centered
        title="How to receive the prize"
        visible={isGuideModalOpen}
        onOk={handleGuideModalNext}
        onCancel={handleGuideModalCancel}
        footer={[
          <button
            onClick={handleGuideModalNext}
            className="bg-[#053697] text-white font-bold py-2 px-4 rounded-md hover:bg-[#053697]/90 focus:outline-none"
          >
            Redeem
          </button>,
        ]}
      >
        {item?.category?.deliveryOption == "Email" ? (
          <>
            <p>
              <strong>Verify Your Email Address:</strong> Enter your email
              address in the provided field and click “Verify.” A verification
              link will be sent to your email. Open the email and click on the
              link to confirm your email address. This step is required for
              digital prizes such as tickets or cash.
            </p>
            <p className="my-3">
              <strong>Verify Your Name and Mailing Address:</strong> For
              physical prizes like gear or merchandise, you will need to provide
              your full name and mailing address. Enter the required information
              in the designated fields and click “Submit.” Ensure that the
              details are accurate to avoid any delivery issues.
            </p>
            <p>
              <strong>Confirmation:</strong> Once your information is verified,
              you will receive a confirmation message. For digital prizes, the
              tickets or cash will be sent to your verified email address. For
              physical prizes, the items will be shipped to your provided
              mailing address.
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>Enter Your Shipping Address Carefully:</strong> For
              physical prizes like gear or merchandise, please provide your full
              name and accurate mailing address in the designated fields.
              Double-check your street address, city, state, and zip code to
              ensure there are no errors. Incorrect or incomplete information
              may cause delivery delays or issues.
            </p>
            <p className="my-3">
              <strong>Check Your Shipping Details:</strong> Before submitting,
              review your address carefully. Make sure the details are complete
              and correct, as the shipment will be sent to the address provided.
              If any changes are needed, please update the information before
              submitting.
            </p>
            <p>
              <strong>Confirmation:</strong> Once your address is submitted,
              your physical prizes will be shipped to the provided address. You
              will receive a confirmation message and tracking details to your
              email once the items are dispatched.
            </p>
          </>
        )}
      </Modal>

      {/* Email Verification Modal */}
      <Modal
        centered
        title="Verify Email Address"
        visible={isEmailVerificationModalOpen}
        onOk={handleEmailVerificationModalOk}
        onCancel={handleEmailVerificationModalCancel}
        footer={[
          <Button
            key="verify"
            type="primary"
            onClick={handleEmailVerificationCodeModalOk}
          >
            Verify Email
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              onChange={(e) => setEmail(e.target.value)}
              className="h-[42px]"
              placeholder="Your email"
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* Email Verification Code Modal */}
      <Modal
        open={isEmailVerificationCodeModalOpen}
        onCancel={handleEmailVerificationCodeModalCancel}
        centered
        footer={false}
      >
        <div className="flex flex-col items-center p-8 rounded-lg max-w-lg w-full bg-white">
          <Title level={3} className="text-center text-[#053697] text-3xl mt-4">
            Enter Code
          </Title>

          <Form
            requiredMark={false}
            onFinish={onOtpInput}
            name=""
            layout="vertical"
            className="w-full"
          >
            <Form.Item
              label="Please enter the 6 digit code"
              name="verifyCode"
              className="text-center flex justify-center items-center"
              rules={[{ required: true, message: "Please enter your Otp" }]}
            >
              <Input.OTP length={5} className="h-[42px]" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#053697] hover:bg-[#053697]/90 h-[42px] max-w-[320px] mx-auto block"
              >
                Verify Otp
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      {/* Email Verified Modal */}
      <Modal
        centered
        visible={isEmailVerifiedModalOpen}
        onOk={handleEmailVerifiedModalOk}
        onCancel={handleEmailVerifiedModalOk}
        footer={null}
      >
        <div className="flex justify-center items-center gap-3 flex-col py-10">
          <Image src={check} alt="check" height={100} width={100} />
          <p className="text-lg font-semibold mt-4">
            Request Send Successfully!
          </p>
        </div>
      </Modal>
      {/* Shipping Address Modal */}
      <Modal
        title={
          <span className="text-lg font-bold text-[#053697]">
            Verify Name and Mailing Address
          </span>
        }
        visible={isShippingAddressModalOpen}
        onOk={handleShippingAddressModalOk}
        onCancel={handleShippingAddressModalCancel}
        footer={null}
        centered
      >
        <Form onFinish={showShippingAddressModalSubmit} layout="vertical">
          <Form.Item
            label="Full Name"
            name={`userName`}
            rules={[
              {
                message: "Full name is required",
                required: true,
              },
            ]}
            className="mt-4"
          >
            <Input
              placeholder="Enter full name"
              className="rounded-lg border border-green-400"
            />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name={`phone`}
            rules={[
              {
                message: "Phone Number is required",
                required: true,
              },
            ]}
            className="mt-4"
          >
            <Input
              placeholder="Enter Phone Number"
              className="rounded-lg border border-green-400"
            />
          </Form.Item>

          <Form.Item label="Mailing Address" className="mt-4">
            <Form.Item
              label="Street Address"
              name={`streetAddress`}
              rules={[
                {
                  message: "Street Address is required",
                  required: true,
                },
              ]}
              className="mb-2"
            >
              <Input
                placeholder="Street Address"
                className="rounded-lg border border-green-400"
              />
            </Form.Item>
            <Form.Item
              label="City"
              name={`city`}
              rules={[
                {
                  message: "City is required",
                  required: true,
                },
              ]}
              className="mb-2"
            >
              <Input
                placeholder="City"
                className="rounded-lg border border-green-400"
              />
            </Form.Item>
            <Form.Item
              label="State"
              name={`state`}
              rules={[
                {
                  message: "State is required",
                  required: true,
                },
              ]}
              className="mb-2"
            >
              <Input
                placeholder="State"
                className="rounded-lg border border-green-400"
              />
            </Form.Item>
            <Form.Item
              label="Zip Code"
              name={`zipCode`}
              rules={[
                {
                  message: "Zip Code is required",
                  required: true,
                },
              ]}
              className="mb-2"
            >
              <Input
                placeholder="Zip Code"
                className="rounded-lg border border-green-400"
              />
            </Form.Item>
          </Form.Item>

          <Form.Item className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full rounded-lg bg-[#053697] text-white"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RedeemButton;
