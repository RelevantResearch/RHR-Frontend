import { useState, useRef, useEffect } from "react";
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context'; // adjust path to your auth hook



export interface ProfileData {
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

export function useProfile() {
    const { user } = useAuth();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileData, setProfileData] = useState<ProfileData>({
        name: "",
        email: "",
        phone: "",
        address: "",
        DOB: "",
        idType: "",
        idDocument: null,
        avatar: null,
        bankDetails: {
            accountNumber: "",
            bankName: "",
            bankAddress: "",
            accountHolderName: "",
            panId: "",
        },
    });

    const [editingSection, setEditingSection] = useState<'personal' | 'documents-bank' | null>(null);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                DOB: user.DOB ? new Date(user.DOB).toISOString().split("T")[0] : "",
                idType: user.idType || "",
                idDocument: user.frontImage || null,
                avatar: user.profilePic || null,
                bankDetails: user.bankDetails || {
                    accountNumber: "",
                    bankName: "",
                    bankAddress: "",
                    accountHolderName: "",
                    panId: "",
                },
            });
        }
    }, [user]);

    return {
        profileData,
        setProfileData,
        editingSection,
        setEditingSection,
        fileInputRef,
    };
}