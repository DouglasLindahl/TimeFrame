import Link from "next/link";
import styled from "styled-components";

const HeaderContainer = styled.header`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #202020;
  color: white;
  box-shadow: 0px 10px 5px #101010;
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
  background-color: #303030;
`;

export default function Header(props) {
  if (props.header == "home") {
    return (
      <HeaderContainer>
        <Logo>
          <LogoLink href={"/authenticated/home"}>
            <LogoImage src="/favicon.ico" alt="TimeFrame logo" />
            <LogoText>TimeFrame</LogoText>
          </LogoLink>
        </Logo>
        <NavLinks>
          <NavLink href="/authenticated/settings">Settings</NavLink>
        </NavLinks>
      </HeaderContainer>
    );
  }
  if (props.header == "start") {
    return (
      <HeaderContainer>
        <Logo>
          <LogoLink href={"/authenticated/home"}>
            <LogoImage src="/favicon.ico" alt="TimeFrame logo" />
            <LogoText>TimeFrame</LogoText>
          </LogoLink>
        </Logo>
        <NavLinks>
          <NavLink href="/login">Login</NavLink>
          <NavLink href="/register">Register</NavLink>
        </NavLinks>
      </HeaderContainer>
    );
  }
}
