import React, { useRef, useState, useEffect } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { useAuth } from "@stores/useAuthStore";
import { Button } from "@components/ui/button";
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
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
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

  const requirements = [
    { met: newPassword.length >= 8, label: "At least 8 characters" },
    { met: /[a-zA-Z]/.test(newPassword), label: "At least one letter" },
    { met: /[0-9]/.test(newPassword), label: "At least one number" },
    {
      met: /[^a-zA-Z0-9]/.test(newPassword),
      label: "At least one special character",
    },
  ];

  return (
    <div className="max-w-screen-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-none text-foreground sm:text-xl">
              {String(dashboard?.change_password ?? "") || "Change Password"}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Update your account password for security
            </p>
          </div>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="space-y-5">
            {/* Email Field */}
            <div className="form-group">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                {String(dashboard?.user_email ?? "") || "Email Address"}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  name="email"
                  defaultValue={user?.email ?? ""}
                  readOnly
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-border bg-muted pl-11 pr-4 text-sm text-muted-foreground"
                />
              </div>
              {state.errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {state.errors.email}
                </p>
              )}
            </div>

            {/* Current Password */}
            <div className="form-group">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                {String(dashboard?.current_password ?? "") ||
                  "Current Password"}
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                </div>
                <input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  autoComplete="new-password"
                  placeholder="Enter current password"
                  className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground transition-colors hover:text-primary"
                >
                  {showCurrent ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {state.errors.currentPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {state.errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                {String(dashboard?.new_password ?? "") || "New Password"}
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <KeyRound className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                </div>
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  aria-label={showNew ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground transition-colors hover:text-primary"
                >
                  {showNew ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-3">
                  <div className="mb-1.5 flex gap-1">
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
                <ul className="mt-1.5 space-y-0.5 text-sm text-destructive">
                  {state.errors.newPassword.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Password Requirements */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium text-foreground">
                Password requirements
              </p>
              <ul className="grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                {requirements.map(({ met, label }) => (
                  <li
                    key={label}
                    className={`flex items-center gap-2 transition-colors ${
                      met ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {met ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                    )}
                    {label}
                  </li>
                ))}
              </ul>
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
              <ShieldCheck className="h-4 w-4" />
              {String(dashboard?.change_password ?? "") || "Update Password"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
