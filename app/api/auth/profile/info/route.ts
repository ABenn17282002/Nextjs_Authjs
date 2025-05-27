import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; 
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await auth();
        if (!session?.user?.email) return NextResponse.json({ error: "Uncertified" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { accounts: true },
        });
        
        const provider = user?.accounts[0]?.provider ?? "credentials";

        return NextResponse.json({
            name: user?.name || "",
            email: user?.email || "",
            isOAuth: provider !== "credentials",
            provider, 
        });
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Uncertified" }, { status: 401 });

    const { name } = await req.json();

    await prisma.user.update({
        where: { email: session.user.email },
        data: { name },
    });

    return NextResponse.json({ success: true });
}
