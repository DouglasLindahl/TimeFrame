"use client";
import { useState } from "react";
import HomeHeader from "@/components/header/page";
import Navbar from "@/components/navbar/page";
import { supabase } from "../../../../supabase";
import styled from "styled-components";

const Container = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
const FormContainer = styled.div`
  margin: 2rem auto;
  width: 100%;
  padding: 0 1rem;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
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
    background-color: #3182ce;
    color: white;
    padding: 0.5rem 0;
    border-radius: 0.25rem;
    margin-top: 1rem;
    cursor: pointer;

    &:hover {
      background-color: #4299e1;
    }
  }
`;

const StyledInput = styled.input`
  height: 2.5rem;
`;

const StyledTextArea = styled.textarea`
  min-height: 3rem;
`;

const StyledSelect = styled.select`
  height: 2.5rem;
`;

export default function AddEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("Events").insert({
      title: title,
      description: description,
      date: date,
      time: time,
      color: color,
      user_uuid: user.id,
    });

    console.log("Submitted:", { title, description, date, time, color });
  };

  return (
    <Container>
      <HomeHeader header={"home"}></HomeHeader>
      <FormContainer>
        <Title>Add Event</Title>
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
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
          <div className="mb-4">
            <label htmlFor="description">Description</label>
            <StyledTextArea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            ></StyledTextArea>
          </div>
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="mb-4">
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
      <Navbar navbar="home"></Navbar>
    </Container>
  );
}
