"use client";
import Image from "next/image";
import HomeHeader from "@/components/header/page";
import Navbar from "@/components/navbar/page";
import { supabase } from "../../../../supabase";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import { startOfWeek, getDay, addDays } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import react, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import classNames from "classnames";
import { useCallback } from "react";
import EventCard from "@/components/eventCard/page";
import { Swipeable, useSwipeable } from "react-swipeable";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { GraphQLClient, ClientContext } from 'graphql-hooks';
import { useQuery } from 'graphql-hooks';

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

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => {
    const dayOfWeek = getDay(date);
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return addDays(date, -diff);
  },
  getDay,
  locales,
});

const eventStyle = (event, start, end, isSelected) => {
  const style = {
    backgroundColor: event.eventColor,
    opacity: 0.8,
    color: "white",
    fontWeight: "bold",
  };
  return {
    style,
  };
};

const calendarStyle = () => {
  return {
    height: "100%",
  };
};


const CardsContainer = styled.section`
height: 100vh;
display: flex;
flex-direction: column;
background-color: ${(props) => props.backgroundcolor};
`;

const CardsContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  overflow-y: auto;
`;

const CalendarSection = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.backgroundcolor};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 1rem;
`;

const DateContainer = styled.div`
  width: 180px;
  text-align: center;
`;

const DateText = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${(props) => props.textColor};
`;

const CalendarContainer = styled.div`
  flex: 1;
  height: 100%;
`;

export default function Home() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setView] = useState(false);
  const [events, setEvents] = useState("");
  const [formattedEvents, setFormattedEvents] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [user, setUser] = useState("");
  const [session, setSession] = useState(false);

  const { data, loading, error } = useQuery(COLOR_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || '303030';
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || '303030';
  const textColor = data?.main?.textColor?.hex || '303030';
  const offDayText = data?.main?.offDayText?.hex || '303030';
  const offDay = data?.main?.offDay?.hex || '303030';
  const currentDay = data?.main?.currentDay?.hex || '303030';
  const currentDayText = data?.main?.currentDayText?.hex || '303030';


  // Dynamically generate CSS for your calendar styles
  const dynamicStyles = `
    .rbc-today {
      background-color: ${currentDay} !important;
    }
    .rbc-current{
      color: ${currentDayText} !important;
    }
    .rbc-off-range-bg {
      background-color: ${offDay} !important;
    }
    .rbc-month-view {
      color: ${textColor} !important;
      border: none !important;
    }
    .rbc-header {
      border: none !important;
    }
    .rbc-month-row {
      border: none !important;
    }
    .rbc-off-range {
      color: ${offDayText} !important;
    }
    .rbc-day-bg {
      border: none !important;
      background-color: #303030;
      border-radius: 5px;
      margin: 2px;
    }
  `;
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = dynamicStyles;
  document.head.appendChild(styleSheet);



  useEffect(() => {
    const checkUserSession = async () => {
      const session = supabase.auth.getSession();
      if (session) {
        if ((await session).data.session == null) {
          router.push("/login");
        } else {
          setSession(true);
        }
      }
    };
    checkUserSession();
  }, [router]);

  function goToSinglePage(event) {
    const eventId = event.id;
    router.push(`singleEvent/${[eventId]}?id=${eventId}`);
  }

  useEffect(() => {
    if (session) {
      const fetchUserInfo = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("UserInfo")
          .select()
          .eq("user_uuid", user.id);

        setUserInfo(data);
        setView(data[0].prefers_calendar);
      };
      fetchUserInfo();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      const fetchEvents = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("Events")
          .select()
          .eq("user_uuid", user.id)
          .order(["date", "time"]);

        setEvents(data);
      };
      fetchEvents();
    }
  }, [session]);

  useEffect(() => {
    const reformatEvents = () => {
      if (events) {
        const formattedEvents = events.map((event) => {
          const eventDate = event.date;
          const eventTime = event.time;

          const dateParts = eventDate.split("-");
          const timeParts = eventTime.split(":");

          const startDate = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2]),
            parseInt(timeParts[0]),
            parseInt(timeParts[1])
          );

          const endDate = new Date(startDate);

          return {
            id: event.id,
            title: event.title,
            description: event.description,
            start: startDate,
            end: endDate,
            eventColor: event.color,
          };
        });

        setFormattedEvents(formattedEvents);
      }
    };
    reformatEvents();
  }, [events]);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextMonth(),
    onSwipedRight: () => handlePreviousMonth(),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleNextMonth = () => {
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonthDate);
  };
  const handlePreviousMonth = () => {
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(nextMonthDate);
  };

  const handleDateClick = (date, view, e) => {
    // Do nothing when a date is clicked
  };

  const onNavigate = useCallback((date) => {
    const fullMonth = getStartAndEndDate(date);
    setSelectedMonth(fullMonth);
  }, []);

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  let cardsComponent = null;
  if (Array.isArray(events)) {
    cardsComponent = events.map((event) => (
      <EventCard
        key={event.id}
        id={event.id}
        title={event.title}
        description={event.description}
        date={event.date}
        time={event.time}
        color={event.color}
      />
    ));
  }

  if (events) {
    if (!calendarView) {
      return (
        <>
          <CardsContainer backgroundcolor={backgroundPrimary}>
            <HomeHeader header="home" />
            <CardsContent>{cardsComponent}</CardsContent>
            <Navbar navbar="home" view={calendarView} setView={setView} />
          </CardsContainer>
        </>
      );
    } else if (calendarView) {
      return (
        <>
          <CalendarSection backgroundcolor={backgroundPrimary}>
            <HomeHeader header="home" />
            <ButtonContainer>
              <Button onClick={handlePreviousMonth}>
                <img
                  src="/icons/arrowWhite.svg"
                  width="20px"
                  alt="Next Month"
                  style={{ transform: "rotate(90deg)" }}
                />
              </Button>
              <DateContainer>
                <DateText textColor={textColor}>{formattedDate}</DateText>
              </DateContainer>
              <Button onClick={handleNextMonth}>
                <img
                  src="/icons/arrowWhite.svg"
                  width="20px"
                  alt="Next Month"
                  style={{ transform: "rotate(270deg)" }}
                />
              </Button>
            </ButtonContainer>
            <CalendarContainer>
              <Calendar
                localizer={localizer}
                events={formattedEvents}
                startAccessor="start"
                endAccessor="end"
                toolbar={false}
                eventPropGetter={eventStyle}
                onSelectEvent={goToSinglePage}
                date={currentDate}
                onNavigate={handleDateClick}
              />
            </CalendarContainer>
            <Navbar navbar="home" view={calendarView} setView={setView} />
          </CalendarSection>
        </>
      );
    }
  } else {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }
}
