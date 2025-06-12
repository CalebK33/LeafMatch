function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
}

if (!navigator.userAgent.match(/Android|iPhone|iPod|BlackBerry|Windows Phone/i)) {
  document.getElementById("sidebar").style.width = "33%";
}

$(document).ready(function() {
  $('.content').hide();

  $('.collapsible').click(function() {
    $(this).toggleClass('active');
    $(this).next('.content').stop(true, false).slideToggle(400);
  });
});

const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    const content = this.nextElementSibling;

    if (content.classList.contains("visible")) {
      content.classList.remove("visible");
      content.style.display = "none";
    } else {
      content.style.display = "block";
      content.classList.add("visible");
    }
  });
}
