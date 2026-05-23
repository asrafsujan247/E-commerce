import React, { useRef, useState, useEffect } from "react";

import { useAuth } from "@stores/useAuthStore";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { changePassword } from "@services/CustomerServices";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import { notifySuccess, notifyError } from "@utils/toast";
import type { StoreCustomizationSetting } from "@appTypes/index";

// ---- Types ----

interface PasswordStrength {
  level: number;
  label: string;
  color: string;
  textColor: string;
}

interface FormErrors {
  email?: string;
  currentPassword?: string;
  newPassword?: string[];
}

interface FormState {
  success: boolean;
  error: string | null;
  errors: FormErrors;
}

// ---- Helpers ----

const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { level: 0, label: "", color: "", textColor: "" };

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2)
    return {
      level: score,
      label: "Weak",
      color: "bg-red-500",
      textColor: "text-red-500",
    };
  if (score === 3)
    return {
      level: score,
      label: "Fair",
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
    };
  if (score === 4)
    return {
      level: score,
      label: "Good",
      color: "bg-green-400",
      textColor: "text-green-500",
    };
  return {
    level: score,
    label: "Strong",
    color: "bg-primary",
    textColor: "text-primary",
  };
};

// ---- Component ----

const ChangePasswordPage: React.FC = () => {
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [newPassword, setNewPassword] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<FormState>({
    success: false,
    error: null,
    errors: {},
  });
  const [customization, setCustomization] =
    useState<StoreCustomizationSetting | null>(null);

  useEffect(() => {
    getStoreCustomizationSetting().then(({ storeCustomizationSetting }) => {
      if (storeCustomizationSetting) {
        setCustomization(storeCustomizationSetting);
      }
    });
  }, []);

  const dashboard = customization?.dashboard as
    | Record<string, Record<string, string>>
    | undefined;

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.token) return;

    const formData = new FormData(e.currentTarget);
    const currentPassword = (
      formData.get("currentPassword") as string
    )?.trim();
    const newPwd = (formData.get("newPassword") as string)?.trim();

    const errors: FormErrors = {};
    if (!currentPassword)
      errors.currentPassword = "Current password is required";
    if (!newPwd || newPwd.length < 8)
      errors.newPassword = ["Password must be at least 8 characters"];

    if (Object.keys(errors).length > 0) {
      setState({ success: false, error: null, errors });
      return;
    }

    setIsPending(true);
    setState({ success: false, error: null, errors: {} });

    const { success, error } = await changePassword(
      { currentPassword, newPassword: newPwd },
      user.token,
    );

    if (error) {
      setState({ success: false, error, errors: {} });
      notifyError(error);
    } else {
      setState({ success: true, error: null, errors: {} });
      notifySuccess(success ?? "Password changed successfully!");
      formRef.current?.reset();
      setNewPassword("");
    }

    setIsPending(false);
  };

  return (
    <div className="max-w-screen-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <svg
              className="w-5 h-5 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {String(dashboard?.change_password ?? '') ??
                "Change Password"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Update your account password for security
            </p>
          </div>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="bg-background rounded-2xl shadow-lg border border-border p-6">
          <div className="space-y-5">
            {/* Email Field */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                {String(dashboard?.user_email ?? '') ??
                  "Email Address"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  defaultValue={user?.email ?? ""}
                  readOnly
                  className="h-10 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
              {state.errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {state.errors.email}
                </p>
              )}
            </div>

            {/* Current Password */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                {String(dashboard?.current_password ?? '') ??
                  "Current Password"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  name="currentPassword"
                  autoComplete="new-password"
                  placeholder={
                    String(dashboard?.current_password ?? '') ??
                    "Enter current password"
                  }
                  className="h-10 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
              {state.errors.currentPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {state.errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                {String(dashboard?.new_password ?? '') ??
                  "New Password"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  placeholder={
                    String(dashboard?.new_password ?? '') ??
                    "Enter new password"
                  }
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.level ? strength.color : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strength.textColor}`}>
                    Password strength: {strength.label}
                  </p>
                </div>
              )}

              {state.errors.newPassword && (
                <ul className="mt-1.5 text-sm text-red-500 space-y-0.5">
                  {state.errors.newPassword.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Password requirements:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {[
                  {
                    met: newPassword.length >= 8,
                    label: "At least 8 characters",
                  },
                  {
                    met: /[a-zA-Z]/.test(newPassword),
                    label: "At least one letter",
                  },
                  { met: /[0-9]/.test(newPassword), label: "At least one number" },
                  {
                    met: /[^a-zA-Z0-9]/.test(newPassword),
                    label: "At least one special character",
                  },
                ].map(({ met, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 ${met ? "text-primary" : "text-muted-foreground"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <span>
                  {String(dashboard?.change_password ?? '') ??
                    "Update Password"}
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
