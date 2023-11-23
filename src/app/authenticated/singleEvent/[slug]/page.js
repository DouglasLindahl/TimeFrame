"use client";
import { supabase } from "../../../../../supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeHeader from "@/components/header/page";
import Navbar from "@/components/navbar/page";
import styled from "styled-components";
import InvitedUser from "@/components/invitedUser/page";
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
    red{
      hex
    }
    green{
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

const PageContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${(props) => props.backgroundcolor};
`;

const EventContainer = styled.section`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.textcolor};
`;

const Content = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  overflow-y: auto;
`;

const EventTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EventTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

const EventDate = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

const EventTime = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

const FormContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
  }
  ::placeholder {
    color: ${(props) => props.textcolor};
  }

  input[type="text"],
  input[type="date"],
  input[type="time"],
  textarea,
  select {
    margin-top: 0.25rem;
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border 0.2s;
    color: ${(props) => props.textcolor};
    border: none;
    box-shadow: 5px 5px 5px ${(props) => props.shadowcolor};

    &:focus {
      border: 1px solid #63b3ed;
    }
  }
  input[type="color"] {
    margin-top: 0.25rem;
    width: 100%;
    border-radius: 8px;
    outline: none;
    color: ${(props) => props.textcolor};
    border: none;
    box-shadow: 5px 5px 5px ${(props) => props.shadowcolor};
    background-color: transparent;
  }

  textarea {
    resize: vertical;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: ${(props) => props.primary};
  color: ${(props) => props.textcolor};
  padding: 0.5rem 0;
  border-radius: 0.25rem;
  margin-top: 1rem;
  cursor: pointer;
`;

const StyledInput = styled.input`
  height: 2.5rem;
  color: ${(props) => props.textcolor};
  background-color: ${(props) => props.backgroundcolor};
`;

const StyledTextArea = styled.textarea`
  min-height: 3rem;
  color: ${(props) => props.textcolor};
  background-color: ${(props) => props.backgroundcolor};
`;

const ExitButton = styled.button`
  background-color: ${(props) => props.backgroundcolor};
  height: 20px;
  width: 20px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 4px;
  border-radius: 100%;
`;

const InviteForm = styled.form`
  color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  background-color: #202020;
  border-radius: 8px;
  padding: 16px;
  transform: translate(-50%, -50%);
  input,
  textarea {
    margin-top: 0.25rem;
    padding: 0.5rem;
    width: 100%;
    border-radius: 0.25rem;
    outline: none;
    transition: border 0.2s;
    box-shadow: 5px 5px 5px #101010;
    background-color: #303030;
    color: white;
  }
`;

const Slug = (id) => {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [invitedUsers, setInvitedUsers] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState("");
  const [invitedUser, setInvitedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const { data, error } = useQuery(COLOR_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const textColor = data?.main?.textColor?.hex || "303030";
  const primaryColor = data?.main?.primaryColor?.hex || "303030";
  const red = data?.main?.red?.hex || "303030";
  const green = data?.main?.green?.hex || "303030";
  const shadowColor = data?.main?.shadowColor?.hex || "303030";

  useEffect(() => {
    async function checkProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("UserInfo")
        .select()
        .eq("user_uuid", user.id);
      if (data.length > 0) {
        setUserProfile(data);
      }
    }
    checkProfile();
  }, []);

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
        const {} = await supabase.from("Invites").insert({
          sender_uuid: user.id,
          receiver_uuid: data[0].user_uuid,
          event_id: event.id,
          status: "pending",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("Events")
      .update({
        title: title,
        description: description,
        date: date,
        time: time,
        color: color,
      })
      .eq("id", event.id);
  };

  useEffect(() => {
    const setId = async () => {
      const data = id.params.slug;
      setEventId(data);
    };
    setId();
  }, [id]);

  useEffect(() => {
    const fetchEvent = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      const { data } = await supabase
        .from("Events")
        .select()
        .eq("id", id.params.slug);

      setEvent(data[0]);
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);
  useEffect(() => {
    const checkAuthentication = async () => {
      if (event && user) {
        if (event.user_uuid != user.id) {
          router.push("/authenticated/home");
        } else {
          setAuthenticated(true);
        }
      }
    };
    checkAuthentication();
  }, [event]);

  useEffect(() => {
    const updateInputFields = async () => {
      if (event) {
        setTitle(event.title);
        setDescription(event.description);
        setDate(event.date);
        setTime(event.time);
        setColor(event.color);
      }
    };
    updateInputFields();
  }, [event]);
  useEffect(() => {
    async function fetchInvitedUsers() {
      if (event) {
        const { data, error } = await supabase
          .from("Invites")
          .select()
          .eq("event_id", event.id);
        setInvitedUsers(data);
      }
    }
    fetchInvitedUsers();
  }, [event]);

  const closeInvitePage = () => {
    setInviteOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    return { day, month };
  };

  let invitedUsersComponent = null;
  if (Array.isArray(invitedUsers)) {
    invitedUsersComponent = invitedUsers.map((invitedUser) => (
      <InvitedUser
        key={invitedUser.id}
        receiver={invitedUser.receiver_uuid}
        status={invitedUser.status}
      />
    ));
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (authenticated) {
    if (event && event.id) {
      return (
        <PageContainer
          textcolor={textColor}
          backgroundcolor={backgroundPrimary}
        >
          <HomeHeader header="home" />
          <Content>
            <EventContainer textcolor={textColor}>
              <EventTitleContainer>
                <EventTitle>{event.title}</EventTitle>
                <EventDate>
                  {formatDate(event.date).day} {formatDate(event.date).month}
                </EventDate>
              </EventTitleContainer>
              <EventTime>{event.time.slice(0, 5)}</EventTime>
            </EventContainer>
            <FormContainer>
              <Form
                textcolor={textColor}
                shadowcolor={shadowColor}
                backgroundcolor={backgroundPrimary}
                onSubmit={handleSubmit}
              >
                <div>
                  <StyledInput
                    backgroundcolor={backgroundSecondary}
                    placeholder="Title"
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <StyledTextArea
                    backgroundcolor={backgroundSecondary}
                    placeholder="Description"
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></StyledTextArea>
                </div>
                <div>
                  <StyledInput
                    backgroundcolor={backgroundSecondary}
                    placeholder="Date"
                    type="date"
                    id="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <StyledInput
                    backgroundcolor={backgroundSecondary}
                    type="time"
                    placeholder="Time"
                    id="time"
                    name="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <StyledInput
                    backgroundcolor={backgroundSecondary}
                    placeholder="Color"
                    type="color"
                    id="color"
                    name="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  />
                </div>
                <Button             textcolor={textColor}
            backgroundcolor={backgroundSecondary}
            primary={primaryColor} type="submit">Update</Button>
              </Form>
            </FormContainer>
            {userProfile && (
              <section>
                {inviteOpen && (
                  <InviteForm onSubmit={handleInvite}>
                    <ExitButton backgroundcolor={red} onClick={closeInvitePage}>
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
                    <div>
                      <StyledInput
                        type="text"
                        id="inviteUser"
                        name="inviteUser"
                        onChange={(e) => setInvitedUser(e.target.value)}
                      />
                    </div>
                    <button type="submit">Submit</button>
                    <section className="text-white">
                      {invitedUsersComponent}
                    </section>
                  </InviteForm>
                )}
              </section>
            )}
            {!userProfile && (
              <>
                <h1 className="text-white">
                  Create a profile in order to invite friends to your events
                </h1>
                <Link className="text-white" href="/authenticated/settings">
                  - Create Profile -
                </Link>
              </>
            )}
          </Content>
          <Navbar
            navbar="singlePage"
            setInviteOpen={setInviteOpen}
            inviteOpen={inviteOpen}
            id={event.id}
          ></Navbar>
        </PageContainer>
      );
    }
  } else {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }
};

export default Slug;
