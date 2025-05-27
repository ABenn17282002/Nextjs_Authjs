"use client";

import { useState } from "react";
import Link from "next/link";
import { signUpCredentials } from "@/lib/actions/auth";
import { RegisterButton } from "@/components/button";
import type { RegisterActionState } from "@/types/register";

// 初期状態
const initialState: RegisterActionState = {
  error: {},
  message: "",
  success: null,
};

export default function FormRegister() {
  const [state, setState] = useState<RegisterActionState>(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    ConfirmPassword: "",
  });

  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // エラー初期化
    setState(initialState);

    const password = name === "password" ? value : formValues.password;
    const confirm = name === "ConfirmPassword" ? value : formValues.ConfirmPassword;

    if (password !== confirm) {
      setConfirmPasswordError("Password does not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = await signUpCredentials(formData);
    setState(result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {state.success && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100" role="status">
          <span className="font-medium">{state.success}</span>
        </div>
      )}

      {!state.success && state.message && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
        <input
          type="text"
          name="name"
          placeholder="john.doe"
          value={formValues.name}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
        />
        {state.error.name && (
          <span className="text-sm text-red-500 mt-2">{state.error.name[0]}</span>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
        <input
          type="email"
          name="email"
          placeholder="john.doe@gmail.com"
          value={formValues.email}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
        />
        {state.error.email && (
          <span className="text-sm text-red-500 mt-2">{state.error.email[0]}</span>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="*********"
            value={formValues.password}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 pr-10"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {state.error.password && (
          <span className="text-sm text-red-500 mt-2">{state.error.password[0]}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="ConfirmPassword" className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="ConfirmPassword"
            placeholder="*********"
            value={formValues.ConfirmPassword}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 pr-10"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        <span className="text-sm text-red-500 mt-2">
          {confirmPasswordError || state.error.ConfirmPassword?.[0]}
        </span>
      </div>

      <RegisterButton />

      <p className="text-sm font-light text-gray-500">
        Already have an account?{" "}
        <Link href="/login">
          <span className="font-medium pl-1 text-blue-600 hover:text-blue-700">Sign In</span>
        </Link>
      </p>
    </form>
  );
}
