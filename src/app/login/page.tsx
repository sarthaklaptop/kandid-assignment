"use client";

import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "emailLogin">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    await signUp.email(
      { email, password, name: `${firstName} ${lastName}` },
      {
        onError: (ctx) => alert(ctx.error.message),
        onSuccess: () => router.push("/dashboard"),
      }
    );
  };

  const handleSignin = async () => {
    await signIn.email(
      { email, password },
      {
        onError: (ctx) => alert(ctx.error.message),
        onSuccess: () => router.push("/dashboard"),
      }
    );
  };

  const handleGoogle = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <Dialog open>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "login"
              ? "Continue with an account"
              : mode === "signup"
              ? "Register with email"
              : "Login with Email"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "You must log in or register to continue"
              : mode === "signup"
              ? "Fill in the details below to create a new account"
              : "Enter your email and password to log in"}
          </DialogDescription>
        </DialogHeader>

        {/* LOGIN MAIN SCREEN */}
        {mode === "login" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleGoogle}
              className="p-2 border rounded hover:bg-gray-100"
            >
              Continue with Google
            </button>
            <button
              onClick={() => setMode("emailLogin")}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Login with Email
            </button>
            <button
              onClick={() => setMode("signup")}
              className="text-sm text-blue-600 underline"
            >
              New User? Create New Account
            </button>
          </div>
        )}

        {/* EMAIL LOGIN */}
        {mode === "emailLogin" && (
          <div className="flex flex-col gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleSignin}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Login
            </button>
            <button
              onClick={() => setMode("login")}
              className="text-sm text-blue-600 underline"
            >
              ← Back
            </button>
          </div>
        )}

        {/* SIGNUP */}
        {mode === "signup" && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                className="border p-2 rounded w-1/2"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="border p-2 rounded w-1/2"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <input
              className="border p-2 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleSignup}
              className="p-2 bg-green-500 text-white rounded"
            >
              Create my account
            </button>
            <button
              onClick={() => setMode("login")}
              className="text-sm text-blue-600 underline"
            >
              Already have an account? Login
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
