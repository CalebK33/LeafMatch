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
    var caret = this.querySelector(".caret-icon");

    if (content.classList.contains("open")) {
      content.classList.remove("open");
      content.style.maxHeight = null;
    } else {
      content.classList.add("open");
      content.style.maxHeight = content.scrollHeight + "px";
    }

  });
}
