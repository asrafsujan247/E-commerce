import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiLock, FiCheck } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { notifyError, notifySuccess } from "@utils/toast";
import ShowToast from "@components/common/ShowToast";
import AuthButton from "@components/form/AuthButton";
import { Input } from "@components/ui/input";

const resetSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

const ForgetPasswordToken = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_BASE_URL ?? "";
      const res = await fetch(`${base}/customer/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: data.newPassword }),
      });
      const json = await res.json() as { message?: string };
      if (!res.ok) throw new Error(json.message ?? "Failed to reset password");
      notifySuccess(json.message ?? "Password reset successful!");
      setSuccess(true);
      setTimeout(() => { navigate("/auth/login"); }, 3000);
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-muted py-8 px-4 flex items-center justify-center">
      <ShowToast />
      <div className="mx-auto max-w-md w-full">
        {success ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-lg mb-6">
              <FiCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Password Reset!</h1>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-lg mb-6">
                <FiLock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
              <p className="text-muted-foreground">Enter your new password below</p>
            </div>
            <div className="bg-background rounded-2xl shadow-xl p-8 border border-border">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <Input type="password" {...register("newPassword")} placeholder="Enter new password" />
                  {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <Input type="password" {...register("confirmPassword")} placeholder="Confirm new password" />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
                <AuthButton type="submit" loading={loading} loadingText="Resetting...">
                  Reset Password
                </AuthButton>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPasswordToken;
