seatNamesLen = 2;
document.addEventListener("DOMContentLoaded", async function () {
    let seventySeats = [];
    let sixtySeats = [];
    let fiftySeats = [];
    let fortySeats = [];
    let thirtySeats = [];
    parties = {
        labor: { leader: "Anthony Albanese", colour: "red" },
        liberal: { hue: `216`, colour: "blue" }
        // also im storing the colour as a hue value to be used as HSL colour, so i can just change the opacity based on percentages
    };
    let res = await fetch("./electorate.json");
    let jsonData = await res.json();
    gameState = jsonData;
    let ques = await fetch("./question.json");
    quesData = await ques.json();

    let seatNames = Object.keys(gameState); // [grey, lingiari]
    for (let i = 0; i < seatNames.length; i++) {
        let seatName = seatNames[i]; // "grey"
        let id = gameState[seatName]?.id;
        let seatElement = document.getElementById(id);
        let polling = gameState[seatName].polling;
        let partyNames = Object.keys(polling);
        let highestParty = partyNames[0];
        for (let i = 1; i < partyNames.length; i++) {
            let partyName = partyNames[i];
            if (polling[partyName] > polling[highestParty]) highestParty = partyName;
        }
        marginColor = "100%";
        if (polling[highestParty] >= 70) {
            setTimeout(() => {
                seatElement.style = `fill: ${parties[highestParty].colour}; filter: opacity(${marginColor})`;
            }, 5000);
        }
        if (polling[highestParty] >= 60 && polling[highestParty] < 70) {
            setTimeout(() => {
                seatElement.style = `fill: ${parties[highestParty].colour}; filter: opacity(${marginColor})`;
            }, 10000);
        }
        if (polling[highestParty] >= 50 && polling[highestParty] < 60) {
            setTimeout(() => {
                seatElement.style = `fill: ${parties[highestParty].colour}; filter: opacity(${marginColor})`;
            }, 15000);
        }
        if (polling[highestParty] >= 40 && polling[highestParty] < 50) {
            setTimeout(() => {
                seatElement.style = `fill: ${parties[highestParty].colour}; filter: opacity(${marginColor})`;
            }, 20000);
        }
        if (polling[highestParty] >= 33 && polling[highestParty] < 40) {
            setTimeout(() => {
                seatElement.style = `fill: ${parties[highestParty].colour}; filter: opacity(${marginColor})`;
            }, 25000);
        }
    }
});
function openResults() {
    let dialog = document.querySelector("dialog");
    dialog.open = "open";
    console.log("test");
}
