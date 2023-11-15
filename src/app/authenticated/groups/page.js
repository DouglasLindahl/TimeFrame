"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/header/page";
import Navbar from "@/components/navbar/page";
import { supabase } from "../../../../supabase";
import GroupCard from "@/components/groupCard/page";

const PageContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const GroupsContainer = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  overflow-y: auto;
`;

const CreateGroupSection = styled.section`
  display: flex;
  align-items: center;
  height: 20px;
`;

const CreateGroupForm = styled.form`
  display: ${({ isopen }) => (isopen ? "flex" : "none")};
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ImageButton = styled.button`
  cursor: pointer;
  margin-right: 1rem;
`;

export default function Groups() {
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("Untitled group");
  const [groups, setGroups] = useState("");

  const toggleCreateGroup = () => {
    setCreateGroupOpen(!isCreateGroupOpen);
  };

  useEffect(() => {
    const getGroups = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("GroupUsers")
        .select()
        .eq("user_uuid", user.id);
        setGroups(data);
    };
    getGroups();
  }, []);

  const createGroup = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("Groups")
      .insert([{ group_name: groupName, owner_uuid: user.id }]);

    const { data } = await supabase
      .from("Groups")
      .select()
      .eq("owner_uuid", user.id)
      .order("id", { ascending: false })
      .limit(1);

    const {} = await supabase
      .from("GroupUsers")
      .insert({ group_id: data[0].id, user_uuid: user.id });
  };

  let cardsComponent = null;
  if (Array.isArray(groups)) {
    cardsComponent = groups.map((group) => (
      <GroupCard key={group.id} id={group.group_id} />
    ));
  }

  return (
    <>
      <PageContainer>
        <Header header="home"></Header>
        <GroupsContainer>
          <CreateGroupSection>
            <ImageButton onClick={toggleCreateGroup}>
              {isCreateGroupOpen ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.271 8.72827L17.4565 1.54272L15.9138 0L8.72827 7.18555L1.54272 0L0 1.54272L7.18555 8.72827L0 15.9138L1.54272 17.4565L8.72827 10.271L15.9138 17.4565L17.4565 15.9138L10.271 8.72827Z"
                    fill="black"
                  />
                </svg>
              ) : (
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.4062 8.09375V0H8.09375V8.09375H0V10.4062H8.09375V18.5H10.4062V10.4062H18.5V8.09375H10.4062Z"
                    fill="black"
                  />
                </svg>
              )}
            </ImageButton>
            <CreateGroupForm isopen={isCreateGroupOpen}>
              <label>
                Group Name:
                <input
                  type="text"
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </label>
              <ImageButton onClick={createGroup}>
                <svg
                  width="37"
                  height="37"
                  viewBox="0 0 37 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.0312 27.75L4.625 17.3437L6.25994 15.7088L15.0312 24.479L30.7401 8.7713L32.375 10.4062L15.0312 27.75Z"
                    fill="black"
                  />
                </svg>
              </ImageButton>
            </CreateGroupForm>
          </CreateGroupSection>
          {cardsComponent}
        </GroupsContainer>
        <Navbar navbar="home"></Navbar>
      </PageContainer>
    </>
  );
}
