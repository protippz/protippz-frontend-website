"use client";

import React, { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Form, Radio, Input, Button } from "antd";
import Image from "next/image";
import cards from "@/Assets/cards.png";
import paypal from "@/Assets/paypal.png";
import { patch, post } from "@/ApisRequests/server";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "",
);

const DepositFundForm = () => {
  const router = useRouter();
  const currentParams = new URLSearchParams(
    typeof window == "undefined" ? "" : window.location.search,
  );
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [amount, setAmount] = useState(currentParams.get("amount"));
  const [entityType, setEntityType] = useState(currentParams.get("entityType"));
  const [entityId, setEntityId] = useState(currentParams.get("entityId"));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (amount && Number(amount) > 999999) {
      return toast.error("amount cant be more then 999999");
    }
    try {
      const clientSecret = await post(
        "/tip/create",
        {
          amount: Number(amount),
          entityId: entityId,
          entityType: entityType,
          tipBy: paymentMethod === "credit" ? "Credit card" : "Paypal",
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        },
      );
      if (paymentMethod === "credit" && stripe && elements) {
        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret?.data?.clientSecret,
          {
            payment_method: {
              card: cardElement!,
              billing_details: {
                name: "Customer Name",
              },
            },
          },
        );
        if (error) {
          console.error(error);
        } else {
          const executePayment = await patch(
            "/tip/execute-stipe-payment",
            {
              transactionId: paymentIntent?.id,
            },
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            },
          );
          if (executePayment?.success) {
            toast.success(executePayment?.message);
            router.push("/playerz");
          } else {
            toast.error(executePayment?.message);
          }
        }
      } else if (paymentMethod === "paypal") {
        router.push(clientSecret?.data?.approvalUrl);
      }
    } catch (error) {}
  };
  useEffect(() => {
    setAmount(currentParams.get("amount"));
    setEntityType(currentParams.get("entityType"));
    setEntityId(currentParams.get("entityId"));
  }, [
    currentParams.get("amount"),
    currentParams.get("entityType"),
    currentParams.get("entityId"),
  ]);
  return (
    <div
      style={{
        width: "100vw",
      }}
      className="w-full max-w-355 mx-auto"
    >
      <Form
        onSubmitCapture={handleSubmit}
        layout="vertical"
        className="w-full p-8 bg-white shadow-lg rounded-lg max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Select Tip Option
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/5 p-4 border rounded-lg ">
            <Form.Item>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full"
              >
                <div className="flex items-center mb-4 p-3 border rounded-lg border-green-400">
                  <Radio value="credit" className="flex items-center ">
                    <div className="flex flex-nowrap gap-3 items-center">
                      <p className="font-medium text-lg text-[#053697] whitespace-nowrap">
                        Credit Card
                      </p>
                      <Image
                        alt="Credit Card Logos"
                        height={400}
                        width={800}
                        src={cards}
                        className="w-[140px]"
                      />
                    </div>
                  </Radio>
                </div>
                <div className="flex items-center p-3 border rounded-lg border-green-400">
                  <Radio value="paypal" className="flex items-center">
                    <div className="flex flex-nowrap gap-3 items-center">
                      <span className="font-medium text-lg text-[#053697]">
                        PayPal
                      </span>
                      <Image
                        alt="PayPal Logo"
                        height={400}
                        width={800}
                        src={paypal}
                        className="w-[100px]"
                      />
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>

          {/* Card Details or PayPal Info */}
          <div className="w-full md:w-3/5 p-4 bg-gray-50 rounded-lg">
            {paymentMethod === "credit" ? (
              <>
                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Card Holder’s Name
                    </span>
                  }
                  className="mb-4"
                >
                  <Input
                    placeholder="Name here"
                    className="rounded-lg border border-green-400"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="text-lg font-medium text-[#053697]">
                      Card Info
                    </span>
                  }
                  className="mb-4"
                >
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": { color: "#9ca3af" },
                        },
                      },
                    }}
                    className="border border-green-400 rounded-lg p-2"
                  />
                </Form.Item>
                {/* <div className="flex gap-4">
                                    <Form.Item label={<span className="text-lg font-medium text-[#053697]">Expire Date</span>} className="flex-1 mb-4">
                                        <Input placeholder="MM/YY" className="rounded-lg border border-green-400" />
                                    </Form.Item>
                                    <Form.Item label={<span className="text-lg font-medium text-[#053697]">CVC</span>} className="flex-1 mb-4">
                                        <Input placeholder="CVV" className="rounded-lg border border-green-400" />
                                    </Form.Item>
                                </div> */}
              </>
            ) : (
              <div className="text-center">
                <p>
                  PayPal selected. Please click below to proceed with PayPal.
                </p>
              </div>
            )}

            <Form.Item
              label={
                <span className="text-lg font-medium text-[#053697]">
                  Enter Amount
                </span>
              }
              className="mt-4"
            >
              <Input
                type="number"
                placeholder="Enter amount here"
                value={amount || ""}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-lg border border-green-400"
              />
            </Form.Item>
            <Form.Item className="mt-6">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#053697] h-[42px] text-white font-semibold py-3 rounded-lg hover:bg-[#053697]/90 transition duration-300"
              >
                Send Tip
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

const TipPage = () => {
  return (
    <div className="">
      <Elements stripe={stripePromise}>
        <DepositFundForm />
      </Elements>
    </div>
  );
};

export default TipPage;
