import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export async function register({
  email,
  contact,
  password,
  fullname,
  isSeller,
}) {
  const response = await authApiInstance.post("/register", {
    email,
    contact,
    password,
    fullname,
    isSeller,
  });
  return response.data;
}

export async function login({ email, username, password }) {
  const response = await authApiInstance.post("/login", {
    email,
    username,
    password,
  });
  return response.data;
}

export async function verifyOTP({ userId, otp }) {
  const response = await authApiInstance.post("/verify-otp", {
    userId,
    otp,
  });
  return response.data;
}

export async function resendOTP({ userId }) {
  const response = await authApiInstance.post("/send-otp", { userId });
  return response.data;
}

export async function forgetPassword({ email, username }) {
  const response = await authApiInstance.post("/forget-password", { email, username });
  return response.data;
}

export async function verifyResetOtp({ userId, otp, newPassword,confirmPassword }) {
  const response = await authApiInstance.post("/verify-reset-otp", {
    userId,
    otp,
    newPassword,
    confirmPassword,
  });
  return response.data;
}


export async function logoutApi() {
  const response = await authApiInstance.post("/logout");
  return response.data;
}




