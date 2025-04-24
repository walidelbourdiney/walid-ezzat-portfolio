// Simple Typewriter Animation
function startTypewriterAnimation() {
  const element = document.getElementById("typewriter");
  const cursor = document.getElementById("cursor");
  const text =
    "Mechanical engineer → front-end dev. → Now I build websites that pop.";
  let currentChar = 0;

  function typeCharacter() {
    if (currentChar >= text.length) {
      cursor.style.display = "none";
      return;
    }

    const char = text[currentChar];

    // Special arrow effect
    if (text.substring(currentChar).startsWith("→")) {
      element.innerHTML +=
        '<span class="text-cyan-400 opacity-0 arrow">→</span>';
      const arrow = element.querySelector(".arrow");

      setTimeout(() => {
        arrow.classList.replace("opacity-0", "opacity-100");
        currentChar++;

        setTimeout(() => {
          typeCharacter();
        }, 500); // Pause after arrow
      }, 100);
    } else {
      element.innerHTML += char;
      currentChar++;

      // Vary typing speed
      let speed = 100;
      if (char === "." || char === ",") speed = 300;
      if (char === " ") speed = 50;

      setTimeout(typeCharacter, speed);
    }
  }

  // Start animation after 1 second
  setTimeout(typeCharacter, 1000);
}

// Initialize when page loads
window.addEventListener("load", () => {
  startTypewriterAnimation();

  // Navigation active state
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("text-cyan-400"));
      link.classList.add("text-cyan-400");
    });
  });

  // Intersection Observer for fade-in animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100");
          entry.target.classList.remove("opacity-0", "translate-y-4");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("section").forEach((section) => {
    section.classList.add(
      "transition-all",
      "duration-700",
      "opacity-0",
      "translate-y-4"
    );
    observer.observe(section);
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
  // form handling
  document
    .getElementById("contact-form")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.innerHTML;

      // Show loading state
      button.innerHTML = "<span>Sending...</span>";
      button.disabled = true;

      try {
        // REAL submission to FormSubmit
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to send");

        // Success UI
        button.innerHTML = "<span>Message Sent!</span>";
        form.reset();

        // Terminal-style success message
        const terminalFeedback = document.createElement("div");
        terminalFeedback.className =
          "mt-4 text-green-400 flex items-center gap-2";
        terminalFeedback.innerHTML = `
            <span>→</span>
            <span>Message received! I'll get back to you soon.</span>
        `;
        form.appendChild(terminalFeedback);
      } catch (error) {
        button.innerHTML = "<span>Error - Try Again</span>";
        console.error("Form error:", error);
      } finally {
        setTimeout(() => {
          button.innerHTML = originalText;
          button.disabled = false;
        }, 3000);
      }
    });
});
