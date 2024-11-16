const dips = [
    "Spinach Artichoke Dip",
    "Buffalo Chicken Dip",
    "Guacamole",
    "Queso",
    "Hummus",
    "French Onion Dip",
    "Ranch Dip",
    "Pico de Gallo",
    "Crab Dip",
    "7-Layer Dip",
    "Salsa",
    "Bean Dip",
    "Tzatziki",
    "Blue Cheese Dip",
    "Baba Ganoush"
];

const votes = new Map(dips.map(dip => [dip, 0]));

const dipsContainer = document.getElementById("dips-container");
const submitVoteButton = document.getElementById("submit-vote");
const resultsHeading = document.getElementById("results-heading");
const resultsList = document.getElementById("results");

let selectedDip = null;

// Generate radio buttons for dips
dips.forEach(dip => {
    const label = document.createElement("label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "dip";
    radio.value = dip;
    radio.addEventListener("change", () => {
        selectedDip = dip;
        submitVoteButton.disabled = false;
    });

    label.appendChild(radio);
    label.appendChild(document.createTextNode(dip));
    dipsContainer.appendChild(label);
    dipsContainer.appendChild(document.createElement("br"));
});

// Handle vote submission
submitVoteButton.addEventListener("click", () => {
    if (selectedDip) {
        votes.set(selectedDip, votes.get(selectedDip) + 1);
        alert(`Thank you for voting for ${selectedDip}!`);
        selectedDip = null;
        submitVoteButton.disabled = true;

        // Display results
        resultsHeading.style.display = "block";
        resultsList.style.display = "block";
        resultsList.innerHTML = "";
        Array.from(votes).forEach(([dip, count]) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${dip}: ${count} vote(s)`;
            resultsList.appendChild(listItem);
        });
    }
});
