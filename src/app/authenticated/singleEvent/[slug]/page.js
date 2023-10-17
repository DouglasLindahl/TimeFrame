"use client";
import { supabase } from "../../../../../supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeHeader from "@/components/header/page";
import Navbar from "@/components/navbar/page";
import styled from "styled-components";
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
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${(props) => props.textcolor};
  }

  input,
  textarea {
    margin-top: 0.25rem;
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    outline: none;
    transition: border 0.2s;

    &:focus {
      border: 1px solid #63b3ed;
    }
  }

  textarea {
    resize: vertical;
  }

  button {
    width: 100%;
    background-color: ${(props) => props.backgroundcolor};
    color: white;
    padding: 0.5rem 0;
    border-radius: 0.25rem;
    margin-top: 1rem;
    cursor: pointer;

    &:hover {
    }
  }
`;

const StyledInput = styled.input`
  height: 2.5rem;
`;

const StyledTextArea = styled.textarea`
  min-height: 3rem;
`;

const InviteForm = styled.form`
  color: white;
  input,
  textarea {
    margin-top: 0.25rem;
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    outline: none;
    transition: border 0.2s;
    color: black;
  }
`;

const Slug = (id) => {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState("");
  const [invitedUser, setInvitedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const { data, error } = useQuery(COLOR_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const textColor = data?.main?.textColor?.hex || "303030";

  const handleInvite = async (e) => {
    e.preventDefault();
    if(invitedUser)
    {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("UserInfo")
        .select()
        .eq("email", invitedUser);

        if(data.length > 0)
        {
          const {} = await supabase.from("Invites").insert({
            sender_uuid: user.id,
            receiver_uuid: data[0].user_uuid,
            event_id: event.id,
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    return { day, month };
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (authenticated) {
    if (event && event.id) {
      return (
        <PageContainer backgroundcolor={backgroundPrimary}>
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
                backgroundcolor={backgroundSecondary}
                onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="title">Title</label>
                  <StyledInput
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <StyledTextArea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></StyledTextArea>
                </div>
                <div>
                  <label htmlFor="date">Date</label>
                  <StyledInput
                    type="date"
                    id="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time">Time</label>
                  <StyledInput
                    type="time"
                    id="time"
                    name="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="color">Color</label>
                  <StyledInput
                    type="color"
                    id="color"
                    name="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Submit</button>
              </Form>
            </FormContainer>
            <InviteForm onSubmit={handleInvite}>
              <div>
                <label htmlFor="inviteUser">Invite</label>
                <StyledInput
                  type="text"
                  id="inviteUser"
                  name="inviteUser"
                  onChange={(e) => setInvitedUser(e.target.value)}
                />
              </div>
              <button type="submit">Submit</button>
            </InviteForm>
          </Content>
          <Navbar navbar="singlePage" id={event.id}></Navbar>
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
