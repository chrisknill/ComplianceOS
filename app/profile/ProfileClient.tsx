"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, CompanyPayload } from "@/lib/validation/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Edit, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";

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
  services: string | string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileClientProps {
  company: Company;
}

export default function ProfileClient({ company }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState<string[]>(
    Array.isArray(company.services) ? company.services : JSON.parse(company.services || "[]")
  );
  const [newService, setNewService] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CompanyPayload>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name,
      sicCode: company.sicCode || "",
      address: company.address || "",
      postCode: company.postCode || "",
      telephone: company.telephone || "",
      email: company.email || "",
      adminPerson: company.adminPerson || "",
      employees: company.employees || undefined,
      website: company.website || "",
      services: Array.isArray(company.services) ? company.services : JSON.parse(company.services || "[]"),
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Company profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Failed to update company profile");
      }
    } catch (error) {
      console.error("Error updating company profile:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setServices(Array.isArray(company.services) ? company.services : JSON.parse(company.services || "[]"));
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-2">Manage your company information and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Company Information</CardTitle>
                  <CardDescription>
                    {isEditing ? "Edit your company details" : "View your company profile"}
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
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
                          Find SIC code
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

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Company Name */}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Name</label>
                      <p className="text-lg font-semibold text-gray-900">{company.name}</p>
                    </div>

                    {/* SIC Code */}
                    {company.sicCode && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">SIC Code</label>
                        <p className="text-gray-900">{company.sicCode}</p>
                      </div>
                    )}

                    {/* Address */}
                    {company.address && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-900 whitespace-pre-line">{company.address}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Post Code */}
                      {company.postCode && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Post Code</label>
                          <p className="text-gray-900">{company.postCode}</p>
                        </div>
                      )}

                      {/* Telephone */}
                      {company.telephone && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Telephone</label>
                          <p className="text-gray-900">{company.telephone}</p>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    {company.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{company.email}</p>
                      </div>
                    )}

                    {/* Admin Person */}
                    {company.adminPerson && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Admin Person</label>
                        <p className="text-gray-900">{company.adminPerson}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Employees */}
                      {company.employees && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Employees</label>
                          <p className="text-gray-900">{company.employees.toLocaleString()}</p>
                        </div>
                      )}

                      {/* Website */}
                      {company.website && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Website</label>
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {company.website}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Services */}
                    {services.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Services</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {services.map((service, index) => (
                            <Badge key={index} variant="secondary">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Company Meta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Company ID</label>
                  <p className="text-sm text-gray-900 font-mono">{company.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">{formatDate(company.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">{formatDate(company.updatedAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Help & Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="https://www.gov.uk/government/publications/standard-industrial-classification-of-economic-activities-sic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  Find your SIC code
                </a>
                <a
                  href="https://find-and-update.company-information.service.gov.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  Companies House
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
