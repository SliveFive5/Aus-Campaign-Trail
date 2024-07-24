var quesData = null;
let questionCount = 0;

document.addEventListener("DOMContentLoaded", async function () {
    parties = {
        labor: { leader: "Anthony Albanese", colour: "red" },
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
    // only do this when the document is loadded
    updateDisplay();
    // gameState = { lingiari: { labor: 76, liberal: 23 }, grey: { labor: 45, liberal: 55 } }; // this will be updated as the game runs

    document.addEventListener("click", (event) => {
        console.log(event?.target?.id);
    });

    document.addEventListener("mouseover", (mouseover) => {
        let id = mouseover.target.id;
        const seatIDElement = document.getElementById("seatName");
        const seatPollElement = document.getElementById("pollData");
        const seatWeightElement = document.getElementById("weightData");
        let seatNames = Object.keys(gameState); // [grey, lingiari]
        for (let i = 0; i < seatNames.length; i++) {
            let seatName = seatNames[i]; // "grey"
            let pollData = gameState[seatName].polling;
            let weightData = gameState[seatName].weighting;
            if (weightData.economy <= 1 && weightData.economy > 0) {
                ideoLabel = "Slightly Liberal";
            }
            if (weightData.economy < 0 && weightData.economy >= -1) {
                ideoLabel = "Slightly Conservative";
            }
            if (weightData.economy > 1 && weightData.economy <= 2) {
                ideoLabel = "Liberal";
            }
            if (weightData.economy < -1 && weightData.economy >= -2) {
                ideoLabel = "Conservative";
            }
            if (weightData.economy > 2 && weightData.economy <= 3) {
                ideoLabel = "Very Liberal";
            }
            if (weightData.economy < -2 && weightData.economy >= -3) {
                ideoLabel = "Very Conservative";
            }
            if (id === gameState[seatName].id) {
                // let seat = gameState[seatName];
                seatIDElement.innerText = seatName;
                // var listPollData = Object.entries(pollData);
                seatPollElement.innerText = `labor: ${pollData.labor}%\nliberal: ${pollData.liberal}%\nGreen: ${pollData.green}%\nOther: ${pollData.other}%`;
                seatWeightElement.innerText = `economy: ${ideoLabel}\nsocial: ${weightData.social}\ntaxes: ${weightData.taxes}`;
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
    ideoEffect = quesData[questionCount].answers[buttonNumber].effect.economy;
    socEffect = quesData[questionCount].answers[buttonNumber].effect.social;
    affEffect = quesData[questionCount].answers[buttonNumber].effect.taxes;
    for (let i = 0; i < seatNames.length; i++) {
        let seatName = seatNames[i];
        let weightData = gameState[seatName].weighting;
        ideoPollEffect = ideoEffect * weightData.economy;
        socPollEffect = socEffect * weightData.social;
        affPollEffect = affEffect * weightData.taxes;
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

    localStorage.setItem("campaign-trail-game-state", JSON.stringify(gameState));
}
function closeAnsDialog() {
    updateDisplay();
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
    if (questionCount <= 2) {
        //Remember to change that to whatever the question count turns out to be
        let dialog = document.querySelector("dialog");
        dialog.open = "open";
        document.getElementById("questionButton").hidden = false;
        document.getElementById("visitHeader").hidden = true;
        let confirmDialog = document.getElementById("confirmation");
        confirmDialog.open = null;
        // updateDisplay();
    } else {
        window.location = "electionDay.html";
    }
}
function closeConfDialog() {
    document.getElementById("confirmation").open = null;
}
function updateDisplay() {
    questions = quesData;
    questionCount = questionCount + 1;
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
        console.log(parties[highestParty]);
        if (highestParty !== "green") {
            if (seatName === "Kennedy") {
                console.log("Gone Through");
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
                console.log("first other");
            }
        }
        if (highestParty !== "other") {
            otherFlowedLabPref = polling.other * 0.507;
            otherFlowedLibPref = polling.other * 0.493;
            otherFlowedLab = greenFlowedLab + otherFlowedLabPref;
            otherFlowedLib = greenFlowedLib + otherFlowedLibPref;
            if (otherFlowedLab > otherFlowedLib && otherFlowedLab > polling.green) {
                highestParty = "labor";
                console.log("second lab");
            }
            if (otherFlowedLib > polling.green && otherFlowedLib > otherFlowedLab) {
                highestParty = "liberal";
                console.log("second lib");
            }
            if (polling.green > otherFlowedLab && polling.green > otherFlowedLib) {
                highestParty = "green";
                console.log("second grn");
            }
        }
        marginColor = `${polling[highestParty]}%`;
        seatElement.style = `fill: ${parties[highestParty].colour}; filter: opacity(${marginColor})`;
    }
}
