function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
}

if (!navigator.userAgent.match(/Android|iPhone|iPod|BlackBerry|Windows Phone/i)) {
  document.getElementById("sidebar").style.width = "33%";
}

var coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");

    var content = this.nextElementSibling;
    var icon = this.querySelector("i");

    if (content.style.display === "block") {
      content.style.display = "none";
      if (icon) {
        icon.classList.remove("fa-caret-down");
        icon.classList.add("fa-caret-right");
      }
    } else {
      content.style.display = "block";
      if (icon) {
        icon.classList.remove("fa-caret-right");
        icon.classList.add("fa-caret-down");
      }
    }
  });
}
