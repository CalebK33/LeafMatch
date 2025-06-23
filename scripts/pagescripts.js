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
  document.getElementById("ready").style.display = '';
}

if (!navigator.userAgent.match(/Android|iPhone|iPod|BlackBerry|Windows Phone/i)) {
  document.getElementById("sidebar").style.width = "33%";
}

const coll = document.getElementsByClassName("collapsible");

$(document).ready(function() {
  $('.content').hide();

  $('.collapsible').click(function() {
    $(this).toggleClass('active');
    $(this).toggleClass('visible');
    $(this).next('.content').stop(true, false).slideToggle(400);
  });
});


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
  return (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
}

function shouldShowCustomInstallPrompt() {
  return isIOS() || (!deferredPrompt && isAndroid() && !isInStandaloneMode());
}

installBtn.addEventListener('click', () => {
  if (isInStandaloneMode()) {
    alert("LeafMatch is already installed.");
    return;
  }

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
    promptOpen(); // shows iOS-style guide
  } else if (!isSupportedPWAInstallBrowser()) {
    alert("Installation isn't supported in your current browser. Read the FAQ for more info.");
  } else {
    alert("Unable to install LeafMatch. Try again in a second, or check if it’s already installed.");
  }
});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

promptClose();
