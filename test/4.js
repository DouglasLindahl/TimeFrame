import Link from "next/link";
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

const NavbarContainer = styled.header`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  box-shadow: 0px 10px 5px ${(props) => props.shadowcolor};
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

const LogoText = styled.h1`
  font-size: 24px;
  font-weight: 600;
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

export default function Navbar(props) {
  const { data, loading, error } = useQuery(COLOR_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || "303030";
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || "303030";
  const primaryColor = data?.main?.primaryColor?.hex || "303030";
  const textColor = data?.main?.textColor?.hex || "303030";
  const shadow = data?.main?.shadowColor?.hex || "303030";

  if (!loading && data) {
    if (props.navbar == "home") {
      return (
        <NavbarContainer
          shadowcolor={shadow}
          backgroundcolor={backgroundPrimary}
          textcolor={textColor}
        >
          <NavLinks>
            <NavImage
              backgroundcolor={primaryColor}
              href="/authenticated/settings"
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="white"
                  d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11.35 11.35 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.48 11.48 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11.35 11.35 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.48 11.48 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.86 8.86 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.36 9.36 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.86 8.86 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.36 9.36 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z"
                />
                <path
                  fill="white"
                  d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6Zm0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4Z"
                />
              </svg>
            </NavImage>
            <NavImage href="">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="white"
                  d="M28.707 19.293L26 16.586V13a10.014 10.014 0 0 0-9-9.95V1h-2v2.05A10.014 10.014 0 0 0 6 13v3.586l-2.707 2.707A1 1 0 0 0 3 20v3a1 1 0 0 0 1 1h7v.777a5.152 5.152 0 0 0 4.5 5.199A5.006 5.006 0 0 0 21 25v-1h7a1 1 0 0 0 1-1v-3a1 1 0 0 0-.293-.707ZM19 25a3 3 0 0 1-6 0v-1h6Zm8-3H5v-1.586l2.707-2.707A1 1 0 0 0 8 17v-4a8 8 0 0 1 16 0v4a1 1 0 0 0 .293.707L27 20.414Z"
                />
              </svg>
            </NavImage>
            <NavImage href="">
              <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="white" d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z" />
              </svg>
            </NavImage>

            <NavImage href="">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="white"
                  d="M16.612 2.214a1.01 1.01 0 0 0-1.242 0L1 13.419l1.243 1.572L4 13.621V26a2.004 2.004 0 0 0 2 2h20a2.004 2.004 0 0 0 2-2V13.63L29.757 15L31 13.428ZM18 26h-4v-8h4Zm2 0v-8a2.002 2.002 0 0 0-2-2h-4a2.002 2.002 0 0 0-2 2v8H6V12.062l10-7.79l10 7.8V26Z"
                />
              </svg>
            </NavImage>
            <NavImage
              backgroundcolor={primaryColor}
              href="/authenticated/groups"
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="white"
                  d="M31 30h-2v-3a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v3h-2v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5zm-7-18a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5zm-9 12h-2v-3a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v3H1v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5zM8 4a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0-2a5 5 0 1 0 5 5a5 5 0 0 0-5-5z"
                />
              </svg>
            </NavImage>
          </NavLinks>
        </NavbarContainer>
      );
    }
    if (props.navbar == "start") {
      return (
        <NavbarContainer
          shadowcolor={shadow}
          backgroundcolor={backgroundPrimary}
          textcolor={textColor}
        >
          <Logo>
            <LogoLink href={"/unauthenticated/start"}>
              <LogoImage src={data.main.logo.url} alt="TimeFrame logo" />
            </LogoLink>
          </Logo>
          <NavLinks>
            <NavLink
              backgroundcolor={primaryColor}
              href="/unauthenticated/login"
            >
              Login
            </NavLink>
          </NavLinks>
        </NavbarContainer>
      );
    }
  } else {
    return <p>Loading...</p>;
  }
}
