// // api/bank.ts
// import axiosInstance from "./axios";

// interface BankDetailsPayload {
//   name: string;
//   address: string;
//   acName: string;
//   acNumber: string;
//   tax: string;
//   userId: string;
//   branch: string;
//   additionalInformation: string;
// }



// export const createBankDetails = async (bankDetails: BankDetailsPayload) => {
//   try {
//     const response = await axiosInstance.post("/bankDetails/create", bankDetails);
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to create bank details");
//   }
// };



// export const getBankDetails = async (userId: number) => {
//   try {
//     const response = await axiosInstance.get(`/bankDetails/${userId}`);
//     if (response.data && response.data.data !== null) {
//       return response.data.data;
//     }
//     return null;
//   } catch (error: any) {
//     console.error("Error fetching bank details:", error);
//     throw new Error(error.response?.data?.message || "Failed to fetch bank details");
//   }
// };

import axiosInstance from "./axios";

interface BankDetailsPayload {
  name: string;
  address: string;
  acName: string;
  acNumber: string;
  tax: string;
  userId: string;
  branch?: string;
  additionalInformation?: string;
}

// Create Bank Details API
export const createBankDetails = async (bankDetails: BankDetailsPayload) => {
  try {
    const response = await axiosInstance.post("/bankDetails/create", bankDetails);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create bank details");
  }
};

export const getBankDetails = async (userId: number) => {
  try {
    const response = await axiosInstance.get(`/bankDetails/${userId}`);
    // console.log("API raw response:", response.data);

    // Check if data exists in the response
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error: any) {
    console.error("Error fetching bank details:", error);
    // If it's a 404 (not found), return null instead of throwing error
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(error.response?.data?.message || "Failed to fetch bank details");
  }
};
