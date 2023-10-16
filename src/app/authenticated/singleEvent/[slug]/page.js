"use client";
import { supabase } from "../../../../../supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeHeader from "@/components/header/page";
import Navbar from "@/components/navbar/page";
import styled from "styled-components";

const PageContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #202020;
`;

const EventContainer = styled.section`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
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
  color: var(--text);
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
    color: #606060;
  }

  input,
  textarea,
  select {
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
    background-color: black;
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


const Slug = (id) => {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (event && event.id) {
    return (
      <PageContainer>
        <HomeHeader header="home" />
        <Content>
          <EventContainer>
            <EventTitleContainer>
              <EventTitle>{event.title}</EventTitle>
              <EventDate>
                {formatDate(event.date).day} {formatDate(event.date).month}
              </EventDate>
            </EventTitleContainer>
            <EventTime>{event.time.slice(0, 5)}</EventTime>
          </EventContainer>
          <FormContainer>
            <Form onSubmit={handleSubmit}>
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
        </Content>
        <Navbar navbar="singlePage" id={event.id}></Navbar>
      </PageContainer>
    );
  }
};

export default Slug;