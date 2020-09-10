import styled, { keyframes } from "styled-components";
import { useEffect, useRef, useState } from "preact/hooks";

import { Col } from "./components";
import { createRef } from "preact";
import { memo } from "preact/compat";

let noMediaRecorder = false;
try {
  MediaRecorder;
} catch {
  noMediaRecorder = true;
}

const Container = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;
`;
const screenHeight = `calc(100vh - 120px)`;
const screenMinHeight = `500px`;
const screenMinWidth = `0px`;
const PreviewScreen = styled.video`
  position: relative;
  z-index: 0;
  left: 0;
  right: 0;
  height: ${screenHeight};
  min-height: ${screenMinHeight};
  min-width: ${screenMinWidth};
  transform: scale(${({ mirror }) => mirror}, 1);
  margin: auto;
`;
const PreviewText = styled.div`
  z-index: 10;
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
  text-shadow: -2px 2px black;
`;

const Screen = styled.video`
  position: absolute;
  z-index: 1;
  opacity: 0;
  left: 0;
  right: 0;
  height: ${screenHeight};
  min-height: ${screenMinHeight};
  min-width: ${screenMinWidth};
  margin: auto;
  transform: scale(${({ mirror }) => mirror}, 1);
`;

const OverlayBox = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: ${screenHeight};
  min-height: ${screenMinHeight};
  min-width: ${screenMinWidth};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingBox = styled(OverlayBox)`
  text-shadow: 0px 0px 4px black;
  margin-top: 30px;
`;

const LoadingIcon = styled.div`
  position: relative;
  margin-top: 50px;
  width: 100px;
  height: 100px;
  h2 {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const spinKeyframes = keyframes`
    from {
        transform: rotate(0deg);
    } to {
        transform: rotate(-360deg);
    }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${spinKeyframes} ${({ time }) => time}s linear infinite;
  img {
    width: 100px;
  }
`;

const InfoBox = styled.div`
  margin: 30px 0px;
  height: 100%;
  border-radius: 10px;
  justify-content: center;
  background-color: #ffdfbd;
  font-size: 20px;
  opacity: 1;
  transition: opacity 0.4s;
  overflow: hidden;
  width: 100%;
  padding: 10px 0px;

  .content {
    height: 100%;
    display: flex;
    justify-content: center;
  }

  color: black;

  iframe {
    margin: 20px 0px;
  }

  h1 {
    font-size: 20px;
    margin-top: 0px;
    color: black;
  }

  div {
    z-index: 1;
    color: black;
  }

  video {
    margin-top: -50px;
    margin-bottom: -50px;
    width: 60%;
  }
`;

const Description = styled.div`
  max-width: 480px;
  span:nth-child(1) {
    color: #840088;
  }
  span:nth-child(2) {
    color: #001f88;
  }
  span:nth-child(3) {
    color: #008886;
  }
  span:nth-child(4) {
    color: #008803;
  }
  span:nth-child(5) {
    color: #888300;
  }
`;

const Footnote = styled.div`
  font-size: 15px;
  color: #666 !important;
  a {
    color: #666;
  }
`;

const Apology = styled.div`
  margin-top: 10px;
  color: #d83131 !important;
`;

function Frame({
  start,
  replay,
  replayDelay,
  replaySpeed,
  ghost,
  ghostDelay,
  setReplayReady,
  setCameraReady,
  preview,
  setPreview,
  downloadButtonRef,
  mirror,
  mute,
}) {
  const [mode, setMode] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(0);
  const infoBoxRef = useRef(null);
  const screen1Ref = useRef(null);
  const screen2Ref = useRef(null);
  const previewScreenRef = useRef(null);
  const replayScreenRef = useRef(null);
  const youtubeRef = useRef(null);

  const ghostRecorder1 = useRef(null);
  const ghostRecorder2 = useRef(null);
  const ghostInterval = useRef(null);
  const ghostStaggerTimeout = useRef(null);

  const replayRecorder1 = useRef(null);
  const replayRecorder2 = useRef(null);
  const replayInterval = useRef(null);
  const replayStaggerTimeout = useRef(null);
  const replayBlobURL = useRef(null);
  const longerReplayRecorder = useRef(1);
  const finalReplay = useRef(false);

  const loadingTimeout = useRef(null);
  const loadingCountdownInterval = useRef(null);

  const [showLoading, setShowLoading] = useState(false);

  let streamRef = createRef();

  const stopRecorder = async (recorder) => {
    if (recorder.current && recorder.current.state === "recording") {
      recorder.current.ondataavailable = null;
      recorder.current.stop();
    }
  };

  const setPreviewVideo = (data) => {
    const blob = new Blob([data], { type: "video/webm" });
    replayBlobURL.current = URL.createObjectURL(blob);
    downloadButtonRef.current.href = replayBlobURL.current;
    const date = new Date();
    downloadButtonRef.current.download = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}__${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.webm`;
    replayScreenRef.current.src = replayBlobURL.current;
  };

  useEffect(() => {
    try {
      replayScreenRef.current.playbackRate = replaySpeed;
    } catch (e) {}
  }, [replaySpeed]);

  useEffect(() => {
    if (replay) {
      setMode("REPLAY");
      setPreview(false);
    } else if (!start) {
      setMode("STOP");
      setPreview(false);
    } else if (ghost) {
      setMode("GHOST");
    } else if (!ghost) {
      setMode("STREAM");
    }
    setCountdown(Math.ceil(ghostDelay));
    countdownRef.current = Math.ceil(ghostDelay);
  }, [start, ghostDelay, ghost, replay]);

  useEffect(() => {
    if (preview) {
      previewScreenRef.current.style.opacity = 1;
      previewScreenRef.current.style.zIndex = 3;
      screen1Ref.current.style.opacity = 0;
      screen2Ref.current.style.opacity = 0;
      previewScreenRef.current.style.border = "dashed 2px #ddd";
    } else {
      previewScreenRef.current.style.zIndex = 0;
      screen1Ref.current.style.opacity = 1;
      screen2Ref.current.style.opacity = 1;
      previewScreenRef.current.style.border = "none";
    }
  }, [preview]);

  // Init modes
  useEffect(async () => {
    setReplayReady(false);
    setShowLoading(false);

    if (mode === "STOP" || mode === null) {
      infoBoxRef.current.style.opacity = 1;
      infoBoxRef.current.style.zIndex = 10;
      youtubeRef.current.src = "https://www.youtube.com/embed/YpGR1l1sapI";
    } else {
      infoBoxRef.current.style.opacity = 0;
      infoBoxRef.current.style.zIndex = 0;
      youtubeRef.current.src = "";
    }

    if (mode === "REPLAY") {
      finalReplay.current = true;
      if (longerReplayRecorder.current === 1) {
        await replayRecorder1.current.stop();
      } else {
        await replayRecorder2.current.stop();
      }
      replayScreenRef.current.style.zIndex = 3;
      replayScreenRef.current.style.opacity = 1;
      replayScreenRef.current.load();
      replayScreenRef.current.onloadeddata = function () {
        replayScreenRef.current.play();
      };
    } else {
      finalReplay.current = false;
      // Clear replay
      URL.revokeObjectURL(replayBlobURL.current);
      replayScreenRef.current.style.zIndex = 0;
      replayScreenRef.current.style.opacity = 0;
      replayScreenRef.current.src = null;
    }

    // Init Stream, Screens, & Recorders
    if (
      (mode == "GHOST" || mode == "STREAM") &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        previewScreenRef.current.srcObject = streamRef.current;
        await previewScreenRef.current.play();
      }

      replayRecorder1.current = new MediaRecorder(
        previewScreenRef.current.captureStream
          ? previewScreenRef.current.captureStream({
              mimeType: "video/webm",
            })
          : previewScreenRef.current.mozCaptureStream({
              mimeType: "video/webm",
            }),
        {
          mimeType: "video/webm",
        }
      );
      replayRecorder2.current = new MediaRecorder(
        previewScreenRef.current.captureStream
          ? previewScreenRef.current.captureStream({
              mimeType: "video/webm",
            })
          : previewScreenRef.current.mozCaptureStream({
              mimeType: "video/webm",
            }),
        {
          mimeType: "video/webm",
        }
      );
      replayRecorder1.current.ondataavailable = (event) => {
        longerReplayRecorder.current = 2;
        if (finalReplay.current) {
          setPreviewVideo(event.data);
        }
        finalReplay.current = false;
      };
      replayRecorder2.current.ondataavailable = (event) => {
        longerReplayRecorder.current = 1;
        if (finalReplay.current) {
          setPreviewVideo(event.data);
        }
        finalReplay.current = false;
      };
      longerReplayRecorder.current = 1;
      replayRecorder1.current.start();
      replayStaggerTimeout.current = window.setTimeout(async () => {
        replayRecorder2.current.start();
      }, replayDelay * 1000 + ghostDelay * 1000);

      replayInterval.current = window.setInterval(async () => {
        await replayRecorder1.current.stop();
        await replayRecorder1.current.start();
        replayStaggerTimeout.current = window.setTimeout(async () => {
          await replayRecorder2.current.stop();
          await replayRecorder2.current.start();
        }, replayDelay * 1000 + ghostDelay * 1000);
      }, (replayDelay * 1000 + ghostDelay * 1000) * 2);

      setCameraReady(true);
    } else {
      // Stop Stream
      streamRef.current = null;
      previewScreenRef.current.srcObject = null;

      // Stop Replay Recorders
      await stopRecorder(replayRecorder1);
      await stopRecorder(replayRecorder2);
      replayRecorder1.current = null;
      replayRecorder2.current = null;
      clearInterval(replayInterval.current);
      clearTimeout(replayStaggerTimeout.current);
    }

    if (mode === "STREAM") {
      previewScreenRef.current.style.opacity = 1;
      setReplayReady(true);
    } else if (!preview) {
      previewScreenRef.current.style.opacity = 0.5;
    }

    // Init ghost recorder
    if (mode === "GHOST") {
      if (!ghostRecorder1.current) {
        ghostRecorder1.current = new MediaRecorder(
          previewScreenRef.current.captureStream
            ? previewScreenRef.current.captureStream()
            : previewScreenRef.current.mozCaptureStream()
        );
        ghostRecorder2.current = new MediaRecorder(
          previewScreenRef.current.captureStream
            ? previewScreenRef.current.captureStream()
            : previewScreenRef.current.mozCaptureStream()
        );
        ghostRecorder1.current.ondataavailable = async (event) => {
          screen1Ref.current.srcObject = null;
          URL.revokeObjectURL(screen1Ref.current.src);
          screen1Ref.current.src = URL.createObjectURL(event.data);
          screen1Ref.current.style.zIndex = 2;
          screen2Ref.current.style.zIndex = 1;
          await screen1Ref.current.play();
          setReplayReady(true);
        };
        ghostRecorder2.current.ondataavailable = (event) => {
          screen2Ref.current.srcObject = null;
          URL.revokeObjectURL(screen2Ref.current.src);
          screen2Ref.current.src = URL.createObjectURL(event.data);
          screen2Ref.current.style.zIndex = 2;
          screen1Ref.current.style.zIndex = 1;
          screen2Ref.current.play();
          setReplayReady(true);
        };
      }

      // LOADING
      setShowLoading(true);
      loadingTimeout.current = window.setTimeout(async () => {
        if (!preview && previewScreenRef.current.style.opacity < 1) {
          screen2Ref.current.style.opacity = 1;
          screen1Ref.current.style.opacity = 1;
        }
        setShowLoading(false);
      }, ghostDelay * 1000);

      loadingCountdownInterval.current = window.setInterval(() => {
        setCountdown(countdownRef.current - 1);
        countdownRef.current = countdownRef.current - 1;
        if (countdownRef.current <= 0) {
          clearInterval(loadingCountdownInterval.current);
        }
      }, 1000);

      ghostStaggerTimeout.current = window.setTimeout(async () => {
        await ghostRecorder2.current.start();
      }, ghostDelay * 1000 * 0.5);
      ghostRecorder1.current.start();

      ghostInterval.current = window.setInterval(async () => {
        if (
          ghostRecorder1.current &&
          ghostRecorder1.current.state !== "inactive"
        ) {
          await ghostRecorder1.current.stop();
          await ghostRecorder1.current.start();
        }
        ghostStaggerTimeout.current = window.setTimeout(async () => {
          if (ghostRecorder2.current.state !== "inactive") {
            await ghostRecorder2.current.stop();
            await ghostRecorder2.current.start();
          }
        }, ghostDelay * 1000 * 0.5);
      }, ghostDelay * 1000);
    } else {
      // Stop Ghost Recorders
      await stopRecorder(ghostRecorder1);
      await stopRecorder(ghostRecorder2);
      ghostRecorder1.current = null;
      ghostRecorder2.current = null;
      clearTimeout(loadingTimeout.current);
      clearInterval(ghostInterval.current);
      clearTimeout(ghostStaggerTimeout.current);
      clearInterval(loadingCountdownInterval.current);
      screen2Ref.current.src = null;
      screen1Ref.current.src = null;
      screen2Ref.current.style.opacity = 0;
      screen1Ref.current.style.opacity = 0;
      screen2Ref.current.style.zIndex = 0;
      screen1Ref.current.style.zIndex = 0;
    }
  }, [mode]);

  return (
    <Container>
      <OverlayBox>
        <InfoBox ref={infoBoxRef}>
          <Col className="content align-center">
            <div>
              {noMediaRecorder && (
                <Apology>
                  Sorry, this browser does not support this app yet!
                </Apology>
              )}
            </div>
            <iframe
              ref={youtubeRef}
              width="560"
              height="315"
              src="https://www.youtube.com/embed/YpGR1l1sapI"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <Description>
              <div>
                One More Try uses a <b>Delay Camera</b> that lets you
                <br />
                <b>try something</b> and then <b>see it play back right away</b>
              </div>
              <br />
              <div>
                It's perfect for practicing <span>skateboarding</span>,{" "}
                <span>dance</span>, <span>magic</span>, <span>tennis</span>,{" "}
                <span>fashion</span>, <i>ANYTHING!</i>
              </div>
              <hr />
              <Footnote>
                One More Try does not collect ANY data. It works entirely in
                your browser, which means it works offline too! It's also open
                source so you can{" "}
                <a href="https://github.com/tomlum/OneMoreTry" target="_blank">
                  see for yourself!
                </a>
              </Footnote>
            </Description>
          </Col>
        </InfoBox>
      </OverlayBox>
      <PreviewScreen
        ref={previewScreenRef}
        mirror={mirror}
        autoplay
        playsinline
        muted
      />

      {preview && (
        <PreviewText>
          <b>No Delay</b>
        </PreviewText>
      )}
      {showLoading && (
        <LoadingBox>
          <h3>Get Started! Your Delay Camera is just catching up!</h3>
          <LoadingIcon>
            <LoadingSpinner time={ghostDelay}>
              <img src="https://s3.us-east-2.amazonaws.com/tomlum/omt-loading-icon.png"></img>
            </LoadingSpinner>
            <h2>{countdown}</h2>
          </LoadingIcon>
        </LoadingBox>
      )}
      <Screen
        ref={screen1Ref}
        mirror={mirror}
        autoplay
        playsinline
        muted
      ></Screen>
      <Screen
        ref={screen2Ref}
        mirror={mirror}
        autoplay
        playsinline
        muted
      ></Screen>
      <Screen
        className="holdControls"
        ref={replayScreenRef}
        autoplay
        playsinline
        controls
        loop
        muted={mute}
      ></Screen>
    </Container>
  );
}

const FrameMemo = memo(Frame);
export default FrameMemo;
