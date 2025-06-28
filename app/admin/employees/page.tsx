'use client';

import type { userForm, EmploymentType, userStatus } from '@/types/user';
import Pagination from '@/components/ui/pagination';
import { useRoles } from '@/hooks/useRoles';
import { createUserApi, deleteUserApi } from '@/api/user';
import { useEmployees } from '@/hooks/useEmployees';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Trash2, Mail, Phone, Building2, Calendar, Download, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDepartments } from "@/hooks/useDepartments";
import { usePagination } from '@/hooks/usePagination';
import CustomSelect from '@/components/CustomSelect';


const emptyuserForm: userForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  department: '',
  position: '',
  joinDate: format(new Date(), 'yyyy-MM-dd'),
  employmentType: 'full-time',
  role: '',
  address: '',
  bankDetails: {
    accountHolder: '',
    accountNumber: '',
    bankName: '',
    panId: '',
    bankAddress: '',
  },
};

export default function EmployeesPage() {
  const [newEmployee, setNewEmployee] = useState<userForm>(emptyuserForm);
  const { departments, loading: loadingDepartments } = useDepartments();
  const { user } = useAuth();
  const { roles } = useRoles();
  const { employees: fetchedEmployees, loading } = useEmployees();
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showuserForm, setShowuserForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");


  useEffect(() => {
    if (!loading && fetchedEmployees.length > 0) {
      setEmployees(fetchedEmployees);
    }
  }, [fetchedEmployees, loading]);


  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.password || !newEmployee.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      name: newEmployee.name,
      email: newEmployee.email,
      password: newEmployee.password,
      phone: newEmployee.phone,
      position: newEmployee.position,
      roleId: newEmployee.role === 'admin' ? 1 : 2,
      fullTimer: newEmployee.employmentType === 'full-time',
      address: newEmployee.address,
      document: 'test docs',
      salary: 250,
    };

    console.log('Payload:', payload);

    try {
      await createUserApi(payload);
      toast.success('User created successfully');
      setShowuserForm(false);
      setNewEmployee(emptyuserForm);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleEditEmployee = () => {
    if (!editingEmployee.name || !editingEmployee.email || !editingEmployee.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedEmployees = employees.map(emp =>
      emp.id === editingEmployee.id ? editingEmployee : emp
    );
    setEmployees(updatedEmployees);
    setShowEditForm(false);
    setEditingEmployee(null);
    toast.success('Employee updated successfully');
  };

  const handleDeleteEmployee = async (id: number | string) => {
    const userToDelete = employees.find((emp) => emp.id === id);

    if (!userToDelete) {
      console.warn(`User with ID ${id} not found in local state.`);
      toast.error("Employee not found.");
      return;
    }


    try {
      await deleteUserApi(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id)); 
      toast.success(`Deleted employee: ${userToDelete.name}`);
    } catch (err) {
      console.error(
        `[ERROR] Failed to delete user with ID ${id}:`,
        (err as Error).message
      );
      toast.error("Failed to delete employee.");
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesDepartment =
      selectedDepartment === 'all' || employee.department === selectedDepartment;

    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && !employee.isDeleted) ||
      (selectedStatus === 'inactive' && employee.isDeleted);

    return matchesDepartment && matchesSearch && matchesStatus;
  })
    .sort((a, b) => Number(a.isDeleted) - Number(b.isDeleted));


  const { paginated: currentEmployees, totalPages } = usePagination(filteredEmployees, currentPage, employeesPerPage);
  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: String(role.id),
  }));

  const departmentOptions = departments.map((dept) => ({
    label: dept.name,
    value: dept.name, 
  }));

  const employmentTypeOptions = [
    { label: "Full Time", value: "full-time" },
    { label: "Part Time", value: "part-time" },
  ];

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const statusFilter = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const departmentFilter = [
    { label: "All Departments", value: "all" },
    ...departments.map(dept => ({
      label: dept.name,
      value: dept.name,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
        <Button onClick={() => {
          setNewEmployee(emptyuserForm);
          setIsEditing(false);
          setShowuserForm(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Add Dialog */}
      <Dialog open={showuserForm} onOpenChange={setShowuserForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>{isEditing ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                placeholder="Enter employee name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                placeholder="Enter phone number"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <CustomSelect
                options={departmentOptions}
                value={newEmployee.department}
                onValueChange={(val) =>
                  setNewEmployee({ ...newEmployee, department: val })
                }
                placeholder="Select department"
              />
            </div>


            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Input
                placeholder="Enter position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <CustomSelect
                options={roleOptions}
                value={newEmployee.role}
                onValueChange={(val) =>
                  setNewEmployee({ ...newEmployee, role: val })
                }
                placeholder="Select role"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Join Date</label>
              <Input
                type="date"
                value={newEmployee.joinDate}
                onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Employment Type</label>
              <CustomSelect
                options={employmentTypeOptions}
                value={newEmployee.employmentType}
                onValueChange={(value) =>
                  setNewEmployee({ ...newEmployee, employmentType: value as EmploymentType })
                }
                placeholder="Select employment type"
              />


            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Full Address</label>
              <Input
                placeholder="Enter complete address"
                value={newEmployee.address}
                onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => {
              setShowuserForm(false);
              setNewEmployee(emptyuserForm);
              setIsEditing(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddEmployee}>
              {isEditing ? 'Update Employee' : 'Add Employee'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>



      {/* Edit Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Edit Employee</DialogTitle>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Employee Information (Read-only)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Name:</span>
                  <span className="ml-2 text-blue-800">{editingEmployee?.name}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Email:</span>
                  <span className="ml-2 text-blue-800">{editingEmployee?.email}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Phone:</span>
                  <span className="ml-2 text-blue-800">{editingEmployee?.phone}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Join Date:</span>
                  <span className="ml-2 text-blue-800">
                    {editingEmployee?.joinDate ? format(new Date(editingEmployee.joinDate), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-blue-700 font-medium">Address:</span>
                  <span className="ml-2 text-blue-800">{editingEmployee?.address}</span>
                </div>
              </div>
            </div>

            {editingEmployee && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <CustomSelect
                    options={departmentOptions}
                    value={editingEmployee.department}
                    onValueChange={(val) =>
                      setNewEmployee({ ...editingEmployee, department: val })
                    }
                    placeholder="Select department"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Input
                    placeholder="Enter position"
                    value={editingEmployee.position}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <CustomSelect
                    options={roleOptions}
                    value={editingEmployee.roleId}
                    onValueChange={(val) =>
                      setEditingEmployee({ ...editingEmployee, roleId: val })
                    }
                    placeholder="Select role"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Employment Type</label>
                  <CustomSelect
                    options={employmentTypeOptions}
                    value={editingEmployee.employmentType}
                    onValueChange={(value) =>
                      setEditingEmployee({ ...editingEmployee, employmentType: value })
                    }
                    placeholder="Select employment type"
                  />

                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <CustomSelect
                    options={statusOptions}
                    value={editingEmployee.status}
                    onValueChange={(value) =>
                      setEditingEmployee({ ...editingEmployee, status: value as userStatus })
                    }
                    placeholder="Select status"
                  />

                </div>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => {
              setShowEditForm(false);
              setEditingEmployee(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditEmployee}>
              Update Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <CustomSelect
                options={departmentFilter}
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                placeholder="All Department"
                className="w-full sm:w-[200px]"
              />
              <CustomSelect
                options={statusFilter}
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value)}
                placeholder="All Status"
                className="w-full sm:w-[200px]"
              />


            </div>

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Employee</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden md:table-cell">Position</TableHead>
                    <TableHead className="hidden md:table-cell">Join Date</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                            <div className="md:hidden text-sm text-gray-500">{employee.department}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                      <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                      <TableCell className="hidden md:table-cell">{format(new Date(employee.joinDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={cn(
                            "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                            employee.isDeleted
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          )}
                        >
                          {employee.isDeleted ? "Inactive" : "Active"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="border-0  w-full max-w-[95vw] max-h-[95vh] md:max-w-4xl md:max-h-[90vh] overflow-y-auto">
                              <DialogTitle>Employee Details</DialogTitle>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                      {employee.avatar && (
                                        <AvatarImage src={employee.avatar} alt={employee.name} />
                                      )}
                                      <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>

                                    <div>
                                      <h3 className="text-xl font-semibold">{employee.name}</h3>
                                      <p className="text-gray-500">{employee.position}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Contact Information</h4>
                                    <div className="grid gap-2">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <span className="break-all">{employee.email}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <span>{employee.phone}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <span className="break-words">{employee.address}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <span>{employee.department}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <span>Joined {format(new Date(employee.joinDate), 'PP')}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Bank Details</h4>
                                    <div className="grid gap-2 text-sm">
                                      <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <span className="text-gray-500">Account Holder</span>
                                        <span>{employee.bankDetails.accountHolder}</span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <span className="text-gray-500">Account Number</span>
                                        <span>{employee.bankDetails.accountNumber}</span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <span className="text-gray-500">Bank Name</span>
                                        <span>{employee.bankDetails.bankName}</span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <span className="text-gray-500">PAN ID</span>
                                        <span>{employee.bankDetails.panId}</span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <span className="text-gray-500">Bank Address</span>
                                        <span className="break-words">{employee.bankDetails.bankAddress}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-6">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Documents</h4>
                                    <div className="grid gap-4">
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm">PAN Card</span>
                                          <Button variant="ghost" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                          </Button>
                                        </div>
                                        <div className="aspect-video rounded-lg border overflow-hidden">
                                          <img
                                            src={employee.documents.panCard}
                                            alt="PAN Card"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm">ID Document ({employee.documents.idType})</span>
                                          <Button variant="ghost" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                          </Button>
                                        </div>
                                        <div className="aspect-video rounded-lg border overflow-hidden">
                                          <img
                                            src={employee.documents.idDocument}
                                            alt="ID Document"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>


                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingEmployee({ ...employee });
                              setShowEditForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>

                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this employee? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {currentEmployees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                        No employees found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredEmployees.length}
              itemsPerPage={employeesPerPage}
              onPageChange={setCurrentPage}
              label="employees"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}