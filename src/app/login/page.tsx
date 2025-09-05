"use client";

import { signIn, signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";

import toast, { Toaster } from 'react-hot-toast';
import { ca } from "zod/v4/locales";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "emailLogin">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();

  const { data: session, isPending } = useSession();

  
  useEffect(() => {
    if (isPending) return;
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending || session) {
    return (
      <div role="" className="flex items-center justify-center h-screen">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  }

  const handleSignup = async () => {
    if (!email || !password || !firstName || !lastName) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSigningUp(true);
    try {
      await toast.promise(
        signUp.email({
          email,
          password,
          name: `${firstName} ${lastName}`,
        }),
        {
          loading: "Creating account...",
          success: () => "Account created successfully!",
          error: (err) => err.message || "Failed to create account",
        }
      );
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    // signUp.email(
    //   { email, password, name: `${firstName} ${lastName}` },
    //   {
    //     onError: (ctx) => {
    //       toast.error(ctx.error.message);
    //       setIsSigningUp(false);
    //     },
    //     onSuccess: () => {
    //       toast.success("Account created successfully!");
    //       router.push("/dashboard");
    //     },
    //   }
    // );
  };

  const handleSignin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSigningIn(true);

    try {
      await toast.promise(
        signIn.email({ email, password }, {}),
        {
          loading: "Logging in...",
          success: () => "Logged in successfully!",
          error: (err) => err.message || "Login failed",
        }
      );
      router.push("/dashboard");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <Dialog open>
      <DialogContent className="max-w-md">
        {(mode === "signup" || mode === "emailLogin") && (
          <button
            onClick={() => setMode("login")}
            className="absolute left-4 top-4 flex items-center text-sm text-gray-500 hover:underline-offset-4 hover:underline delay-100 transition-all cursor-pointer"
          >
            <IoChevronBack className="mr-1" /> Back
          </button>
        )}

        <DialogHeader>
          <DialogTitle className="mx-auto font-bold text-2xl">
            {mode === "login"
              ? "Continue with an account"
              : mode === "signup"
              ? "Register with email"
              : "Login with Email"}
          </DialogTitle>
          <DialogDescription className="mx-auto text-lg">
            {mode === "login"
              ? "You must log in or register to continue."
              : mode === "signup"
              ? "Register using your email address."
              : "Login using your email address."}
          </DialogDescription>
        </DialogHeader>

        {mode === "login" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleGoogle}
              disabled={isGoogleLoading}
              className="p-2 border rounded-full hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              <FcGoogle className="inline mr-2" />
              {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
            </button>
            <button
              onClick={() => setMode("emailLogin")}
              className="p-2 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer"
            >
              <MdEmail className="inline mr-2" />
              Login with Email
            </button>

            <hr />

            <button
              onClick={() => setMode("signup")}
              className="text-sm font-semibold text-gray-500 mt-4 hover:underline-offset-4  hover:text-gray-800 hover:underline delay-100 transition-all cursor-pointer"
            >
              New User? Create New Account
            </button>

            <button className="text-xs text-gray-500 mt-4">
              By continuing, you agree to our{" "}
              <span className="underline cursor-pointer">Privacy Policy</span> and{" "}
              <span className="text-gray-500 underline cursor-pointer">T&Cs</span>
            </button>
          </div>
        )}

        {mode === "emailLogin" && (
          <div className="flex flex-col gap-4">
            <div className="grid items-center w-full gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid items-center gap-3 w-full">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-xl text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>
            <button
              onClick={handleSignin}
              disabled={isSigningIn}
              className="p-2 bg-blue-500 cursor-pointer text-white rounded-full flex items-center justify-center disabled:opacity-50"
            >
              {isSigningIn ? "Logging in..." : "Login"}
            </button>
          </div>
        )}

        {mode === "signup" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-2">
              <div className="grid items-center w-full gap-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid items-center gap-3 w-full">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid items-center gap-3 w-full">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid items-center gap-3 w-full">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-xl text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>
            <button
              onClick={handleSignup}
              disabled={isSigningUp}
              className="p-2 bg-blue-500 text-white rounded-full flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              {isSigningUp ? "Creating..." : "Create my account"}
            </button>

            <hr />

            <button
              onClick={() => setMode("login")}
              className="text-sm text-gray-500"
            >
              Already have an account?{" "}
              <span className=" font-bold hover:underline-offset-4  hover:text-gray-800 hover:underline delay-100 transition-all cursor-pointer">
                Login
              </span>
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
