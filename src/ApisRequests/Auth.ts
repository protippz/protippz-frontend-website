"use server";

import { baseUrl } from "./server";

interface SignUp {
  password: string;
  confirmPassword: string;
  userData: {
    name: string;
    username: string;
    phone?: string;
    email: string;
    address?: string;
    role?: string;
    accountType?: string;
    inviteToken?: string;
  };
  playerId?: string;
  platform?: "ios" | "android" | "web" | string;
}

export const signUpHandler = async (value: SignUp) => {
  const url = await baseUrl("user/register-user");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(value),
  });
  return await response.json();
};

interface verifyCode {
  verifyCode: number;
  email: string;
}

export const OtpVerify = async (value: verifyCode) => {
  const url = await baseUrl("user/verify-code");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(value),
  });
  return await response.json();
};

interface SignIn {
  userNameOrEmail: string;
  password: string;
  playerId?: string;
  platform?: "ios" | "android" | "web" | string;
}

export const SignInHandler = async (value: SignIn) => {
  console.log(value);
  const url = await baseUrl("auth/login");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(value),
  });
  return await response.json();
};

export interface IverifyEmail {
  email: string;
}

export const addEmailAddress = async (data: IverifyEmail) => {};
