"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, CompanyPayload } from "@/lib/validation/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CompanyPayload>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      services: [],
    },
  });

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      const updatedServices = [...services, newService.trim()];
      setServices(updatedServices);
      setValue("services", updatedServices);
      setNewService("");
    }
  };

  const removeService = (serviceToRemove: string) => {
    const updatedServices = services.filter(service => service !== serviceToRemove);
    setServices(updatedServices);
    setValue("services", updatedServices);
  };

  const onSubmit = async (data: CompanyPayload) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/company-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Company profile created successfully!");
        router.push("/profile");
      } else {
        toast.error(result.error || "Failed to create company profile");
      }
    } catch (error) {
      console.error("Error creating company profile:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipSetup = async () => {
    setIsSkipping(true);
    try {
      console.log("Skip setup clicked");
      
      // Call the skip setup API
      const response = await fetch("/api/skip-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("Response status:", response.status);
      
      if (response.ok) {
        toast.success("Setup skipped - you can complete this later");
        // Small delay to ensure session is updated
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        console.log("API failed, but continuing to dashboard");
        router.push("/dashboard");
      }
      
    } catch (error) {
      console.error("Error in skip setup:", error);
      // If there's any error, just redirect to dashboard
      router.push("/dashboard");
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl relative">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipSetup}
            disabled={isSkipping || isLoading}
            className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-gray-100 disabled:opacity-50"
            title="Skip setup and go to dashboard"
          >
            {isSkipping ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Set up your company profile
          </CardTitle>
          <CardDescription className="text-gray-600">
            Please provide your company information to get started with ComplianceOS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* SIC Code */}
            <div className="space-y-2">
              <label htmlFor="sicCode" className="text-sm font-medium text-gray-700">
                SIC Code
              </label>
              <div className="flex gap-2">
                <Input
                  id="sicCode"
                  {...register("sicCode")}
                  placeholder="e.g., 62010"
                  className="flex-1"
                />
                <a
                  href="https://www.gov.uk/government/publications/standard-industrial-classification-of-economic-activities-sic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
                >
                  Find your SIC code
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {errors.sicCode && (
                <p className="text-sm text-red-600">{errors.sicCode.message}</p>
              )}
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter your company name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address
              </label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Enter your company address"
                rows={3}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Post Code */}
              <div className="space-y-2">
                <label htmlFor="postCode" className="text-sm font-medium text-gray-700">
                  Post Code
                </label>
                <Input
                  id="postCode"
                  {...register("postCode")}
                  placeholder="e.g., SW1A 1AA"
                />
                {errors.postCode && (
                  <p className="text-sm text-red-600">{errors.postCode.message}</p>
                )}
              </div>

              {/* Telephone */}
              <div className="space-y-2">
                <label htmlFor="telephone" className="text-sm font-medium text-gray-700">
                  Telephone
                </label>
                <Input
                  id="telephone"
                  {...register("telephone")}
                  placeholder="e.g., +44 20 7123 4567"
                />
                {errors.telephone && (
                  <p className="text-sm text-red-600">{errors.telephone.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Company Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="company@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Admin Person */}
            <div className="space-y-2">
              <label htmlFor="adminPerson" className="text-sm font-medium text-gray-700">
                Admin Person
              </label>
              <Input
                id="adminPerson"
                {...register("adminPerson")}
                placeholder="e.g., Jane Smith, Ops Manager"
              />
              {errors.adminPerson && (
                <p className="text-sm text-red-600">{errors.adminPerson.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employees */}
              <div className="space-y-2">
                <label htmlFor="employees" className="text-sm font-medium text-gray-700">
                  Number of Employees
                </label>
                <Input
                  id="employees"
                  type="number"
                  min="0"
                  {...register("employees")}
                  placeholder="e.g., 50"
                />
                {errors.employees && (
                  <p className="text-sm text-red-600">{errors.employees.message}</p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium text-gray-700">
                  Company Website
                </label>
                <Input
                  id="website"
                  {...register("website")}
                  placeholder="https://www.company.com"
                />
                {errors.website && (
                  <p className="text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <label htmlFor="services" className="text-sm font-medium text-gray-700">
                Services
              </label>
              <div className="flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="e.g., Software Development"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addService();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addService}
                  disabled={!newService.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {services.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {services.map((service, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {service}
                      <button
                        type="button"
                        onClick={() => removeService(service)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleSkipSetup}
                disabled={isLoading || isSkipping}
              >
                {isSkipping ? "Skipping..." : "Skip Setup"}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || isSkipping}
              >
                {isLoading ? "Creating Profile..." : "Save & Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
