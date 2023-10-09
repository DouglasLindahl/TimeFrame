"use client"
import { supabase } from "../../../supabase";
import { useRouter } from "next/navigation";
export default function Settings() {
    const router = useRouter();
  async function handleClick() {
    const { error } = await supabase.auth.signOut();
    router.push("/login");
  }
  return (
    <>
      <button onClick={handleClick}>Logout</button>
    </>
  );
}
