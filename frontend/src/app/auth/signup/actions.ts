"use server";

import axios from "axios";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await axios.post(
      "https://notes-web-app-backend-lhf5.onrender.com/api/auth/signup",
      {
        username,
        email,
        password,
      },
    );

    console.log("form submit response is", response.data);

    redirect("/auth/login");
  } catch (error) {
    throw new Error(String(error) || "Signup failed, try again");
  }
}
