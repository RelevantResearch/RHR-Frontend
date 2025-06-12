// @/hooks/useEmployees.ts
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllEmployees } from "@/api/user";
import { getBankDetails } from "@/api/bank";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=faces";
const DEFAULT_DOCUMENTS = {
  panCard: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
  idType: "passport",
  idDocument: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const rawEmployees = await getAllEmployees();

        const enriched = await Promise.all(
          rawEmployees.map(async (emp: any) => {
            let bankDetails = null;
            try {
              bankDetails = await getBankDetails(Number(emp.id));
            } catch (err) {
              console.warn(`Bank details fetch failed for user ${emp.id}`, err);
            }

            return {
              ...emp,
              joinDate: emp.joinDate || new Date().toISOString(),
              department: "Web Development", // Static fallback
              avatar: DEFAULT_AVATAR,
              documents: DEFAULT_DOCUMENTS,
              position: emp.document || "",
              bankDetails: bankDetails
                ? {
                    accountHolder: bankDetails.acName || "",
                    accountNumber: bankDetails.acNumber || "",
                    bankName: bankDetails.name || "",
                    panId: bankDetails.tax || "",
                    bankAddress: bankDetails.address || "",
                  }
                : {
                    accountHolder: "",
                    accountNumber: "",
                    bankName: "",
                    panId: "",
                    bankAddress: "",
                  },
            };
          })
        );

        setEmployees(enriched);
      } catch (err) {
        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, loading };
};
