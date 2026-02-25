const container = document.getElementById("donorContainer");
const filter = document.getElementById("bloodFilter");
const count = document.getElementById("count");
const loading = document.getElementById("loading");

let donors = [];
const bloodGroups = ["A+", "B+", "O+", "AB+"];

fetch("https://jsonplaceholder.typicode.com/users")
  .then(res => res.json())
  .then(data => {
    donors = data.map((user, index) => ({
      id: user.id,
      name: user.name,
      city: user.address.city,
      blood: bloodGroups[index % bloodGroups.length],
      available: Math.random() > 0.3,
      requested: false
    }));
    
    loading.style.display = "none";
    displayDonors(donors);
  });

function displayDonors(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No donors found</p>";
    count.innerText = "";
    return;
  }

  let availableCount = list.filter(d => d.available).length;
  count.innerText = "Available Donors: " + availableCount;

  list.forEach(donor => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${donor.name}</h3>
      <p>Blood: ${donor.blood}</p>
      <p>City: ${donor.city}</p>
      <p>Status: ${donor.available ? "Available" : "Not Available"}</p>
      <button ${!donor.available || donor.requested ? "disabled" : ""}>
        ${donor.requested ? "Request Sent" : "Request Help"}
      </button>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => {
      donor.requested = true;
      displayDonors(donors);
    });

    container.appendChild(card);
  });
}

filter.addEventListener("change", () => {
  const value = filter.value;
  if (value === "All") {
    displayDonors(donors);
  } else {
    const filtered = donors.filter(d => d.blood === value);
    displayDonors(filtered);
  }
});
