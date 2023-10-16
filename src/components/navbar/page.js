import Link from "next/link";
import { useEffect } from "react";
import { supabase } from "../../../supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const NavbarContainer = styled.div`
  width: 100%;
  color: white;
  padding: 16px 0;
  background-color: #202020;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChangeViewButton = styled.button`
  background: #800080;
  &:hover {
    background: #9400d3;
  }
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 999px;
  margin: 0 8px;
  cursor: pointer;
`;

const AddEventLink = styled(Link)`
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
  gap: 16px;
`;

const RemoveEventButton = styled.button`
  background: #008000;
  &:hover {
    background: #00b300;
  }
  color: white;
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
`;

const KeepEventButton = styled.button`
  background: white;
  color: #222;
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #222;
    color: white;
    outline: 2px solid white;
  }
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

export default function Navbar(props) {
  const [userInfo, setUserInfo] = useState("");
  const router = useRouter();
  const [isConfirmingRemoval, setConfirmingRemoval] = useState(false);

  const removeEvent = async () => {
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('UserInfo')
      .update({ prefers_calendar: !props.view })
      .eq('user_uuid', user.id)
    props.setView(!props.view);
  }

  if (props.navbar === "home") {
    return (
      <NavbarContainer>
        <Container>
          <ChangeViewButton onClick={updateView}>Change View</ChangeViewButton>
          <AddEventLink href="addEvent">+</AddEventLink>
        </Container>
      </NavbarContainer>
    );
  }

  if (props.navbar === "singlePage") {
    return (
      <SinglePageContainer>
        {isConfirmingRemoval && (
          <ConfirmRemovalContainer>
            <ConfirmationText>Are you sure you want to delete this event?</ConfirmationText>
            <ButtonGroup>
              <RemoveEventButton onClick={removeEvent}>Remove Event</RemoveEventButton>
              <KeepEventButton onClick={denyRemoveEvent}>Keep Event</KeepEventButton>
            </ButtonGroup>
          </ConfirmRemovalContainer>
        )}
        <SinglePageInnerContainer>
          <ReturnButton href="/authenticated/home">
            <img src="/icons/arrowWhite.svg" width="18px" alt="Return" style={{ transform: "rotate(90deg)" }} />
            <p>Return</p>
          </ReturnButton>
          <RemoveEventButton onClick={confirmRemoveEvent}>Remove Event</RemoveEventButton>
        </SinglePageInnerContainer>
      </SinglePageContainer>
    );
  }
}
