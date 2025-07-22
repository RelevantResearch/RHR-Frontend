'use client';

import { useState, useEffect } from 'react';
import { useDepartmentsQuery, useRolesQuery } from '@/lib/queries';
import CustomSelect from "@/components/CustomSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, User, Briefcase, AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { userForm, userStatus } from "@/types/user";
import { addEmployeeSchema, editEmployeeSchema, AddEmployeeFormData, EditEmployeeFormData } from "@/lib/schemas/employee.schema";
import { z } from 'zod';

export interface EmployeeFormData extends userForm {
    salary: string;
    status: userStatus;
}

export const createEmptyEmployee = (): EmployeeFormData => ({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    joinDate: format(new Date(), 'yyyy-MM-dd'),
    employmentType: 'part-time',
    role: '',
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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const isFieldReadOnly = (fieldName: string) => readOnlyFields.includes(fieldName);
    const { data: departments = [], isLoading: deptLoading, error: deptError } = useDepartmentsQuery();
    const { data: roles = [], isLoading: roleLoading, error: roleError } = useRolesQuery();

    // Validate form data
    const validateForm = () => {
        try {
            if (isEditMode) {
                const editableData = {
                    department: employee.department,
                    position: employee.position,
                    role: employee.role,
                    employmentType: employee.employmentType,
                    status: employee.status,
                    salary: employee.salary,
                };
                editEmployeeSchema.parse(editableData);
            } else {
                addEmployeeSchema.parse(employee);
            }
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path.length > 0) {
                        newErrors[err.path.join('.')] = err.message;
                    }
                });
                setErrors(newErrors);
                return false;
            }
            return false;
        }
    };

    const validateField = (fieldName: string, value: any) => {
        try {
            if (isEditMode) {
                // For edit mode, only validate if it's an editable field
                const editableFields = ['department', 'position', 'role', 'employmentType', 'status', 'salary'];
                if (editableFields.includes(fieldName)) {
                    const fieldSchema = editEmployeeSchema.shape[fieldName as keyof EditEmployeeFormData];
                    if (fieldSchema) {
                        fieldSchema.parse(value);
                    }
                }
            } else {
                // For add mode, validate the specific field
                const fieldSchema = addEmployeeSchema.shape[fieldName as keyof AddEmployeeFormData];
                if (fieldSchema) {
                    fieldSchema.parse(value);
                }
            }

            // Clear error if validation passes
            if (errors[fieldName]) {
                const newErrors = { ...errors };
                delete newErrors[fieldName];
                setErrors(newErrors);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: error.errors[0]?.message || 'Invalid value'
                }));
            }
        }
    };

    const handleFieldChange = (field: string, value: any) => {
        if (isFieldReadOnly(field)) return;

        onEmployeeChange({ ...employee, [field]: value });

        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, value);
    };

    const handleSubmit = () => {
        const allFields = isEditMode
            ? ['department', 'position', 'role', 'employmentType', 'status', 'salary']
            : ['name', 'email', 'password', 'phone', 'department', 'position', 'salary', 'role', 'employmentType', 'status'];

        const newTouched: Record<string, boolean> = {};
        allFields.forEach(field => {
            newTouched[field] = true;
        });
        setTouched(newTouched);

        // Validate and submit if valid
        if (validateForm()) {
            onSubmit();
        }
    };

    const departmentOptions = departments.map((dept) => ({
        label: dept.name,
        value: dept.name,
    }));
    const roleOptions = roles.map((role) => ({
        label: role.name,
        value: role.name,
    }));

    // Error display component
    const ErrorMessage = ({ fieldName }: { fieldName: string }) => {
        if (!errors[fieldName] || !touched[fieldName]) return null;
        return (
            <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors[fieldName]}</span>
            </div>
        );
    };

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
                                className={`border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${errors.name && touched.name ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                disabled={isFieldReadOnly('name')}
                            />
                            <ErrorMessage fieldName="name" />
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
                                className={`border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${errors.email && touched.email ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                disabled={isFieldReadOnly('email')}
                            />
                            <ErrorMessage fieldName="email" />
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
                                    className={`border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${errors.password && touched.password ? 'border-red-500 focus:border-red-500' : ''
                                        }`}
                                />
                                <ErrorMessage fieldName="password" />
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
                                className={`border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${errors.phone && touched.phone ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                disabled={isFieldReadOnly('phone')}
                            />
                            <ErrorMessage fieldName="phone" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Full Address</label>
                            <Input
                                placeholder="Enter complete address"
                                value={employee.address}
                                onChange={(e) => handleFieldChange('address', e.target.value)}
                                className={`border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${errors.address && touched.address ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                disabled={isFieldReadOnly('address')}
                            />
                            <ErrorMessage fieldName="address" />
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
                            <label className="text-sm font-semibold text-gray-700">
                                Department <span className="text-orange-500">*</span>
                            </label>
                            <CustomSelect
                                options={departmentOptions}
                                value={employee.department}
                                onValueChange={(value) => handleFieldChange('department', value)}
                                placeholder="Select department"
                                className={errors.department && touched.department ? 'border-red-500' : ''}
                            />
                            <ErrorMessage fieldName="department" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Position <span className="text-orange-500">*</span>
                            </label>
                            <Input
                                placeholder="Enter position"
                                value={employee.position}
                                onChange={(e) => handleFieldChange('position', e.target.value)}
                                className={`border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${errors.position && touched.position ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                disabled={isFieldReadOnly('position')}
                            />
                            <ErrorMessage fieldName="position" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Salary <span className="text-orange-500">*</span>
                            </label>
                            <Input
                                placeholder="Enter Salary"
                                value={employee.salary}
                                onChange={(e) => handleFieldChange('salary', e.target.value)}
                                className={`border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${errors.salary && touched.salary ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                disabled={isFieldReadOnly('salary')}
                            />
                            <ErrorMessage fieldName="salary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Role <span className="text-orange-500">*</span>
                            </label>
                            <CustomSelect
                                options={roleOptions}
                                value={employee.role}
                                onValueChange={(value) => handleFieldChange('role', value)}
                                placeholder="Select role"
                                className={`border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${errors.role && touched.role ? 'border-red-500' : ''
                                    }`}
                            />
                            <ErrorMessage fieldName="role" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Employment Type <span className="text-orange-500">*</span>
                            </label>
                            <CustomSelect
                                options={[
                                    { label: 'Full Time', value: 'full-time' },
                                    { label: 'Part Time', value: 'part-time' },
                                ]}
                                value={employee.employmentType}
                                onValueChange={(value) => handleFieldChange('employmentType', value)}
                                placeholder="Select employment type"
                                className={`border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${errors.employmentType && touched.employmentType ? 'border-red-500' : ''
                                    }`}
                            />
                            <ErrorMessage fieldName="employmentType" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Status <span className="text-orange-500">*</span>
                            </label>
                            <CustomSelect
                                options={[
                                    { label: 'Active', value: 'active' },
                                    { label: 'Inactive', value: 'inactive' },
                                ]}
                                value={employee.status}
                                onValueChange={(value) => handleFieldChange('status', value)}
                                placeholder="Select status"
                                className={`border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${errors.status && touched.status ? 'border-red-500' : ''
                                    }`}
                            />
                            <ErrorMessage fieldName="status" />
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
                                <div>
                                    <span className="text-green-700 font-medium">Salary:</span>
                                    <span className="ml-2 text-green-800">{employee.salary}</span>
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
                    onClick={handleSubmit}
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