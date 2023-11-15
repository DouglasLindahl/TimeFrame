import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import InviteCard from "../inviteCard/page";
import GroupInviteCard from "../groupInviteCard/page";

export default function Invites() {
  const [invites, setInvites] = useState("");
  const [groupInvites, setGroupInvites] = useState("");
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


  useEffect(() => {
    const fetchGroupInvites = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("GroupInvites")
        .select()
        .eq("receiver_uuid", user.id)
        .eq("status", "pending");
      setGroupInvites(data);
    };
    fetchGroupInvites();
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

  let groupInvitesComponent = null;
  if (Array.isArray(groupInvites)) {
    groupInvitesComponent = groupInvites.map((groupInvite) => (
      <GroupInviteCard
        key={groupInvite.id}
        id={groupInvite.id}
        sender={groupInvite.sender_uuid}
        receiver={groupInvite.receiver_uuid}
        group_id={groupInvite.group_id}
        setRerender={setRerender}
        rerender={rerender}
      />
    ));
  }

  return (
    <>
      {invitesComponent}
      {groupInvitesComponent}
    </>
  );
}
