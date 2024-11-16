// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, runTransaction } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOo3oLeRSKrf1pT_pVu86XMv_AmtmebNE",
    authDomain: "dipgiving-voting-2024.firebaseapp.com",
    projectId: "dipgiving-voting-2024",
    storageBucket: "dipgiving-voting-2024.firebasestorage.app",
    messagingSenderId: "311832183972",
    appId: "1:311832183972:web:b619f47961ecf7960f5231",
    measurementId: "G-1CB7MRXMME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dips options
const dips = [
    "Brisket",
    "Buffalo Chicken",
    "Butter Chicken",
    "Cake Batter",
    "Corn",
    "Crab",
    "Dorito",
    "Espinaca",
    "Fried Pickle",
    "Funfetti",
    "Goat Cheese Bruschetta",
    "Hoagie",
    "Smoked Jalapeno",
    "Key Lime",
    "Mango Salsa",
    "Mediterranean",
    "Pineapple Pepper",
    "Smoked Salmon"
];

let selectedDip = null;

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const dipsContainer = document.getElementById("dips-container");
    const submitVoteButton = document.getElementById("submit-vote");

    // Generate radio buttons for dips
    if (dipsContainer) {
        dips.forEach((dip) => {
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
    }

    submitVoteButton.disabled = true; // Initially disable button

    // Handle vote submission
    submitVoteButton.addEventListener("click", async () => {
        const voterName = prompt("Enter your name:").trim();
        if (!voterName || !selectedDip) {
            alert("Please select a dip and enter your name!");
            return;
        }

        submitVoteButton.disabled = true; // Disable to prevent multiple submissions
        await submitVote(voterName, selectedDip);
        submitVoteButton.disabled = false; // Re-enable after vote
        loadVotes();
    });

    // Load votes on page load
    loadVotes();
});

// Submit a vote
async function submitVote(voterName, selectedDip) {
    try {
        const votesRef = doc(db, "votes", "dipResults");
        const voterRef = doc(db, "voters", voterName);

        // Check if the voter has already voted
        const voterDoc = await getDoc(voterRef);
        if (voterDoc.exists()) {
            alert("You have already voted!");
            return;
        }

        // Use transaction to update votes
        await runTransaction(db, async (transaction) => {
            const voteDoc = await transaction.get(votesRef);
            const currentVotes = voteDoc.exists() ? voteDoc.data() : {};
            currentVotes[selectedDip] = (currentVotes[selectedDip] || 0) + 1;
            transaction.set(votesRef, currentVotes);
        });

        // Mark voter as having voted
        await setDoc(voterRef, { voted: true });
        alert(`Thank you, ${voterName}, for voting for ${selectedDip}!`);
    } catch (error) {
        console.error("Error submitting vote: ", error);
        alert("An error occurred while submitting your vote. Please try again.");
    }
}

// Load votes
async function loadVotes() {
    try {
        const votesRef = doc(db, "votes", "dipResults");
        const voteDoc = await getDoc(votesRef);

        if (voteDoc.exists()) {
            const votes = voteDoc.data();
            displayResults(votes);
        }
    } catch (error) {
        console.error("Error loading votes: ", error);
    }
}

// Display results
//function displayResults(votes) {
    //const resultsList = document.getElementById("results");
    //if (!resultsList) {
        //console.error("Results container not found!");
        //return;
    //}

    //resultsList.innerHTML = ""; // Clear previous results
    //Object.entries(votes).forEach(([dip, count]) => {
        //const listItem = document.createElement("li");
        //listItem.textContent = `${dip}: ${count} vote(s)`;
        //resultsList.appendChild(listItem);
    //});
}
