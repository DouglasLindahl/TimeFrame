"use client";
import Image from "next/image";
import HomeHeader from "@/components/homeHeader/page";
import Navbar from "@/components/navbar/page";
import { supabase } from "../../../supabase";
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
    borderColor: "border-black",
    borderRadius: "5px",
    opacity: 0.8,
    color: "text-black",
    fontWeight: "bold",
  };
  return {
    style,
  };
};

const calendarStyle = () => {
  return {
    height: 550,
  };
};

function handleClick(event) {
  const eventId = event.id;
  console.log(`Clicked on event with id: ${eventId}`);
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setView] = useState(false);
  const [events, setEvents] = useState("");
  const [formattedEvents, setFormattedEvents] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("Events").select();
      setEvents(data);
      console.log(data);
    };
    fetchEvents();
  }, []);

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
      />
    ));
  }

  if (events) {
    if (!calendarView) {
      return (
        <>
          <HomeHeader></HomeHeader>
          <div className="flex flex-col gap-4 py-4 px-2">{cardsComponent}</div>
          <Navbar view={calendarView} setView={setView}></Navbar>
        </>
      );
    } else if (calendarView) {
      return (
        <>
          <HomeHeader></HomeHeader>
          <div className="bg-gray-100 min-h-screen py-4">
            <div className="w-full">
              <div className="flex justify-center items-center mb-4">
                <button onClick={handlePreviousMonth} className="">
                  <img
                    src="icons/arrow.svg"
                    width="20px"
                    alt="Next Month"
                    style={{ transform: "rotate(90deg)" }}
                  />
                </button>
                <div className="w-60 text-center">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {formattedDate}
                  </h1>
                </div>
                <button onClick={handleNextMonth} className="">
                  <img
                    src="icons/arrow.svg"
                    width="20px"
                    alt="Next Month"
                    style={{ transform: "rotate(270deg)" }}
                  />
                </button>
              </div>

              <Calendar
                localizer={localizer}
                events={formattedEvents}
                startAccessor={"start"}
                endAccessor={"end"}
                style={calendarStyle()}
                toolbar={false}
                eventPropGetter={eventStyle}
                onSelectEvent={handleClick}
                onNavigate={onNavigate}
                date={currentDate}
              />
            </div>
          </div>
          <Navbar view={calendarView} setView={setView}></Navbar>
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
