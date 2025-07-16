const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("ID");
console.log(window.location.href)
if (window.location.href == "https://leafmatch.org/plant") {
  window.location.href = "/database";
}
const confidence = urlParams.get("c");

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
    if (confidence) {
      document.getElementById("name").textContent = entry.name + " - " + confidence + "% Confidence";
    }
    else {
      document.getElementById("name").textContent = entry.name;
    }
    document.getElementById("description").textContent = entry.description;
      
  img.onerror = () => {
    img.onerror = () => {
      img.onerror = () => {
        img.src = "images/plants/placeholder.jpg";
      }
      img.src = "images/plants/plant" + id + ".jpeg";
    }
    img.src = "images/plants/plant" + id + ".png";
  };
  img.src = "images/plants/plant" + id + ".jpg";

  } else {
    document.getElementById("title").textContent = "Not Found";
    document.getElementById("name").textContent = "This plant doesn't seem to exist...";
    document.getElementById("description").textContent = "No data available for ID: " + id;
    img.src = "images/plants/placeholder.jpg";
  }
});
