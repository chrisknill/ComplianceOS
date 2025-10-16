import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has a company
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true }
    });

    if (existingUser?.company) {
      return NextResponse.json({ 
        success: false, 
        error: "Company profile already exists" 
      }, { status: 400 });
    }

    // Create a default company and mark setup as completed
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: "Default Company",
          services: JSON.stringify([])
        }
      });

      const user = await tx.user.update({
        where: { email: session.user.email },
        data: {
          companyId: company.id,
          hasCompletedSetup: true
        },
        include: { company: true }
      });

      return { company, user };
    });

    return NextResponse.json({ 
      success: true, 
      message: "Setup skipped successfully",
      data: result.company 
    });
  } catch (error) {
    console.error("Error skipping setup:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
