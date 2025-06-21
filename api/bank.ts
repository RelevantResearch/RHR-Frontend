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

    console.log(response)
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create bank details");
  }
};

export const getBankDetails = async (userId: number) => {
  try {
    const response = await axiosInstance.get(`/bankDetails/${userId}`);
    // console.log("API raw response haii:", response); 
    console.log("API raw response:", response.data);  

    if (response.data && response.data.data !== null) {
      return response.data.data;
    }
    return null;
  } catch (error: any) {
    console.error("Error fetching bank details:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch bank details");
  }
};

export const updateBankDetails = async (userId: number, bankDetails: BankDetailsPayload) => {
  try {
    const response = await axiosInstance.put(`/bankDetails/${userId}`, bankDetails);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update bank details");
  }
};

