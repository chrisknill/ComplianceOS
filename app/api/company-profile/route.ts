import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { companySchema } from "@/lib/validation/company";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: user.company 
    });
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = companySchema.parse(body);

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

    // Create company and update user
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          ...validatedData,
          services: JSON.stringify(validatedData.services || [])
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
      data: result.company 
    });
  } catch (error) {
    console.error("Error creating company profile:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ 
        success: false, 
        error: "Validation error",
        details: error.message
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = companySchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true }
    });

    if (!user?.company) {
      return NextResponse.json({ 
        success: false, 
        error: "Company profile not found" 
      }, { status: 404 });
    }

    // Update company
    const company = await prisma.company.update({
      where: { id: user.company.id },
      data: {
        ...validatedData,
        services: JSON.stringify(validatedData.services || [])
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: company 
    });
  } catch (error) {
    console.error("Error updating company profile:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ 
        success: false, 
        error: "Validation error",
        details: error.message
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
