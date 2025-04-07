"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CardWrapper from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import FormSuccess from "./FormSuccess";
import FormError from "./FormError";

export default function NewVerificationForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const token = searchParams.get("token");

  useEffect(() => {
    console.log("token from URL:", token); 
    const verify = async () => {
      if (!token) {
        setError("Missing token");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/verification/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        console.log("verify-token API received body:", data); 
        if (res.ok && data.success) {
          setSuccess(data.success);
        } else {
          setError(data.error || "Verification failed");
        }
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/login"
      backButtonLabel="Back to login"
    >
      <div className="flex justify-center items-center w-full">
        {loading && <BeatLoader color="#007bff" />}
        {!loading && success && <FormSuccess message={success} />}
        {!loading && error && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
}