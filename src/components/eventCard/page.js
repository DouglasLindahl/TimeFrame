"use client";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const EventContainer = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: space-between;
  background-color: #303030;
  color: white;
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
  color: white;
`;

const Time = styled.p`
font-size: 24px;
`;


export default function EventCard(props) {
  const ColorStripe = styled.div`
  position: absolute;
  right: 0px;
  bottom: -25px;
  width: 18px;
  height: 100px;
  transform: rotate(45deg);
  background-color: ${props.color};
`;
  const router = useRouter();

  function redirectToSingleEvent() {
    router.push(`/authenticated/singleEvent/${[props.id]}?id=${props.id}`);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const isCurrentDate = isToday(date);
    const dateClassName = isCurrentDate ? "text-xl font-bold bg-primary-dark" : "text-xl";

    return (
      <EventContainer
        onClick={redirectToSingleEvent}
      >
        <ColorStripeContainer>
          <ColorStripe></ColorStripe>
        </ColorStripeContainer>
        <InfoSection>
          <Title>{props.title}</Title>
          <p className={dateClassName}>{`${day} ${month}`}</p>
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
