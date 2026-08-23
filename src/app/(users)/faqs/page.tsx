"use client";
import React, { useEffect, useState } from "react";
import { Collapse, Typography } from "antd";
import Heading from "@/components/Shared/Heading";
import { get } from "@/ApisRequests/server";

const { Panel } = Collapse;
const { Title, Text } = Typography;
interface FaqInterface {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
const FAQPage: React.FC = () => {
  const [data, setData] = useState<FaqInterface[]>();
  useEffect(() => {
    const getFaqData = async () => {
      const res = await get("/manage/get-faq");
      setData(res?.data || []);
    };
    getFaqData();
  }, []);
  return (
    <div className="max-w-355 mx-auto px-4 py-8">
      <Heading headingText="Frequently Asked Questions" />
      <Collapse
        accordion
        bordered={false}
        expandIconPosition="end"
        className="custom-collapse"
        expandIcon={({ isActive }) => (
          <span
            style={{
              fontSize: "20px",
              color: isActive ? "#1a73e8" : "#1a73e8",
            }}
          >
            {isActive ? "−" : "+"}
          </span>
        )}
      >
        {data?.map((item: FaqInterface) => (
          <Panel
            header={
              <span className="text-[#053697] font-semibold">
                {item?.question}
              </span>
            }
            key={item?._id}
            className="custom-panel"
          >
            <Text className="text-green-600">{item?.answer}</Text>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default FAQPage;
