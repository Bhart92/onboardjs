const onboard = {
  // sets up basic things needed for functionality
  init: function (
    sequenceTargetClass = "onboarder",
    backgroundParentWrapper = "body"
  ) {
    // Create background and add it to parent element (body tag by default)
    const background = document.createElement("div");
    background.classList.add("onboard-background", "inactive");
    document.querySelector(backgroundParentWrapper).appendChild(background);
    this.backgroundElement = background;

    // Grab all elements with the class passed in as the parameter 'sequenceTargetClass'
    // sort ascending order them using the data-sequence attribute
    const targets = Array.from(
      document.querySelectorAll(`.${sequenceTargetClass}`)
    ).sort(function (a, b) {
      return +a.dataset.sequence - +b.dataset.sequence;
    });

    // save elements to object
    this.sequenceElements = targets;

    // calculate length of array of elements
    this.finalIndex = targets.length - 1;

    // set initialization to true if we can grab an array of elements
    if (this.sequenceElements.length <= 1) {
      this.initialized = true;
    }
  },
  initialized: false,
  sequenceElements: [],
  isrunning: false,
  backgroundElement: null,
  backgroundActive: false,

  currIndex: 0,
  finalIndex: null,
  startSequencer: function () {
    // if onboarding is running prevent it from running in another instance
    // if background has not been created yet - prevent from running
    if (!onboard.backgroundElement || onboard.isrunning) return;

    // begin onboarding
    onboard.isrunning = true;

    // Display background
    onboard.backgroundElement.classList.toggle("inactive");
    onboard.backgroundActive = true;

    // Toggles the first onboarding sequence
    onboard.sequenceElements[onboard.currIndex].classList.add(
      "active-sequence"
    );

    // begins the interval for setting the remaining sequences
    const interval = setInterval(() => {
      // checks if current index is less than or equal to final index of sequence array
      if (onboard.currIndex <= onboard.finalIndex) {
        // removes active class from first step
        onboard.removeActiveClass(0);

        // Adds active class to next step in the array
        onboard.sequenceElements[onboard.currIndex].classList.add(
          "active-sequence"
        );

        // After 2 seconds removes active class from current step before iteration
        const timeout = setTimeout(() => {
          onboard.removeActiveClass(onboard.currIndex);

          // Iterates to next step and clears timeout
          onboard.currIndex += 1;
          clearTimeout(timeout);
        }, 2000);
      } else {
        // onboarding is finished
        onboard.isrunning = false;
        // hide background
        onboard.backgroundElement.classList.add("inactive");
        // stops onboarder
        onboard.resetSequencer(interval);
        return;
      }
    }, 2500);
  },
  // used to remove active class from sequence
  removeActiveClass: function (i) {
    onboard.sequenceElements[i].classList.remove("active-sequence");
  },
  // resets all variables used for tracking status of onboarder
  resetSequencer: function (interval) {
    clearInterval(interval);
    onboard.initialized = false;
    onboard.isrunning = false;

    onboard.currIndex = 0;
    onboard.finalIndex = null;
    onboard.backgroundElement.classList.add("inactive");
    onboard.backgroundActive = false;
  },
};
export default onboard;
