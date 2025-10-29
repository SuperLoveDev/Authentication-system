"use client";
import Input from "@/shared/components/globalInput";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

// type FormData = {
//   name: string;
//   email: string;
//   password: string;
// };

const Page = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // login mutation function
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`,
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setErrorMessage(null);
      router.push("/content");
    },
    onError: (error) => {
      console.error("Login failed:", error);

      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        setErrorMessage(serverMessage || "Login failed. Please try again.");
      }
    },
  });

  const onSubmit = (data: any) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[320px] sm:w-[450px] mt-10">
        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <Input
              type="text"
              label="Email"
              placeholder="auth@gmail.com"
              {...register("email", {
                required: "email is required",
                pattern: {
                  value: emailRegex,
                  message: "Email format invalid",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500">{String(errors.email.message)}</p>
            )}
          </div>

          <div className="mt-4 relative">
            <Input
              type={passwordVisible ? "text" : "password"}
              label="Password"
              placeholder="*******"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500">{String(errors.password.message)}</p>
            )}

            <button
              onClick={() => setPasswordVisible(!passwordVisible)}
              type="button"
              className="absolute top-10 right-5"
            >
              {passwordVisible ? <Eye /> : <EyeOff />}
            </button>

            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 italic">{errorMessage}</p>
            )}
          </div>

          <div className="mt-4 flex justify-end items-center gap-2">
            <p className="text-purple-400 font-medium text-base">
              <Link href={"/forgot-password"}>Forgot-Password</Link>
            </p>
          </div>

          <button
            disabled={loginMutation.isPending}
            className="mt-10 text-gray-300 bg-purple-700 flex items-center justify-center w-full p-4 rounded-lg hover:bg-purple-900"
            type="submit"
          >
            {loginMutation?.isPending ? "Login in ..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
