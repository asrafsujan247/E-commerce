import { z } from "zod";
import Cookies from "js-cookie";
import type { UserInfo } from "@appTypes/index";
import {
  loginCustomer,
  verifyOtpAndLogin,
} from "@services/CustomerServices";

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function persistAuthCookies(data: UserInfo): void {
  const cookieOptions = { expires: 7 };

  if (data.token) {
    Cookies.set("_token", data.token, cookieOptions);
  }

  Cookies.set(
    "_userInfo",
    JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      image: data.image,
    }),
    cookieOptions,
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthResult {
  success: boolean;
  user?: UserInfo | null;
  token?: string;
  error: string | null;
  errors?: Record<string, string[]> | null;
}

interface OtpStepResult {
  success: boolean;
  message?: string;
  step?: "phone" | "otp" | "email";
  phone?: string;
  email?: string;
  otp?: string | null;
  redirectUrl?: string;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function loginAction(credentials: {
  email: string;
  password: string;
  redirectUrl?: string;
}): Promise<AuthResult> {
  const { email, password } = credentials;

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: null,
    };
  }

  const { userInfo, error } = await loginCustomer({ email, password });

  if (error || !userInfo) {
    return {
      success: false,
      error: error ?? "Invalid credentials",
      errors: null,
    };
  }

  persistAuthCookies(userInfo);

  return {
    success: true,
    user: userInfo,
    token: userInfo.token,
    error: null,
    errors: null,
  };
}

export async function registerAction(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<AuthResult> {
  const { name, email, password, phone } = data;

  const validatedFields = registerSchema.safeParse({ name, email, password, phone });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: null,
    };
  }

  const userData: UserInfo = {
    _id: `user_${Date.now()}`,
    name,
    email,
    phone,
    token: `local_token_${Date.now()}`,
    refreshToken: `local_refresh_${Date.now()}`,
  };

  persistAuthCookies(userData);

  return {
    success: true,
    user: userData,
    token: userData.token,
    error: null,
    errors: null,
  };
}

export function logoutAction(): void {
  Cookies.remove("_token");
  Cookies.remove("_userInfo");
}

export async function verifyEmailAction(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult & { user: UserInfo | null }> {
  const { name, email, password } = data;

  const validatedFields = registerSchema.safeParse({ name, email, password });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: null,
      user: null,
    };
  }

  const user: UserInfo = {
    _id: `user_${Date.now()}`,
    name,
    email,
    token: `local_token_${Date.now()}`,
    refreshToken: `local_refresh_${Date.now()}`,
  };

  return { success: true, user, error: null, errors: null };
}

// ---------------------------------------------------------------------------
// OTP Login Actions — simulated in local mode
// ---------------------------------------------------------------------------

export async function sendPhoneOtpAction(phone: string): Promise<OtpStepResult> {
  if (!phone || phone.trim().length < 8) {
    return {
      success: false,
      error: "Please enter a valid phone number with country code",
      step: "phone",
    };
  }

  return {
    success: true,
    message: "OTP sent successfully (local mode: use any 4-digit code)",
    step: "otp",
    phone: phone.trim(),
    error: null,
    otp: "1234",
  };
}

export async function confirmPhoneOtpAction(
  phone: string,
  otp: string,
  redirectUrl?: string,
): Promise<OtpStepResult & { user?: UserInfo; token?: string }> {
  if (!phone || !otp || otp.length < 4) {
    return { success: false, error: "Please enter a valid OTP" };
  }

  const { userInfo, error } = await verifyOtpAndLogin({ phone, otp });

  if (error || !userInfo) {
    return { success: false, error: error ?? "Invalid OTP" };
  }

  persistAuthCookies(userInfo);

  return {
    success: true,
    message: "Login successful",
    user: userInfo,
    token: userInfo.token,
    redirectUrl: redirectUrl ?? "/user/dashboard",
    error: null,
  };
}

export async function resendPhoneOtpAction(
  phone: string,
): Promise<{ success: boolean; message?: string; error: string | null }> {
  if (!phone) {
    return { success: false, error: "Phone number is required" };
  }
  return { success: true, message: "OTP resent successfully", error: null };
}

export async function sendEmailOtpAction(email: string): Promise<OtpStepResult> {
  const emailSchema = z.string().email("Invalid email address");
  const result = emailSchema.safeParse(email);

  if (!result.success) {
    return { success: false, error: "Please enter a valid email address", step: "email" };
  }

  return {
    success: true,
    message: "OTP sent to your email (local mode: use any 4-digit code)",
    step: "otp",
    email: email.trim(),
    error: null,
  };
}

export async function confirmEmailOtpAction(
  email: string,
  otp: string,
  redirectUrl?: string,
): Promise<OtpStepResult & { user?: UserInfo; token?: string }> {
  if (!email || !otp || otp.length < 4) {
    return { success: false, error: "Please enter a valid OTP" };
  }

  const { userInfo, error } = await verifyOtpAndLogin({ email, otp });

  if (error || !userInfo) {
    return { success: false, error: error ?? "Invalid OTP" };
  }

  persistAuthCookies(userInfo);

  return {
    success: true,
    message: "Login successful",
    user: userInfo,
    token: userInfo.token,
    redirectUrl: redirectUrl ?? "/user/dashboard",
    error: null,
  };
}

export async function resendEmailOtpAction(
  email: string,
): Promise<{ success: boolean; message?: string; error: string | null }> {
  if (!email) {
    return { success: false, error: "Email is required" };
  }
  return { success: true, message: "OTP resent successfully", error: null };
}
