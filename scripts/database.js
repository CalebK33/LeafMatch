const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("ID");
        
const database = {
  "1": {
    title: "Plant one",
    name: "Fancy name",
    description: "Plant one is a really cool plant",
    image: "images/plants/plant1.jpg",
  },
  "2": {
    title: "Plant two",
    name: "Fancy name",
    description: "Plant two is a really ugly plant",
    image: "images/plants/plant2.jpg",
  }
};

const entry = database[id];
if (entry) {
  document.getElementById("title").textContent = entry.title;
  document.getElementById("name").textContent = entry.name;
  document.getElementById("description").textContent = entry.description;
  document.getElementById("image").src = entry.image;
} else {
  document.getElementById("title").textContent = "Not Found";
  document.getElementById("description").textContent = "No data available for ID: " + id;
}
