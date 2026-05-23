import type { UserInfo } from "@appTypes/index";

// ===================== Login =====================

interface LoginResult {
  userInfo?: UserInfo;
  success?: string;
  error?: string;
}

const loginCustomer = async (data: {
  email: string;
  password: string;
}): Promise<LoginResult> => {
  if (!data.password || data.password.length < 6) {
    return { error: "Invalid credentials" };
  }
  const userInfo: UserInfo = {
    _id: `user_${Date.now()}`,
    name: data.email.split("@")[0],
    email: data.email,
    token: `local_token_${Date.now()}`,
    refreshToken: `local_refresh_${Date.now()}`,
  };
  return { userInfo, success: "Login Successfully!" };
};

// ===================== Register / Verify Email =====================

interface VerifyEmailResult {
  user?: unknown;
  error?: string;
}

const verifyEmailAddress = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<VerifyEmailResult> => {
  const user: UserInfo = {
    _id: `user_${Date.now()}`,
    name: data.name,
    email: data.email,
    token: `local_token_${Date.now()}`,
    refreshToken: `local_refresh_${Date.now()}`,
  };
  return { user };
};

// ===================== Change Password =====================

interface ChangePasswordResult {
  success?: string;
  error?: string;
}

const changePassword = async (
  _data: {
    email: string;
    currentPassword: string;
    newPassword: string;
  },
  _token: string,
): Promise<ChangePasswordResult> => {
  return { success: "Password changed successfully!" };
};

// ===================== Update Customer =====================

interface UpdateCustomerResult {
  user?: UserInfo;
  success?: string;
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
  return { user, success: "Profile updated successfully!" };
};

// ===================== Shipping Address =====================

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
  token?: string;
}): Promise<AddShippingAddressResult> => {
  return { success: "Shipping address added successfully!" };
};

export {
  loginCustomer,
  verifyEmailAddress,
  changePassword,
  updateCustomer,
  addShippingAddress,
};
