import React, { useEffect } from "react";
import "../../styles/index.scss";
import onboard from "../../js/onboard";
import SequenceBox from "../../components/SequenceBox";
const Landing = () => {
  useEffect(() => {
    onboard.init("onboarder");
  }, []);
  return (
    <div className="landing-wrapper">
      <div className="onboarder title" data-sequence={"3"}>
        <h1>title</h1>
      </div>
      <div className="onboarder body" data-sequence={"1"}>
        <p>body</p>
        <button onClick={onboard.startSequencer}>toggleOnboard</button>
      </div>
      <footer className="onboarder footer" data-sequence={"2"}>
        <span>Footer</span>
      </footer>
    </div>
  );
};

export default Landing;
