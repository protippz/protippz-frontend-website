"use client";
import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import logo_bg from "@/Assets/logo_bg.png";
import { post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
const ContactUsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const onFinish = async (value: any) => {
    setLoading(true);
    const res = await post("/contact-us", value);
    if (res?.message == "Contact email sent successfully") {
      toast.success(res?.message);
      setLoading(false);
    } else {
      toast.error(res?.message);
      setLoading(false);
    }
  };
  // Update landing page
  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{
        backgroundImage: `url(${logo_bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-center text-[#053697] text-2xl font-bold mb-6">
          Contact Us
        </h2>

        <Form requiredMark={false} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter your full name!" },
            ]}
          >
            <Input
              placeholder="Your full name"
              style={{ borderColor: "#2FC191" }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              placeholder="Your email"
              style={{ borderColor: "#2FC191" }}
            />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <PhoneInput
              country={"us"}
              inputStyle={{ width: "100%", borderColor: "#2FC191" }}
              placeholder="Your phone number"
            />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please enter your message!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Your message"
              style={{ borderColor: "#2FC191", resize: "none" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              disabled={loading}
              type="primary"
              htmlType="submit"
              className={`w-full ${
                loading
                  ? "cursor-not-allowed"
                  : "bg-[#053697] hover:bg-[#032b6d] text-white font-semibold"
              } `}
            >
              {loading ? "Sending..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ContactUsPage;
