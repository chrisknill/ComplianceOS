import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

interface Company {
  id: string;
  name: string;
  sicCode?: string | null;
  address?: string | null;
  postCode?: string | null;
  telephone?: string | null;
  email?: string | null;
  adminPerson?: string | null;
  employees?: number | null;
  website?: string | null;
  services: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { company: true }
  });

  if (!user?.company) {
    // redirect("/onboarding"); // DISABLED - Setup page disabled
    // For now, redirect to dashboard instead
    redirect("/dashboard");
  }

  const company: Company = {
    ...user.company,
    services: JSON.parse(user.company.services || "[]")
  };

  return <ProfileClient company={company} />;
}