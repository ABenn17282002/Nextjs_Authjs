"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";

import { ResetPasswordSchema } from "@/lib/zod";
import { reset } from "@/lib/actions/new-password";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CardWrapper from "@/components/auth/CardWrapper";
import { Eye, EyeOff } from "lucide-react";

type ResetData = z.infer<typeof ResetPasswordSchema>;

export function NewPasswordForm() {
  const {
    register,
    handleSubmit,
    reset: resetForm,
  } = useForm<ResetData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: ResetData) => {
    setMessage(null); // メッセージ初期化

    const result = await reset({ ...data, token });

    if (result?.error) {
      setMessage(result.error);
      setIsError(true);
    } else if (result?.success) {
      setMessage(result.success);
      setIsError(false);
      resetForm();
      // 任意: 数秒後にログインページへリダイレクト
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }
  };

  return (
    <CardWrapper
      headerLabel="新しいパスワードを入力"
      backButtonLabel="ログイン画面に戻る"
      backButtonHref="/login"
    >
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="新しいパスワード"
          {...register("password")}
          className="pr-10" // アイコン分の余白
        />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      </div>

      <Button type="submit" className="w-full">
      パスワードを更新
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
