import Link from "next/link";
import { useEffect } from "react";
import { supabase } from "../../../supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useQuery } from "graphql-hooks";

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
  }
}
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const LogoImage = styled.img`
  width: 48px;
`;

const HeaderContainer = styled.div`
  width: 100%;
  color: white;
  padding: 16px 0;
  background-color: #202020;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const ChangeViewButton = styled.button`
  background: #6c63ff;
  &:hover {
    background: #a9a6ff;
  }
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 100px;
  cursor: pointer;
`;

const AddEventLink = styled(Link)`
  background: #4caf50;
  &:hover {
    background: #8bc34a;
  }
  color: white;
  font-weight: 600;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  text-decoration: none;
`;

const SwitchToNotesButton = styled(Link)`
  background: #008000;
  &:hover {
    background: #00b300;
  }
  color: white;
  font-weight: 600;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  text-decoration: none;
`;

const ConfirmRemovalContainer = styled.div`
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #222;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: white;
`;

const ConfirmationText = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 16px;
`;

const RemoveEventButton = styled.button`
  font-size: 18px;
  font-weight: normal;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: red;
  color: white;
  cursor: pointer;
`;

const ToggleInvitePageButton = styled.button`
  font-size: 18px;
  font-weight: normal;
  width: 100%;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: white;
  color: black;
  cursor: pointer;
`;

const KeepEventButton = styled.button`
  font-size: 18px;
  font-weight: normal;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: white;
  color: black;
  cursor: pointer;
`;

const SinglePageContainer = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #202020;
`;

const SinglePageInnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const ReturnButton = styled(Link)`
  display: flex;
  gap: 16px;
  padding: 8px 24px;
  background: #222;
  color: white;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
`;

export default function Header(props) {
  const [userInfo, setUserInfo] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const router = useRouter();
  const [isConfirmingRemoval, setConfirmingRemoval] = useState(false);

  const { data, loading, error } = useQuery(COLOR_QUERY);
  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const primaryColor = data?.main?.primaryColor?.hex || "303030";
  const textColor = data?.main?.textColor?.hex || "303030";
  const shadow = data?.main?.shadowColor?.hex || "303030";

  useEffect(() => {
    async function checkProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("UserInfo")
        .select()
        .eq("user_uuid", user.id);
      if (data.length > 0) {
        setUserProfile(data);
      }
    }
    checkProfile();
  }, []);

  const toggleInvitePage = () => {
    props.setInviteOpen(!props.inviteOpen);
  };

  const removeEvent = async () => {
    const {} = await supabase.from("Invites").delete().eq("event_id", props.id);
    const { error } = await supabase.from("Events").delete().eq("id", props.id);
    router.push(`/authenticated/home`);
  };

  const confirmRemoveEvent = () => {
    setConfirmingRemoval(true);
  };

  const denyRemoveEvent = () => {
    setConfirmingRemoval(false);
  };

  async function updateView() {
    if (userProfile) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("UserInfo")
        .update({ prefers_calendar: !props.view })
        .eq("user_uuid", user.id);
    }
    props.setView(!props.view);
  }

  if(!loading)
  {
  if (props.header === "home") {
    return (
      <HeaderContainer>
        <Container>
        <Logo>
            <LogoLink href={"/authenticated/home"}>
              <LogoImage src={data.main.logo.url} alt="TimeFrame logo" />
            </LogoLink>
          </Logo>
          <ChangeViewButton onClick={updateView}>Change View</ChangeViewButton>
          <AddEventLink href="addEvent">+</AddEventLink>
          <SwitchToNotesButton href="/authenticated/notes">
            Notes
          </SwitchToNotesButton>
        </Container>
      </HeaderContainer>
    );
  }
  if (props.header == "singleGroup") {
    return (
      <SinglePageContainer>
        {isConfirmingRemoval && (
          <ConfirmRemovalContainer>
            {props.isOwner ? (
              <>
                <ConfirmationText>
                  Are you sure you want to DELETE this group?
                </ConfirmationText>
                <ButtonGroup>
                  <RemoveEventButton onClick={props.leaveGroup}>
                    Delete
                  </RemoveEventButton>
                  <KeepEventButton onClick={denyRemoveEvent}>
                    Stay
                  </KeepEventButton>
                </ButtonGroup>
              </>
            ) : (
              <>
                <ConfirmationText>
                  Are you sure you want to leave this group?
                </ConfirmationText>
                <ButtonGroup>
                  <RemoveEventButton onClick={props.leaveGroup}>
                    Leave
                  </RemoveEventButton>
                  <KeepEventButton onClick={denyRemoveEvent}>
                    Stay
                  </KeepEventButton>
                </ButtonGroup>
              </>
            )}
          </ConfirmRemovalContainer>
        )}
        <SinglePageInnerContainer>
          <ReturnButton href="/authenticated/home">
            <img
              src="/icons/arrowWhite.svg"
              width="18px"
              alt="Return"
              style={{ transform: "rotate(90deg)" }}
            />
            <p>Return</p>
          </ReturnButton>
          <ToggleInvitePageButton onClick={props.showGroupUsers}>
            Group members
          </ToggleInvitePageButton>
          {props.isOwner ?(
          <RemoveEventButton onClick={confirmRemoveEvent}>
            Delete
          </RemoveEventButton>
          ) : 
          <RemoveEventButton onClick={confirmRemoveEvent}>
          Leave
        </RemoveEventButton>}
        </SinglePageInnerContainer>
      </SinglePageContainer>
    );
  }
  if (props.header === "singlePage") {
    return (
      <SinglePageContainer>
        {isConfirmingRemoval && (
          <ConfirmRemovalContainer>
            <ConfirmationText>
              Are you sure you want to delete this event?
            </ConfirmationText>
            <ButtonGroup>
              <RemoveEventButton onClick={removeEvent}>
                Delete
              </RemoveEventButton>
              <KeepEventButton onClick={denyRemoveEvent}>
                Keep Event
              </KeepEventButton>
            </ButtonGroup>
          </ConfirmRemovalContainer>
        )}
        <SinglePageInnerContainer>
          <ReturnButton href="/authenticated/home">
            <img
              src="/icons/arrowWhite.svg"
              width="18px"
              alt="Return"
              style={{ transform: "rotate(90deg)" }}
            />
            <p>Return</p>
          </ReturnButton>
          <ToggleInvitePageButton onClick={toggleInvitePage}>
            Invite
          </ToggleInvitePageButton>
          <RemoveEventButton onClick={confirmRemoveEvent}>
            Delete
          </RemoveEventButton>
        </SinglePageInnerContainer>
      </SinglePageContainer>
    );
  }
}
}
