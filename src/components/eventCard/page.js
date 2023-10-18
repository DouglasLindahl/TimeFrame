"use client";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useQuery } from 'graphql-hooks';
import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";

const COLOR_QUERY = `
query{
  main {
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
  }
}
`;

const EventContainer = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: space-between;
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 5px 10px 5px #101010;
`;

const ColorStripeContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
`;

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const Title = styled.h1`
  font-size: 30px;
  text-align: left;
  display: flex;
  flex-direction: row;
  p{
    font-size: 18px;
  }
`;

const Time = styled.p`
font-size: 24px;
`;
const ColorStripe = styled.div`
position: absolute;
right: 0px;
bottom: -25px;
width: 18px;
height: 100px;
transform: rotate(45deg);
background-color: ${(props) => props.color};
`;


export default function EventCard(props) {
  const router = useRouter();
  const { data, loading, error } = useQuery(COLOR_QUERY);
  const [invitedUsers, setInvitedUsers] = useState("");

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || '303030';
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || '303030';
  const textColor = data?.main?.textColor?.hex || '303030';

  useEffect(() => {
    async function fetchInvitedUsers() {
      const { data, error } = await supabase
        .from("Invites")
        .select()
        .eq("event_id", props.id)
        .eq("status", "accepted");
      setInvitedUsers(data);
    }
    fetchInvitedUsers();
  }, []);
  
  function redirectToSingleEvent() {
    router.push(`/authenticated/singleEvent/${[props.id]}?id=${props.id}`);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });

    return (
      <EventContainer
        backgroundcolor={backgroundSecondary}
        textcolor={textColor}
        onClick={redirectToSingleEvent}
      >
        <ColorStripeContainer>
          <ColorStripe color={props.color}></ColorStripe>
        </ColorStripeContainer>
        <InfoSection>
          <Title>{props.title}
          {invitedUsers.length > 0 && (
            <p>(+{invitedUsers.length})</p>
          )}
          </Title>
          <p>{`${day} ${month}`}</p>
        </InfoSection>
        <InfoSection>
          <Time>{props.time.slice(0, 5)}</Time>
        </InfoSection>
      </EventContainer>
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return formatDate(props.date);
}
