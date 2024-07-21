var quesData = null;
let questionCount = 0;

document.addEventListener("DOMContentLoaded", async function () {
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
    // only do this when the document is loadded

    // gameState = { lingiari: { labor: 76, liberal: 23 }, grey: { labor: 45, liberal: 55 } }; // this will be updated as the game runs
    updateDisplay();

    console.log(pollData.labor);
    document.addEventListener("mouseover", (mouseover) => {
        let id = mouseover.target.id;
        console.log(id);
        const seatIDElement = document.getElementById("seatName");
        const seatPollElement = document.getElementById("pollData");
        const seatWeightElement = document.getElementById("weightData");
        let seatNames = Object.keys(gameState); // [grey, lingiari]
        for (let i = 0; i < seatNames.length; i++) {
            let seatName = seatNames[i]; // "grey"
            let pollData = gameState[seatName].polling;
            let weightData = gameState[seatName].weighting;
            if (weightData.ideology <= 1 && weightData.ideology > 0) {
                ideoLabel = "Slightly Liberal";
            }
            if (weightData.ideology < 0 && weightData.ideology >= -1) {
                ideoLabel = "Slightly Conservative";
            }
            if (weightData.ideology > 1 && weightData.ideology <= 2) {
                ideoLabel = "Liberal";
            }
            if (weightData.ideology < -1 && weightData.ideology >= -2) {
                ideoLabel = "Conservative";
            }
            if (weightData.ideology > 2 && weightData.ideology <= 3) {
                ideoLabel = "Very Liberal";
            }
            if (weightData.ideology < -2 && weightData.ideology >= -3) {
                ideoLabel = "Very Conservative";
            }
            if (id === gameState[seatName].id) {
                // let seat = gameState[seatName];
                seatIDElement.innerText = seatName;
                // var listPollData = Object.entries(pollData);
                seatPollElement.innerText = `labor: ${pollData.labor}%\nliberal: ${pollData.liberal}%\nGreen: ${pollData.green}%`;
                seatWeightElement.innerText = `ideology: ${ideoLabel}\nsocial: ${weightData.social}\naffluence: ${weightData.affluence}`;
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
            if (polling[partyName] > polling[highestParty]) highestParty = partyName;
        }
        marginColor = `${polling[highestParty]}%`;
        seatElement.style = `fill: ${parties[highestParty].colour}; filter: opacity(${marginColor})`;
    }
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
    ideoEffect = quesData[questionCount].answers[buttonNumber].effect.ideology;
    socEffect = quesData[questionCount].answers[buttonNumber].effect.social;
    affEffect = quesData[questionCount].answers[buttonNumber].effect.affluence;
    for (let i = 0; i < seatNames.length; i++) {
        let seatName = seatNames[i];
        let weightData = gameState[seatName].weighting;
        ideoPollEffect = ideoEffect * weightData.ideology;
        socPollEffect = socEffect * weightData.social;
        affPollEffect = affEffect * weightData.affluence;
        let pollData = gameState[seatName].polling;
        pollChange = ideoPollEffect + socPollEffect + affPollEffect;
        pollData.labor = pollData.labor + pollChange;
        pollData.liberal = pollData.liberal - pollChange;
    }
    let something = document.getElementById("textFeedback");
    something.innerText = quesData[questionCount].answers.one.feedback;
    let dialog = document.getElementById("advisorFeedback");
    dialog.open = "open";
    document.getElementById("answerButton1").disabled = true;
    document.getElementById("answerButton2").disabled = true;
    document.getElementById("answerButton3").disabled = true;
    document.getElementById("answerButton4").disabled = true;
    document.getElementById("mapButton").disabled = true;
}
function closeAnsDialog() {
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
        updateDisplay();
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
}
