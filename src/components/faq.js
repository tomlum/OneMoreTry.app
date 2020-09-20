import { Row, ThemeColor } from "./components";
import { useEffect, useRef, useState } from "preact/hooks";

import styled from "styled-components";

const AccordionHeader = styled.div`
  background-color: #eceef4;
  border: solid 3px #9b9ca1;
  border-radius: 3px;
  padding: 10px;
  margin-top: 5px;
  cursor: pointer;
`;
const AccordionBody = styled.div`
  background-color: #eceef4;
  border: solid 3px #9b9ca1;
  border-top: solid 2px #9b9ca1;
  border-radius: 3px;
  padding: 10px;
  margin-top: -3px;
`;
function Accordion({ title, content }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => {
        setOpen(!open);
      }}
    >
      <AccordionHeader>
        <b>{title}</b>
      </AccordionHeader>
      {open && <AccordionBody>{content}</AccordionBody>}
    </div>
  );
}

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
  background-color: #e6e9ef;
  min-width: 700px;
  padding: 20px;
  box-shadow: 0px 0px 10px 1px #333;

  h1 {
    font-size: 25px;
    margin: 0px;
    margin-bottom: 4px;
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

  a {
    color: #4459c6;
  }

  span {
    display: flex;
    align-items: center;

    img {
      width: 30px;
      height: 30px;
      padding: 4px;
      border: solid 1px black;
      background-color: white;
      margin-right: 5px;
    }
  }

  button {
    width: 30px;
    height: 30px;
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
            className="flex justify-center align-center"
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
      <Accordion
        title={`⏱ What's the difference between "Delay" seconds and "Replay" seconds?`}
        content={
          <div>
            Delay time is how long the camera is delayed for. Replay time is how
            many seconds back in time before what you see on the screen to
            record for the final replay. In total your final replay will be
            roughly Delay + Replay seconds long.
          </div>
        }
      />
      <Accordion
        title={"🎛 What do all the icon buttons mean?"}
        content={
          <div>
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
        }
      />
      <Accordion
        title={`🔊 Why can't I hear my audio playing back? / Why am I getting audio
        feedback?`}
        content={
          <div>
            While using the camera, there should be a little mute/unmute button
            on the bottom right corner of the video. If you unmute, be sure to
            be using headphones or a dedicated microphone, or else you may get
            unwanted audio feedback.
          </div>
        }
      />
      <Accordion
        title={`↔️ Why can't I control my replay?`}
        content={
          <div>
            Depending on how long your replay video is, you may need to play it
            once start to finish before the controls load. This is because the
            video needs to load into the player first.
          </div>
        }
      />
      <Accordion
        title={`🎥 Why is my download a .webm file?`}
        content={
          <div>
            Unfortunately, due to technical limitations of browsers, that's the
            default video file type. In order to keep OneMoreTry.app free and
            fast, you'll have to do the file conversion yourself, my apologies!
            I highly recommend using{" "}
            <a href="https://handbrake.fr/">Handbrake</a>!
          </div>
        }
      />

      <Accordion
        title={`🏔 How would I use the app offline?`}
        content={
          <div>
            <div>
              If you're on chrome you can also install it as a dedicated app
              <img
                className="mt5"
                src="https://s3.us-east-2.amazonaws.com/tomlum/omt-pwa-chrome.png"
              ></img>
            </div>
            <br />
            <div>
              Otherwise, while you still have an internet connection, you can
              visit the page. Once it's loaded, you can now use the app freely
              without an internet connection. Also, most browsers will cache the
              page, so if you visit it directly without an internet connection,
              it may still work!
            </div>
          </div>
        }
      />

      <Accordion
        title={`📱 Why doesn't this work on mobile/safari?`}
        content={
          <div>
            Sadly, mobile browsers and safari are missing some features that are
            essential for the delay camera to work (though I'm investigating
            other solutions to get around this)
          </div>
        }
      />

      <Accordion
        title={`🔐 Do you collect my data? (No)`}
        content={
          <div>
            Nope! The app works entirely locally on your computer. In fact,
            after you visit the page, you don't even need an internet connection
            to get it to work! If you're curious, this app is open source so you
            can see the code for yourself{" "}
            <a href="https://github.com/tomlum/OneMoreTry">here</a>!
          </div>
        }
      />

      <Accordion
        title={`🤘 Can I donate to support this?`}
        content={
          <div>
            I swear a real person actually asked me this. I really had no
            intention of it but if you feel so inclined you can donate to
            support this site and others here:
            <form
              action="https://www.paypal.com/cgi-bin/webscr"
              method="post"
              target="_top"
            >
              <input type="hidden" name="cmd" value="_donations" />
              <input type="hidden" name="business" value="ZMHX8U6A5JARG" />
              <input
                type="hidden"
                name="item_name"
                value="To continue building and maintaining useful and free software tools!"
              />
              <input type="hidden" name="currency_code" value="USD" />
              <input
                type="image"
                src="https://s3.us-east-2.amazonaws.com/tomlum/omt-donate-button.png"
                border="0"
                name="submit"
                title="PayPal - The safer, easier way to pay online!"
                alt="Donate with PayPal button"
              />
            </form>
          </div>
        }
      />
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
