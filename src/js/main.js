// Recompute the reading position beneath the resizing navigation bar.
const header = document.querySelector(".site-header");
const navLinks = [...document.querySelectorAll("nav a")];
const sections = navLinks.map((link) => document.querySelector(link.hash));
let scrollPending = false;
function updateNavigation() {
  header.classList.toggle("compact", window.scrollY > 35);
  const edge = header.getBoundingClientRect().bottom + 24;
  let current = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= edge) current = section;
  });
  if (
    Math.ceil(window.scrollY + window.innerHeight) >=
    document.documentElement.scrollHeight - 2
  )
    current = sections[sections.length - 1];
  navLinks.forEach((link) => {
    const active = link.hash === `#${current.id}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  scrollPending = false;
}
function scheduleNavigation() {
  if (!scrollPending) {
    scrollPending = true;
    requestAnimationFrame(updateNavigation);
  }
}
window.addEventListener("scroll", scheduleNavigation, { passive: true });
window.addEventListener("resize", scheduleNavigation);
header.addEventListener("transitionend", scheduleNavigation);
updateNavigation();
const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".dots button")];
const slideNames = ["Higher ground", "Under the canopy", "Still waters"];
let slideIndex = 0;
function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.hidden = i !== slideIndex;
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("selected", i === slideIndex);
    dot.setAttribute("aria-pressed", String(i === slideIndex));
  });
  document.querySelector("#slide-status").textContent = `0${
    slideIndex + 1
  } / 03 — ${slideNames[slideIndex]}`;
}
document
  .querySelector(".previous")
  .addEventListener("click", () => showSlide(slideIndex - 1));
document
  .querySelector(".next")
  .addEventListener("click", () => showSlide(slideIndex + 1));
dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));
document.querySelector(".carousel").addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showSlide(slideIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
const stories = {
  forest: {
    label: "FIELD NOTE / MINDFUL WANDERING",
    title: "The art of noticing",
    paragraphs: [
      "At first, a forest seems like one thing: green. Stay a little longer and it becomes a hundred small things. The pale edge of a leaf. A crooked branch holding a pocket of sky. Light moving across the path before you.",
      "Try walking for ten minutes without measuring how far you have gone. Choose one sense at a time. Listen for the nearest sound, then the farthest. Notice which patches of air feel cool, and where the earth smells different.",
      "You do not need a remote wilderness for this. A city park, a familiar footpath, or a single tree can be enough. Return to the same place another day and look for one thing that has changed.",
      "A small practice: pause at the next bend. Find three textures, two sounds, and one detail you would usually walk past. Leave everything where you found it.",
    ],
  },
  mountains: {
    label: "FIELD NOTE / FRESH PERSPECTIVES",
    title: "A little higher, a little lighter",
    paragraphs: [
      "From below, a ridgeline can look like a finish line. But the best part of a climb is often somewhere in the middle: the first open view, a place to sit, the moment the everyday noise falls away.",
      "There is a particular kind of relief in seeing a wide horizon. Things that filled your whole attention can become one small part of a much larger landscape. Nothing has to be solved immediately.",
      "Let the walk be its own reason. Choose a route that fits your experience, check local conditions, and leave room to turn back. The summit is optional; getting home is part of the adventure.",
      "A small practice: at your next viewpoint, put the camera away for one minute. Follow the line of the land with your eyes. Keep a memory before you make a photograph.",
    ],
  },
  lake: {
    label: "FIELD NOTE / SLOW LIVING",
    title: "In praise of doing nothing",
    paragraphs: [
      "Water gives you something to watch without asking you to keep up. A ripple crosses a reflection. A cloud moves slowly through a second sky. For once, there is no next thing.",
      "Find a comfortable spot on an established path or resting place. Give yourself permission to stay without calling it productive. You do not need to meditate perfectly or come away with a revelation.",
      "A quiet pause can fit into an ordinary afternoon. A pond in a local park will do. Bring a layer, take your litter home, and give wildlife plenty of space.",
      "A small practice: spend five minutes beside the water with your phone out of sight. Notice how often the surface changes. Let that be enough.",
    ],
  },
  credits: {
    label: "THE PEOPLE BEHIND THE VIEW",
    title: "Sources & credits",
    paragraphs: [
      "Photography: forest (photo-1448375240586-882707db888b), mountains (photo-1464822759023-fed622ff2c3b), and lake (photo-1470770841072-f978cf4d019e), downloaded from Unsplash under the Unsplash License. Full source URLs are documented in SOURCES.md.",
      "Video: flower.mp4, the MDN interactive examples CC0 nature clip. The footage is silent; its visual description is flowers moving in the breeze.",
      "Elsewhere is a fictional student project. Social links point to National Geographic, not fictional Elsewhere accounts.",
    ],
  },
};
const dialog = document.querySelector("#story-dialog");
let dialogTrigger;
document.querySelectorAll("[data-story]").forEach((button) =>
  button.addEventListener("click", () => {
    const story = stories[button.dataset.story];
    dialogTrigger = button;
    document.querySelector("#dialog-label").textContent = story.label;
    document.querySelector("#dialog-title").textContent = story.title;
    document.querySelector("#dialog-body").replaceChildren(
      ...story.paragraphs.map((text) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        return paragraph;
      })
    );
    document.body.classList.add("modal-open");
    dialog.showModal();
    dialog.scrollTop = 0;
  })
);
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
document
  .querySelector(".dialog-done")
  .addEventListener("click", () => dialog.close());
// Keep keyboard navigation inside the modal, including at either end.
dialog.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const controls = [
    ...dialog.querySelectorAll('button, a[href], [tabindex="0"]'),
  ];
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom)
  )
    dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  if (dialogTrigger) dialogTrigger.focus({ preventScroll: true });
});
