import React from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { ImFacebook, ImGithub } from "react-icons/im";

interface BottomNavigationProps {
  or?: boolean;
  route: string;
  desc?: boolean;
  pageName?: string;
  loginTitle?: string;
  hideSignupText?: boolean;
  onGoogleSignIn?: () => void;
  onFacebookSignIn?: () => void;
  onGithubSignIn?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  or,
  route,
  desc,
  pageName,
  loginTitle,
  onGoogleSignIn,
  onFacebookSignIn,
  onGithubSignIn,
}) => {
  return (
    <>
      {or && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="flex items-center justify-center gap-3 w-full h-10 px-4 text-sm font-semibold text-muted-foreground bg-background border-2 border-border rounded-lg hover:bg-muted hover:border-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <FcGoogle className="text-xl" />
              <span>{loginTitle || "Sign Up"} With Google</span>
            </button>

            <button
              type="button"
              onClick={onFacebookSignIn}
              className="flex items-center justify-center gap-3 w-full h-10 px-4 text-sm font-semibold text-white bg-[#1877F2] rounded-lg hover:bg-[#166FE5] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <ImFacebook className="text-xl" />
              <span>{loginTitle || "Sign Up"} With Facebook</span>
            </button>
          </div>
        </>
      )}

      <div className="text-center mt-8 pb-2">
        <p className="text-muted-foreground text-sm">
          {desc ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            to={route}
            className="text-primary hover:text-primary font-semibold hover:underline"
          >
            {pageName}
          </Link>
        </p>
      </div>
    </>
  );
};

export default BottomNavigation;
