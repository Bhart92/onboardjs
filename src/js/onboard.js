const onboard = {
  initialized: false,

  onboardingTarget: "onboard-hint",
  sequenceElements: [],
  isrunning: false,

  hasBackground: true,
  backgroundElement: null,

  currentHintType: "timed",

  currIndex: 0,
  finalIndex: null,

  // sets up basic things needed for functionality
  init: function ({
    hasBackground = true,
    backgroundParentWrapper = "body",
    color = "rgba( 0, 0, 0, .5)",
  } = {}) {
    // if background is false then update value on obj
    if (!hasBackground) this.hasBackground = hasBackground;
    // Create background and add it to parent element (body tag by default)
    if (this.hasBackground) {
      const background = document.createElement("div");
      background.style.background = color;
      background.classList.add("onboard-background", "inactive");
      document.querySelector(backgroundParentWrapper).appendChild(background);
      this.backgroundElement = background;
    }

    // Grab all elements with the 'onboard-hint' class
    // sort them ascending order using the data-sequence attribute
    const sequencingTargets = Array.from(
      document.querySelectorAll(`.${this.onboardingTarget}`)
    ).sort(function (a, b) {
      return +a.dataset.sequence - +b.dataset.sequence;
    });
    sequencingTargets.map((current) => (current.style.position = "absolute"));

    // If no sequencing targets are found then throw error
    if (sequencingTargets.length === 0)
      throw new Error(
        "Cannot find target elements. Please ensure DOM is loaded before onboard is initialized."
      );

    // save elements to object
    this.sequenceElements = sequencingTargets;

    // set initialization to true if we can grab an array of elements
    if (this.sequenceElements.length <= 1) this.initialized = true;
  },
  // Begin the sequencer
  startTimedSequencer: function () {
    // begin onboarding
    if (!onboard.isrunning) onboard.isrunning = true;

    let currentSequence = onboard.sequenceElements[onboard.currIndex];

    let sequenceType = currentSequence.dataset.type || "timed";
    onboard.currentHintType = sequenceType;
    let sequencePos = currentSequence.dataset.position
      ? JSON.parse(currentSequence.dataset.position)
      : {
          top: "0px",
          right: "0px",
        };
    let sequencePosFormat = sequencePos?.format ? sequencePos.format : "px";

    if (sequencePos.hasOwnProperty("top"))
      currentSequence.style.top = `${sequencePos.top}${sequencePosFormat}`;
    if (sequencePos.hasOwnProperty("right"))
      currentSequence.style.right = `${sequencePos.right}${sequencePosFormat}`;
    if (sequencePos.hasOwnProperty("bottom"))
      currentSequence.style.bottom = `${sequencePos.bottom}${sequencePosFormat}`;
    if (sequencePos.hasOwnProperty("left"))
      currentSequence.style.left = `${sequencePos.left}${sequencePosFormat}`;

    let sequenceTimer = currentSequence.dataset.timer || 2500;

    let elementParent = currentSequence.parentElement;

    elementParent.style.position = "relative";

    // calculate length of array of elements
    onboard.finalIndex = onboard.sequenceElements.length - 1;

    // Display background
    if (onboard.hasBackground) onboard.toggleBackground();

    // Toggles the first onboarding sequence
    currentSequence.classList.add("active-sequence");
    if (sequenceType === "timed") {
      const timeout = setTimeout(() => {
        onboard.removeActiveClass(onboard.currIndex);

        // Iterates to next step and clears timeout
        onboard.currIndex += 1;

        if (onboard.currIndex > onboard.finalIndex) {
          clearTimeout(timeout);
          onboard.resetSequencer();
          if (onboard.hasBackground) onboard.toggleBackground(true);
          return;
        }
        onboard.startTimedSequencer();
      }, sequenceTimer);
      return;
    }
  },
  toggleConfirmSequence: function () {
    if (onboard.currentHintType === "timed") return;
    console.log("fired confirm");
    // Iterates to next step and clears timeout

    onboard.removeActiveClass(onboard.currIndex);
    onboard.currIndex += 1;
    if (onboard.currIndex > onboard.finalIndex) {
      onboard.resetSequencer();
      onboard.toggleBackground(true);
      return;
    }
    onboard.startTimedSequencer();
  },
  toggleBackground: function (boolean = false) {
    // true turns background off
    // false turns background on
    return boolean
      ? onboard.backgroundElement.classList.add("inactive")
      : onboard.backgroundElement.classList.remove("inactive");
  },
  // used to remove active class from sequence
  removeActiveClass: function (i) {
    onboard.sequenceElements[i].classList.remove("active-sequence");
  },
  // resets all variables used for tracking status of onboard-hint
  resetSequencer: function (interval) {
    clearInterval(interval);
    onboard.initialized = false;
    onboard.isrunning = false;

    onboard.currIndex = 0;
    onboard.finalIndex = null;
    if (onboard.hasBackground) onboard.toggleBackground(true);
  },
};
export default onboard;
