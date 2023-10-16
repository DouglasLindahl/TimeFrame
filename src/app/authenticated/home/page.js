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
  background-color: #202020;
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
  background-color: #202020;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
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
  color: white;
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
    console.log(`Clicked on event with id: ${eventId}`);
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
    console.log(currentDate);
  };
  const handlePreviousMonth = () => {
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(nextMonthDate);
    console.log(currentDate);
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
          <CardsContainer>
            <HomeHeader header="home" />
            <CardsContent>{cardsComponent}</CardsContent>
            <Navbar navbar="home" view={calendarView} setView={setView} />
          </CardsContainer>
        </>
      );
    } else if (calendarView) {
      return (
        <>
          <CalendarSection>
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
                <DateText>{formattedDate}</DateText>
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
                style={calendarStyle()}
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
