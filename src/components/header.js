import { Row, ThemeColor } from "./components";
import styled, { keyframes } from "styled-components";

import { FAQButton } from "./faq";

const waveKeyframes = keyframes`
  0% { margin-bottom: 0px;}
  20%{ margin-bottom: -4px;}
  40%{ margin-bottom: 0px;}
  70%{ margin-bottom: -4px;}
  100%{ margin-bottom: 0px;}
`;
const waveShadowKeyframes = keyframes`
  0% { text-shadow: -2px 2px #fff; }
  20%{ text-shadow: -2px -1px #fff; }
  40%{ text-shadow: -2px 2px #fff; }
  70%{ text-shadow: -2px -1px #fff; }
  100%{ text-shadow: -2px 2px #fff; }
`;

const HeaderContainer = styled.div`
  display: flex;
  height: 40px;
  width: 640px;
  color: ${ThemeColor};
  font-size: 25px;
  font-family: "Alfa Slab One", Verdana;
`;

const Title = styled.div`
  color: ${ThemeColor};
  text-align: center;
  text-shadow: -2px 2px #fff;
  animation: ${waveKeyframes} 1.5s ease-in-out,
    ${waveShadowKeyframes} 1.5s ease-in-out;
  animation-delay: 0s, 0.1s;
`;

const IconRow = styled(Row)`
  padding-top: 6px;
`;

const LogoImage = styled.img`
  width: 50px;
  margin-top: 10px;
  cursor: pointer;
  animation: ${waveKeyframes} 1.5s ease-in-out;
  animation-delay: 0.1s;
`;

const TwitterImage = styled.img`
  width: 50px;
  margin-top: 15px;
  cursor: pointer;
  animation: ${waveKeyframes} 1.5s ease-in-out;
  animation-delay: 0.2s;
`;

export default function Header({ setShowFAQ }) {
  return (
    <HeaderContainer>
      <Row className="flex1" />
      <Row className="flex1">
        <Title>One More Try!</Title>
      </Row>
      <IconRow className="justify-start flex1">
        <span title="TomLum.com">
          <a href="https://www.tomlum.com/" target="_blank">
            <LogoImage src="https://s3.us-east-2.amazonaws.com/tomlum/orange--me.png" />
          </a>
        </span>
        <span title="Twitter">
          <a href="https://twitter.com/tomlumperson" target="_blank">
            <TwitterImage src="https://s3.us-east-2.amazonaws.com/tomlum/orange--bird.png" />
          </a>
        </span>
        <FAQButton setShowFAQ={setShowFAQ} />
      </IconRow>
    </HeaderContainer>
  );
}
