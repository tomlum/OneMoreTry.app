import styled from "styled-components";

export const ThemeColor = "#f38322";

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const SliderTitle = styled.div`
  text-align: center;
`;
const Slider = styled.input``;
const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
`;

export function ReplaySpeedSlider({ replaySpeed, setReplaySpeed }) {
  return (
    <SliderContainer>
      <SliderTitle>Replay Speed</SliderTitle>
      <Slider
        type="range"
        min="0"
        max="100"
        value={replaySpeed}
        onChange={(e) => {
          setReplaySpeed(e.target.value);
        }}
      />
      <SliderLabel>
        <div>0x</div>
        <div>½x</div>
        <div>1x</div>
      </SliderLabel>
    </SliderContainer>
  );
}

export const Button = styled.button`
  font-size: 20px;
  height: 30px;
  cursor: pointer;
  padding: 0px 5px;
  box-shadow: -2px 2px ${ThemeColor};
  &:disabled {
    box-shadow: -3px 3px #000;
  }
  width: 100px;
`;

export const Input = styled.input`
  height: 30px;
  width: 40px;
  background-color: rgba(0,0,0,0.6);
  border: none;
  border-radius: 5px;
  color: ${ThemeColor};
  font-size: 20px;
  border: solid 1px rgba(255,255,255,0.5);
  text-align: center;
  margin: 0px 5px;
  &:disabled {
    background-color: #333;
    color: #dadada;
  }
  transition: all .4s;
}
`;

export const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
`;
