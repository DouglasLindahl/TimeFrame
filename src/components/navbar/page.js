"use client"
import Link from "next/link";
import { useEffect } from "react";
export default function Navbar(props) {

    const updateView = () => {
      if(props.view == true)
      {
        props.setView(false)
      }
      if(props.view == false)
      {
        props.setView(true)
      }
    };
    return (
      <div className="fixed bottom-0 left-0 w-full text-white py-4">
        <div className="container mx-auto flex justify-center items-center">
          <button onClick={updateView} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-full mx-2">
            Change View
          </button>
          <Link href="addEvent" className="bg-green-500 hover:bg-green-600 text-white font-semibold w-14 h-14 flex items-center justify-center rounded-full">
            +
          </Link>
        </div>
      </div>
    );
  }
  