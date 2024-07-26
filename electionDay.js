seatNamesLen = 151;
document.addEventListener("DOMContentLoaded", async function () {
    laborCount = 0;
    liberalCount = 0;
    greensCount = 0;
    otherCount = 0;
    parties = {
        labor: { leader: "Anthony Albanese", colour: "red" },
        liberal: { hue: `216`, colour: "blue" },
        green: { colour: "lightgreen" },
        other: { colour: "purple" }
        // also im storing the colour as a hue value to be used as HSL colour, so i can just change the opacity based on percentages
    };
    let raw = localStorage.getItem("campaign-trail-game-state");
    let gameState = JSON.parse(raw);

    document.addEventListener("mouseover", (mouseover) => {
        let id = mouseover.target.id;
        const seatIDElement = document.getElementById("seatName");
        const seatPollElement = document.getElementById("pollData");
        let seatNames = Object.keys(gameState); // [grey, lingiari]
        for (let i = 0; i < seatNames.length; i++) {
            let seatName = seatNames[i]; // "grey"
            let pollData = gameState[seatName].polling;
            if (id === gameState[seatName].id) {
                // let seat = gameState[seatName];
                seatIDElement.innerText = seatName;
                // var listPollData = Object.entries(pollData);
                seatPollElement.innerText = `labor: ${pollData.labor}%\nliberal: ${pollData.liberal}%\nGreen: ${pollData.green}%\nOther: ${pollData.other}%`;
            }
        }
    });
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
            if (polling[partyName] > polling[highestParty]) {
                highestParty = partyName;
            }
        }
        if (highestParty !== "green") {
            greenFlowedLabPref = polling.green * 0.82;
            greenFlowedLibPref = polling.green * 0.178;
            greenFlowedLab = polling.labor + greenFlowedLabPref;
            greenFlowedLib = polling.liberal + greenFlowedLibPref;
            if (greenFlowedLab > greenFlowedLib && greenFlowedLab > polling.other) {
                highestParty = "labor";
            }
            if (greenFlowedLib > greenFlowedLab && greenFlowedLib > polling.other) {
                highestParty = "liberal";
            }
            if (polling.other > greenFlowedLib && polling.other > greenFlowedLab) {
                highestParty = "other";
            }
        }
        if (highestParty !== "other") {
            otherFlowedLabPref = polling.other * 0.507;
            otherFlowedLibPref = polling.other * 0.493;
            otherFlowedLab = greenFlowedLab + otherFlowedLabPref;
            otherFlowedLib = greenFlowedLib + otherFlowedLibPref;
            if (otherFlowedLab > otherFlowedLib && otherFlowedLab > polling.green) {
                highestParty = "labor";
            }
            if (otherFlowedLib > polling.green && otherFlowedLib > otherFlowedLab) {
                highestParty = "liberal";
            }
            if (polling.green > otherFlowedLab && polling.green > otherFlowedLib) {
                highestParty = "green";
            }
        }
        if (highestParty === "labor") {
            laborCount += 1;
        }
        if (highestParty === "liberal") {
            liberalCount += 1;
        }
        if (highestParty === "green") {
            greensCount += 1;
        }
        if (highestParty === "other") {
            otherCount += 1;
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
    document.getElementById("labTabCount").innerText = laborCount;
    document.getElementById("libTabCount").innerText = liberalCount;
    document.getElementById("grnTabCount").innerText = greensCount;
    document.getElementById("othTabCount").innerText = otherCount;

    let dialogTextSpan = document.getElementById("resultDialogSpan");
    let dialog = document.querySelector("dialog");
    dialog.open = "open";
    if (laborCount >= 76) {
        dialogTextSpan.innerText = `Congratulations! You've won the election with a grand total of ${laborCount} seats. With this majority, you can [BE MORE SPECIFIC WHEN YOU WRITE THE QUESTIONS]`;
    }
    if (laborCount > liberalCount && laborCount > greensCount && laborCount < 76) {
        dialogTextSpan.innerText = `In a shocking result, the election has returned a hung parliament. Thankfully however, you are the biggest party, with ${laborCount} seats. This means you will have to form a government with the crossbench.`;
    } else {
        dialogTextSpan.innerText = `Unfortunately, you have lost this election, only winning ${laborCount} seats.`;
    }
}
