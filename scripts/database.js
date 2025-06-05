const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("ID");
        
const database = {
  "1": {
    title: "Plant one",
    name: "Fancy name",
    description: "Plant one is a really cool plant for now...",
    image: "images/plants/plant1.jpg",
  },
  "2": {
    title: "Plant two",
    name: "Fancy name",
    description: "Plant two is a really fantastic and interesting plant :)",
    image: "images/plants/plant2.jpg",
  },
  "3": {
    title: "Plant three",
    name: "Fancy name",
    description: "Plant three is exactly the same as plant two! It is not a different plant",
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
  document.getElementById("title").textContent = "This plant does't seem to exist...";
  document.getElementById("description").textContent = "No data available for ID: " + id;
}
