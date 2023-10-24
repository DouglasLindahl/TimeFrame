"use client";
import React, { useState } from "react";
import { supabase } from "../../../../supabase";
import { useRouter } from "next/navigation";
import HomeHeader from "@/components/header/page";
import { styled } from "styled-components";
import { useQuery } from "graphql-hooks";

const COLOR_QUERY = `
query{
  main {
    logo{
      url
    }
    shadowColor{
      hex
    }
    primaryColor{
      hex
    }
    textColor{
      hex
    }
    secondaryColor{
      hex
    }
    backgroundPrimary{
      hex
    }
    backgroundSecondary{
      hex
    }
    currentDay{
      hex
    }
    currentDayText{
      hex
    }
    offDay{
      hex
    }
    offDayText{
      hex
    }
  }
}
`;

const LoginPage = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.backgroundcolor};
`;
const Title = styled.h1`
  width: 100%;
  text-align: center;
  font-size: 32px;
  color: ${(props) => props.textcolor};
`;
const LoginFormSection = styled.section`
  width: 80%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: ${(props) => props.backgroundcolor};
  padding: 32px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.backgroundcolor};
  padding: 8px;
  border-radius: 8px;
  color: ${(props) => props.textcolor};
  box-shadow: 5px 5px 5px ${(props) => props.shadowcolor};
`;
const ActionSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.textcolor};
`;
const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 24px;
  input {
    border-radius: 8px;
    background-color: #303030;
    color: ${(props) => props.textcolor};
    padding: 16px;
    font-size: 16px;
    box-shadow: 5px 5px 5px ${(props) => props.shadowcolor};
  }
  input::placeholder {
    color: ${(props) => props.textcolor};
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
  const { data, error } = useQuery(COLOR_QUERY);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const primaryColor = data?.main?.primaryColor?.hex || "303030";
  const shadowColor = data?.main?.shadowColor?.hex || '303030';
  const textColor = data?.main?.textColor?.hex || "303030";

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
      <LoginPage backgroundcolor={backgroundSecondary}>
        <HomeHeader register={register} header={"start"}></HomeHeader>
        <LoginFormSection backgroundcolor={backgroundPrimary}>
          {!register && <Title textcolor={textColor}>Login Form</Title>}
          {register && <Title textcolor={textColor}>Register Form</Title>}
          <ActionSection textcolor={textColor}>
            <ActionButton  onClick={changeToLogin} style={loginButtonStyle}>
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
          <LoginForm shadowcolor={shadowColor} onSubmit={handleSubmit}>
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
              <SubmitButton shadowcolor={shadowColor} backgroundcolor={primaryColor} textcolor={textColor} type="submit">Login</SubmitButton>
            )}
            {register && (
              <SubmitButton shadowcolor={shadowColor} backgroundcolor={primaryColor} textcolor={textColor} type="submit">Register</SubmitButton>
            )}
          </LoginForm>
        </LoginFormSection>
      </LoginPage>
    </>
  );
}
