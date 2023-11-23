"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/header/page";
import Navbar from "@/components/navbar/page";
import { supabase } from "../../../../supabase";
import GroupCard from "@/components/groupCard/page";

import { useQuery } from "graphql-hooks";

const COLOR_QUERY = `
query{
  main {
    backgroundPrimary{
      hex
    }
    backgroundSecondary{
      hex
    }
    shadowColor{
      hex
    }
    red{
      hex
    }
    green{
      hex
    }
    textColor{
      hex
    }
  }
}
`;

const PageContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.backgroundcolor};
`;

const GroupsContainer = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 32px 16px;
  overflow-y: auto;
  h1 {
    font-size: 32px;
  }
`;

const CreateGroupSection = styled.section`
  z-index: 10;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: ${({ isopen }) => (isopen ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  box-shadow: 0 2px 4px ${(props) => props.shadowcolor};
  border-radius: 8px;
  padding: 16px;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const AcceptButton = styled.button`
  background-color: ${(props) => props.backgroundcolor};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const DeclineButton = styled.button`
  background-color: ${(props) => props.backgroundcolor};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const CreateGroupForm = styled.form`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  input {
    border-radius: 8px;
    color: white;
    width: 100%;
    padding: 4px 8px;
    background-color: ${(props) => props.backgroundcolor};
  }
`;

export default function Groups() {
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("Untitled group");
  const [groups, setGroups] = useState("");

  const { data, loading, error } = useQuery(COLOR_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const textColor = data?.main?.textColor?.hex || "303030";
  const shadowColor = data?.main?.shadowColor?.hex || "303030";
  const red = data?.main?.red?.hex || "303030";
  const green = data?.main?.green?.hex || "303030";

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
    window.location.reload();
  };

  let cardsComponent = null;
  if (Array.isArray(groups)) {
    cardsComponent = groups.map((group) => (
      <GroupCard key={group.id} id={group.group_id} />
    ));
  }

  return (
    <>
      <PageContainer backgroundcolor={backgroundPrimary}>
        <Header header="singlePage"></Header>
        <GroupsContainer>
          <CreateGroupSection
            textcolor={textColor}
            backgroundcolor={backgroundPrimary}
            shadowcolor={shadowColor}
            isopen={isCreateGroupOpen}
          >
            <CreateGroupForm backgroundcolor={backgroundSecondary}>
              <h1>Create Group</h1>
              <input
                placeholder="Groupname:"
                type="text"
                onChange={(e) => setGroupName(e.target.value)}
              />
            </CreateGroupForm>
            <ButtonsContainer>
              <AcceptButton onClick={createGroup} backgroundcolor={green}>Create</AcceptButton>
              <DeclineButton
                onClick={toggleCreateGroup}
                backgroundcolor={backgroundSecondary}
              >
                Cancel
              </DeclineButton>
            </ButtonsContainer>
          </CreateGroupSection>
          {cardsComponent}
        </GroupsContainer>
        <Navbar toggleCreateGroup={toggleCreateGroup} navbar="groups"></Navbar>
      </PageContainer>
    </>
  );
}
