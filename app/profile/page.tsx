"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { User, Upload, Camera, Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BreadcrumbNavigation } from "@/components/ui/breadcrumbs-navigation";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  DOB: string;
  idType: "passport" | "citizenship" | "driving-license" | "";
  idDocument: string | null;
  avatar: string | null;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    bankAddress: string;
    accountHolderName: string;
    panId: string;
  };
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    DOB: user?.DOB ? new Date(user.DOB).toISOString().split("T")[0] : "",
    idType: user?.idType || "",
    idDocument: user?.frontImage || null,
    avatar: user?.profilePic || null,
    bankDetails: user?.bankDetails || {
      accountNumber: "",
      bankName: "",
      bankAddress: "",
      accountHolderName: "",
      panId: "",
    },
  });

  console.log("Avatar Preview URL:", profileData.avatar);


  const [editingSection, setEditingSection] = useState<'personal' | 'documents-bank' | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result as string }));
        toast.success("Profile picture updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, idDocument: reader.result as string }));
        toast.success("Document uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSection === 'personal') {
      if (!profileData.name || !profileData.email || !profileData.phone || !profileData.address || !profileData.DOB) {
        toast.error("Please fill in all required personal information");
        return;
      }
    }

    if (editingSection === 'documents-bank') {
      if (!profileData.idType) {
        toast.error("Please select an identification document type");
        return;
      }

      if (!profileData.idDocument) {
        toast.error("Please upload your identification document");
        return;
      }

      const bank = profileData.bankDetails;
      if (!bank.accountNumber || !bank.bankName || !bank.accountHolderName || !bank.panId || !bank.bankAddress) {
        toast.error("Please fill in all required bank details");
        return;
      }
    }

    try {
      await updateProfile({
        ...profileData,
        frontImage: profileData.idDocument,
        idType: profileData.idType as "passport" | "citizenship" | "driving-license",
      });
      setEditingSection(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <BreadcrumbNavigation/>
      <div className="flex items-center gap-4 mb-8">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Update your personal information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information with Profile Picture */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <div className="flex gap-2">
              {!editingSection && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSection('personal')}
                >
                  Update
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border">
                  {profileData.avatar && (
                    <AvatarImage
                      src={profileData.avatar}
                      alt="User Avatar"
                      className="object-cover"
                      onError={(e) => {
                        console.log("Image failed:", e.currentTarget.src);
                      }}
                    />
                  )}
                  <AvatarFallback>
                    {profileData.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {editingSection === 'personal' && (
                  <Button
                    type="button"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={editingSection !== 'personal'}
                />
              </div>
              {editingSection === 'personal' && (
                <p className="text-sm text-muted-foreground text-center">
                  Click the camera icon to upload a new profile picture
                </p>
              )}
            </div>

            {/* Personal Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Enter your full name"
                  disabled={editingSection !== 'personal'}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter your email"
                  disabled={editingSection !== 'personal'}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  disabled={editingSection !== 'personal'}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input
                  type="date"
                  value={profileData.DOB}
                  onChange={(e) => setProfileData({ ...profileData, DOB: e.target.value })}
                  placeholder="Select your date of birth"
                  disabled={editingSection !== 'personal'}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Full Address</label>
                <Input
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  placeholder="Country, State, City, Street Address"
                  disabled={editingSection !== 'personal'}
                />
              </div>
            </div>

            {editingSection === 'personal' && (
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSection(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Combined Documents and Bank Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Documents & Bank Details
            </CardTitle>
            <div className="flex gap-2">
              {!editingSection && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSection('documents-bank')}
                >
                  Update
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bank Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Bank Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Holder's Name</label>
                  <Input
                    value={profileData.bankDetails.accountHolderName}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      bankDetails: {
                        ...profileData.bankDetails,
                        accountHolderName: e.target.value
                      }
                    })}
                    placeholder="Enter account holder's name"
                    disabled={editingSection !== 'documents-bank'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <Input
                    value={profileData.bankDetails.accountNumber}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      bankDetails: {
                        ...profileData.bankDetails,
                        accountNumber: e.target.value
                      }
                    })}
                    placeholder="Enter account number"
                    disabled={editingSection !== 'documents-bank'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <Input
                    value={profileData.bankDetails.bankName}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      bankDetails: {
                        ...profileData.bankDetails,
                        bankName: e.target.value
                      }
                    })}
                    placeholder="Enter bank name"
                    disabled={editingSection !== 'documents-bank'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">PAN ID</label>
                  <Input
                    value={profileData.bankDetails.panId}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      bankDetails: {
                        ...profileData.bankDetails,
                        panId: e.target.value.toUpperCase()
                      }
                    })}
                    placeholder="Enter PAN ID"
                    disabled={editingSection !== 'documents-bank'}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Bank Address</label>
                  <Input
                    value={profileData.bankDetails.bankAddress}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      bankDetails: {
                        ...profileData.bankDetails,
                        bankAddress: e.target.value
                      }
                    })}
                    placeholder="Enter bank address"
                    disabled={editingSection !== 'documents-bank'}
                  />
                </div>
              </div>
            </div>

            {/* Identification Document Section - Moved below Bank Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Identification Document</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select an identification document</label>
                <Select
                  value={profileData.idType}
                  onValueChange={(value: "passport" | "citizenship" | "driving-license") =>
                    setProfileData({ ...profileData, idType: value, idDocument: null })}
                  disabled={editingSection !== 'documents-bank'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select identification document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="citizenship">Citizenship</SelectItem>
                    <SelectItem value="driving-license">Driving License</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {profileData.idType && (
                <label className={`block ${editingSection !== 'documents-bank' ? 'pointer-events-none' : 'cursor-pointer'}`}>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleDocumentUpload}
                    disabled={editingSection !== 'documents-bank'}
                  />
                  <div className="border rounded-lg p-4">
                    {profileData.idDocument ? (
                      <div className="relative">
                        <img
                          src={profileData.idDocument}
                          alt="ID Document"
                          className="w-full h-48 object-cover rounded"
                        />
                        {editingSection === 'documents-bank' && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfileData({ ...profileData, idDocument: null });
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 bg-muted rounded hover:bg-muted/80 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-primary hover:underline">
                          Upload {profileData.idType === "passport" ? "Passport" :
                            profileData.idType === "driving-license" ? "Driving License" :
                              "Citizenship"} Document
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              )}
            </div>

            {editingSection === 'documents-bank' && (
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSection(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}