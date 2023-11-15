"use client";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useQuery } from "graphql-hooks";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import Groups from "@/app/authenticated/groups/page";

const COLOR_QUERY = `
query{
  main {
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
    shadowColor{
      hex
    }
  }
}
`;

const GroupContainer = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: space-between;
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 5px 5px 5px ${(props) => props.shadowcolor};
  height: 100px;
`;

const ColorStripeContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
`;

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const Title = styled.h1`
  font-size: 30px;
  text-align: left;
  display: flex;
  flex-direction: row;
  p {
    font-size: 18px;
  }
`;

const Time = styled.p`
  font-size: 24px;
`;
const ColorStripe = styled.div`
  position: absolute;
  right: 0px;
  bottom: -25px;
  width: 18px;
  height: 100px;
  transform: rotate(45deg);
  background-color: ${(props) => props.color};
`;

export default function GroupCard(props) {
  const router = useRouter();
  const { data, loading, error } = useQuery(COLOR_QUERY);
  const [group, setGroup] = useState("");

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const textColor = data?.main?.textColor?.hex || "303030";
  const shadowColor = data?.main?.shadowColor?.hex || "303030";


  function redirectToSingleGroup() {
    router.push(`/authenticated/singleGroup/${[props.id]}?id=${props.id}`);
  }


  useEffect(() => {
    const getGroup = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("Groups")
        .select()
        .eq("id", props.id);
        setGroup(data);
    };
    getGroup();
}, []);

    if(group)
    {
        return (
          <GroupContainer
            shadowcolor={shadowColor}
            backgroundcolor={backgroundSecondary}
            textcolor={textColor}
            onClick={redirectToSingleGroup}
          >
            <ColorStripeContainer>
              <ColorStripe color={props.color}></ColorStripe>
            </ColorStripeContainer>
            <InfoSection>
              <Title>
                {group[0].group_name}
              </Title>
            </InfoSection>
          </GroupContainer>
        );
    }
    else
    {
        return(
            <>
                <p>Loading...</p>
            </>
        )
    }
};

