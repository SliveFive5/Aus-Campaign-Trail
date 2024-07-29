// This is a game designed to simulate an election campaign.
//Here, a number of hoisted variables are defined, necessary for the functions to work
var quesData = null;
let questionCount = 1;
const NUMBER_OF_QUESTIONS = 3;

document.addEventListener("DOMContentLoaded", async function () {
    //All of the below actions will only take place once loaded
    parties = {
        //Fairly self-explanatory, this sets the colours for use on the map
        labor: { colour: "red" },
        liberal: { colour: "blue" },
        green: { colour: "lightgreen" },
        other: { colour: "purple" }
        // also im storing the colour as a hue value to be used as HSL colour, so i can just change the opacity based on percentages
    };
    let res = await fetch("./electorate.json");
    let jsonData = await res.json();
    gameState = jsonData;
    let ques = await fetch("./question.json");
    quesData = await ques.json();
    // These actions only take place when the JSON has loaded
    updateDisplay();
    // This initial updateDisplay serves to display the initial data about the map

    document.addEventListener("mouseover", (mouseover) => {
        //This event listener checks for the user hovering over a seat on the map so it can display the details for that seat
        let id = mouseover.target.id;
        const seatIDElement = document.getElementById("seatName");
        const seatPollElement = document.getElementById("pollData");
        const seatWeightElement = document.getElementById("weightData");
        let seatNames = Object.keys(gameState); // [grey, lingiari]
        for (let i = 0; i < seatNames.length; i++) {
            let seatName = seatNames[i]; // "grey"
            let pollData = gameState[seatName].polling;
            let weightData = gameState[seatName].weighting;
            if (weightData.Economy <= 1 && weightData.Economy > 0) {
                //This code gives unique labels to the weightings based on their
                ideoLabel = "Slightly Liberal";
            }
            if (weightData.Economy < 0 && weightData.Economy >= -1) {
                ideoLabel = "Slightly Conservative";
            }
            if (weightData.Economy > 1 && weightData.Economy <= 2) {
                ideoLabel = "Liberal";
            }
            if (weightData.Economy < -1 && weightData.Economy >= -2) {
                ideoLabel = "Conservative";
            }
            if (weightData.Economy > 2 && weightData.Economy <= 3) {
                ideoLabel = "Very Liberal";
            }
            if (weightData.Economy < -2 && weightData.Economy >= -3) {
                ideoLabel = "Very Conservative";
            }
            if (weightData.Social <= 1 && weightData.Social > 0) {
                ideoLabel = "Slightly Progressive";
            }
            if (weightData.Social < 0 && weightData.Social >= -1) {
                ideoLabel = "Slightly Conservative";
            }
            if (weightData.Social > 1 && weightData.Social <= 2) {
                socLabel = "Moderately Progressive";
            }
            if (weightData.Social < -1 && weightData.Social >= -2) {
                socLabel = "Moderately Conservative";
            }
            if (weightData.Social > 2 && weightData.Social <= 3) {
                socLabel = "Progressive";
            }
            if (weightData.Social < -2 && weightData.Social >= -3) {
                socLabel = "Reactionary";
            }
            if (weightData.Taxes <= 1 && weightData.Taxes > 0) {
                taxLabel = "Slightly Raise";
            }
            if (weightData.Taxes < 0 && weightData.Taxes >= -1) {
                taxLabel = "Slightly Lower";
            }
            if (weightData.Taxes > 1 && weightData.Taxes <= 2) {
                taxLabel = "Tax and Spend";
            }
            if (weightData.Taxes < -1 && weightData.Taxes >= -2) {
                taxLabel = "Slash Taxes";
            }
            if (weightData.Taxes > 2 && weightData.Taxes <= 3) {
                taxLabel = "Eat the Rich!";
            }
            if (weightData.Taxes < -2 && weightData.Taxes >= -3) {
                taxLabel = "Thatcherite";
            }
            if (weightData.Climate <= 1 && weightData.Climate > 0) {
                cliLabel = "Asks for Paper Straw";
            }
            if (weightData.Climate < 0 && weightData.Climate >= -1) {
                cliLabel = "Ignores Recycling Bin";
            }
            if (weightData.Climate > 1 && weightData.Climate <= 2) {
                cliLabel = "Concerned about Climate";
            }
            if (weightData.Climate < -1 && weightData.Climate >= -2) {
                cliLabel = "Economy over Climate";
            }
            if (weightData.Climate > 2 && weightData.Climate <= 3) {
                cliLabel = "Very Environmentalist";
            }
            if (weightData.Climate < -2 && weightData.Climate >= -3) {
                cliLabel = "Hoax";
            }
            if (id === gameState[seatName].id) {
                //By checking if the ID of the hover matches any of the
                // let seat = gameState[seatName];
                seatIDElement.innerText = seatName;
                // var listPollData = Object.entries(pollData);
                seatPollElement.innerText = `labor: ${pollData.labor}%\nliberal: ${pollData.liberal}%\nGreen: ${pollData.green}%\nOther: ${pollData.other}%`;
                seatWeightElement.innerText = `Economy: ${ideoLabel}\nSocial: ${socLabel}\nTaxes: ${taxLabel}\nClimate: ${cliLabel}`;
            }
        }
    });
});

function closeDialog() {
    let dialog = document.querySelector("dialog");
    dialog.open = null; // = "open"
}

function openDialog() {
    let dialog = document.querySelector("dialog");
    dialog.open = "open";
}
function openAnsDialog(buttonNumber) {
    let seatNames = Object.keys(gameState);
    ideoEffect = quesData[questionCount].answers[buttonNumber].effect.Economy;
    socEffect = quesData[questionCount].answers[buttonNumber].effect.Social;
    affEffect = quesData[questionCount].answers[buttonNumber].effect.Taxes;
    for (let i = 0; i < seatNames.length; i++) {
        let seatName = seatNames[i];
        let weightData = gameState[seatName].weighting;
        ideoPollEffect = ideoEffect * weightData.Economy;
        socPollEffect = socEffect * weightData.Social;
        affPollEffect = affEffect * weightData.Taxes;
        let pollData = gameState[seatName].polling;
        pollChange = ideoPollEffect + socPollEffect + affPollEffect;
        pollData.labor = pollData.labor + pollChange;
        pollData.liberal = pollData.liberal - pollChange;
    }
    let something = document.getElementById("textFeedback");
    something.innerText = quesData[questionCount].answers[buttonNumber].feedback;
    let dialog = document.getElementById("advisorFeedback");
    dialog.open = "open";
    document.getElementById("answerButton1").disabled = true;
    document.getElementById("answerButton2").disabled = true;
    document.getElementById("answerButton3").disabled = true;
    document.getElementById("answerButton4").disabled = true;
    document.getElementById("mapButton").disabled = true;

    const te = new TextEncoder();
    window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv
        },
        key,
        te.encode(JSON.stringify(gameState))
    );
    localStorage.setItem("campaign-trail-game-state", JSON.stringify(gameState));
}
function closeAnsDialog() {
    questionCount = questionCount + 1;
    let seatNames = Object.keys(gameState);
    document.getElementById("answerButton1").disabled = null;
    document.getElementById("answerButton2").disabled = null;
    document.getElementById("answerButton3").disabled = null;
    document.getElementById("answerButton4").disabled = null;
    document.getElementById("mapButton").disabled = null;
    let dialog = document.getElementById("advisorFeedback");
    dialog.open = null;
    let otherDialog = document.querySelector("dialog");
    otherDialog.open = null; // = "open"
    document.getElementById("questionButton").hidden = true;
    document.getElementById("visitHeader").hidden = false;
    document.addEventListener("click", (visitClick) => {
        let id = visitClick.target.id;
        for (let i = 0; i < seatNames.length; i++) {
            let seatName = seatNames[i]; // "grey"
            if (id === gameState[seatName].id) {
                console.log(seatName);
                let confirmDialog = document.getElementById("confirmation");
                const confirmText = document.getElementById("confirmationText");
                confirmDialog.open = "open";
                confirmText.innerText = `Do you want to campaign in ${seatName}?`;
            }
        }
    });
}
function nextRound() {
    document.getElementById("confirmation").open = null;
    if (questionCount <= NUMBER_OF_QUESTIONS) {
        //Remember to change that to whatever the question count turns out to be
        let dialog = document.querySelector("dialog");
        dialog.open = "open";
        document.getElementById("questionButton").hidden = false;
        document.getElementById("visitHeader").hidden = true;
        let confirmDialog = document.getElementById("confirmation");
        confirmDialog.open = null;
        updateDisplay();
    } else {
        window.location = "electionDay.html";
    }
}
function closeConfDialog() {
    document.getElementById("confirmation").open = null;
}
function updateDisplay() {
    let keys = Object.keys(gameState);
    let list = keys.map((key) => {
        let seat = gameState[key];
        seat.name = key;
        return seat;
    });

    const compareFn = (a, b) => {
        // pick which is more marginal

        if (a.polling.labor > a.polling.liberal && a.polling.labor > a.polling.other && a.polling.labor > a.polling.green) {
            if (a.polling.labor > b.polling.labor) return -1;
            else if (a.polling.labor < b.polling.labor) return 1;
        } else if (a.polling.liberal > a.polling.labor && a.polling.liberal > a.polling.other && a.polling.liberal > a.polling.green) {
            if (a.polling.liberal > b.polling.liberal) return -1;
            else if (a.polling.liberal < b.polling.liberal) return 1;
        } else if (a.polling.green > a.polling.labor && a.polling.green > a.polling.liberal && a.polling.green > a.polling.other) {
            if (a.polling.labor > b.polling.labor) return -1;
            else if (a.polling.labor < b.polling.labor) return 1;
        } else if (a.polling.other > a.polling.labor && a.polling.other > a.polling.liberal && a.polling.other > a.polling.green) {
            if (a.polling.labor > b.polling.labor) return -1;
            else if (a.polling.labor < b.polling.labor) return 1;
        }
    };

    let sorted = list.sort(compareFn);
    let names = sorted.map((seat) => seat.name);
    localStorage.setItem("marginal-seats", names);

    const jsTextQuestion = document.getElementById("textQuestion");
    jsTextQuestion.innerText = quesData[questionCount].question;
    const jsTextAnswer1 = document.getElementById("answerButton1");
    const jsTextAnswer2 = document.getElementById("answerButton2");
    const jsTextAnswer3 = document.getElementById("answerButton3");
    const jsTextAnswer4 = document.getElementById("answerButton4");
    jsTextAnswer1.innerText = quesData[questionCount].answers.one.text;
    jsTextAnswer2.innerText = quesData[questionCount].answers.two.text;
    jsTextAnswer3.innerText = quesData[questionCount].answers.three.text;
    jsTextAnswer4.innerText = quesData[questionCount].answers.four.text;

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
        // console.log(parties[highestParty]);
        if (highestParty !== "green") {
            if (seatName === "Kennedy") {
                // console.log("Gone Through");
            }
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
                // console.log("first other");
            }
        }
        if (highestParty !== "other") {
            otherFlowedLabPref = polling.other * 0.507;
            otherFlowedLibPref = polling.other * 0.493;
            otherFlowedLab = greenFlowedLab + otherFlowedLabPref;
            otherFlowedLib = greenFlowedLib + otherFlowedLibPref;
            if (otherFlowedLab > otherFlowedLib && otherFlowedLab > polling.green) {
                highestParty = "labor";
                // console.log("second lab");
            }
            if (otherFlowedLib > polling.green && otherFlowedLib > otherFlowedLab) {
                highestParty = "liberal";
                // console.log("second lib");
            }
            if (polling.green > otherFlowedLab && polling.green > otherFlowedLib) {
                highestParty = "green";
                // console.log("second grn");
            }
        }
        marginColor = `${polling[highestParty]}%`;
        seatElement.style = `fill: ${parties[highestParty].colour}; filter: opacity(${marginColor})`;
    }
}
