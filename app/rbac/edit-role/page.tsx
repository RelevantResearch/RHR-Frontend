'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, Search, ChevronDown, X, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useRBACStore, Role } from "@/lib/rbac-store";
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ConfirmDialog } from '@/components/confirm-dialog';

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

export default function EditRolePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleId = searchParams?.get('id');

    const { permissions, roles, updateRole, getRoleById } = useRBACStore();

    const [roleForm, setRoleForm] = useState({
        name: "",
        description: "",
        permissions: [] as string[],
        assignedEmployees: [] as string[],
        isActive: true,
    });

    const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
    const [showDepartments, setShowDepartments] = useState(false);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<Role | null>(null);

    const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));

    const filteredEmployees = mockEmployees.filter(employee => {
        const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment;
        const matchesSearch = employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase());
        return matchesDepartment && matchesSearch;
    });

    const selectedEmployees = mockEmployees.filter(emp =>
        roleForm.assignedEmployees.includes(emp.id)
    );

    useEffect(() => {
        if (roleId) {
            const foundRole = getRoleById(roleId);
            if (foundRole) {
                setRole(foundRole);
                setRoleForm({
                    name: foundRole.name,
                    description: foundRole.description,
                    permissions: foundRole.permissions,
                    assignedEmployees: (foundRole as any).assignedEmployees || [],
                    isActive: foundRole.isActive,
                });
            } else {
                toast.error("Role not found");
                router.push('/rbac');
            }
        } else {
            toast.error("Role ID is required");
            router.push('/rbac');
        }
        setLoading(false);
    }, [roleId, getRoleById, router]);

    const groupedPermissions = permissions.reduce((acc, permission) => {
        if (!acc[permission.resource]) {
            acc[permission.resource] = [];
        }
        acc[permission.resource].push(permission);
        return acc;
    }, {} as Record<string, typeof permissions>);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!roleForm.name || !roleForm.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!roleId) return;

        updateRole(roleId, roleForm);
        toast.success("Role updated successfully");
        router.push('/rbac');
    };

    const handleEmployeeSelection = (employeeId: string, checked: boolean) => {
        if (checked) {
            setRoleForm(prev => ({
                ...prev,
                assignedEmployees: [...prev.assignedEmployees, employeeId]
            }));
        } else {
            setRoleForm(prev => ({
                ...prev,
                assignedEmployees: prev.assignedEmployees.filter(id => id !== employeeId)
            }));
        }
    };

    const handleRemoveEmployee = (employeeId: string) => {
        setRoleForm(prev => ({
            ...prev,
            assignedEmployees: prev.assignedEmployees.filter(id => id !== employeeId)
        }));
    };

    const handlePermissionSelection = (permissionId: string, checked: boolean) => {
        if (checked) {
            setRoleForm(prev => ({
                ...prev,
                permissions: [...prev.permissions, permissionId]
            }));
        } else {
            setRoleForm(prev => ({
                ...prev,
                permissions: prev.permissions.filter(id => id !== permissionId)
            }));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading role...</p>
                </div>
            </div>
        );
    }

    if (!role) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Role not found</p>
                <Button onClick={() => router.push('/rbac')} className="mt-4">
                    Back to RBAC
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            {/* Pass the role name to the breadcrumb */}
            <BreadcrumbNavigation dynamicData={{ roleName: role.name }} />

            <div className="flex items-center gap-4">


            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Role Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role Name *</label>
                                <Input
                                    placeholder="Enter role name"
                                    value={roleForm.name}
                                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={roleForm.isActive}
                                        onCheckedChange={(checked) => setRoleForm({ ...roleForm, isActive: checked as boolean })}
                                    />
                                    <label className="text-sm">Active Role</label>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description *</label>
                            <Textarea
                                placeholder="Enter role description"
                                value={roleForm.description}
                                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Assign Employees */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Assign Employees ({roleForm.assignedEmployees.length} selected)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Filter by Department</label>
                            <button
                                type="button"
                                onClick={() => setShowDepartments(prev => !prev)}
                                className="w-full border rounded px-4 py-2 flex justify-between items-center"
                            >
                                {selectedDepartment === "all" ? "All Departments" : selectedDepartment}
                                {showDepartments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {showDepartments && (
                                <div className="border rounded mt-2">
                                    {["all", ...departments].map(dept => (
                                        <button
                                            key={dept}
                                            onClick={() => {
                                                setSelectedDepartment(dept);
                                                setShowDepartments(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 hover:bg-muted ${selectedDepartment === dept ? 'bg-muted font-medium' : ''}`}
                                        >
                                            {dept === "all" ? "All Departments" : dept}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Employee Selection */}
                        {/* <div className="space-y-2">
                            <label className="text-sm font-medium">Select Employees</label>
                            <Popover open={isEmployeeDropdownOpen} onOpenChange={setIsEmployeeDropdownOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isEmployeeDropdownOpen}
                                        className="w-full justify-between"
                                    >
                                        {roleForm.assignedEmployees.length === 0
                                            ? "Select employees..."
                                            : `${roleForm.assignedEmployees.length} employee(s) selected`}
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <div className="p-3 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search employees..."
                                                className="pl-10"
                                                value={employeeSearchTerm}
                                                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredEmployees.length === 0 ? (
                                            <div className="p-4 text-center text-muted-foreground">
                                                No employees found
                                            </div>
                                        ) : (
                                            <div className="p-2">
                                                {filteredEmployees.map((employee) => (
                                                    <label
                                                        key={employee.id}
                                                        className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded cursor-pointer"
                                                    >
                                                        <Checkbox
                                                            checked={roleForm.assignedEmployees.includes(employee.id)}
                                                            onCheckedChange={(checked) => handleEmployeeSelection(employee.id, checked as boolean)}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm">{employee.name}</div>
                                                            <div className="text-xs text-muted-foreground">{employee.department}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div> */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Employees</label>

                            <Button
                                type="button"
                                variant="outline"
                                role="button"
                                onClick={() => setIsEmployeeDropdownOpen((prev) => !prev)}
                                className="w-full justify-between"
                            >
                                {roleForm.assignedEmployees.length === 0
                                    ? "Select employees..."
                                    : `${roleForm.assignedEmployees.length} employee(s) selected`}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>

                            {isEmployeeDropdownOpen && (
                                <div className="border rounded mt-2 p-3">
                                    {/* Search bar */}
                                    <div className="relative mb-3">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search employees..."
                                            className="pl-10"
                                            value={employeeSearchTerm}
                                            onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    {/* Employee List */}
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredEmployees.length === 0 ? (
                                            <div className="p-4 text-center text-muted-foreground">No employees found</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {filteredEmployees.map((employee) => (
                                                    <label
                                                        key={employee.id}
                                                        className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded cursor-pointer"
                                                    >
                                                        <Checkbox
                                                            checked={roleForm.assignedEmployees.includes(employee.id)}
                                                            onCheckedChange={(checked) =>
                                                                handleEmployeeSelection(employee.id, checked as boolean)
                                                            }
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm">{employee.name}</div>
                                                            <div className="text-xs text-muted-foreground">{employee.department}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Selected Employees Display */}
                        {selectedEmployees.length > 0 && (
                            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">Selected Employees ({selectedEmployees.length})</h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setRoleForm(prev => ({ ...prev, assignedEmployees: [] }))}
                                        className="text-xs"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {selectedEmployees.map((employee) => (
                                        <div
                                            key={employee.id}
                                            className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm">{employee.name}</div>
                                                <div className="text-xs text-muted-foreground">{employee.department}</div>
                                            </div>
                                            <ConfirmDialog
                                                trigger={
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground ml-2"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                }
                                                title="Remove Employee"
                                                description={`Do you really want to remove ${employee.name} from this ${role.name}?`}
                                                confirmText="Remove"
                                                cancelText="Cancel"
                                                onConfirm={() => handleRemoveEmployee(employee.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Permissions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Permissions ({roleForm.permissions.length} selected)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-hidden">
                            <div className="mr-2">
                                {Object.entries(groupedPermissions).map(([resource, perms], index) => (
                                    <div key={resource} className="space-y-3">
                                        <h4 className="font-medium text-lg capitalize border-b p-2">{resource}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {perms.map((permission) => (
                                                <label key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                                    <Checkbox
                                                        checked={roleForm.permissions.includes(permission.id)}
                                                        onCheckedChange={(checked) => handlePermissionSelection(permission.id, checked as boolean)}
                                                        className="mt-0.5"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm">{permission.name}</div>
                                                        <div className="text-xs text-muted-foreground">{permission.description}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/rbac')}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        Update Role
                    </Button>
                </div>
            </form>
        </div>
    );
}

