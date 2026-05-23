import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { notifyError } from "@utils/toast";
import Error from "@components/form/Error";
import InputArea from "@components/form/InputArea";
import BottomNavigation from "@components/login/BottomNavigation";
import ShowToast from "@components/common/ShowToast";
import OtpLogin from "@components/login/OtpLogin";
import { useSetting } from "@stores/useSettingStore";
import { useAuth } from "@stores/useAuthStore";
import { loginCustomer } from "@services/ServerActionServices";
import { getLogoUrl } from "@utils/imageUtils";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { globalSetting } = useSetting() || {};
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const redirectUrl = searchParams.get("redirectUrl") || "/user/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "justin@gmail.com",
      password: "12345678",
    },
  });

  const submitHandler = async ({ email, password }: LoginFormValues) => {
    setLoading(true);
    const result = await loginCustomer({ email, password });
    setLoading(false);

    if (result.error) {
      notifyError(result.error);
    } else if (result.userInfo) {
      login(result.userInfo);
      navigate(redirectUrl);
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
            alt="Workspace Background"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="mb-8">
              <Link to="/" className="inline-block">
                <img
                  src={getLogoUrl((globalSetting as { logo?: string })?.logo, "/logo/logo-color.svg")}
                  alt={(globalSetting as { shop_name?: string })?.shop_name || "Kacha Bazar"}
                  className="h-10 w-40 object-contain object-left"
                />
              </Link>
            </div>

            {/* Headers */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sign in to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Login Method Toggle */}
            <div className="flex mb-6 border-b border-border">
              <button
                type="button"
                onClick={() => setLoginMethod("password")}
                className={`flex-1 pb-2 text-sm font-semibold transition-all duration-200 border-b-2 ${
                  loginMethod === "password"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("otp")}
                className={`flex-1 pb-2 text-sm font-semibold transition-all duration-200 border-b-2 ${
                  loginMethod === "otp"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                OTP Login
              </button>
            </div>

            {loginMethod === "password" ? (
              <form
                onSubmit={handleSubmit(submitHandler)}
                className="space-y-6"
              >
                <div>
                  <InputArea
                    register={register}
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="justin@gmail.com"
                    Icon={FiMail}
                  />
                  <Error errorMessage={errors.email} />
                </div>

                <div>
                  <InputArea
                    register={register}
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    Icon={FiLock}
                  />
                  <Error errorMessage={errors.password} />
                </div>

                <div className="flex items-center justify-start mt-2">
                  <Link
                    to="/auth/forget-password"
                    className="text-sm font-semibold text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-3 px-4 font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-70 mt-4"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>
            ) : (
              <OtpLogin redirectUrl={redirectUrl} />
            )}

            <div className="mt-8">
              <BottomNavigation
                or={loginMethod === "password"}
                route="/auth/signup"
                pageName="Sign Up"
                loginTitle="Login"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
