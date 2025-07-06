'use client';

import { useState } from 'react';
// import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, Search, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { useRBACStore } from "@/lib/rbac-store";
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import { ConfirmDialog } from '@/components/confirm-dialog';


type Role = {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    assignedEmployees: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    priority?: number;
    priorityLabel?: string;
};


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

export default function AddRolePage() {
    const router = useRouter();
    const { permissions, addRole } = useRBACStore();
    const [showDepartments, setShowDepartments] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    const [roleForm, setRoleForm] = useState({
        name: "",
        description: "",
        permissions: [] as string[],
        assignedEmployees: [] as string[],
        isActive: true,
        priority: 0, // <-- default value
        priorityLabel: "",
    });

    const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
    // const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

    const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));

    const filteredEmployees = mockEmployees.filter(employee => {
        const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment;
        const matchesSearch = employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase());
        return matchesDepartment && matchesSearch;
    });

    const selectedEmployees = mockEmployees.filter(emp =>
        roleForm.assignedEmployees.includes(emp.id)
    );

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

        addRole(roleForm);
        toast.success("Role created successfully");
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

    return (
        <div className="container mx-auto">
            <BreadcrumbNavigation />

            {/* <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push('/rbac')}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Role</h1>
                    <p className="text-muted-foreground">Create a new role with permissions and assign employees</p>
                </div>
            </div> */}

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
                            <Users className="h-5 w-5" />
                            Assign Employees ({roleForm.assignedEmployees.length} selected)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Department Filter */}
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


                        {/* Selected Employees Display - Now appears directly below the dropdown */}
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
                                                description={`Do you really want to remove ${employee.name} from this role?`}
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
                        <div className="max-h-100 overflow-y-auto space-y-6">
                            {Object.entries(groupedPermissions).map(([resource, perms]) => (
                                <div key={resource} className="space-y-3">
                                    <h4 className="font-medium text-lg capitalize border-b pb-2">{resource}</h4>
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
                        Create Role
                    </Button>
                </div>
            </form>
        </div>
    );
}