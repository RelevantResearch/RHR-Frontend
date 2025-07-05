'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRBACStore } from '@/lib/rbac-store';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';

const mockEmployees = [
    {
        id: '1',
        name: 'John Admin',
        email: 'john.admin@company.com',
        department: 'Management',
        position: 'HR Manager',
    },
    {
        id: '2',
        name: 'Jane Employee',
        email: 'jane.employee@company.com',
        department: 'Engineering',
        position: 'Software Engineer',
    },
    {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        department: 'Data Analysis',
        position: 'Data Analyst',
    },
    {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        department: 'Web Development',
        position: 'Frontend Developer',
    },
    {
        id: '5',
        name: 'David Brown',
        email: 'david.brown@company.com',
        department: 'Public Impact',
        position: 'Project Manager',
    },
    {
        id: '6',
        name: 'Lisa Garcia',
        email: 'lisa.garcia@company.com',
        department: 'Engineering',
        position: 'Backend Developer',
    },
];

export default function ViewRolePage() {
    const searchParams = useSearchParams();
    const roleId = searchParams?.get('id');

    const router = useRouter();
    const { roles, permissions } = useRBACStore();
    const [selectedRole, setSelectedRole] = useState<any | null>(null);

    useEffect(() => {
        if (roleId) {
            const role = roles.find(r => r.id === roleId);
            setSelectedRole(role || null);
        }
    }, [roleId, roles]);

    const getEmployeeById = (id: string) => mockEmployees.find(emp => emp.id === id);

    if (!selectedRole) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl text-gray-300 mb-4">🔍</div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Role not found</h2>
                    <p className="text-gray-600 mb-6">The role you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (

        <div className="container mx-auto">


            <div className="flex flex-col justify-between items-start md:flex-row md:items-center mb-6">

                <BreadcrumbNavigation dynamicData={{ roleName: selectedRole?.name }} />

                <Button
                    variant="outline"
                    onClick={() => router.push(`/rbac/edit-role?id=${selectedRole.id}`)}
                    className="flex items-center gap-2"
                >
                    <Edit className="w-4 h-4" />
                    Edit Role
                </Button>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Role Information</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <dt className="text-sm font-medium text-gray-500">Role Name</dt>
                            <dd className="text-base font-medium text-gray-900">{selectedRole.name}</dd>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="text-base font-medium text-gray-900">
                                {selectedRole.isActive ? "Active" : "Inactive"}
                            </dd>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                            <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                            <dd className="text-base font-medium text-gray-900">
                                {format(new Date(selectedRole.createdAt), 'PPP')}
                            </dd>
                        </div>
                    </div>
                </div>
                {/* Description */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Role Description</h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                            {selectedRole.description || "No description provided for this role."}
                        </p>
                    </div>
                </div>
            </div>
            {/* Assigned Employees */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">Assigned Employees</h3>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {(selectedRole.assignedEmployees || []).length} employee{(selectedRole.assignedEmployees || []).length !== 1 ? 's' : ''}
                    </Badge>
                </div>

                {(selectedRole.assignedEmployees || []).length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-4xl text-gray-300 mb-3">👤</div>
                        <p className="text-gray-500">No employees assigned to this role yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {(selectedRole.assignedEmployees || []).map((empId: string) => {
                            const employee = getEmployeeById(empId);
                            return employee ? (
                                <div key={empId} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                                    <div className="flex items-center gap-3">

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900">
                                                {employee.name}
                                            </h4>
                                            <p className="text-blue-600 font-medium">{employee.department}</p>
                                            <p className="text-xs text-gray-500 truncate">{employee.position}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>
                )}
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">Role Permissions</h3>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {selectedRole.permissions.length} permission{selectedRole.permissions.length !== 1 ? 's' : ''}
                    </Badge>
                </div>

                {selectedRole.permissions.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-4xl text-gray-300 mb-3">🔒</div>
                        <p className="text-gray-500">No permissions assigned to this role.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {selectedRole.permissions.map((permId: string) => {
                            const permission = permissions.find(p => p.id === permId);
                            return permission ? (
                                <div key={permId} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                                                {permission.name}
                                            </h4>
                                            <p className="text-xs text-gray-600">
                                                {permission.description || 'No description available'}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="ml-2 bg-white/80 text-purple-700 border-purple-300 text-xs font-medium"
                                        >
                                            {permission.action}
                                        </Badge>
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}