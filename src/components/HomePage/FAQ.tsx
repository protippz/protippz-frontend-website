"use client";

import { useEffect, useState } from "react";
import { get } from "@/ApisRequests/server";

interface FaqInterface {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="border rounded-xl overflow-hidden transition-all duration-200"
      style={{
        borderColor: isOpen ? "rgba(42,146,109,0.3)" : "#D0D7DE",
        background: isOpen ? "rgba(42,146,109,0.03)" : "#fff",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left group cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className="text-sm sm:text-[15px] font-semibold leading-snug transition-colors duration-150"
          style={{ color: isOpen ? "#2FC191" : "#053697" }}
        >
          {question}
        </span>

        {/* Plus / minus icon */}
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 mt-0.5"
          style={{
            borderColor: isOpen ? "rgba(47,193,145,0.3)" : "#D0D7DE",
            background: isOpen ? "rgba(47,193,145,0.08)" : "transparent",
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <path
              d="M5 1v8M1 5h8"
              stroke={isOpen ? "#2FC191" : "#57606A"}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {/* Answer panel */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "500px" : "0px" }}
      >
        <div
          className="px-6 pb-5 border-t"
          style={{ borderColor: "rgba(47,193,145,0.12)" }}
        >
          <p className="text-sm text-[#57606A] leading-relaxed pt-4 whitespace-pre-line">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const [faqs, setFaqs] = useState<FaqInterface[]>([]);
  const [openItem, setOpenItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await get("/manage/get-faq");
        if (res?.data && Array.isArray(res.data)) {
          setFaqs(res.data);
          if (res.data.length > 0) {
            setOpenItem(res.data[0]?.question || null);
          }
        }
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      }
    };

    fetchFaqs();
  }, []);

  const toggle = (question: string) => {
    setOpenItem((prev) => (prev === question ? null : question));
  };

  return (
    <section className="relative w-full mt-4">
      <div className="max-w-355 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border"
            style={{
              background: "rgba(47,193,145,0.06)",
              borderColor: "rgba(47,193,145,0.22)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#2FC191] animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#2FC191]">
              FAQ
            </span>
          </div>

          <h2 className="text-4xl font-extrabold sm:text-5xl font-black text-[#053697] mb-4 leading-[1.1] tracking-[-0.03em]">
            Frequently asked <span className="text-[#2FC191]">questions</span>
          </h2>

          <p className="text-[#57606A] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Everything you need to know about PROTIPPZ from sending your first
            tip to unlocking exclusive fan rewards
          </p>
        </div>

        {/* FAQ List */}
        <div className="grid grid-cols-1">
          <div className="flex flex-col gap-2.5">
            {faqs.map((item) => (
              <FAQItem
                key={item._id || item.id || item.question}
                question={item.question}
                answer={item.answer}
                isOpen={openItem === item.question}
                onToggle={() => toggle(item.question)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
