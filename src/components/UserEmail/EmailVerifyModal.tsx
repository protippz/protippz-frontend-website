"use client";
import React, { useState } from "react";
import { Button, Form, Input, message, Modal, Typography } from "antd";
import { addEmailAddress, IverifyEmail } from "@/ApisRequests/Auth";
import UserVerifyOtp from "./UserVerifyOtp";
import { post } from "@/ApisRequests/server";

const { Title } = Typography;

function EmailVerifyModal({
  setAddEmail,
  showModal,
  setShowModalOtp,
  setShowModal,
  showModaOtp,
}:{
  setAddEmail: (email: string) => void; // Function to set the email
  showModal: boolean; // State to control the visibility of the email modal
  setShowModalOtp: (value: boolean) => void; // Function to toggle OTP modal visibility
  setShowModal: (value: boolean) => void; // Function to toggle email modal visibility
  showModaOtp: boolean; // State to control the visibility of the OTP modal
}) {
  const onFinish = async (values: IverifyEmail) => {
    const EmailVerify = values.email;

    const data = { email: EmailVerify };

    try {
      const result = await post("/user/add-email-address", data, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (result.success) {
        setAddEmail(EmailVerify);
        setShowModal(false);
        setShowModalOtp(true);
      }
    } catch (error) {}
  };

  return (
    <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
      <div className="flex flex-col items-center">
        <Title level={3} className="text-center text-[#053697] text-3xl mt-4">
          Enter Your Email Address
        </Title>

        <Form
          requiredMark={false}
          name="emailForm"
          onFinish={onFinish}
          layout="vertical"
          className="w-full"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter your email" className="h-[42px]" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#053697] hover:bg-[#053697]/90 h-[42px]"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default EmailVerifyModal;
