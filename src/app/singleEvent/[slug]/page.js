"use client";
import { supabase } from "../../../../supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeHeader from "@/components/homeHeader/page";


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
      .eq('id', event.id);
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

  useEffect(()=>{
    const updateInputFields = async()=>{
      if(event)
      {
        setTitle(event.title);
        setDescription(event.description);
        setDate(event.date);
        setTime(event.time);
        setColor(event.color);
      }
    }
    updateInputFields();
  },[event])



  if (loading) {
    return <p>Loading...</p>;
  }

  if (event && event.id) {
    return (
      <>
        <HomeHeader></HomeHeader>
        <section className="px-2 py-4 flex flex-col gap-8">
          <Link
            href="/home"
            className="flex items-center justify-center bg-primary-dark px-4 py-4 rounded-full cursor-pointer"
          >
            <img
              src="/icons/arrowWhite.svg"
              width="20px"
              alt="Return"
              style={{ transform: "rotate(90deg)" }}
            />
            <p className="text-white">Return</p>
          </Link>
          <div className="flex flex-col gap-4 pb-4 border-solid border-b-2 border-primary-dark">
            <h1 className="text-4xl font-semibold">{event.title}</h1>
            <p className="text-lg font-normal">{event.description}</p>
          </div>
          <div>
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-600"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-600"
            >
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-600"
            >
              Color
            </label>
            <input
              type="color"
              id="color"
              name="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
          </div>
        </section>
      </>
    );
  }
};

export default Slug;
