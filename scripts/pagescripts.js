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
      content.style.opacity = "0";
      setTimeout(() => {
        content.classList.remove("open");
        content.style.display = "none";
      }, 400);
    } else {
      content.style.display = "block";
      content.style.opacity = "100";
      setTimeout(() => {
        content.classList.add("open");
      }, 10); 
    }
  });
}

