
function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
}

function promptClose() {
    document.getElementById("ready").style.display = 'none';
}

function promptOpen() {
  document.getElementById("ready").style.display = ''
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
      content.classList.remove("visible");
      content.style.display = "none";
    } else {
      content.style.display = "block";
      content.classList.add("visible");
    }
  });
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');

installBtn.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('App installed');
      } else {
        console.log('User dismissed install');
      }
      deferredPrompt = null;
    });
  } else {
    promptOpen();
  }
});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); 
  deferredPrompt = e;
  installBtn.style.display = 'inline-block'; 
});

promptClose();
