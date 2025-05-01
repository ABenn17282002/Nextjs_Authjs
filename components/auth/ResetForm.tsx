"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import  CardWrapper from "@/components/auth/CardWrapper"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { reset } from "@/lib/actions/reset";
import * as z from "zod";
import { resetSchema } from "@/lib/zod"; 

type ResetData = z.infer<typeof resetSchema>;

export function ResetForm() {
  const {
    register,
    handleSubmit,
    reset: resetForm, 
    formState: { errors },
  } = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
  });

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const onSubmit = async (data: ResetData) => {
    const result = await reset(data); 

    if (result?.error) {
      setMessage(result.error);
      setIsError(true);
    } else if (result?.success) {
      setMessage(result.success);
      setIsError(false);
      resetForm(); 
    }
  };

  return (
    <CardWrapper
      headerLabel="Forgot your Password？"
      backButtonLabel="Back to Login"
      backButtonHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          {...register("email")}
          onBlur={() => {
            const error = errors.email?.message;
            if (error) {
              setMessage(error);
              setIsError(true);
            }
          }}
        />
        

        <Button type="submit" className="w-full">
            Send password reset email
        </Button>

        {message && (
    <p
      className={`text-sm text-center ${
        isError ? "text-red-500" : "text-green-600"
      }`}
    >
      {message}
    </p>
  )}
      </form>
    </CardWrapper>
  );
}
