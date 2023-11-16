"use client";
import { useState } from "react";
import HomeHeader from "@/components/header/page";
import Navbar from "@/components/navbar/page";
import { supabase } from "../../../../supabase";
import styled from "styled-components";
import { useQuery } from "graphql-hooks";
import { useRouter } from "next/navigation";

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

const Container = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
`;
const FormContainer = styled.div`
  width: 100%;
  padding: 16px;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Form = styled.form`
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
  input[type="color"]
  {
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

const StyledSelect = styled.select`
  height: 2.5rem;
`;

export default function AddEvent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState("");

  const { data, loading, error } = useQuery(COLOR_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const primaryColor = data?.main?.primaryColor?.hex || "303030";
  const textColor = data?.main?.textColor?.hex || "303030";
  const shadowColor = data?.main?.shadowColor?.hex || "303030";

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
    router.push("/authenticated/home");
    console.log("Submitted:", { title, description, date, time, color });
  };

  return (
    <Container textcolor={textColor} backgroundcolor={backgroundPrimary}>
      <HomeHeader header={"singlePage"}></HomeHeader>
      <FormContainer>
        <Title>Create Event</Title>
        <Form
          textcolor={textColor}
          shadowcolor={shadowColor}
          backgroundcolor={backgroundPrimary}
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <StyledInput
              backgroundcolor={backgroundSecondary}
              placeholder="Title"
              type="text"
              id="title"
              name="title"
              value={title}
              maxLength={30}
              onChange={(e) => setTitle(e.target.value)}
              textcolor={backgroundPrimary}
              required
            />
          </div>
          <div className="mb-4">
            <StyledTextArea
              backgroundcolor={backgroundSecondary}
              placeholder="Description"
              id="description"
              name="description"
              value={description}
              maxLength={300}
              onChange={(e) => setDescription(e.target.value)}
              textcolor={backgroundPrimary}
              rows="4"
            ></StyledTextArea>
          </div>
          <div className="mb-4">
            <StyledInput
              type="date"
              id="date"
              name="date"
              backgroundcolor={backgroundSecondary}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              textcolor={backgroundPrimary}
              required
            />
          </div>
          <div className="mb-4">
            <StyledInput
              type="time"
              backgroundcolor={backgroundSecondary}
              id="time"
              name="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              textcolor={backgroundPrimary}
              required
            />
          </div>
          <div className="mb-4">
            <StyledInput
              type="color"
              backgroundcolor={backgroundSecondary}
              id="color"
              name="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              textcolor={backgroundPrimary}
              required
            />
          </div>
          <Button
            textcolor={textColor}
            backgroundcolor={backgroundSecondary}
            primary={primaryColor}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </FormContainer>
      <Navbar navbar="home"></Navbar>
    </Container>
  );
}
