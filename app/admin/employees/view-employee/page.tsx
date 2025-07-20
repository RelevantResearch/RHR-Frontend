'use client';

import { useEmployeeByIdQuery } from '@/lib/queries';
import { useEmployeeById } from '@/hooks/useEmployees';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building2,
  Calendar,
  MapPin,
  Download,
  User,
  CreditCard,
  FileText,
  Briefcase,
  Clock,
  Wallet,
  Shield
} from "lucide-react";
import { format } from 'date-fns';
import { BreadcrumbNavigation } from "@/components/ui/breadcrumbs-navigation";
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import Link from 'next/link';
import { Employee } from '@/types/user';


interface Props {
  employee: Employee;
}

export default function ViewEmployeePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const employeeId = searchParams?.get('id') ?? "";
  const { data: employee, isLoading, isError } = useEmployeeByIdQuery(employeeId);

  const fetchUser = useMemo(() => {
    if (!employee) return null;
    return {
      ...employee,
      status: employee.isDeleted ? 'inactive' : 'active',
      employmentType: employee.fullTimer ? 'full-time' : 'part-time',
      roleName: employee.UserRole?.[0]?.role?.name ?? 'No Role',
    };
  }, [employee]);




  const handleDownloadDocument = (documentType: string, documentUrl: string) => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = `${employee?.name}_${documentType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${documentType} downloaded successfully`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Employee Not Found</h2>
        <Button onClick={() => router.push('/admin/employees')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="space-y-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <BreadcrumbNavigation dynamicData={{ employeeName: employee.name }} />
          {user?.role?.name === 'Admin' && (
            <Link href={`/admin/employees/edit-employee?id=${employee.id}`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Employee
              </Button>
            </Link>
          )}
        </div>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
            <div className="absolute -bottom-16 left-6">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={employee.avatar ?? "https://t4.ftcdn.net/jpg/06/59/57/65/360_F_659576586_9CSUewJar5TZDkEMJu3qHVaPJmywlDn1.jpg"}  alt={employee.name} />
                <AvatarFallback className="text-2xl font-semibold">
                  {employee.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <CardContent className="pt-20 pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                <p className="text-sm text-gray-600">{fetchUser?.roleName}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Badge
                  variant={employee.status === 'active' ? 'default' : 'secondary'}
                  className="mb-2 sm:mb-0"
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${employee.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  {fetchUser?.status
                    ? fetchUser.status.charAt(0).toUpperCase() + fetchUser.status.slice(1)
                    : 'N/A'}

                </Badge>

                <Badge variant="outline" className="capitalize">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {fetchUser?.employmentType?.replace('-', ' ') ?? 'N/A'}
                </Badge>

              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-300/50 hover:shadow-md hover:bg-gray-100 transition-shadow gap-3">
                  <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600 break-all">{employee.email}</p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-300/50 hover:shadow-md hover:bg-gray-100 transition-shadow gap-3">
                  <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{employee.phone}</p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-300/50 hover:shadow-md hover:bg-gray-100 transition-shadow gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-600 break-words">{employee.address}</p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-300/50 hover:shadow-md hover:bg-gray-100 transition-shadow gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Date of Birth</p>
                    <p className="text-sm text-gray-600 break-words">{employee.DOB.split('T')[0]}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Employment Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow gap-3 p-3">
                  <Building2 className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Department</p>
                    <p className="text-sm text-gray-600">{employee.department?.name ?? "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow gap-3 p-3">
                  <Briefcase className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Position</p>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                  </div>
                </div>

                <div className="flex items-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow gap-3 p-3">
                  <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Join Date</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(employee.DOB), 'PPP')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow gap-3 p-3">
                  <Wallet className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Salary</p>
                    <p className="text-sm text-gray-600 capitalize">
                      ${employee.salary}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Bank Details</CardTitle>
              </div>

            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Separator />
                <div className="flex flex-col gap-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm font-medium text-gray-500">Bank Name</p>
                    <p className="text-sm font-semibold">{fetchUser?.bankInfo?.name}</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-sm font-medium text-gray-500">Account Holder</p>
                    <p className="text-sm font-semibold">{fetchUser?.bankInfo?.acName}</p>
                  </div>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm font-medium text-gray-500">Account Number</p>
                  <p className="text-sm font-semibold">{fetchUser?.bankInfo?.acNumber}</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm font-medium text-gray-500">PAN ID</p>
                  <p className="text-sm font-semibold">{fetchUser?.bankInfo?.tax}</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm font-medium text-gray-500">Bank Address</p>
                  <p className="text-sm font-semibold break-words">{fetchUser?.bankInfo?.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">Documents</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">
                    ID Document ({employee.documents?.idType ?? 'Passport'})
                  </h4>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadDocument('ID_Document', employee.documents.idDocument)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="aspect-video rounded-lg border-2 border-dashed border-gray-200 overflow-hidden hover:border-blue-300 transition-colors">
                  <img
                    src={employee.documents?.idDocument ?? "https://i.ebayimg.com/00/s/NzIwWDE2MDA=/z/MgkAAOSwZY1lttWm/$_12.JPG?set_id=880000500F"}
                    alt="ID Document"
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      if (employee.documents?.idDocument) {
                        window.open(employee.documents.idDocument, '_blank');
                      }
                    }}
                  />
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}