export const dynamic = "force-dynamic";
import NewVerificationForm from '@/components/auth/NewVerificationForm'
import React from 'react'

export default function NewVerificationPage() {
    return (
        <main className="flex h-screen w-full items-center justify-center 
        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
        from-sky-400 to-blue-800">
            <NewVerificationForm />
        </main>
    )
}