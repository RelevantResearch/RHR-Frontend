import axiosInstance from "./axios"

export const login_api = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(
      "/auth/login",
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Login failed";

      if (status === 401) {
        throw new Error("Invalid email or password");
      }

      throw new Error(message);
    } else {
      throw new Error("Network or server error");
    }
  }
};