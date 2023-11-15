import Link from "next/link";
import styled from "styled-components";
import { useQuery } from 'graphql-hooks';

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

const HeaderContainer = styled.header`
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

export default function Header(props) {
  const { data, loading, error } = useQuery(COLOR_QUERY);

  const backgroundPrimary = data?.main?.backgroundPrimary?.hex || '303030';
  const backgroundSecondary = data?.main?.backgroundSecondary?.hex || '303030';
  const primaryColor = data?.main?.primaryColor?.hex || '303030';
  const textColor = data?.main?.textColor?.hex || '303030';
  const shadow = data?.main?.shadowColor?.hex || '303030';
  
  if(!loading && data)
  {
  if (props.header == "home") {
    return (
    <HeaderContainer shadowcolor={shadow} backgroundcolor={backgroundPrimary} textcolor={textColor}>
        <Logo>
          <LogoLink href={"/authenticated/home"}>
            <LogoImage src={data.main.logo.url} alt="TimeFrame logo" />
          </LogoLink>
        </Logo>
        <NavLinks>
          <NavLink backgroundcolor={primaryColor} href="/authenticated/settings">Settings</NavLink>
          <NavLink backgroundcolor={primaryColor} href="/authenticated/groups">Groups</NavLink>
        </NavLinks>
      </HeaderContainer>
    );
  }
  if (props.header == "start") {
    return (
      <HeaderContainer shadowcolor={shadow} backgroundcolor={backgroundPrimary} textcolor={textColor}>
        <Logo>
          <LogoLink href={"/unauthenticated/start"}>
          <LogoImage src={data.main.logo.url} alt="TimeFrame logo" />
          </LogoLink>
        </Logo>
        <NavLinks>
          <NavLink backgroundcolor={primaryColor} href="/unauthenticated/login">Login</NavLink>
        </NavLinks>
      </HeaderContainer>
    );
  }
}
else
{
  return(
    <p>Loading...</p>
  )
}
}
