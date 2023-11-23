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

const DateInfo = styled.div`
  z-index: 10;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 16px;
  max-height: 200px;
  width: 200px;
  border-radius: 8px;
  background-color: #303030;
  overflow-y: auto;
  color: white;
  box-shadow: 0 2px 4px #101010;
  p {
    font-size: 24px;
  }
`;

const ExitButton = styled.button`
  background-color: red;
  height: 20px;
  width: 20px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 4px;
  border-radius: 100%;
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
  background-color: #202020;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 4px #101010;
  p {
    margin-left: 8px;
    padding-bottom: 4px;
  }
  form {
    input {
      background-color: #303030;
      padding: 4px 8px;
      border-radius: 8px;
      box-shadow: 0 2px 4px #101010;
    }
    ::placeholder {
      color: white;
    }
    button {
      padding: 4px 8px;
      border-radius: 16px;
      background-color: #6c63ff;
      margin-left: 8px;
    }
  }
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
  const [dateInfoOpen, setDateInfoOpen] = useState("");
  const [usernamesWithIds, setUsernamesWithIds] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);
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

  const closeDateInfo = () => {
    setDateInfoOpen(false);
  };
  const closeGroupUsersWindow = () => {
    setIsGroupUsersWindowOpen(false);
  }

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
    if (groupId) {
      const getGroupCount = async () => {
        const { data, error } = await supabase
          .from("GroupUsers")
          .select()
          .eq("group_id", groupId);
        setGroupCount(data);
      };
      getGroupCount();
    }
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
    setDateInfoOpen(false);
  
    try {
      // Fetch users belonging to the group
      const { data: groupUsers, error: groupUsersError } = await supabase
        .from("GroupUsers")
        .select("user_uuid")
        .eq("group_id", groupId);
  
      if (groupUsersError) {
        throw groupUsersError;
      }
  
      const userUUIDs = groupUsers.map((user) => user.user_uuid);
  
      // Fetch user information from UserInfo using user_uuids
      const { data: usersInfo, error: usersInfoError } = await supabase
        .from("UserInfo")
        .select()
        .in("user_uuid", userUUIDs);
  
      if (usersInfoError) {
        throw usersInfoError;
      }
  
      // Display usernames of the fetched users
      const usernames = usersInfo.map((user) => user.username);
      console.log(usernames); // Check if you're getting the usernames correctly
      setGroupUsers(usernames);

      // You can set the fetched usernames to a state or variable for rendering in the UI
    } catch (error) {
      console.error("Error fetching group users:", error);
      // Handle error state or error display here
    }
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

  const openDateInfo = async (event) => {
    const eventId = event.id;

    try {
      const { data: groupDates, error: groupDatesError } = await supabase
        .from("GroupDates")
        .select("user_uuid")
        .eq("date", eventId);

      if (groupDatesError) {
        throw groupDatesError;
      }

      const userUUIDs = groupDates.map((date) => date.user_uuid);

      const { data: usersInfo, error: usersInfoError } = await supabase
        .from("UserInfo")
        .select()
        .in("user_uuid", userUUIDs);

      if (usersInfoError) {
        throw usersInfoError;
      }

      const usernamesAndIds = usersInfo.map((user) => ({
        username: user.username,
        user_uuid: user.user_uuid,
      }));
      console.log(usernamesAndIds);
      setUsernamesWithIds(usernamesAndIds);
      setDateInfoOpen(true);
      setIsGroupUsersWindowOpen(false);
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
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
    else if (isOwner) {
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
      const {} = await supabase.from("Groups").delete().eq("id", groupId);
    }
    router.push(`/authenticated/groups`);
  };

  const addDate = async (e) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Check if the date already exists for the user and group
      const { data: existingDate, error: dateError } = await supabase
        .from("GroupDates")
        .select()
        .eq("group_id", groupId)
        .eq("user_uuid", user.id)
        .eq("date", date);

      if (existingDate && existingDate.length > 0) {
        // Date already exists for this user in the group
        // Handle this case, such as showing an error message
        console.log("Date already exists for this user in the group");
      } else {
        // Date doesn't exist, insert the new date
        const { error } = await supabase
          .from("GroupDates")
          .insert({ group_id: groupId, user_uuid: user.id, date: date });

        if (error) {
          // Handle insertion error
          console.error("Error inserting date:", error);
        } else {
          // Refresh the page after successful insertion
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error adding date:", error);
    }
  };

  if (groupId) {
    return (
      <PageContainer backgroundcolor={backgroundPrimary}>
        <Header header="home"></Header>
        {dateInfoOpen && (
          <DateInfo>
            <ExitButton onClick={closeDateInfo}>
              <svg
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.271 8.72827L17.4565 1.54272L15.9138 0L8.72827 7.18555L1.54272 0L0 1.54272L7.18555 8.72827L0 15.9138L1.54272 17.4565L8.72827 10.271L15.9138 17.4565L17.4565 15.9138L10.271 8.72827Z"
                  fill="white"
                />
              </svg>
            </ExitButton>
            {usernamesWithIds.map((userInfo, index) => (
              <p key={index}>{userInfo.username}</p>
            ))}
          </DateInfo>
        )}
        <InfoContainer>
          <GroupUsersWindow isopen={isGroupUsersWindowOpen}>
            <ExitButton onClick={closeGroupUsersWindow}>
              <svg
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.271 8.72827L17.4565 1.54272L15.9138 0L8.72827 7.18555L1.54272 0L0 1.54272L7.18555 8.72827L0 15.9138L1.54272 17.4565L8.72827 10.271L15.9138 17.4565L17.4565 15.9138L10.271 8.72827Z"
                  fill="white"
                />
              </svg>
            </ExitButton>
            {groupUsers.map((user, index) => (
              <p key={index}>{user}</p>
            ))}
            <form>
              <input
                type="text"
                id="inviteUser"
                name="inviteUser"
                placeholder="Username"
                onChange={(e) => setInvitedUser(e.target.value)}
              />
              <button onClick={handleInvite}>Invite</button>
            </form>
          </GroupUsersWindow>
          <form>
            <input type="date" onChange={(e) => setDate(e.target.value)} />
          </form>
          <button onClick={addDate}>Submit</button>
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
            {formattedDates && (
              <Calendar
                localizer={localizer}
                events={formattedDates}
                startAccessor="start"
                endAccessor="end"
                toolbar={false}
                eventPropGetter={eventStyle}
                onSelectEvent={openDateInfo}
                onView={openDateInfo}
                date={currentDate}
                onNavigate={handleDateClick}
              />
            )}
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
