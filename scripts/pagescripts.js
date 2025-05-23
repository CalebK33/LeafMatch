function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
}

if (!navigator.userAgent.match(/Android|iPhone|iPod|BlackBerry|Windows Phone/i)) {
    document.getElementById("sidebar").style.width = "30%"
}
