import styled from "styled-components";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";

const RegisterProfileForm = styled.form`
  input {
    background-color: blueviolet;
    color: white;
  }
`;

export default function RegisterProfile() {
  const [errorText, setErrorText] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [formData, setFormData] = useState({
    username: "",
  });

  useEffect(() => {
    async function checkProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("UserInfo")
        .select()
        .eq("user_uuid", user.id);
      if (data.length > 0) {
        setUserProfile(data);
      }
    }
    checkProfile();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("UserInfo")
        .select()
        .eq("username", formData.username);

      if (data.length > 0) {
        setErrorText("That username already exists");
      } else {
        const { data, error } = await supabase
          .from("UserInfo")
          .select()
          .eq("user_uuid", user.id);
        if (data.length > 0) {
          setErrorText("You already have a profile");
        } else {
          const {} = await supabase.from("UserInfo").insert({
            user_uuid: user.id,
            email: user.email,
            username: formData.username,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  if (!userProfile) {
    return (
      <>
        <RegisterProfileForm onSubmit={handleSubmit}>
          <h1>{errorText}</h1>
          <label htmlFor="username">Name</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
            required
          />
          <button tpye="submit">submit</button>
        </RegisterProfileForm>
      </>
    );
  } else {
    return (
      <>
        <h1>you already have a profile</h1>
      </>
    );
  }
}
