"use client";
import React, { useState } from "react";
import { supabase } from "../../../../supabase";
import { useRouter } from "next/navigation";
import HomeHeader from "@/components/header/page";
import { styled } from "styled-components";

const LoginPage = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #303030;
`;
const Title = styled.h1`
  width: 100%;
  text-align: center;
  font-size: 32px;
  color: white;
`;
const LoginFormSection = styled.section`
  width: 80%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #202020;
  padding: 32px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const ActionSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: white;
`;
const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 24px;
  button {
    background-color: #6c63ff;
    padding: 8px;
    border-radius: 8px;
    color: white;
    box-shadow: 5px 5px 5px #101010;
  }
  input {
    border-radius: 8px;
    background-color: #303030;
    color: white;
    padding: 16px;
    font-size: 16px;
    box-shadow: 5px 5px 5px #101010;
  }
  input::placeholder {
    color: white;
  }
  div {
    display: flex;
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  box-shadow: 5px 5px 5px #101010;
  padding: 8px 16px 8px 16px;
  width: 100%;
`;

export default function Login() {
  const router = useRouter();
  const [register, setRegister] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginButtonStyle = {
    background: register ? "#303030" : "#6c63ff",
    borderRadius: "8px 0 0 8px",
  };

  const registerButtonStyle = {
    background: register ? "#6c63ff" : "#303030",
    borderRadius: "0 8px 8px 0",
  };

  function changeToLogin() {
    setRegister(false);
  }

  function changeToRegister() {
    setRegister(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (register) {
        // Register logic
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (error) {
          console.log("Registration error:", error);
          setLoginError("Registration failed");
        } else {
          router.push("/unauthenticated/emailConfirmation");
        }
      } else {
        // Login logic
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) {
          console.log("Authentication error:", error);
          setLoginError("Email or password is incorrect");
        } else {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            router.push("/authenticated/home");
          } else {
            console.log("wrong password");
            setLoginError("Email or password is incorrect");
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <LoginPage>
        <HomeHeader register={register} header={"start"}></HomeHeader>
        <LoginFormSection>
          {!register && <Title>Login Form</Title>}
          {register && <Title>Register Form</Title>}
          <ActionSection>
            <ActionButton onClick={changeToLogin} style={loginButtonStyle}>
              Login
            </ActionButton>
            <ActionButton
              onClick={changeToRegister}
              style={registerButtonStyle}
            >
              Register
            </ActionButton>
          </ActionSection>
          <p>{loginError}</p>
          <LoginForm onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {!register && (
              <button type="submit">Login</button>
            )}
            {register && (
              <button type="submit">Register</button>
            )}
          </LoginForm>
        </LoginFormSection>
      </LoginPage>
    </>
  );
}
