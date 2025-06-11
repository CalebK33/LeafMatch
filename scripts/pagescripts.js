function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
}

if (!navigator.userAgent.match(/Android|iPhone|iPod|BlackBerry|Windows Phone/i)) {
  document.getElementById("sidebar").style.width = "33%";
}

const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    const content = this.nextElementSibling;

    if (content.classList.contains("open")) {
      // Collapse
      content.style.height = content.scrollHeight + "px"; // Set to current height first
      requestAnimationFrame(() => {
        content.style.height = "0px";
        content.classList.remove("open");
      });
    } else {
      // Expand
      content.classList.add("open");
      content.style.height = "auto"; // Reset first in case it's stuck
      const height = content.scrollHeight + "px";
      content.style.height = "0px"; // Force it to start collapsed
      requestAnimationFrame(() => {
        content.style.height = height;
      });

      // Clean up inline height after animation
      content.addEventListener("transitionend", function handler() {
        if (content.classList.contains("open")) {
          content.style.height = "auto";
        }
        content.removeEventListener("transitionend", handler);
      });
    }
  });
}
