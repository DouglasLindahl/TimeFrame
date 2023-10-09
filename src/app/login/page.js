"use client";
import React, { useState } from "react";
import StartHeader from "@/components/startHeader/page";
import { supabase } from "../../../supabase";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [loginError, setLoginError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      console.error("Error:", error);
    }

    const { data: { user } } = await supabase.auth.getUser()
    if(user)
    {
      router.push("/home");
    }
    else{
      console.log("wrong password");
      setLoginError("Email or password is incorrect");
    }
  };

  return (
    <>
      <StartHeader></StartHeader>
      <p className="text-red-500">{loginError}</p>
      <section className="">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </section>
    </>
  );
}
