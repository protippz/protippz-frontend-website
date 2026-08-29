"use client";
import React, { useState } from "react";
import { Button, Input, Typography, Form, Spin, message } from "antd";
import { useRouter } from "next/navigation";
import { OtpVerify } from "@/ApisRequests/Auth";
import toast from "react-hot-toast";
import { post } from "@/ApisRequests/server";
const { Title } = Typography;
interface UserVerifyOtpProps {
  setShowModalOtp: (value: boolean) => void;
  addEmail: string; 
}
const UserVerifyOtp = ({ setShowModalOtp, addEmail }:{
  addEmail: string; 
  setShowModalOtp: (value: boolean) => void; 

}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    otp: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const data = {
      email: addEmail,
      verifyCode: Number(values?.otp),
    };
    try {
      const result = await post("/user/verify-add-email", data, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (result.success) {
        toast.success("Email verified successfull");
        setLoading(false);
        setShowModalOtp(false);
      }
    } catch (error) {}
  };

  const onFinishFailed = (errorInfo: any) => {};

  return (
    <div className="flex flex-col items-center p-8 rounded-lg max-w-lg w-full bg-white shadow-lg">
      <Title level={3} className="text-center text-[#053697] text-3xl mt-4">
        Enter Code
      </Title>

      <Form
        requiredMark={false}
        name="signin"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        className="w-full"
      >
        <Form.Item
          label="Please enter the 6 digit code"
          name="otp"
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
            {loading ? <Spin size="small" /> : "Verify code"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserVerifyOtp;
