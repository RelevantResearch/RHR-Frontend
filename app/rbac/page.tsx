"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Plus, Edit, Trash2, Users, Search, Eye } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useRBACStore, Role, Permission } from "@/lib/rbac-store";
import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';





const mockEmployees = [
    {
        id: '1',
        name: 'John Admin',
        email: 'john.admin@company.com',
        department: 'Management',
        position: 'HR Manager',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=faces',
    },
    {
        id: '2',
        name: 'Jane Employee',
        email: 'jane.employee@company.com',
        department: 'Engineering',
        position: 'Software Engineer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=256&h=256&fit=crop&crop=faces',
    },
    {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        department: 'Data Analysis',
        position: 'Data Analyst',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces',
    },
    {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        department: 'Web Development',
        position: 'Frontend Developer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=faces',
    },
    {
        id: '5',
        name: 'David Brown',
        email: 'david.brown@company.com',
        department: 'Public Impact',
        position: 'Project Manager',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces',
    },
    {
        id: '6',
        name: 'Lisa Garcia',
        email: 'lisa.garcia@company.com',
        department: 'Engineering',
        position: 'Backend Developer',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop&crop=faces',
    },
];

export default function RBACPage() {
    const { user } = useAuth();
    const router = useRouter();
    const {
        roles,
        permissions,
        deleteRole,
    } = useRBACStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getEmployeeById = (id: string) => mockEmployees.find(emp => emp.id === id);

    const handleAddRole = () => {
        router.push('/rbac/add-role');
    };

    const handleEditRole = (role: Role) => {
        router.push(`/rbac/edit-role?id=${role.id}`);
    };

    return (
        <div className="container mx-auto">
            <BreadcrumbNavigation />

            

            <Tabs value="roles">
                <TabsContent value="roles" className="space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search roles..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAddRole} className="w-full md:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Role
                        </Button>
                    </div>

                    {/* Roles Table */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-900 space-y-2">
                    <p className="font-semibold">Note:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                        <strong>Eye Icon #1</strong> (color: <code>&lt;black&gt;</code>):  
                        Opens a modal (<code>&lt;DialogContent&gt;</code>) to show inline role details <strong>without navigating</strong> away from the page.
                        </li>
                        <li>
                        <strong>Eye Icon #2</strong> (color: <code>&lt;blue&gt;</code>):  
                        Navigates to a <strong> role details page</strong>.
                        </li>
                    </ul>
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="min-w-[150px]">Role Name</TableHead>
                                        <TableHead className="hidden md:table-cell min-w-[200px]">Description</TableHead>
                                        <TableHead className="hidden xl:table-cell">Permissions</TableHead>
                                        <TableHead className="hidden min-w-[200px]">Assigned Employees</TableHead>
                                        <TableHead className="hidden md:table-cell">Status</TableHead>
                                        <TableHead className="w-[120px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRoles.map((role, index) => {
                                        const assignedEmployees = (role as any).assignedEmployees || [];
                                        return (
                                            <TableRow key={role.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-semibold">{role.name}</div>
                                                        <div className="md:hidden text-sm text-muted-foreground mt-1">
                                                            {role.description}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="max-w-[200px]" title={role.description}>
                                                        {role.description}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="hidden xl:table-cell">
                                                    <div className="flex flex-wrap gap-1">
                                                        {role.permissions.slice(0, 2).map((permId) => {
                                                            const permission = permissions.find(p => p.id === permId);
                                                            return permission ? (
                                                                <Badge key={permId} variant="outline" className="text-xs">
                                                                    {permission.name}
                                                                </Badge>
                                                            ) : null;
                                                        })}
                                                        {role.permissions.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{role.permissions.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="space-y-2">
                                                        <div className="flex flex-wrap gap-1">
                                                            {assignedEmployees.slice(0, 2).map((empId: string) => {
                                                                const employee = getEmployeeById(empId);
                                                                return employee ? (
                                                                    <div
                                                                        key={empId}
                                                                        className="text-sm bg-muted/50 rounded px-2 py-1"
                                                                    >
                                                                        {employee.name}
                                                                    </div>
                                                                ) : null;
                                                            })}
                                                            {assignedEmployees.length > 2 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{assignedEmployees.length - 2}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="hidden md:table-cell">
                                                    <Badge variant={role.isActive ? "default" : "secondary"}>
                                                        {role.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" onClick={() => setSelectedRole(role)}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>

                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                                <DialogHeader>
                                                                    <DialogTitle>Role Details</DialogTitle>
                                                                </DialogHeader>
                                                                {selectedRole && (
                                                                    <div className="space-y-4">
                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                            <div>
                                                                                <h4 className="font-medium mb-2">Basic Information</h4>
                                                                                <div className="space-y-2 text-sm">
                                                                                    <div><span className="text-muted-foreground">Name:</span> {selectedRole.name}</div>
                                                                                    <div><span className="text-muted-foreground">Status:</span> {selectedRole.isActive ? "Active" : "Inactive"}</div>
                                                                                    <div><span className="text-muted-foreground">Created:</span> {format(new Date(selectedRole.createdAt), 'PPP')}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-medium mb-2">Description</h4>
                                                                                <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                                                                            </div>
                                                                        </div>

                                                                        <div>
                                                                            <h4 className="font-medium mb-2">Assigned Employees ({((selectedRole as any).assignedEmployees || []).length})</h4>
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                                {((selectedRole as any).assignedEmployees || []).map((empId: string) => {
                                                                                    const employee = getEmployeeById(empId);
                                                                                    return employee ? (
                                                                                        <div key={empId} className="flex items-center gap-2 p-2 border rounded">
                                                                                            {/* <Avatar className="h-8 w-8">
                                                                                                <AvatarImage src={employee.avatar} alt={employee.name} />
                                                                                                <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
                                                                                            </Avatar> */}
                                                                                            <div>
                                                                                                <div className="text-sm font-medium">{employee.name}</div>
                                                                                                <div className="text-xs text-muted-foreground">{employee.department}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : null;
                                                                                })}
                                                                            </div>
                                                                        </div>

                                                                        <div>
                                                                            <h4 className="font-medium mb-2">Permissions ({selectedRole.permissions.length})</h4>
                                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                                                {selectedRole.permissions.map((permId) => {
                                                                                    const permission = permissions.find(p => p.id === permId);
                                                                                    return permission ? (
                                                                                        <div key={permId} className="flex items-center justify-between p-2 border rounded">
                                                                                            <span className="text-sm">{permission.name}</span>
                                                                                            <Badge variant="outline" className="text-xs">
                                                                                                {permission.action}
                                                                                            </Badge>
                                                                                        </div>
                                                                                    ) : null;
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </DialogContent>
                                                        </Dialog>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => router.push(`/rbac/view-role?id=${role.id}`)}
                                                        >
                                                            <Eye className="h-4 w-4 text-blue-500" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete this role? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                        onClick={() => {
                                                                            deleteRole(role.id);
                                                                            toast.success("Role deleted successfully");
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {filteredRoles.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No roles found. Create your first role to get started.
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}