import { Row, ThemeColor } from "./components";
import { useEffect, useRef, useState } from "preact/hooks";

import styled from "styled-components";

export const FAQButtonRing = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  color: black;
  font-size: 20px;
  padding-top: 1px;
  color: ${ThemeColor};
  border: solid 3px ${ThemeColor};
  cursor: pointer;
`;

export const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 20;
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  margin: auto;
  width: 400px;
  font-family: arial;
  border: solid 5px ${ThemeColor};
  border-radius: 10px;
  color: black;
  background-color: #d5d7dc;
  min-width: 700px;
  padding: 20px;

  h1 {
    font-size: 25px;
    margin: 0px;
  }
  h2 {
    font-size: 17px;
    margin: 0px;
  }
  b {
    margin-top: 20px;
  }
  div {
    font-size: 17px;
    width: 100%;
    color: black;
  }

  span {
    display: flex;
    align-items: center;
  }

  button {
    width: 30px;
    height: 30px;
  }

  img {
    width: 30px;
    height: 30px;
    padding: 4px;
    border: solid 1px black;
    background-color: white;
    margin-right: 5px;
  }

  .qa {
    padding-top: 20px;
  }
`;

export function FAQ({ setShowFAQ }) {
  const FAQRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (FAQRef.current && !FAQRef.current.contains(e.target)) {
      setShowFAQ(false);
    }
  };

  return (
    <Overlay ref={FAQRef}>
      <Row>
        <div className="flex1"></div>
        <Row className="flex1">
          <h1>FAQ</h1>
        </Row>
        <div className="flex flex1 justify-end">
          <button
            onClick={() => {
              setShowFAQ(false);
            }}
          >
            X
          </button>
        </div>
      </Row>
      <h2>
        Have a question? Reach out at{" "}
        <a href="https://twitter.com/tomlumperson">@TomLumPerson</a> on twitter
      </h2>

      <div className="qa">
        <div>
          <b>
            What's the difference between "Delay" seconds and "Replay" seconds?
          </b>
        </div>
        <div>
          Delay time is how long the camera is delayed for. Replay time is how
          many seconds back in time before what you see on the screen to record
          for the final replay. In total your final replay will be roughly Delay
          + Replay seconds long.
        </div>
      </div>

      <div className="qa">
        <div>
          <b>What do all the icon buttons mean?</b>
        </div>
        <div>
          <span>
            <img src="https://s3.us-east-2.amazonaws.com/tomlum/omt-mirror-icon.png"></img>
            lets you mirror the camera
          </span>
        </div>
        <div>
          <span>
            <img src="https://s3.us-east-2.amazonaws.com/tomlum/omt-align-icon.png"></img>
            turns off the delay so you can setup the position of your camera
          </span>
        </div>
        <div>
          <span>
            <img src="https://s3.us-east-2.amazonaws.com/tomlum/omt-mute-off.png"></img>
            toggles muting the replay
          </span>
        </div>
        <div>
          <span>
            <img src="https://s3.us-east-2.amazonaws.com/tomlum/omt-download.png"></img>
            lets you download your replay
          </span>
        </div>
      </div>

      <div className="qa">
        <div>
          <b>Why can't I control my replay?</b>
        </div>
        <div>
          Depending on how long your replay video is, you may need to play it
          once start to finish before the controls load. This is because the
          video needs to load into the player first.
        </div>
      </div>

      <div className="qa">
        <div>
          <b>Why is my download a .webm file?</b>
        </div>
        <div>
          Unfortunately, due to technical limitations of browsers, that's the
          default video file type. In order to keep OneMoreTry.app free and
          fast, you'll have to do the file conversion yourself, my apologies! I
          highly recommend using <a href="https://handbrake.fr/">Handbrake</a>!
        </div>
      </div>

      <div className="qa">
        <div>
          <b>How would I use the app offline?</b>
        </div>
        <div>
          First, while you still have an internet connection, visit the page.
          Once it's loaded, you can now use the app freely without an internet
          connection. Also, most browsers will cache the page, so if you visit
          it directly without an internet connection, it may still work!
        </div>
      </div>

      <div className="qa">
        <div>
          <b>Do you collect my data?</b>
        </div>
        <div>
          Nope! The app works entirely locally on your computer. In fact, after
          you visit the page, you don't even need an internet connection to get
          it to work! If you're curious, this app is open source so you can see
          the code for yourself{" "}
          <a href="https://github.com/tomlum/OneMoreTry">here</a>!
        </div>
      </div>
    </Overlay>
  );
}

export function FAQButton({ setShowFAQ }) {
  return (
    <span title="FAQ">
      <FAQButtonRing
        onClick={(e) => {
          setShowFAQ(true);
        }}
      >
        <b>?</b>
      </FAQButtonRing>
    </span>
  );
}
