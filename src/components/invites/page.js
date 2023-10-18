import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import InviteCard from "../inviteCard/page";

export default function Invites() {
  const [invites, setInvites] = useState("");
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    const fetchInvites = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("Invites")
        .select()
        .eq("receiver_uuid", user.id)
        .eq("status", "pending");
      setInvites(data);
    };
    fetchInvites();
  }, [rerender]);



  let invitesComponent = null;
  if (Array.isArray(invites)) {
    invitesComponent = invites.map((invite) => (
      <InviteCard
        key={invite.id}
        id={invite.id}
        sender={invite.sender_uuid}
        receiver={invite.receiver_uuid}
        event_id={invite.event_id}
        setRerender={setRerender}
        rerender={rerender}
      />
    ));
  }

  return (
    <>
      {invitesComponent}
    </>
  );
}
