import React, { useEffect, useRef, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheck,
  FiAlertCircle,
  FiCamera,
} from "react-icons/fi";

import { useAuth } from "@stores/useAuthStore";
import { Button } from "@components/ui/button";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Uploader from "@components/image-uploader/Uploader";
import { updateCustomer } from "@services/CustomerServices";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import { notifySuccess, notifyError } from "@utils/toast";
import type { StoreCustomizationSetting } from "@appTypes/index";

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

interface FormState {
  success: boolean;
  error: string | null;
  message: string | null;
  errors: FormErrors;
}

const initialFormState: FormState = {
  success: false,
  error: null,
  message: null,
  errors: {},
};

const UpdateProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<FormState>(initialFormState);
  const [customization, setCustomization] =
    useState<StoreCustomizationSetting | null>(null);

  useEffect(() => {
    getStoreCustomizationSetting().then(({ storeCustomizationSetting }) => {
      if (storeCustomizationSetting) {
        setCustomization(storeCustomizationSetting);
      }
    });
  }, []);

  const defaultImg = imageUrl || user?.image || "";

  const dashboard = customization?.dashboard as
    | Record<string, Record<string, string>>
    | undefined;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?._id || !user?.token) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();

    const errors: FormErrors = {};
    if (!name) errors.name = "Name is required";

    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, errors, success: false, error: null }));
      return;
    }

    setIsPending(true);
    setState(initialFormState);

    const { user: updatedUser, error } = await updateCustomer(
      user._id,
      { name, phone, address, image: defaultImg },
      user.token,
    );

    if (error) {
      setState({ success: false, error, message: null, errors: {} });
      notifyError(error);
    } else if (updatedUser) {
      updateUser({
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        image: updatedUser.image,
      });
      setState({
        success: true,
        error: null,
        message: "Profile updated successfully!",
        errors: {},
      });
      notifySuccess("Profile updated successfully!");
      formRef.current?.reset();
    }

    setIsPending(false);
  };

  return (
    <div className="max-w-screen-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FiUser className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-none text-foreground sm:text-xl">
              {String(dashboard?.update_profile ?? '') ??
                "Update Profile"}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Update your personal information
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {state.success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <FiCheck className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-primary">{state.message}</p>
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <FiAlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{state.error}</p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
          {/* Profile Photo Section */}
          <div className="mb-8">
            <label className="block text-muted-foreground font-medium text-sm mb-3">
              <div className="flex items-center gap-2">
                <FiCamera className="w-4 h-4" />
                Profile Photo
              </div>
            </label>
            <div className="flex items-center gap-6">
              <Uploader imageUrl={defaultImg} setImageUrl={(url: string | string[]) => setImageUrl(Array.isArray(url) ? url[0] ?? "" : url)} />
            </div>
            <input type="hidden" name="imageUrl" value={defaultImg} />
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                {String(dashboard?.full_name ?? '') ?? "Full Name"}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="name"
                  defaultValue={user?.name ?? ""}
                  placeholder="Enter your full name"
                  className="h-12 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                />
              </div>
              {state.errors.name && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {state.errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                {String(dashboard?.user_email ?? '') ??
                  "Email Address"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  name="email"
                  defaultValue={user?.email ?? ""}
                  readOnly
                  className="h-12 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Phone & Address Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone */}
              <div className="form-group">
                <label className="block text-muted-foreground font-medium text-sm mb-2">
                  {String(dashboard?.user_phone ?? '') ??
                    "Phone Number"}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiPhone className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={user?.phone ?? ""}
                    placeholder="+1 (555) 000-0000"
                    className="h-12 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                  />
                </div>
                {state.errors.phone && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {state.errors.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="form-group">
                <label className="block text-muted-foreground font-medium text-sm mb-2">
                  {String(dashboard?.address ?? '') ?? "Address"}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMapPin className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    defaultValue={user?.address ?? ""}
                    placeholder="Your address"
                    className="h-12 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                  />
                </div>
                {state.errors.address && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {state.errors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              size="lg"
              isLoading={isPending}
              loadingText="Updating..."
            >
              <FiCheck className="h-4 w-4" />
              {String(dashboard?.update_button ?? "") || "Update Profile"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
