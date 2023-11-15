"use client";
import { supabase } from "../../../supabase";
import { useState, useEffect } from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

const Email = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
  margin-bottom: 16px;
`;

const Date = styled.p`
  font-size: 16px;
  margin: 0;
  margin-bottom: 8px;
`;

const Time = styled.p`
  font-size: 16px;
  margin: 0;
  margin-bottom: 8px;
`;

const AcceptButton = styled.button`
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 16px;

  &:hover {
    background: #45a049;
  }
`;

const DeclineButton = styled.button`
  background: #f44336;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #d32f2f;
  }
`;

export default function GroupInviteCard(props) {
  const [sender, setSender] = useState("");
  const [group, setGroup] = useState("");

  async function acceptInvite() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("GroupUsers").insert({
      created_at: group[0].created_at,
      group_id: group[0].id,
      user_uuid: user.id,
    });

    const {} = await supabase
      .from("GroupInvites")
      .update({ status: "accepted" })
      .eq("id", props.id);
    props.setRerender(!props.rerender);


    console.log(group[0].id)
  }


  async function declineInvite() {
    const {} = await supabase
      .from("GroupInvites")
      .update({ status: "declined" })
      .eq("id", props.id);
    props.setRerender(!props.rerender);
  }

  useEffect(() => {
    const fetchSender = async () => {
      const { data, error } = await supabase
        .from("UserInfo")
        .select()
        .eq("user_uuid", props.sender);
      setSender(data);
    };
    fetchSender();
  }, []);
  useEffect(() => {
    const fetchGroup = async () => {
      const { data, error } = await supabase
        .from("Groups")
        .select()
        .eq("id", props.group_id);
      setGroup(data);
    };
    fetchGroup();
  }, []);

  if (sender && group) {
    return (
      <CardContainer>
        <Email>{sender[0].email}</Email>
        <Title>{group[0].group_name} (Group)</Title>
        <Date>{group[0].date}</Date>
        <Time>{group[0].time}</Time>
        <AcceptButton onClick={acceptInvite}>Accept</AcceptButton>
        <DeclineButton onClick={declineInvite}>Decline</DeclineButton>
      </CardContainer>
    );
  } else {
    return <p>Loading...</p>;
  }
}
