"use client";
import Input from "@/shared/components/globalInput";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

const Page = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [errorMessage, setErrorMessage] = useState(null);
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

  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-forgot-password`,
        { email }
      );
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setErrorMessage(null);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        setErrorMessage(serverMessage || "Failed to send OTP");
      }
    },
  });

  // OTP verification mutation
  const otpVerificationMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user-forgot-password`,
        {
          email: userEmail,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("reset");
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error("Otp Error:", error);
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        setErrorMessage(serverMessage || "OTP verification failed");
      }
    },
  });

  // reset mutation function
  const resetMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-user-password`,
        { email: userEmail, newPassword: password }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("email");
      toast.success("Password reset successfully");
      setErrorMessage(null);
      router.push("/login");
    },
    onError: (error) => {
      console.log("password reset:", error);
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        setErrorMessage(serverMessage || "Password reset failed");
      }
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

  // function to collect the email data
  const onSubmitEmail = ({ email }: { email: string }) => {
    requestOtpMutation.mutate({ email });
  };

  // function to reset the password
  const onSubmitPassword = ({ password }: { password: string }) => {
    resetMutation.mutate({ password });
  };

  // resend otp function
  const resendOtp = () => {
    setCanResend(false);
    setTimer(60);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[320px] sm:w-[450px] mt-10">
        {/* form */}
        {step === "email" && (
          <>
            <form onSubmit={handleSubmit(onSubmitEmail)}>
              <h2 className="text-gray-300 text-3xl text-center mb-5">
                Home . Forgot password
              </h2>
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

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </div>

              <button
                className="mt-10 text-gray-300 bg-purple-700 flex items-center justify-center w-full p-4 rounded-lg hover:bg-purple-900"
                type="submit"
                disabled={requestOtpMutation.isPending}
              >
                {requestOtpMutation.isPending ? "Sending OTP" : "Submit"}
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
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
              disabled={otpVerificationMutation.isPending}
              onClick={() => otpVerificationMutation.mutate()}
              className="text-xl w-full mt-2 bg-purple-700 hover:bg-purple-900 text-gray-300 text-center p-2 rounded-lg cursor-pointer"
            >
              {otpVerificationMutation.isPending
                ? "Verifying..."
                : "Verify OTP"}
            </button>

            {canResend ? (
              <p
                className="text-white font-bold cursor-pointer"
                onClick={resendOtp}
              >
                Resend OTP
              </p>
            ) : (
              `Resend OTP in ${timer}s`
            )}
          </div>
        )}

        {step === "reset" && (
          <>
            <form onSubmit={handleSubmit(onSubmitPassword)}>
              <h2 className="text-gray-300 text-3xl text-center mb-5">
                Home . Reset password
              </h2>
              <div className="mt-4">
                <Input
                  type="text"
                  label="Reset password"
                  placeholder="******"
                  {...register("password", {
                    required: "your new password is required",
                    minLength: {
                      value: 6,
                      message: "Your new password must be atleast 6 charaxter",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500">
                    {String(errors.password.message)}
                  </p>
                )}
              </div>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              <button
                className="mt-10 text-gray-300 bg-purple-700 flex items-center justify-center w-full p-4 rounded-lg hover:bg-purple-900"
                type="submit"
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? "resetting password" : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
