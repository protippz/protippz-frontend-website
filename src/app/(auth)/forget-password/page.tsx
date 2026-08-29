"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Typography, Form } from "antd";
import Image from "next/image";
import logo from "@/Assets/logo.png";
import logo_bg from "@/Assets/logo_bg.png";
import Link from "next/link";
import { post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const ForgetPasswordPage: React.FC = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const onFinish = async (values: any) => {
    const res = await post("/auth/forget-password", values, {});
    if (res?.success) {
      localStorage.setItem("email", values?.email);
      toast.success(res?.message);
      router.push(`/forget-otp`);
    } else {
      toast.error(res?.message);
    }
  };

  const onFinishFailed = (errorInfo: any) => {};

  return (
    <div
      className="w-full min-h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${logo_bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center p-8 rounded-lg max-w-lg w-full bg-white shadow-lg">
        <Image src={logo} alt="logo" height={100} width={200} />

        <Title level={3} className="text-center text-[#053697] text-3xl mt-4">
          Forgot Password
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
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              className="h-[42px]"
            />
          </Form.Item>
          {/* Uncomment if terms checkbox is needed */}
          {/* <Form.Item name="terms" valuePropName="checked">
                        <Checkbox onChange={handleCheckboxChange} className="text-[#053697]">
                            I agree to the <Text underline>Terms and Privacy Policy</Text>
                        </Checkbox>
                    </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#053697] hover:bg-[#053697]/90 h-[42px]"
            >
              Recover Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
