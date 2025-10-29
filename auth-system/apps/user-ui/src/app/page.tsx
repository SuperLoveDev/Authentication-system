"use client";
import Input from "@/shared/components/globalInput";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Page = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userData, setUserData] = useState<FormData | null>(null);
  const [showOtp, setShowOtp] = useState(true);
  const [canResend, setCanResend] = useState(true);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // OTP timer
  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(true);
      setTimer(60);
      startResendTimer();
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  // handle otp input text change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; //otp regex

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[320px] sm:w-[450px] mt-10">
        {/* form */}
        {!showOtp ? (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Input
                  type="text"
                  label="Name"
                  placeholder="John Monreo"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-red-500">{String(errors.name.message)}</p>
                )}
              </div>

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
                  <p className="text-red-500">
                    {String(errors.password.message)}
                  </p>
                )}

                <button
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  type="button"
                  className="absolute top-10 right-5"
                >
                  {passwordVisible ? <Eye /> : <EyeOff />}
                </button>
              </div>

              <button
                className="mt-10 text-gray-300 bg-purple-700 flex items-center justify-center w-full p-4 rounded-lg hover:bg-purple-900"
                type="submit"
              >
                Create my Account
              </button>
            </form>

            <div className="mt-4 flex justify-end items-center gap-2">
              <p className="text-gray-400 text-base sm:text-xl">
                Already have an account ?
              </p>
              <p className="text-purple-400 font-medium text-base">
                <Link href={"/login"}>Login here</Link>
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-xl text-gray-300">Enter your OTP code</h1>
            <div className="flex justify-center gap-5  border-1 border-purple-600">
              {otp?.map((digit, index) => (
                <input
                  className="w-12 h-12 text-center rounded-md border-2 border-slate-900 outline-none"
                  type="text"
                  value={digit}
                  key={index}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  maxLength={1}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                />
              ))}
            </div>

            <button
              className="text-xl w-full mt-2 bg-purple-700 hover:bg-purple-900 text-gray-300 text-center p-2 rounded-lg cursor-pointer"
              type="submit"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
