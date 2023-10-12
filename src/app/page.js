"use client"
import Image from "next/image";
import Header from "@/components/startHeader/page";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState("")

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(()=>{
    const loginUser = async () => {
      console.log(user);
    }
    if(user)
    {
      router.push(`/home`);
    }
  },[user])


  return (
    <>
      <Header></Header>
    </>
  );
}
