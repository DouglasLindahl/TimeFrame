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
  background: #4CAF50;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 16px;

  &:hover {
    background: #45A049;
  }
`;

const DeclineButton = styled.button`
  background: #F44336;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #D32F2F;
  }
`;


export default function InviteCard(props) {
  const [sender, setSender] = useState("");
  const [event, setEvent] = useState("");

  async function acceptInvite() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("Events").insert({
      created_at: event[0].created_at,
      title: event[0].title,
      description: event[0].description,
      date: event[0].date,
      time: event[0].time,
      color: event[0].color,
      user_uuid: user.id,
    });
    const {} = await supabase.from("Invites").delete().eq("id", props.id);
    props.setRerender(!props.rerender);
  }
  async function declineInvite(){
    const {} = await supabase.from("Invites").delete().eq("id", props.id);
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
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("Events")
        .select()
        .eq("id", props.event_id);
      setEvent(data);
    };
    fetchEvent();
  }, []);

  if (sender && event) {
    return (
      <CardContainer>
        <Email>{sender[0].email}</Email>
        <Title>{event[0].title}</Title>
        <Date>{event[0].date}</Date>
        <Time>{event[0].time}</Time>
        <AcceptButton onClick={acceptInvite}>Accept</AcceptButton>
        <DeclineButton onClick={declineInvite}>Decline</DeclineButton>
      </CardContainer>
    );
  } else {
    return <p>Loading...</p>;
  }
}
