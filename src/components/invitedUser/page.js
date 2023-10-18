import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";

export default function InvitedUser(props) {
  const [invitedUserInfo, setInvitedUserInfo] = useState("");
  useEffect(() => {
    async function fetchInvitedUserInfo() {
      const { data, error } = await supabase
        .from("UserInfo")
        .select()
        .eq("user_uuid", props.receiver);
      setInvitedUserInfo(data);
    }
    fetchInvitedUserInfo();
  }, []);

  if(invitedUserInfo)
  {
      return (
          <>
      <h1>
        Invited: {invitedUserInfo[0].username}
      </h1>
        Status: {props.status}
    </>
  );
}
}
