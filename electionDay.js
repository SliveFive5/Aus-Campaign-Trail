seatNamesLen = 151;
//This value needed to be hoisted to work for all the functions
document.addEventListener("DOMContentLoaded", async function () {
    laborCount = 0;
    liberalCount = 0; //This initializes the starting seat count, which is then added to later on
    greensCount = 0;
    otherCount = 0;
    parties = {
        labor: { colour: "red" },
        liberal: { colour: "blue" },
        green: { colour: "lightgreen" },
        other: { colour: "purple" }
    };
    let raw = localStorage.getItem("campaign-trail-game-state"); //Here, the electorate data is extracted from localStorage, where it was placed earlier in the process, allowing for the changes that took place there to impact here.
    let gameState = JSON.parse(raw);
    let marginalSeats = localStorage.getItem("marginal-seats"); //We also need to get this data, because later on we are going to compare the two.
    arrMarginalSeats = marginalSeats.split(","); //This string has to be split by comma to make it an array

    document.addEventListener("mouseover", (mouseover) => {
        //This is essentially a copy of the code shown in game.js, simply showing the user what they got in each state.
        let id = mouseover.target.id;
        const seatIDElement = document.getElementById("seatName");
        const seatPollElement = document.getElementById("pollData");
        let seatNames = Object.keys(gameState);
        for (let i = 0; i < seatNames.length; i++) {
            let seatName = seatNames[i];
            let pollData = gameState[seatName].polling;
            if (id === gameState[seatName].id) {
                seatIDElement.innerText = seatName;
                seatPollElement.innerText = `labor: ${Math.round(pollData.labor)}%\nliberal: ${Math.round(pollData.liberal)}%\nGreen: ${Math.round(pollData.green)}%\nOther: ${Math.round(
                    pollData.other
                )}%`;
            }
        }
    });
    timeoutNum = 1000; //This is equivalent to 1 second. This number will go up as the code iterates over and over again, creating the impression of results coming in.
    for (let i = 0; i < 151; i++) {
        let seatName = arrMarginalSeats[i]; //Here, we are trying to find the highestparty in the list of arrMarginalSeats, similar to the code in game.js
        let id = gameState[seatName]?.id;
        let seatElement = document.getElementById(id);
        let polling = gameState[seatName].polling;
        console.log(polling);
        let partyNames = Object.keys(polling);
        let highestParty = partyNames[0];
        for (let i = 1; i < partyNames.length; i++) {
            let partyName = partyNames[i];
            if (polling[partyName] > polling[highestParty]) {
                highestParty = partyName;
            }
        }
        greenFlowedLab = 0;
        greenFlowedLib = 0;
        if (highestParty !== "green") {
            if (seatName === "Melbourne") {
                console.log("Melbourne");
            }
            //This code is identical to the code in game.js, checking preference flows
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
            if (seatName === "Melbourne") {
                console.log(otherFlowedLab);
            }
            if (otherFlowedLab > otherFlowedLib && otherFlowedLab > polling.green) {
                highestParty = "labor";
                if (seatName === "Melbourne") {
                    console.log("Not greens");
                }
            }
            if (otherFlowedLib > polling.green && otherFlowedLib > otherFlowedLab) {
                highestParty = "liberal";
            }
            if (polling.green > otherFlowedLab && polling.green > otherFlowedLib) {
                highestParty = "green";
            }
        }
        if (highestParty === "labor") {
            //This is the code that counts each individual seat for each party
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
        setTimeout(() => {
            seatElement.style = `fill: ${parties[highestParty].colour};`; //Now that the highestParty is known, we can change the colour
        }, timeoutNum); //The timeout begins with just 1 second
        timeoutNum = timeoutNum + 500; //Each time it iterates, more time is added. Since setTimeout is asynchrous, this means that the impression is created that the seats are actually being called in order of marginalness
    }
});

function openResults() {
    //This code adds a table telling you the tabulated results.
    document.getElementById("labTabCount").innerText = laborCount;
    document.getElementById("libTabCount").innerText = liberalCount;
    document.getElementById("grnTabCount").innerText = greensCount;
    document.getElementById("othTabCount").innerText = otherCount;

    let dialogTextSpan = document.getElementById("resultDialogSpan"); //This code fires when the Show Results button is clicked, and it opens a dialog that displays the textual ending and tabular results.
    let dialog = document.querySelector("dialog");
    dialog.open = "open";
    if (laborCount >= "76") {
        //These are the different endings a player can get, based on whether they have won enough seats.
        dialogTextSpan.innerText = `Congratulations! You've won the election with a grand total of ${laborCount} seats. With this majority, you've retaken Parliament for the Labor Party, and can finally make progress on the climate, make the economy fairer, and bring the country forward socially. As long as no major crisis occurs in your term, it should be smooth sailing from here...`;
    }
    if (laborCount > liberalCount && laborCount > greensCount && laborCount < "76") {
        dialogTextSpan.innerText = `In a shocking result, the election has returned a hung parliament. Thankfully however, you are the biggest party, with ${laborCount} seats. This means you will have to form a government with the crossbench.`;
    }
    if (labor) {
        dialogTextSpan.innerText = `Unfortunately, you have lost this election, only winning ${laborCount} seats.`;
    }
}
