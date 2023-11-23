"use client";
import { supabase } from "../../../supabase";
import { useState, useEffect } from "react";
import styled from "styled-components";

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

const CardContainer = styled.div`
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px ${(props) => props.shadowcolor};
  margin-bottom: 16px;
`;

const Email = styled.p`
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 16px;
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
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 16px;
`;
const Buttons = styled.div`
  display: flex;
  justify-content: left;
`;

const DeclineButton = styled.button`
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

export default function InviteCard(props) {
  const [sender, setSender] = useState("");
  const [event, setEvent] = useState("");

  const { data, loading, error } = useQuery(COLOR_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const textColor = data?.main?.textColor?.hex || "303030";
  const shadowColor = data?.main?.shadowColor?.hex || "303030";
  const red = data?.main?.red?.hex || "303030";
  const green = data?.main?.green?.hex || "303030";

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

    const {} = await supabase
      .from("Invites")
      .update({ status: "accepted" })
      .eq("id", props.id);
    props.setRerender(!props.rerender);
  }
  async function declineInvite() {
    const {} = await supabase
      .from("Invites")
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
      <CardContainer textcolor={textColor} shadowcolor={shadowColor} backgroundcolor={backgroundSecondary}>
        <Email>{sender[0].username}</Email>
        <Title>{event[0].title}</Title>
        <Date>{event[0].date}</Date>
        <Time>{event[0].time}</Time>
        <Buttons>
          <AcceptButton backgroundcolor={green} textcolor={textColor} onClick={acceptInvite}>Accept</AcceptButton>
          <DeclineButton backgroundcolor={red} textcolor={textColor} onClick={declineInvite}>Decline</DeclineButton>
        </Buttons>
      </CardContainer>
    );
  } else {
    return <p>Loading...</p>;
  }
}
