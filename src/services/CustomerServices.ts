import type { UserInfo, ShippingAddress } from "@appTypes/index";

interface LoginResult {
  userInfo?: UserInfo;
  error?: string;
}

const loginCustomer = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResult> => {
  if (!password || password.length < 6) {
    return { error: "Invalid credentials" };
  }
  const userInfo: UserInfo = {
    _id: `user_${Date.now()}`,
    name: email.split("@")[0],
    email,
    token: `local_token_${Date.now()}`,
    refreshToken: `local_refresh_${Date.now()}`,
  };
  return { userInfo };
};

interface RegisterResult {
  user?: UserInfo;
  error: string | null;
}

const registerCustomer = async (_token: string): Promise<RegisterResult> => {
  return { user: undefined, error: "Registration is not available in local mode" };
};

interface OAuthSignupResult {
  res?: unknown;
  error?: string;
}

const signUpWithOauthProvider = async ({
  name,
  email,
}: {
  name: string;
  email: string;
  image?: string;
}): Promise<OAuthSignupResult> => {
  const userInfo: UserInfo = {
    _id: `user_${Date.now()}`,
    name,
    email,
    token: `local_token_${Date.now()}`,
    refreshToken: `local_refresh_${Date.now()}`,
  };
  return { res: userInfo };
};

interface OtpLoginResult {
  userInfo?: UserInfo;
  error?: string;
}

const verifyOtpAndLogin = async ({
  email,
  phone,
  otp,
}: {
  email?: string;
  phone?: string;
  otp: string;
}): Promise<OtpLoginResult> => {
  if (!otp || otp.length < 4) {
    return { error: "Invalid OTP" };
  }
  const identifier = email ?? phone ?? "user";
  const userInfo: UserInfo = {
    _id: `user_${Date.now()}`,
    name: identifier.split("@")[0],
    email: email ?? "",
    phone,
    token: `local_token_${Date.now()}`,
    refreshToken: `local_refresh_${Date.now()}`,
  };
  return { userInfo };
};

interface ShippingAddressResult {
  shippingAddress?: ShippingAddress;
  error?: string;
}

const getShippingAddress = async ({
  id: _id,
  userId: _userId,
  token: _token,
}: {
  id?: string;
  userId: string;
  token: string;
}): Promise<ShippingAddressResult> => {
  return { shippingAddress: undefined };
};

interface UpdateCustomerResult {
  user?: UserInfo;
  error?: string;
}

const updateCustomer = async (
  userId: string,
  data: unknown,
  _token: string,
): Promise<UpdateCustomerResult> => {
  const updates = data as Partial<UserInfo>;
  const user: UserInfo = {
    _id: userId,
    name: updates.name ?? "User",
    email: updates.email ?? "",
    phone: updates.phone,
    image: updates.image,
    address: updates.address,
    token: `local_token_${Date.now()}`,
  };
  return { user };
};

interface ChangePasswordResult {
  success?: string;
  error?: string;
}

const changePassword = async (
  _data: unknown,
  _token: string,
): Promise<ChangePasswordResult> => {
  return { success: "Password changed successfully!" };
};

interface AddShippingAddressResult {
  success?: string;
  error?: string;
}

const addShippingAddress = async ({
  userId: _userId,
  shippingAddressData: _data,
  token: _token,
}: {
  userId: string;
  shippingAddressData: unknown;
  token: string;
}): Promise<AddShippingAddressResult> => {
  return { success: "Shipping address added successfully!" };
};

export {
  loginCustomer,
  registerCustomer,
  signUpWithOauthProvider,
  verifyOtpAndLogin,
  getShippingAddress,
  updateCustomer,
  changePassword,
  addShippingAddress,
};
