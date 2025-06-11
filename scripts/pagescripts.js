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

    if (content.classList.contains("visible")) {
      // Fade out
      content.classList.remove("fading-in");
      content.classList.add("fading-out");
      setTimeout(() => {
        content.classList.remove("visible", "fading-out");
        content.style.display = "none";
      }, 400); // Match the fade duration
    } else {
      // Fade in
      content.style.display = "block";
      content.classList.add("visible");
      setTimeout(() => {
        content.classList.add("fading-in");
      }, 10); // Delay to trigger transition
    }
  });
}

