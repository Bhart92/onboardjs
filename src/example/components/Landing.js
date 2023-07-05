import React, { useState, useEffect } from "react";
import "../../styles/index.scss";
import "../../styles/example.scss";
import img from "../img/onboard.png";
import onboard from "../../js/onboard";
const Landing = () => {
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
          // data-options={JSON.stringify({
          //   sequenceOrder: "1",
          //   timer: "2500",
          //   type: "confirm",
          //   position: {
          //     top: "0",
          //     left: "10%",
          //   },
          // })}
        >
          <div className="onboard-hint-wrapper">
            <span>Confirmation Dialogue!</span>
            <button onClick={onboard.toggleConfirmSequence}>confirm</button>
          </div>
        </div>
      </div>
      <div className="body">
        <p>body</p>
        <button onClick={onboard.startSequencer}>toggleOnboard</button>
        {/* Onboarding hint card */}
        <div
          className="onboard-hint onboard-dialogue-hint"
          // data-options={JSON.stringify({
          //   sequenceOrder: "2",
          //   timer: "2500",
          //   type: "confirm",
          //   position: {
          //     position: {
          //       top: "25px",
          //       left: "50%",
          //     },
          //   },
          // })}
        >
          <div className="onboard-hint-wrapper">
            <span>Confirmation Dialogue!</span>
            <button onClick={onboard.toggleConfirmSequence}>confirm</button>
          </div>
        </div>
      </div>
      <footer className="footer">
        <span>Footer</span>

        {/* Onboarding hint card */}
        <div
          className="onboard-hint onboard-dialogue-hint"
          data-options={JSON.stringify({
            sequenceOrder: "3",
            timer: "5000",
            type: "confirm",
            position: {
              bottom: "25px",
              right: "10%",
            },
          })}
        >
          <div className="onboard-hint-wrapper">
            <span>Confirmation Dialogue!</span>
            <button onClick={onboard.toggleConfirmSequence}>confirm</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
