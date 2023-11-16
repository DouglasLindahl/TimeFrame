"use client";
import Header from "@/components/header/page";
import Navbar from "@/components/navbar/page";
import { supabase } from "../../../../../supabase";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import { startOfWeek, getDay, addDays } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import react, { useEffect, useState } from "react";
import { useCallback } from "react";
import EventCard from "@/components/eventCard/page";
import { Swipeable, useSwipeable } from "react-swipeable";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { GraphQLClient, ClientContext } from "graphql-hooks";
import { useQuery } from "graphql-hooks";

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

const PageContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.backgroundcolor};
  color: white;
`;

const InfoContainer = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  overflow-y: auto;
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

const GroupUsersWindow = styled.div`
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: ${({ isopen }) => (isopen ? "flex" : "none")};
  flex-direction: column;
  color: white;
  background-color: orange;
  padding: 16px;
  border-radius: 16px;
`;

const DateContainer = styled.div`
  width: 180px;
  text-align: center;
`;

const DateText = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${(props) => props.textcolor};
`;

const CalendarContainer = styled.div`
  flex: 1;
  height: 100%;
`;

export default function singleGrouo(id) {
  const router = useRouter();
  const [groupId, setGroupId] = useState("");
  const [date, setDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dates, setDates] = useState("");
  const [formattedDates, setFormattedDates] = useState("");
  const [invitedUser, setInvitedUser] = useState("");
  const [groupCount, setGroupCount] = useState("");
  const [isOwner, setIsOwner] = useState("");
  const [isGroupUsersWindowOpen, setIsGroupUsersWindowOpen] = useState(false);

  const { data, loading, error } = useQuery(COLOR_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const textColor = data?.main?.textColor?.hex || "303030";
  const offDayText = data?.main?.offDayText?.hex || "303030";
  const offDay = data?.main?.offDay?.hex || "303030";
  const currentDay = data?.main?.currentDay?.hex || "303030";
  const currentDayText = data?.main?.currentDayText?.hex || "303030";

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
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = dynamicStyles;
  document.head.appendChild(styleSheet);

  useEffect(() => {
    const setId = async () => {
      const data = id.params.slug;
      setGroupId(data);
    };
    setId();
  });

  useEffect(() => {
    const checkOwner = async () => {
      if (groupId) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
          .from("Groups")
          .select()
          .eq("id", groupId);
        if (data[0].owner_uuid == user.id) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      }
    };
    checkOwner();
  }, [groupId]);

  const eventStyle = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: `#6C63FF`,
      opacity: 0.8,
      color: "white",
      fontWeight: "bold",
    };
    return {
      style,
    };
  };

  useEffect(() => {
    const getGroupCount = async () => {
      const { data, error } = await supabase
        .from("GroupUsers")
        .select()
        .eq("group_id", groupId);
      setGroupCount(data);
    };
    getGroupCount();
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      const getDates = async () => {
        const { data, error } = await supabase
          .from("GroupDates")
          .select()
          .eq("group_id", groupId);
        const groupedDates = {};

        if (data) {
          data.forEach((date) => {
            const formattedDate = date.date;
            if (groupedDates[formattedDate]) {
              groupedDates[formattedDate].count += 1;
            } else {
              groupedDates[formattedDate] = {
                count: 1,
                date: formattedDate,
              };
            }
          });
        }
        setDates(groupedDates);
      };
      getDates();
    }
  }, [groupId]);

  const showGroupUsers = async () => {
    setIsGroupUsersWindowOpen(!isGroupUsersWindowOpen);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (invitedUser) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("UserInfo")
        .select()
        .eq("username", invitedUser);

      if (data.length > 0) {
        const {} = await supabase.from("GroupInvites").insert({
          sender_uuid: user.id,
          receiver_uuid: data[0].user_uuid,
          group_id: groupId,
          status: "pending",
        });
      }
    }
  };

  useEffect(() => {
    const reformatDates = () => {
      if (dates && groupCount) {
        const formattedDates = Object.values(dates).map((groupedDate) => {
          const startDate = parse(groupedDate.date, "yyyy-MM-dd", new Date());
          const endDate = new Date(startDate);
          const eventTitle = `${groupedDate.count} / ${groupCount.length}`;

          return {
            id: groupedDate.date,
            title: eventTitle,
            start: startDate,
            end: endDate,
          };
        });

        setFormattedDates(formattedDates);
      }
    };

    reformatDates();
  }, [dates]);

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

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const handleDateClick = (date, view, e) => {
    // Do nothing when a date is clicked
  };

  const leaveGroup = async () => {
    //check user id
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    //check group id (groupId)

    //if not owner
    if (!isOwner) {
      //from GroupUsers delete where user_uuid = id
      const {} = await supabase
        .from("GroupUsers")
        .delete()
        .eq("user_uuid", user.id);
      //from GroupDates delete where user_uuid = id

      const {} = await supabase
        .from("GroupDates")
        .delete()
        .eq("user_uuid", user.id);
    }
    //if owner
    else if(isOwner)
    {
      //from GroupUsers delete where group_id = group id
      const {} = await supabase
      .from("GroupUsers")
      .delete()
      .eq("group_id", groupId);
      //from GroupDates delete where group_id = group id
      const {} = await supabase
      .from("GroupDates")
      .delete()
      .eq("group_id", groupId);
      //from Groups delete where id = group id
      const {} = await supabase
      .from("Groups")
      .delete()
      .eq("id", groupId);
    }
    router.push(`/authenticated/groups`);
  };

  const addDate = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("GroupDates")
      .insert({ group_id: groupId, user_uuid: user.id, date: date });
  };

  if (groupId) {
    return (
      <PageContainer backgroundcolor={backgroundPrimary}>
        <Header header="home"></Header>
        <InfoContainer>
          <GroupUsersWindow isopen={isGroupUsersWindowOpen}>
            <div>
              <p>Douglas</p>
            </div>
            <div>
              <p>Noel</p>
            </div>
            <div>
              <p>TimeFrame</p>
            </div>
            <form>
              <p>Invite:</p>
              <input
                type="text"
                id="inviteUser"
                name="inviteUser"
                onChange={(e) => setInvitedUser(e.target.value)}
              />
              <button onClick={handleInvite}>Submit</button>
            </form>
          </GroupUsersWindow>
          <form>
            <input type="date" onChange={(e) => setDate(e.target.value)} />
            <button onClick={addDate}>Submit</button>
          </form>
          <ButtonContainer>
            <Button onClick={handlePreviousMonth}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 10"
                transform="rotate(90)"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 9.27502L0.5 1.77502L1.55 0.725025L8 7.17502L14.45 0.725025L15.5 1.77502L8 9.27502Z"
                  fill={textColor}
                />
              </svg>
            </Button>
            <DateContainer>
              <DateText textcolor={textColor}>{formattedDate}</DateText>
            </DateContainer>
            <Button onClick={handleNextMonth}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 10"
                transform="rotate(270)"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 9.27502L0.5 1.77502L1.55 0.725025L8 7.17502L14.45 0.725025L15.5 1.77502L8 9.27502Z"
                  fill={textColor}
                />
              </svg>
            </Button>
          </ButtonContainer>
          <CalendarContainer {...handlers}>
            <Calendar
              localizer={localizer}
              events={formattedDates}
              startAccessor="start"
              endAccessor="end"
              toolbar={false}
              eventPropGetter={eventStyle}
              // onSelectEvent={goToSinglePage}
              date={currentDate}
              onNavigate={handleDateClick}
            />
          </CalendarContainer>
        </InfoContainer>
        <Navbar
          navbar="singleGroup"
          isOwner={isOwner}
          showGroupUsers={showGroupUsers}
          isUsersPageOpen={isGroupUsersWindowOpen}
          setUsersPageOpen={setIsGroupUsersWindowOpen}
          leaveGroup={leaveGroup}
        ></Navbar>
      </PageContainer>
    );
  } else {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }
}
