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
import react, { useState } from "react";
import DatePicker from "react-datepicker";
import classNames from "classnames";
import { useCallback } from "react";

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

const events = [
  {
    id: 1,
    title: "Cool Event",
    start: new Date(2023, 9, 10),
    end: new Date(2023, 9, 10),
    eventColor: "orange",
  },
  {
    id: 2,
    title: "Another Event",
    start: new Date(2023, 9, 5),
    end: new Date(2023, 9, 5),
    eventColor: "blue",
  },
];

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
  const [calendarView, setView] = useState(true);

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

  if (!calendarView) {
    return (
      <>
        <HomeHeader></HomeHeader>
        <div>asd</div>
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
              <img src="icons/arrow.svg" width="20px" alt="Next Month" style={{ transform: 'rotate(90deg)' }} />
              </button>
              <div className="w-60 text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  {formattedDate}
                </h1>
              </div>
              <button onClick={handleNextMonth} className="">
                <img src="icons/arrow.svg" width="20px" alt="Next Month" style={{ transform: 'rotate(270deg)' }} />
              </button>
            </div>

            <Calendar
              localizer={localizer}
              events={events}
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
}
