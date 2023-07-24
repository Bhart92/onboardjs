if (typeof exports != "undefined") {
  exports.onboard = {
    initialized: false,

    onboardingHintTarget: "onboard-hint",
    hintElements: [],
    isRunning: false,
    hasBackground: true,
    backgroundElement: null,

    currentHintType: "timed",

    currIndex: 0,
    finalIndex: null,
    // parameters control background color,
    // wrapper it will attach to,
    // or if its even required
    init: function ({
      hasBackground = true,
      backgroundParentWrapper = "body",
      color = "rgba( 0, 0, 0, .5)",
    } = {}) {
      // if background is false then update value on obj
      if (!hasBackground) this.hasBackground = hasBackground;

      if (this.hasBackground) {
        // create div
        const background = document.createElement("div");

        // add background color
        background.style.background = color;

        // add appropriate background classes
        background.classList.add("onboard-background", "inactive");

        // attach to direct parent element - can be changed by object passed into init func
        document.querySelector(backgroundParentWrapper).appendChild(background);

        // save background to obj
        this.backgroundElement = background;
      }

      // Grab all elements with the 'onboard-hint' class
      const onboardHints = Array.from(
        document.querySelectorAll(`.${this.onboardingHintTarget}`)
        // sort them ascending order using the data-sequence attribute
      ).sort(function (a, b) {
        return (
          JSON.parse(a.dataset.options).sequenceOrder -
          JSON.parse(b.dataset.options).sequenceOrder
        );
      });
      // force absolute positioning on all onboard hints
      onboardHints.map(
        (currentHint) => (currentHint.style.position = "absolute")
      );
      Array.from(document.querySelectorAll(".onboard-hint button")).map((ele) =>
        ele.addEventListener("click", () => {
          onboard.toggleConfirmSequence();
        })
      );

      // If no sequencing targets are found then throw error
      if (onboardHints.length === 0)
        throw new Error(
          "Cannot find target elements. Please ensure DOM is loaded before onboard is initialized."
        );

      // save onbord hint elements to object
      this.hintElements = onboardHints;

      // set initialization to true if we can grab an array of elements
      if (this.hintElements.length <= 1) this.initialized = true;
    },
    startSequencer: function (next) {
      // begin onboarding sequncer
      if (!onboard.isRunning) onboard.isRunning = true;

      let currentSequence = onboard.hintElements[onboard.currIndex];

      let options = currentSequence.dataset?.options
        ? JSON.parse(currentSequence.dataset.options)
        : {};

      const { type, timer, top, right, left, bottom } = options;
      // currently supports timed and confirm
      let sequenceType = type || "timed";

      onboard.currentHintType = sequenceType;

      // absolute position relative to the direct parent element
      // obj passed to each individual onboard hint element from data attribute
      // JSON.stringify and JSON.parse are necessary to pass an object through data attribute
      if (!top && !left && !bottom && !right) {
        let sequencePos = {
          top: "0px",
          left: "50%",
        };

        currentSequence.style.top = sequencePos.top;

        currentSequence.style.left = sequencePos.left;
      }

      // Sets absolute positioning based on the presence of the corresponding
      // property passed into the onboard elements data-position attribute
      if (top) {
        currentSequence.style.top = top;
      }
      if (right) {
        currentSequence.style.right = right;
      }
      if (bottom) currentSequence.style.bottom = bottom;
      if (left) currentSequence.style.left = left;

      // amount of time for each timed onboard hint to be displayed
      let sequenceTimer = timer || 2500;

      // current onboard hint's direct parent element
      let elementParent = currentSequence.parentElement;

      // force parent elements position to relative
      // this forces the onboard hint's position to be relative to the direct parent element
      elementParent.style.position = "relative";

      // final index of sequence elements array
      onboard.finalIndex = onboard.hintElements.length - 1;

      // Display background
      if (onboard.hasBackground) onboard.toggleBackground();

      // Toggles the first onboarding hint in hintElements array
      currentSequence.classList.add("active-sequence");

      // checks current onboard hint if it is timed, or confirmation
      if (sequenceType === "timed") {
        // if type is timer then begin the timeout
        // pass in the value grabbed from data-timer attribute on our onboard-hint element
        onboard.toggleTimedSequence(sequenceTimer);
        return;
      }
    },
    toggleTimedSequence: (sequenceTimer) => {
      // if type is timer then begin the timeout
      // pass in the value grabbed from data-timer attribute on our onboard-hint element
      const timeout = setTimeout(() => {
        // when timer is finished remove active class from current onboard hint
        onboard.removeActiveClass(onboard.currIndex);

        // Iterates to next onboard hint
        onboard.currIndex += 1;

        // Check if we iterate past final index
        if (onboard.currIndex > onboard.finalIndex) {
          // terminate timeout
          clearTimeout(timeout);

          // reset onboard sequencer
          onboard.resetSequencer();

          // toggle off background
          if (onboard.hasBackground) onboard.toggleBackground(true);

          return;
        }

        // if we are not at the final index fire the sequencer again
        onboard.startSequencer();
      }, sequenceTimer);
    },
    toggleConfirmSequence: function () {
      // Prevent confirm button from firing if current onboard hint is type timed
      if (onboard.currentHintType === "timed") return;

      // remove active class from current onboard hint
      onboard.removeActiveClass(onboard.currIndex);

      // iterate to next onboard hint
      onboard.currIndex += 1;

      // Check if we iterate past final index
      if (onboard.currIndex > onboard.finalIndex) {
        // reset onboard sequencer
        onboard.resetSequencer();

        // toggle off background
        onboard.toggleBackground(true);
        return;
      }
      onboard.startSequencer();
    },
    toggleBackground: function (boolean = false) {
      // true turns background off
      // false turns background on
      return boolean
        ? onboard.backgroundElement.classList.add("inactive")
        : onboard.backgroundElement.classList.remove("inactive");
    },
    removeActiveClass: function (i) {
      // remove active class from the currently active onboard hint
      onboard.hintElements[i].classList.remove("active-sequence");
    },
    resetSequencer: function () {
      // reset initial values
      onboard.initialized = false;
      onboard.isRunning = false;
      onboard.currIndex = 0;
      onboard.finalIndex = null;
      // toggle background
      if (onboard.hasBackground) onboard.toggleBackground(true);
    },
    getisRunning: function () {
      return onboard.isRunning;
    },
  };
} else {
  const onboard = {
    initialized: false,

    onboardingHintTarget: "onboard-hint",
    hintElements: [],
    isRunning: false,
    hasBackground: true,
    backgroundElement: null,

    currentHintType: "timed",

    currIndex: 0,
    finalIndex: null,
    // parameters control background color,
    // wrapper it will attach to,
    // or if its even required
    init: function ({
      hasBackground = true,
      backgroundParentWrapper = "body",
      color = "rgba( 0, 0, 0, .5)",
    } = {}) {
      // if background is false then update value on obj
      if (!hasBackground) this.hasBackground = hasBackground;

      if (this.hasBackground) {
        // create div
        const background = document.createElement("div");

        // add background color
        background.style.background = color;

        // add appropriate background classes
        background.classList.add("onboard-background", "inactive");

        // attach to direct parent element - can be changed by object passed into init func
        document.querySelector(backgroundParentWrapper).appendChild(background);

        // save background to obj
        this.backgroundElement = background;
      }

      // Grab all elements with the 'onboard-hint' class
      const onboardHints = Array.from(
        document.querySelectorAll(`.${this.onboardingHintTarget}`)
        // sort them ascending order using the data-sequence attribute
      ).sort(function (a, b) {
        return (
          JSON.parse(a.dataset.options).sequenceOrder -
          JSON.parse(b.dataset.options).sequenceOrder
        );
      });
      // force absolute positioning on all onboard hints
      onboardHints.map(
        (currentHint) => (currentHint.style.position = "absolute")
      );
      Array.from(document.querySelectorAll(".onboard-hint button")).map((ele) =>
        ele.addEventListener("click", () => {
          onboard.toggleConfirmSequence();
        })
      );

      // If no sequencing targets are found then throw error
      if (onboardHints.length === 0)
        throw new Error(
          "Cannot find target elements. Please ensure DOM is loaded before onboard is initialized."
        );

      // save onbord hint elements to object
      this.hintElements = onboardHints;

      // set initialization to true if we can grab an array of elements
      if (this.hintElements.length <= 1) this.initialized = true;
    },
    startSequencer: function (next) {
      // begin onboarding sequncer
      if (!onboard.isRunning) onboard.isRunning = true;

      let currentSequence = onboard.hintElements[onboard.currIndex];

      let options = currentSequence.dataset?.options
        ? JSON.parse(currentSequence.dataset.options)
        : {};

      const { type, timer, top, right, left, bottom } = options;
      // currently supports timed and confirm
      let sequenceType = type || "timed";

      onboard.currentHintType = sequenceType;

      // absolute position relative to the direct parent element
      // obj passed to each individual onboard hint element from data attribute
      // JSON.stringify and JSON.parse are necessary to pass an object through data attribute
      if (!top && !left && !bottom && !right) {
        let sequencePos = {
          top: "0px",
          left: "50%",
        };

        currentSequence.style.top = sequencePos.top;

        currentSequence.style.left = sequencePos.left;
      }

      // Sets absolute positioning based on the presence of the corresponding
      // property passed into the onboard elements data-position attribute
      if (top) {
        currentSequence.style.top = top;
      }
      if (right) {
        currentSequence.style.right = right;
      }
      if (bottom) currentSequence.style.bottom = bottom;
      if (left) currentSequence.style.left = left;

      // amount of time for each timed onboard hint to be displayed
      let sequenceTimer = timer || 2500;

      // current onboard hint's direct parent element
      let elementParent = currentSequence.parentElement;

      // force parent elements position to relative
      // this forces the onboard hint's position to be relative to the direct parent element
      elementParent.style.position = "relative";

      // final index of sequence elements array
      onboard.finalIndex = onboard.hintElements.length - 1;

      // Display background
      if (onboard.hasBackground) onboard.toggleBackground();

      // Toggles the first onboarding hint in hintElements array
      currentSequence.classList.add("active-sequence");

      // checks current onboard hint if it is timed, or confirmation
      if (sequenceType === "timed") {
        // if type is timer then begin the timeout
        // pass in the value grabbed from data-timer attribute on our onboard-hint element
        onboard.toggleTimedSequence(sequenceTimer);
        return;
      }
    },
    toggleTimedSequence: (sequenceTimer) => {
      // if type is timer then begin the timeout
      // pass in the value grabbed from data-timer attribute on our onboard-hint element
      const timeout = setTimeout(() => {
        // when timer is finished remove active class from current onboard hint
        onboard.removeActiveClass(onboard.currIndex);

        // Iterates to next onboard hint
        onboard.currIndex += 1;

        // Check if we iterate past final index
        if (onboard.currIndex > onboard.finalIndex) {
          // terminate timeout
          clearTimeout(timeout);

          // reset onboard sequencer
          onboard.resetSequencer();

          // toggle off background
          if (onboard.hasBackground) onboard.toggleBackground(true);

          return;
        }

        // if we are not at the final index fire the sequencer again
        onboard.startSequencer();
      }, sequenceTimer);
    },
    toggleConfirmSequence: function () {
      // Prevent confirm button from firing if current onboard hint is type timed
      if (onboard.currentHintType === "timed") return;

      // remove active class from current onboard hint
      onboard.removeActiveClass(onboard.currIndex);

      // iterate to next onboard hint
      onboard.currIndex += 1;

      // Check if we iterate past final index
      if (onboard.currIndex > onboard.finalIndex) {
        // reset onboard sequencer
        onboard.resetSequencer();

        // toggle off background
        onboard.toggleBackground(true);
        return;
      }
      onboard.startSequencer();
    },
    toggleBackground: function (boolean = false) {
      // true turns background off
      // false turns background on
      return boolean
        ? onboard.backgroundElement.classList.add("inactive")
        : onboard.backgroundElement.classList.remove("inactive");
    },
    removeActiveClass: function (i) {
      // remove active class from the currently active onboard hint
      onboard.hintElements[i].classList.remove("active-sequence");
    },
    resetSequencer: function () {
      // reset initial values
      onboard.initialized = false;
      onboard.isRunning = false;
      onboard.currIndex = 0;
      onboard.finalIndex = null;
      // toggle background
      if (onboard.hasBackground) onboard.toggleBackground(true);
    },
    getisRunning: function () {
      return onboard.isRunning;
    },
  };
}
export default onboard;
