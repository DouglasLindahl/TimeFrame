"use client";
import Link from "next/link";
import { useEffect } from "react";
import { supabase } from "../../../supabase";
import { useState } from "react";

export default function Navbar(props) {
  const [userInfo, setUserInfo] = useState("");

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     const { error } = await supabase
  //     .from('UserInfo')
  //     .update({ prefers_calendar: props.view })
  //     .eq('user_uuid', user.id)

  //     setUserInfo(data);
  //     setView(data[0].prefers_calendar);
  //   };
  //   fetchUserInfo();
  // }, []);

  async function updateView(){
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
    .from('UserInfo')
    .update({ prefers_calendar: !props.view })
    .eq('user_uuid', user.id)
    props.setView(!props.view);
  }

  return (
    <div className="w-full text-white py-4 border-t-4 border-primary-dark">
      <div className="container mx-auto flex justify-center items-center">
        <button
          onClick={updateView}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-full mx-2"
        >
          Change View
        </button>
        <Link
          href="addEvent"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold w-14 h-14 flex items-center justify-center rounded-full"
        >
          +
        </Link>
      </div>
    </div>
  );
}
