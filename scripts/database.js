const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("ID");

async function loadDatabase() {
  const response = await fetch("/scripts/database.txt");
  const text = await response.text();

  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  const database = {};
  for (let i = 0; i < lines.length; i += 4) {
    const entryID = lines[i];
    database[entryID] = {
      title: lines[i + 1] || "",
      name: lines[i + 2] || "",
      description: lines[i + 3] || "",
    };
  }

  return database;
}

loadDatabase().then(database => {
  const entry = database[id];
  const img = document.getElementById("image");

  if (entry) {
    document.getElementById("title").textContent = entry.title;
    document.getElementById("name").textContent = entry.name;
    document.getElementById("description").textContent = entry.description;

    const img = new Image();
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    let index = 0;
    
    function tryNextExtension() {
      if (index < extensions.length) {
        img.onerror = tryNextExtension;
        img.src = `images/plants/plant${id}.${extensions[index++]}`;
      } else {
        img.src = "images/plants/placeholder.jpg";
      }
    }
    
    tryNextExtension();

  } else {
    document.getElementById("title").textContent = "Not Found";
    document.getElementById("name").textContent = "This plant doesn't seem to exist...";
    document.getElementById("description").textContent = "No data available for ID: " + id;
    img.src = "images/plants/placeholder.jpg";
  }
});
