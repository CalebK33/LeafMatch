
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
function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

function isSupportedPWAInstallBrowser() {
  return /Chrome|Edg|SamsungBrowser|Brave|OPR/.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);
}

function shouldShowCustomInstallPrompt() {
  return isIOS() || (!deferredPrompt && isAndroid() && !isInStandaloneMode());
}

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
  } else if (shouldShowCustomInstallPrompt()) {
    promptOpen();
  } else if (isSupportedPWAInstallBrowser()){
    alert("Installation isn't supported in your current browser. Read the FAQ for more info.");
  } else {
    alert("Unable to install LeafMatch, try again in a second. Is the app already installed?")
  }
});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); 
  deferredPrompt = e;
  installBtn.style.display = 'inline-block'; 
});

promptClose();
