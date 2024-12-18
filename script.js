// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Zoom-Out Effect for the Intro Text
gsap.to(".zoom-text", {
  scale: 6, // Zoom-out effect
  opacity: 0, // Fade out
  scrollTrigger: {
    trigger: "#intro",
    start: "top top",
    end: "top -175%", // Longer scroll distance
    scrub: true, // Smooth animation tied to scroll
    pin: true, // Keeps the intro section pinned
    onLeave: () => {
      // Add 'active' class with faster animation
      gsap.to(".portfolio-content", {
        opacity: 1,
        y: 0,
        duration: 0.8, // Faster animation duration
        ease: "power2.out",
      });
    },
    onEnterBack: () => {
      // Remove 'active' class with faster animation
      gsap.to(".portfolio-content", {
        opacity: 0,
        y: 50,
        duration: 0.8, // Faster animation duration
        ease: "power2.in",
      });
    },
  },
});

// Ensure Name Reappears After Portfolio Content is Hidden
ScrollTrigger.create({
  trigger: "#intro",
  start: "top -175%",
  end: "top top",
  scrub: true,
  onEnterBack: () => {
    gsap.to(".zoom-text", {
      opacity: 1,
      scale: 1,
      duration: 0.8, // Smooth reappearance
      ease: "power2.out",
    });
  },
});
