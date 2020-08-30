import {
  Button,
  Col,
  Input,
  ReplaySpeedSlider,
  Row,
  ThemeColor,
} from "./components";
import styled, { keyframes } from "styled-components";
import { useEffect, useRef, useState } from "preact/hooks";

import Cookies from "js-cookie";
import Frame from "./frame";
import Header from "./header";

const LeftCol = styled.div`
  display: flex;
  padding: 0px 10px;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
`;
const MiddleCol = styled.div`
  display: flex;
  min-width: 150px;
  width: 150px;
  align-items: flex-start;
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-shadow: -8px 0px 0 -5px ${ThemeColor};
  padding-left: 5px;
`;

const PreviewButton = styled(Button)`
  width: 40px;
  margin-right: 10px;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 60%;
  }

  &:disabled {
    img {
      opacity: 0.3;
    }
  }
`;

const Hint = styled.div`
  font-color: #bbb;
  text-align: center;
  height: 20px;
  width: 100%;
`;

const ReplayButtonContainer = styled.div`
  position: relative;
  margin-bottom: 30px;
  width: 100px;
`;

const buttonLoadKeyframes = keyframes`
    from {
        width: 0%;
    } to {
        width: 93%;
    }
`;

const StartButton = styled(Button)`
  margin-right: 20px;
`;
const LoadingButton = styled(Button)`
  position: absolute;
  width: 0%;
  box-shadow: none !important;
  animation: ${buttonLoadKeyframes} ${({ time }) => time}s linear;
`;

function adjustReplayTime(t) {
  return Math.abs(t) + 1;
}

export default function App() {
  useRef;
  const [start, setStart] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [preview, setPreview] = useState(false);

  const [replay, setReplay] = useState(false);
  const [replayReady, setReplayReady] = useState(false);
  const replayReadyRef = useRef(false);
  const [replayDelayInput, setReplayDelayInput] = useState(2);
  const [replayDelay, setReplayDelay] = useState(replayDelayInput);
  const [replaySpeed, setReplaySpeed] = useState(100);

  const [ghostDelayInput, setGhostDelayInput] = useState(2);
  const [ghostDelay, setGhostDelay] = useState(ghostDelayInput);

  const appRef = useRef(null);

  const handleSpaceDown = (e) => {
    e = e || window.event;
    if (replayReadyRef.current && e.key == " ") {
      setReplay(true);
      e.preventDefault();
    }
  };

  // Init
  useEffect(() => {
    document.addEventListener("keydown", handleSpaceDown);
    const saves = JSON.parse(Cookies.get("OneMoreTry"));
    saves.replayDelayInput && setReplayDelayInput(saves.replayDelayInput);
    saves.ghostDelayInput && setGhostDelayInput(saves.ghostDelayInput);
  }, []);

  useEffect(() => {
    replayReadyRef.current = replayReady;
  }, [replayReady]);

  const onGhostInputChange = (e) => {
    e = e || window.event;
    let newValue = null;
    if (e.keyCode === 38) {
      e.preventDefault();
      newValue = Math.max(0, Math.floor(ghostDelayInput + 1));
      setGhostDelayInput(newValue);
    }
    if (e.keyCode === 40) {
      e.preventDefault();
      newValue = Math.max(0, Math.ceil(ghostDelayInput - 1));
      setGhostDelayInput(newValue);
    }
    if (newValue && newValue > replayDelayInput) {
      setReplayDelayInput(newValue);
    }
  };

  const onReplayInputChange = (e) => {
    e = e || window.event;
    if (e.keyCode === 38) {
      e.preventDefault();
      setReplayDelayInput(Math.max(0, Math.floor(replayDelayInput + 1)));
    }
    if (e.keyCode === 40) {
      e.preventDefault();
      setReplayDelayInput(Math.max(0, Math.ceil(replayDelayInput - 1)));
    }
  };

  return (
    <div ref={appRef} id="app" onKeyDown={handleSpaceDown}>
      <Row>
        <Header />
      </Row>
      <Row>
        <Frame
          start={start}
          replay={replay}
          ghost={Math.abs(ghostDelay) > 0}
          ghostDelay={Math.abs(ghostDelay)}
          replayDelay={adjustReplayTime(replayDelay)}
          setReplayReady={setReplayReady}
          replaySpeed={replaySpeed / 100}
          setCameraReady={setCameraReady}
          preview={preview}
          setPreview={setPreview}
        />
      </Row>
      <div className="flex mt5">
        <LeftCol>
          <Col>
            <InputGroup>
              <b>Camera Lag</b>
              <Input
                disabled={start}
                value={ghostDelayInput}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val > replayDelayInput) {
                    setReplayDelayInput(val);
                  }
                  setGhostDelayInput(e.target.value);
                }}
                onKeyDown={onGhostInputChange}
              ></Input>
              <b>Seconds</b>
            </InputGroup>
            <InputGroup>
              <b>Replay</b>
              <Input
                disabled={start}
                value={replayDelayInput}
                onChange={(e) => {
                  setReplayDelayInput(e.target.value);
                }}
                onKeyDown={onReplayInputChange}
              ></Input>
              <b>Seconds</b>
            </InputGroup>
          </Col>
        </LeftCol>

        <MiddleCol className="justify-end">
          <span title="Preview without Lag">
            <PreviewButton
              disabled={!start}
              onClick={() => {
                setPreview(!preview);
              }}
            >
              <img
                src={`https://s3.us-east-2.amazonaws.com/tomlum/align-icon${
                  preview ? "-orange" : ""
                }.png`}
              ></img>
            </PreviewButton>
          </span>
          <StartButton
            onKeyDown={handleSpaceDown}
            onClick={() => {
              if (Math.abs(ghostDelayInput) < 1) {
                setGhostDelay(0);
                setGhostDelayInput(0);
              } else {
                setGhostDelay(ghostDelayInput);
              }
              if (Math.abs(replayDelayInput) < 1) {
                setReplayDelay(0);
                setReplayDelayInput(0);
              } else {
                setReplayDelay(replayDelayInput);
              }
              Cookies.set(
                "OneMoreTry",
                JSON.stringify({ replayDelayInput, ghostDelayInput })
              );
              setStart(!start);
              setReplay(false);
            }}
          >
            <b>{start ? "STOP" : replay ? "RESUME" : "START"}</b>
          </StartButton>
        </MiddleCol>
        <MiddleCol>
          {replay ? (
            <ReplaySpeedSlider
              replaySpeed={replaySpeed}
              setReplaySpeed={setReplaySpeed}
            />
          ) : (
            <Col>
              <ReplayButtonContainer>
                {cameraReady && !replayReady && start && ghostDelay > 0 && (
                  <LoadingButton time={ghostDelay + 0.1} />
                )}
                <Button
                  className="absolute"
                  disabled={!replayReady}
                  onClick={() => {
                    setReplay(!replay);
                    setStart(false);
                  }}
                >
                  <b>REPLAY</b>
                </Button>
              </ReplayButtonContainer>
              <Hint>[spacebar]</Hint>
            </Col>
          )}
        </MiddleCol>
        <Col className="flex1" />
      </div>
    </div>
  );
}
