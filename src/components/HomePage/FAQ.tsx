"use client";

import { useState } from "react";

const faqs = [
  {
    category: "General",
    items: [
      {
        question: "What is PROTIPPZ?",
        answer:
          "PROTIPPZ is a platform that lets fans directly tip and support female athletes they love. We bridge the gap between fan passion and athlete income   no middlemen, no delays, just real support that makes a real difference.",
      },
      {
        question: "Who can use PROTIPPZ?",
        answer:
          "Anyone can use PROTIPPZ   whether you are a fan wanting to support your favourite athlete, or a female athlete looking to earn direct income from your community. We welcome fans and athletes from all sports and countries.",
      },
      {
        question: "Is PROTIPPZ available worldwide?",
        answer:
          "Yes. PROTIPPZ is built for a global audience. Athletes and fans from any country can sign up and start connecting. We support multiple currencies and payment methods to make it seamless.",
      },
    ],
  },
  {
    category: "Tipping & Payments",
    items: [
      {
        question: "How do I send a tip to an athlete?",
        answer:
          'Simply search for an athlete by name, sport, or country   then tap "Send Tip", choose your amount, and confirm. The tip reaches the athlete instantly with no hidden fees eating into their earnings.',
      },
      {
        question: "What payment methods are supported?",
        answer:
          "We support all major credit and debit cards, Apple Pay, Google Pay, and select local payment methods depending on your region. All transactions are secured with industry-standard encryption.",
      },
      {
        question: "Are there any fees for tipping?",
        answer:
          "PROTIPPZ charges a small platform fee to keep the service running and secure. Athletes receive the majority of every tip   we are transparent about our fee structure and display it clearly before you confirm any transaction.",
      },
    ],
  },
  {
    category: "Rewards & Points",
    items: [
      {
        question: "How does the rewards system work?",
        answer:
          "Every tip you send earns you PROTIPPZ points. Accumulate enough points and you unlock exclusive rewards   from signed merch and behind-the-scenes content to meet-and-greets and VIP fan experiences with your favourite athletes.",
      },
      {
        question: "Do my points expire?",
        answer:
          "Points remain active as long as your account is in good standing. We occasionally run bonus point events and seasonal campaigns, so keep an eye on the app for opportunities to earn faster.",
      },
    ],
  },
  {
    category: "For Athletes",
    items: [
      {
        question: "How do athletes receive their tips?",
        answer:
          "Athletes can withdraw their earnings directly to their bank account or preferred payment method. Withdrawals are processed within 1–3 business days, and athletes always have full visibility into their balance and transaction history.",
      },
      {
        question: "How do I sign up as an athlete?",
        answer:
          'Download the PROTIPPZ app, select "I am an athlete" during onboarding, and complete a short verification process. Once approved, your profile goes live and fans can start supporting you immediately.',
      },
    ],
  },
];

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
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className="text-sm sm:text-[15px] font-semibold leading-snug transition-colors duration-150"
          style={{ color: isOpen ? "#2FC191" : "#1A2A23" }}
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
        style={{ maxHeight: isOpen ? "400px" : "0px" }}
      >
        <div
          className="px-6 pb-5 border-t"
          style={{ borderColor: "rgba(47,193,145,0.12)" }}
        >
          <p className="text-sm text-[#57606A] leading-relaxed pt-4">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>("What is PROTIPPZ?");

  const toggle = (question: string) => {
    setOpenItem((prev) => (prev === question ? null : question));
  };

  return (
    <section className="relative w-full">
      {/* Silk top border */}
      {/* <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#D0D7DE] to-transparent" /> */}

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

          <h2 className="text-4xl font-e sm:text-5xl font-black text-[#1A2A23] mb-4 leading-[1.1] tracking-[-0.03em]">
            Frequently asked <span className="text-[#2FC191]">questions</span>
          </h2>

          <p className="text-[#57606A] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Everything you need to know about PROTIPPZ from sending your first
            tip to unlocking exclusive fan rewards
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1">
          {/* Right   FAQ items */}
          <div className="lg:col-span-9 flex flex-col gap-10">
            {faqs.map((section) => (
              <div
                key={section.category}
                id={`faq-${section.category.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {/* Category label */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold tracking-[0.16em] uppercase text-[#2FC191]">
                    {section.category}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#D0D7DE" }}
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  {section.items.map((item) => (
                    <FAQItem
                      key={item.question}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openItem === item.question}
                      onToggle={() => toggle(item.question)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Silk bottom border */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#D0D7DE] to-transparent" /> */}
    </section>
  );
}

export default FAQ;
