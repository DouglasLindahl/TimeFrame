"use client";
import { supabase } from "../../../../supabase";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Header from "@/components/header/page";
import Navbar from "@/components/navbar/page";
import Invites from "@/components/invites/page";
import RegisterProfile from "@/components/registerProfile/page";

const SettingsPage = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
const Content = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`;

export default function Settings() {
  const router = useRouter();
  async function handleClick() {
    const { error } = await supabase.auth.signOut();
    router.push("/authenticated/login");
  }
  return (
    <SettingsPage>
      <Header header={"home"}></Header>
      <Content>
        <button onClick={handleClick}>Logout</button>
        <RegisterProfile></RegisterProfile>
        <Invites></Invites>
      </Content>
      <Navbar navbar={"home"}></Navbar>
    </SettingsPage>
  );
}
