import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse } from "@/types/api";

export type DevicePlatform = "ios" | "android" | "web" | string;

export interface AuthUserData {
  _id?: string;
  email?: string;
  name?: string;
  role?: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken?: string;
  role?: string;
  _id?: string;
  userId?: string;
  user?: AuthUserData;
  userData?: AuthUserData;
}

export interface LoginRequest {
  userNameOrEmail: string;
  password: string;
  playerId?: string;
  platform?: DevicePlatform;
}

export interface RegisterRequest {
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
  platform?: DevicePlatform;
}

export interface GoogleLoginRequest {
  name: string;
  picture?: string;
  email: string;
  username: string;
  address?: string;
  phone?: string;
  playerId?: string;
  platform?: DevicePlatform;
  [key: string]: unknown;
}

export interface VerifyCodeRequest {
  email: string;
  verifyCode: number;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: unknown;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword?: string;
  [key: string]: unknown;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthPayload>, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Profile"],
    }),
    googleLogin: builder.mutation<ApiResponse<AuthPayload>, GoogleLoginRequest>({
      query: (body) => ({ url: "/auth/google-login", method: "POST", body }),
      invalidatesTags: ["Profile"],
    }),
    register: builder.mutation<ApiResponse<Partial<AuthPayload> | null>, RegisterRequest>({
      query: (body) => ({ url: "/user/register-user", method: "POST", body }),
    }),
    verifyCode: builder.mutation<ApiResponse<Partial<AuthPayload> | null>, VerifyCodeRequest>({
      query: (body) => ({ url: "/user/verify-code", method: "POST", body }),
      invalidatesTags: ["Profile"],
    }),
    forgetPassword: builder.mutation<ApiResponse<unknown>, { email: string }>({
      query: (body) => ({ url: "/auth/forget-password", method: "POST", body }),
    }),
    verifyResetOtp: builder.mutation<ApiResponse<unknown>, Record<string, unknown>>({
      query: (body) => ({ url: "/auth/verify-reset-otp", method: "POST", body }),
    }),
    resetPassword: builder.mutation<ApiResponse<unknown>, ResetPasswordRequest>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
    changePassword: builder.mutation<ApiResponse<unknown>, ChangePasswordRequest>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useRegisterMutation,
  useVerifyCodeMutation,
  useForgetPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
