"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Typography, Form } from "antd";
import { FaGoogle } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import Image from "next/image";
import logo from "@/Assets/logo.png";
import logo_bg from "@/Assets/logo_bg.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { post } from "@/ApisRequests/server";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const ResetPage: React.FC = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    confirmPassword: "",
    password: "",
    termsAccepted: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const onFinish = async (values: any) => {
    const data = {
      ...values,
      email: localStorage.getItem("email"),
    };
    const res = await post("/auth/reset-password", data);
    if (res?.success) {
      toast.success(res?.message || "Password reset successfully");
      router.push("/sign-in");
    } else {
      toast.error(res?.message || "something went wrong");
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
          Set New Password
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
            label="New Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              className="h-[42px]"
              iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please enter Confirm Password" },
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={handleInputChange}
              className="h-[42px]"
              iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
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
              Set New Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPage;
