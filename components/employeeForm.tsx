'use client';


import { useDepartmentsQuery, useRolesQuery } from '@/lib/queries';
import CustomSelect from "@/components/CustomSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, User, Briefcase, CreditCard } from "lucide-react";
import { format } from 'date-fns';
import { userForm, userStatus } from "@/types/user";


export interface EmployeeFormData extends userForm {
    salary: string;
    status: userStatus;
}

export const createEmptyEmployee = (): EmployeeFormData => ({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Web Development',
    position: '',
    salary: '',
    joinDate: format(new Date(), 'yyyy-MM-dd'),
    employmentType: 'full-time',
    role: 'Employee',
    address: '',
    status: 'active',
    bankDetails: {
        accountHolder: '',
        accountNumber: '',
        bankName: '',
        panId: '',
        bankAddress: ''
    }
});

interface EmployeeFormProps {
    employee: EmployeeFormData;
    onEmployeeChange: (employee: EmployeeFormData) => void;
    onSubmit: () => void;
    onCancel: () => void;
    onReset?: () => void;
    isLoading: boolean;
    isEditMode?: boolean;
    readOnlyFields?: string[];
}

export function EmployeeForm({
    employee,
    onEmployeeChange,
    onSubmit,
    onCancel,
    onReset,
    isLoading,
    isEditMode = false,
    readOnlyFields = []
}: EmployeeFormProps) {
    const isFieldReadOnly = (fieldName: string) => readOnlyFields.includes(fieldName);
    const { data: departments = [], isLoading: deptLoading, error: deptError } = useDepartmentsQuery();
    const { data: roles = [], isLoading: roleLoading, error: roleError } = useRolesQuery();
    const handleFieldChange = (field: string, value: any) => {
        if (isFieldReadOnly(field)) return;
        onEmployeeChange({ ...employee, [field]: value });
    };

    const departmentOptions = departments.map((dept) => ({
        label: dept.name,
        value: dept.name,
    }));
    const roleOptions = roles.map((role) => ({
        label: role.name,
        value: role.name,
    }));

    return (
        <div className="space-y-6">

            <Card className="rounded-lg text-card-foreground shadow-lg border-0 bg-white/70 backdrop-blur-s">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                        <User className="h-5 w-5 text-orange-500" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                Full Name {!isEditMode && <span className="text-orange-500">*</span>}
                            </label>
                            <Input
                                placeholder="Enter employee name"
                                value={employee.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
                                disabled={isFieldReadOnly('name')}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                Email {!isEditMode && <span className="text-orange-500">*</span>}
                            </label>
                            <Input
                                type="email"
                                placeholder="Enter email address"
                                value={employee.email}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
                                disabled={isFieldReadOnly('email')}
                            />
                        </div>
                        {!isEditMode && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    Password <span className="text-orange-500">*</span>
                                </label>
                                <Input
                                    type="password"
                                    placeholder="Enter password"
                                    value={employee.password || ''}
                                    onChange={(e) => handleFieldChange('password', e.target.value)}
                                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                Phone {!isEditMode && <span className="text-orange-500">*</span>}
                            </label>
                            <Input
                                placeholder="Enter phone number"
                                value={employee.phone}
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
                                disabled={isFieldReadOnly('phone')}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Full Address</label>
                            <Input
                                placeholder="Enter complete address"
                                value={employee.address}
                                onChange={(e) => handleFieldChange('address', e.target.value)}
                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
                                disabled={isFieldReadOnly('address')}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-lg text-card-foreground shadow-lg border-0 bg-white/70 backdrop-blur-s">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                        <Briefcase className="h-5 w-5 text-orange-500" />
                        {isEditMode ? 'Employment Information (Editable)' : 'Employment Information'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Department</label>
                            <CustomSelect
                                options={departmentOptions}
                                value={employee.department}
                                onValueChange={(value) => handleFieldChange('department', value)}
                                placeholder="Select department"
                                className="..."
                            />

                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Position</label>
                            <Input
                                placeholder="Enter position"
                                value={employee.position}
                                onChange={(e) => handleFieldChange('position', e.target.value)}
                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
                                disabled={isFieldReadOnly('position')}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Salary</label>
                            <Input
                                placeholder="Enter Salary"
                                value={employee.salary}
                                onChange={(e) => handleFieldChange('salary', e.target.value)}
                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
                                disabled={isFieldReadOnly('salary')}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Role</label>
                            <CustomSelect
                                options={roleOptions}
                                value={employee.role}
                                onValueChange={(value) => handleFieldChange('role', value)}
                                placeholder="Select role"
                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Employment Type</label>
                            <CustomSelect
                                options={[
                                    { label: 'Full Time', value: 'full-time' },
                                    { label: 'Part Time', value: 'part-time' },
                                ]}
                                value={employee.employmentType}
                                onValueChange={(value) => handleFieldChange('employmentType', value)}
                                placeholder="Select employment type"
                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
                            />

                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Status</label>
                            <CustomSelect
                                options={[
                                    { label: 'Active', value: 'active' },
                                    { label: 'Inactive', value: 'inactive' },
                                ]}
                                value={employee.status}
                                onValueChange={(value) => handleFieldChange('status', value)}
                                placeholder="Select status"
                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isEditMode && (
                <Card>
                    <CardHeader>
                        <CardTitle>Current Values Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-900 mb-3">Updated Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-green-700 font-medium">Department:</span>
                                    <span className="ml-2 text-green-800">{employee.department}</span>
                                </div>
                                <div>
                                    <span className="text-green-700 font-medium">Position:</span>
                                    <span className="ml-2 text-green-800">{employee.position}</span>
                                </div>
                                <div>
                                    <span className="text-green-700 font-medium">Role:</span>
                                    <span className="ml-2 text-green-800 capitalize">{employee.role}</span>
                                </div>
                                <div>
                                    <span className="text-green-700 font-medium">Employment Type:</span>
                                    <span className="ml-2 text-green-800 capitalize">{employee.employmentType.replace('-', ' ')}</span>
                                </div>
                                <div>
                                    <span className="text-green-700 font-medium">Status:</span>
                                    <span className="ml-2 text-green-800 capitalize">{employee.status}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 pb-8">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className={isEditMode ? "" : "px-8 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel
                </Button>

                {isEditMode && onReset && (
                    <Button type="button" variant="outline" onClick={onReset}>
                        Reset Changes
                    </Button>
                )}

                <Button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className={isEditMode ? "" : "px-8 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {isEditMode ? 'Updating...' : 'Adding Employee...'}
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {isEditMode ? 'Update Employee' : 'Add Employee'}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}