import React, { useEffect } from "react";
import "../../styles/index.scss";
import "../../styles/example.scss";
import img from "../img/onboard.png";
import onboard from "../../js/onboard";
const Landing = () => {
  const backgroundOptions = {
    color: "rgba(35, 42, 0, .65)",
  };
  useEffect(() => {
    onboard.init();
  }, []);
  return (
    <div className="landing-wrapper">
      <div className="title">
        <h1>title</h1>
        {/* Onboarding hint card */}
        <div
          className="onboard-hint onboard-dialogue-hint"
          data-sequence={"1"}
          data-timer={"2500"}
          data-type={"confirm"}
          data-position={JSON.stringify({
            top: "50",
            left: "50",
            format: "%",
          })}
        >
          <div className="onboard-hint-wrapper">
            <span>Confirmation Dialogue!</span>
            <button onClick={onboard.toggleConfirmSequence}>confirm</button>
          </div>
        </div>
      </div>
      <div className="body">
        <p>body</p>
        <button onClick={onboard.startTimedSequencer}>toggleOnboard</button>
        {/* Onboarding hint card */}
        <div
          className="onboard-hint onboard-image-hint"
          data-sequence={"2"}
          data-timer={"3500"}
          data-type={"timed"}
          data-position={JSON.stringify({
            top: "50",
            left: "50",
            format: "%",
          })}
        >
          <div className="onboard-hint-wrapper">
            <img src={img} alt={"img alt"} />
          </div>
        </div>
      </div>
      <footer className="footer">
        <span>Footer</span>

        {/* Onboarding hint card */}
        <div
          className="onboard-hint onboard-dialogue-hint"
          data-sequence={"3"}
          data-type={"timed"}
          data-position={JSON.stringify({
            top: "50",
            left: "50",
            format: "%",
          })}
        >
          <div className="onboard-hint-wrapper">
            <span>Timed Dialogue</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
