"use client";

import React, { useState } from "react";
import { Form, Radio, Input, Button } from "antd";
import Image from "next/image";
import ach from "@/Assets/ach.png";
import check2 from "@/Assets/check2.png";
import { useContextData } from "@/provider/ContextProvider";
import toast from "react-hot-toast";
import { post } from "@/ApisRequests/server";

const WithdrawFundForm = () => {
  const data = useContextData();
  const [paymentMethod, setPaymentMethod] = useState("ach");
  const [amount, setAmount] = useState(data?.userData?.totalAmount || 0);

  // Submit handler
  const handleSubmit = async (values: any) => {
    try {
      if (!data?.userData?.totalAmount) {
        return toast.error("Insufficient balance");
      }
      if (amount > data?.userData?.totalAmount) {
        toast.error("Insufficient balance.");
        return;
      }
      const ach = {
        ...values,
        bankAccountNumber: Number(values?.bankAccountNumber),
        routingNumber: Number(values?.routingNumber),
        amount: Number(amount),
        withdrawOption: "ACH",
        status: "Pending",
      };
      const check = {
        ...values,
        zipCode: Number(values?.zipCode),
        amount: Number(amount),
        withdrawOption: "Check",
        status: "Pending",
      };
      const res = await post(
        "/withdraw/create",
        paymentMethod == "ach" ? ach : check,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        },
      );
      if (res?.success) {
        toast.success(res?.message);
        window.location.href = "/";
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to withdraw funds");
    }
  };

  return (
    <div style={{ width: "100vw" }} className="w-full max-w-355 mx-auto">
      <div className="w-full p-8 bg-white rounded-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-3 text-[#053697]">
          {" "}
          Withdraw Funds
        </h2>
        <h2 className="text-3xl font-semibold text-center mb-6 text-[#053697]">
          <span className="text-[#2FC191]">Total Funds : </span> $
          {data?.userData?.totalAmount}
        </h2>
        <Form.Item name="amount">
          <div className="flex justify-center items-center gap-3 max-w-[400px] mx-auto md:flex-row flex-col">
            <p className="text-[#053697] text-2xl whitespace-nowrap">
              Enter amount
            </p>
            <Input
              value={amount}
              onChange={(e) => {
                toast.dismiss();
                if (!data?.userData?.totalAmount) {
                  return toast.error("Insufficient balance");
                }
                if (Number(e.target.value) > data?.userData?.totalAmount) {
                  return toast.error("Insufficient balance");
                }
                setAmount(Number(e.target.value));
              }}
              type="number"
              placeholder="Enter Your Amount"
            />
          </div>
        </Form.Item>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/5 p-4 border rounded-lg ">
            <Form.Item>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full"
              >
                <div className="flex items-center p-3 border rounded-lg border-green-400">
                  <Radio value="ach" className="flex items-center">
                    <div className="flex flex-nowrap gap-3 items-center justify-between">
                      <span className="font-medium text-lg text-[#053697]">
                        ACH
                      </span>
                      <Image
                        alt="ACH"
                        height={400}
                        width={800}
                        src={ach}
                        className="w-[100px]"
                      />
                    </div>
                  </Radio>
                </div>
                <div className="flex items-center p-3 border rounded-lg border-green-400 mt-4">
                  <Radio value="check" className="flex items-center">
                    <div className="flex flex-nowrap gap-3 items-center justify-between">
                      <span className="font-medium text-lg text-[#053697]">
                        Check
                      </span>
                      <Image
                        alt="Check"
                        height={100}
                        width={100}
                        src={check2}
                        className="w-[50px]"
                      />
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="w-full md:w-3/5 p-4 bg-gray-50 rounded-lg">
            {paymentMethod === "ach" ? (
              <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Bank Account Number
                    </span>
                  }
                  name="bankAccountNumber"
                  className="mt-4"
                  rules={[
                    {
                      required: true,
                      message: "Please input your bank account number!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Bank Account Number"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Routing Number
                    </span>
                  }
                  name="routingNumber"
                  className="mt-4"
                  rules={[
                    {
                      required: true,
                      message: "Please input your routing number!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Routing Number"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Account Type
                    </span>
                  }
                  name="accountType"
                  className="mt-4"
                  rules={[
                    {
                      required: true,
                      message: "Please input your account type!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Account Type"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Bank Name
                    </span>
                  }
                  name="bankName"
                  className="mt-4"
                  rules={[
                    { required: true, message: "Please input your bank name!" },
                  ]}
                >
                  <Input
                    placeholder="Enter Bank Name"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Account Holder Name
                    </span>
                  }
                  name="accountHolderName"
                  className="mt-4"
                  rules={[
                    {
                      required: true,
                      message: "Please input your account holder name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Account Holder Name"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>

                <Form.Item className="mt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-[#053697] h-[42px] text-white font-semibold py-3 rounded-lg hover:bg-[#053697]/90 transition duration-300"
                  >
                    Withdraw Now
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Full Name
                    </span>
                  }
                  name="fullName"
                  className="mt-4"
                  rules={[
                    { required: true, message: "Please input your full name!" },
                  ]}
                >
                  <Input
                    placeholder="Enter Full Name"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Email
                    </span>
                  }
                  name="email"
                  className="mt-4"
                  rules={[
                    { required: true, message: "Please input your Email!" },
                  ]}
                >
                  <Input
                    type="email"
                    placeholder="Enter Email"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Street Address
                    </span>
                  }
                  name="streetAddress"
                  className="mt-4"
                  rules={[
                    {
                      required: true,
                      message: "Please input your street address!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Street Address"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      City
                    </span>
                  }
                  name="city"
                  className="mt-4"
                  rules={[
                    { required: true, message: "Please input your city!" },
                  ]}
                >
                  <Input
                    placeholder="Enter City"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      State
                    </span>
                  }
                  name="state"
                  className="mt-4"
                  rules={[
                    { required: true, message: "Please input your state!" },
                  ]}
                >
                  <Input
                    placeholder="Enter State"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Zip Code
                    </span>
                  }
                  name="zipCode"
                  className="mt-4"
                  rules={[
                    { required: true, message: "Please input your zip code!" },
                  ]}
                >
                  <Input
                    placeholder="Enter Zip Code"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>

                <Form.Item className="mt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-[#053697] h-[42px] text-white font-semibold py-3 rounded-lg hover:bg-[#053697]/90 transition duration-300"
                  >
                    Withdraw Now
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawFundForm;
