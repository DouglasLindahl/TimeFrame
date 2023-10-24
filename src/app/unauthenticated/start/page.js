"use client";
import React from "react";
import styled from "styled-components";
import Header from "@/components/header/page";
import Link from "next/link";
import { useQuery } from "graphql-hooks";

const CMS_QUERY = `
  query {
    start {
      header
      paragraphone
      summary
      featuresheader
    }
    allFeatures {
      text
      bold
      id
    }
    main {
      logo {
        url
      }
      shadowColor {
        hex
      }
      primaryColor {
        hex
      }
      textColor {
        hex
      }
      secondaryColor {
        hex
      }
      backgroundPrimary {
        hex
      }
      backgroundSecondary {
        hex
      }
      currentDay {
        hex
      }
      currentDayText {
        hex
      }
      offDay {
        hex
      }
      offDayText {
        hex
      }
    }
  }
`;

const StartPage = styled.div`
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  height: 100vh;
`;

const Content = styled.section`
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  text-align: center;
  margin-bottom: 16px;
  color: ${(props) => props.primaryColor};
`;

const Paragraph = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 16px;
  width: 60%;
`;

const FeaturesHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: ${(props) => props.primaryColor};
`;

const FeatureList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  font-size: 16px;
  margin: 16px 0;
  color: ${(props) => props.textcolor};
`;

const LoginButton = styled(Link)`
  background-color: ${(props) => props.primaryColor};
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 20px;
  color: #fff;
  margin-top: 16px;
`;

export default function Start() {
  const { data, loading, error } = useQuery(CMS_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "#303030";
  const textColor = data?.main?.textColor?.hex || "#303030";
  const primaryColor = data?.main?.primaryColor?.hex || "#6c63ff";

  if (data) {
    const features = data.allFeatures.map((feature) => (
      <li key={feature.id}>
        <span><strong>{feature.bold}:</strong></span> {feature.text}
      </li>
    ));

    return (
      <StartPage backgroundcolor={backgroundPrimary} textcolor={textColor}>
        <Header header={"start"}></Header>
        <Content>
          <Title primaryColor={primaryColor}>{data.start.header}</Title>
          <Paragraph>{data.start.paragraphone}</Paragraph>
          <FeaturesHeader primaryColor={primaryColor}>
            {data.start.featuresheader}
          </FeaturesHeader>
          <FeatureList textcolor={textColor}>{features}</FeatureList>
          <Paragraph>{data.start.summary}</Paragraph>
          <LoginButton href="/unauthenticated/login" primaryColor={primaryColor}>Login</LoginButton>
        </Content>
      </StartPage>
    );
  }
}
