"use client";
import { supabase } from "../../../supabase";
import { useState, useEffect } from "react";

export default function InviteCard(props) {
  const [sender, setSender] = useState("");
  const [event, setEvent] = useState("");

  useEffect(() => {
    const fetchSender = async () => {
      const { data, error } = await supabase
        .from("UserInfo")
        .select()
        .eq("user_uuid", props.sender);
      setSender(data);
    };
    fetchSender();
  }, []);
  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("Events")
        .select()
        .eq("id", props.event_id);
      setEvent(data);
    };
    fetchEvent();
  }, []);

  if (sender && event) {
    return (
      <>
        <p>{sender[0].email}</p>
        <h1>{event[0].title}</h1>
        <p>{event[0].date}</p>
        <p>{event[0].time}</p>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
