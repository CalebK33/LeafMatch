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
      content.style.height = content.scrollHeight + 'px'; 
      requestAnimationFrame(() => {
        content.style.height = '0';
      });
      content.classList.remove("open");
    } else {
      content.classList.add("open");
      const fullHeight = content.scrollHeight + 'px';
      content.style.height = fullHeight;

      content.addEventListener("transitionend", function clearHeight() {
        if (content.classList.contains("open")) {
          content.style.height = 'auto';
        }
        content.removeEventListener("transitionend", clearHeight);
      });
    }
  });
}
