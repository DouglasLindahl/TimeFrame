"use client";
import Invites from "@/components/invites/page";
import { styled } from "styled-components";
import Header from "@/components/header/page";
import Navbar from "@/components/navbar/page";

import { useQuery } from "graphql-hooks";

const COLOR_QUERY = `
query{
  main {
    backgroundPrimary{
      hex
    }
    backgroundSecondary{
      hex
    }
  }
}
`;

const NotificationsPage = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.backgroundcolor};
`;

const NotificationsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  overflow-y: auto;
  `;

export default function Notifications() {
    const { data, loading, error } = useQuery(COLOR_QUERY);

    const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
    const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
    const textColor = data?.main?.textColor?.hex || "303030";
    const offDayText = data?.main?.offDayText?.hex || "303030";
    const offDay = data?.main?.offDay?.hex || "303030";
    const currentDay = data?.main?.currentDay?.hex || "303030";
    const currentDayText = data?.main?.currentDayText?.hex || "303030";
  return (
    <NotificationsPage backgroundcolor={backgroundPrimary}>
      <Header header="singlePage"></Header>
      <NotificationsContainer>
        <Invites></Invites>
      </NotificationsContainer>
      <Navbar navbar="home"></Navbar>
    </NotificationsPage>
  );
}
