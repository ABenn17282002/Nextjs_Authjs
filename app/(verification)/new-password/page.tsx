import { NewPasswordForm } from "@/components/auth/FormNewPassword";
import { Suspense } from "react";

export default function NewPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">新しいパスワードを入力</h1>
        <Suspense fallback={<div>読み込み中...</div>}>
          <NewPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

