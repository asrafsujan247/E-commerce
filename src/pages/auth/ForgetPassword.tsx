import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { notifyError, notifySuccess } from "@utils/toast";
import ShowToast from "@components/common/ShowToast";
import FormError from "@components/form/Error";
import AuthButton from "@components/form/AuthButton";
import { Input } from "@components/ui/input";
import { useSetting } from "@stores/useSettingStore";
import { getLogoUrl } from "@utils/imageUtils";

const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;

const ForgetPassword = () => {
  const { globalSetting } = useSetting() || {};
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData: ForgetPasswordFormValues) => {
    setLoading(true);
    setSubmittedEmail(formData.email);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/customer/forget-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        },
      );

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      notifySuccess(
        data.message || "Password reset email sent! Please check your inbox.",
      );
      setSent(true);
    } catch (error) {
      notifyError(
        error instanceof Error ? error.message : "Failed to send reset email",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ShowToast />
      <div className="min-h-screen flex flex-col lg:flex-row bg-background">
        {/* Left Side: Background Image Area (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-muted">
          <img
            src="https://images.unsplash.com/photo-1632406897798-e5472b4a989e?q=80"
            alt="Forgot Password Background"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-y-auto">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <Link to="/" className="inline-block">
                <img
                  src={getLogoUrl((globalSetting as { logo?: string })?.logo, "/logo/logo-color.svg")}
                  alt={(globalSetting as { shop_name?: string })?.shop_name || "Kacha Bazar"}
                  className="h-10 w-40 object-contain object-left"
                />
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Forgot password?
              </h1>
              <p className="text-sm text-muted-foreground">
                {sent
                  ? "Check your email for reset instructions"
                  : "No worries, we'll send you reset instructions"}
              </p>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiMail className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Check your email
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  We've sent a password reset link to
                </p>
                <p className="font-semibold text-foreground mb-6">
                  {submittedEmail}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    try again
                  </button>
                </p>

                <Link
                  to="/auth/login"
                  className="inline-block w-full py-3 px-4 font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-foreground font-medium text-sm mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="Enter your registered email"
                      className={`pl-11 w-full h-12 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                        errors.email ? "border-destructive" : "border-border"
                      }`}
                    />
                  </div>
                  <FormError errorMessage={errors.email} />
                </div>

                <AuthButton
                  type="submit"
                  loading={loading}
                  loadingText="Sending..."
                  className="w-full h-12 text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none transition-colors disabled:opacity-70 mt-4 block"
                >
                  Send Reset Link
                </AuthButton>

                <div className="mt-8 text-center">
                  <Link
                    to="/auth/login"
                    className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    &larr; Back to login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
