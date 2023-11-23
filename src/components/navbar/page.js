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
    red{
      hex
    }
    green{
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

const NavbarContainer = styled.div`
  width: 100%;
  color: white;
  padding: 16px 0;
  background-color: ${(props) => props.backgroundcolor};
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const NavLink = styled(Link)`
  font-size: 18px;
  font-weight: normal;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: ${(props) => props.backgroundcolor};
`;

const NavImage = styled(Link)`
  width: 40px;
  height: 40px;
`;

const NavButton = styled.button`
  width: 40px;
  height: 40px;
`;

const ChangeViewButton = styled.button`
  width: 40px;
  height: 40px;
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
  background-color: ${(props) => props.backgroundcolor};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px ${(props) => props.shadowcolor};
  color: ${(props) => props.textcolor};
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
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  cursor: pointer;
`;

const ToggleInvitePageButton = styled.button`
  font-size: 18px;
  font-weight: normal;
  width: 100%;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  cursor: pointer;
`;

const KeepEventButton = styled.button`
  font-size: 18px;
  font-weight: normal;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  cursor: pointer;
`;

const SinglePageContainer = styled.div`
  width: 100%;
  padding: 16px;
  background-color: ${(props) => props.backgroundcolor};
`;

const SinglePageInnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.textcolor};
  gap: 16px;
`;

const ReturnButton = styled(Link)`
  display: flex;
  gap: 16px;
  padding: 8px 24px;
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
`;

export default function Navbar(props) {
  const [userInfo, setUserInfo] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const router = useRouter();
  const [isConfirmingRemoval, setConfirmingRemoval] = useState(false);

  const { data, loading, error } = useQuery(COLOR_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const primaryColor = data?.main?.primaryColor?.hex || "303030";
  const textColor = data?.main?.textColor?.hex || "303030";
  const shadowColor = data?.main?.shadowColor?.hex || "303030";
  const red = data?.main?.red?.hex || "303030";
  const green = data?.main?.green?.hex || "303030";

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

  if (props.navbar === "home") {
    return (
      <NavbarContainer backgroundcolor={backgroundPrimary}>
        <Container>
          <NavLinks>
            <NavImage href="/authenticated/home">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill={textColor}
                  d="M16.612 2.214a1.01 1.01 0 0 0-1.242 0L1 13.419l1.243 1.572L4 13.621V26a2.004 2.004 0 0 0 2 2h20a2.004 2.004 0 0 0 2-2V13.63L29.757 15L31 13.428ZM18 26h-4v-8h4Zm2 0v-8a2.002 2.002 0 0 0-2-2h-4a2.002 2.002 0 0 0-2 2v8H6V12.062l10-7.79l10 7.8V26Z"
                />
              </svg>
            </NavImage>
            <NavImage href="addEvent">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path fill={textColor} d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z" />
              </svg>
            </NavImage>
            <NavImage
              backgroundcolor={primaryColor}
              href="/authenticated/groups"
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill={textColor}
                  d="M31 30h-2v-3a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v3h-2v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5zm-7-18a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5zm-9 12h-2v-3a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v3H1v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5zM8 4a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5z"
                />
              </svg>
            </NavImage>
          </NavLinks>
        </Container>
      </NavbarContainer>
    );
  }
  if (props.navbar == "groups") {
    return (
      <NavbarContainer>
        <Container>
          <NavLinks>
            <NavImage href="/authenticated/home">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill={textColor}
                  d="M16.612 2.214a1.01 1.01 0 0 0-1.242 0L1 13.419l1.243 1.572L4 13.621V26a2.004 2.004 0 0 0 2 2h20a2.004 2.004 0 0 0 2-2V13.63L29.757 15L31 13.428ZM18 26h-4v-8h4Zm2 0v-8a2.002 2.002 0 0 0-2-2h-4a2.002 2.002 0 0 0-2 2v8H6V12.062l10-7.79l10 7.8V26Z"
                />
              </svg>
            </NavImage>
            <NavButton onClick={props.toggleCreateGroup}>
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path fill={textColor} d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z" />
              </svg>
            </NavButton>
            <NavImage
              backgroundcolor={primaryColor}
              href="/authenticated/groups"
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill={textColor}
                  d="M31 30h-2v-3a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v3h-2v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5zm-7-18a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5zm-9 12h-2v-3a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v3H1v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5zM8 4a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5z"
                />
              </svg>
            </NavImage>
          </NavLinks>
        </Container>
      </NavbarContainer>
    );
  }
  if (props.navbar == "singleGroup") {
    return (
      <SinglePageContainer backgroundcolor={backgroundPrimary}>
        {isConfirmingRemoval && (
          <ConfirmRemovalContainer shadowcolor={shadowColor} backgroundcolor={backgroundPrimary}>
            {props.isOwner ? (
              <>
                <ConfirmationText>
                  Are you sure you want to DELETE this group?
                </ConfirmationText>
                <ButtonGroup>
                  <RemoveEventButton backgroundcolor={red} onClick={props.leaveGroup}>
                    Delete
                  </RemoveEventButton>
                  <KeepEventButton backgroundcolor={backgroundSecondary} onClick={denyRemoveEvent}>
                    Keep
                  </KeepEventButton>
                </ButtonGroup>
              </>
            ) : (
              <>
                <ConfirmationText>
                  Are you sure you want to leave this group?
                </ConfirmationText>
                <ButtonGroup>
                  <RemoveEventButton backgroundcolor={red} onClick={props.leaveGroup}>
                    Leave
                  </RemoveEventButton>
                  <KeepEventButton backgroundcolor={backgroundSecondary} onClick={denyRemoveEvent}>
                    Stay
                  </KeepEventButton>
                </ButtonGroup>
              </>
            )}
          </ConfirmRemovalContainer>
        )}
        <SinglePageInnerContainer textcolor={textColor}>
          <ReturnButton href="/authenticated/groups">
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 10"
              transform="rotate(90)"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 9.27502L0.5 1.77502L1.55 0.725025L8 7.17502L14.45 0.725025L15.5 1.77502L8 9.27502Z"
                fill={textColor}
              />
            </svg>
            <p>Return</p>
          </ReturnButton>
          <ToggleInvitePageButton backgroundcolor={backgroundSecondary} onClick={props.showGroupUsers}>
            Group members
          </ToggleInvitePageButton>
          {props.isOwner ? (
            <RemoveEventButton backgroundcolor={red} onClick={confirmRemoveEvent}>
              Delete
            </RemoveEventButton>
          ) : (
            <RemoveEventButton backgroundcolor={red} onClick={confirmRemoveEvent}>
              Leave
            </RemoveEventButton>
          )}
        </SinglePageInnerContainer>
      </SinglePageContainer>
    );
  }
  if (props.navbar === "singlePage") {
    return (
      <SinglePageContainer backgroundcolor={backgroundPrimary}>
        {isConfirmingRemoval && (
          <ConfirmRemovalContainer backgroundcolor={backgroundPrimary} shadowcolor={shadowColor}>
            <ConfirmationText>
              Are you sure you want to delete this event?
            </ConfirmationText>
            <ButtonGroup>
              <RemoveEventButton backgroundcolor={red} onClick={removeEvent}>
                Delete
              </RemoveEventButton>
              <KeepEventButton backgroundcolor={backgroundSecondary} onClick={denyRemoveEvent}>
                Keep Event
              </KeepEventButton>
            </ButtonGroup>
          </ConfirmRemovalContainer>
        )}
        <SinglePageInnerContainer textcolor={textColor}>
          <ReturnButton href="/authenticated/home">
          <svg
              width="20"
              height="20"
              viewBox="0 0 16 10"
              transform="rotate(90)"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 9.27502L0.5 1.77502L1.55 0.725025L8 7.17502L14.45 0.725025L15.5 1.77502L8 9.27502Z"
                fill={textColor}
              />
            </svg>
            <p>Return</p>
          </ReturnButton>
          <ToggleInvitePageButton backgroundcolor={backgroundSecondary} onClick={toggleInvitePage}>
            Invite
          </ToggleInvitePageButton>
          <RemoveEventButton backgroundcolor={red} onClick={confirmRemoveEvent}>
            Delete
          </RemoveEventButton>
        </SinglePageInnerContainer>
      </SinglePageContainer>
    );
  }
}
