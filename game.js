// This is a game designed to simulate an election campaign.
//Here, a number of hoisted variables are defined, necessary for the functions to work
var quesData = null;
let questionCount = 1;
const NUMBER_OF_QUESTIONS = 8;

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
    //Here, we lay out the initial state of polling direct from the electorate.json
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
        //Each of the above corresponds to a different element which will be shown when a mouserover event is detected, the name of the seat, the polling information, and the seat weightings
        let seatNames = Object.keys(gameState); // [grey, lingiari, etc.]
        for (let i = 0; i < seatNames.length; i++) {
            // Goes through all of the seats in the gamestate
            let seatName = seatNames[i]; // "grey", for example
            let pollData = gameState[seatName].polling; //Gets the polling for the seat chosen
            let weightData = gameState[seatName].weighting; //Gets the weighting for the seat chosen
            if (weightData.Economy <= 1 && weightData.Economy > 0) {
                //This code gives unique labels to a seat based on it's weightings
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
                //This is essentially a search function, as it looks through the list of seat id's to see which one matches the id the user has hovered over
                seatIDElement.innerText = seatName; //This is the code that adds the name to the InfoBox
                seatPollElement.innerText = `labor: ${Math.round(pollData.labor)}%\nliberal: ${Math.round(pollData.liberal)}%\nGreen: ${Math.round(pollData.green)}%\nOther: ${Math.round(
                    pollData.other
                )}%`; //This is the code that adds the polling to the infoBox
                seatWeightElement.innerText = `Economy: ${ideoLabel}\nSocial: ${socLabel}\nTaxes: ${taxLabel}\nClimate: ${cliLabel}`; //This is the code that adds the weighting to the infoBox
            }
        }
    });
});

function closeDialog() {
    //This function is used to close the question dialog, revealing the map underneath
    let dialog = document.querySelector("dialog");
    dialog.open = null; // = "open"
}

function openDialog() {
    //Opens the question dialog again, allowing the user to go back to the question page
    let dialog = document.querySelector("dialog");
    dialog.open = "open";
}
function openAnsDialog(buttonNumber) {
    //This is the function that runs when a user selects one of the answer buttons
    let seatNames = Object.keys(gameState);
    ideoEffect = quesData[questionCount].answers[buttonNumber].effect.Economy; //These functions find the weightings for each of the 4 categories for the answer they have selected
    socEffect = quesData[questionCount].answers[buttonNumber].effect.Social;
    affEffect = quesData[questionCount].answers[buttonNumber].effect.Taxes;
    climEffect = quesData[questionCount].answers[buttonNumber].effect.Climate;
    genEffect = quesData[questionCount].answers[buttonNumber].effect.general;
    for (let i = 0; i < seatNames.length; i++) {
        //Iterates through all seats
        let seatName = seatNames[i]; //^^
        let weightData = gameState[seatName].weighting;
        ideoPollEffect = ideoEffect * weightData.Economy; //This code multiplies the weighting for a seat on an issue by the weighting for the answer that the user has selected
        socPollEffect = socEffect * weightData.Social;
        affPollEffect = affEffect * weightData.Taxes;
        climPollEffect = climEffect * weightData.Climate;
        genPollEffect = genEffect * weightData.general;
        let pollData = gameState[seatName].polling;
        pollChange = ideoPollEffect + socPollEffect + affPollEffect + climPollEffect + genPollEffect; //This creates a polling effect derived on all of the weightings from an answer
        pollData.labor = pollData.labor + pollChange; //If the pollChange is a negative, then labor will lose support
        pollData.liberal = pollData.liberal - pollChange * 0.5; //Since the polls can't exceed 100%, other parties need to lose support as labor gains it, and vice versa
        pollData.green = pollData.green - pollChange * 0.25; //Most of the support loss/gain comes from/goes to the Liberals, but a fair bit goes to the other parties. This simulates the dominance of Labor and the Liberal Party in politics
        pollData.other = pollData.other - pollChange * 0.25;
    }
    let textFeedback = document.getElementById("textFeedback");
    textFeedback.innerText = quesData[questionCount].answers[buttonNumber].feedback; //Finds the respective question and answer feedback
    let dialog = document.getElementById("advisorFeedback");
    dialog.open = "open"; //The above 4 lines open the respective advisor feedback dialog
    document.getElementById("answerButton1").disabled = true;
    document.getElementById("answerButton2").disabled = true;
    document.getElementById("answerButton3").disabled = true;
    document.getElementById("answerButton4").disabled = true;
    document.getElementById("mapButton").disabled = true; //These lines prevent the user from clicking anything else while the advisor feedback button is up. This prevents them from sequence breaking or clicking more than one answer
}
function closeAnsDialog() {
    //This function runs when the user closes the advisor feedback window, and it places the user back in the map screen, except it is changed to include a click event, and the user cannot open the questions until they have visited
    questionCount = questionCount + 1;
    let seatNames = Object.keys(gameState);
    document.getElementById("answerButton1").disabled = null;
    document.getElementById("answerButton2").disabled = null;
    document.getElementById("answerButton3").disabled = null; //Reopens all of the answers buttons for future use, although the user won't actually be able to see them at this point
    document.getElementById("answerButton4").disabled = null;
    document.getElementById("mapButton").disabled = null;
    let dialog = document.getElementById("advisorFeedback");
    dialog.open = null; //This closes the question dialog and shows the map
    let otherDialog = document.querySelector("dialog");
    otherDialog.open = null; // = "open"
    document.getElementById("questionButton").hidden = true; //This gets rid of the button taking you back to the question screen
    document.getElementById("visitHeader").hidden = false; //This shows the header that instructs the user to visit a state
    document.addEventListener("click", (visitClick) => {
        let id = visitClick.target.id; //Very similar to the mouseOver code, this runs the following only when there has been a click on an applicable object
        for (let i = 0; i < seatNames.length; i++) {
            let seatName = seatNames[i]; // "grey"
            if (id === gameState[seatName].id) {
                //This is another example of a search algorithm, looking through the seatlist to find
                let confirmDialog = document.getElementById("confirmation");
                const confirmText = document.getElementById("confirmationText");
                confirmDialog.open = "open"; //The buttons within this confirmDialog allow the user to either select a different seat, or it allows them
                confirmText.innerText = `Do you want to campaign in ${seatName}?`;
                let polling = gameState[seatName].polling; //polling is then extracted from the seat
                polling.labor = polling.labor += 0.3;
            }
        }
    });
}
function nextRound() {
    document.getElementById("confirmation").open = null;
    if (questionCount <= NUMBER_OF_QUESTIONS) {
        //This can change in hoisted section depending on the number of questions written
        let dialog = document.querySelector("dialog");
        dialog.open = "open";
        document.getElementById("questionButton").hidden = false; //Now, it goes back to the question screen
        document.getElementById("visitHeader").hidden = true;
        let confirmDialog = document.getElementById("confirmation");
        confirmDialog.open = null; //Closes the confirm dialog
        updateDisplay();
        //The display is updated here to ensure decisions are reflected throughout gameplay, rather than just at the end
    } else {
        //This is the code that will run when there are no more questions left, meaning the game is over and only the election day remains
        //It sends you to the other html file
        window.location = "electionDay.html";
    }
}
function closeConfDialog() {
    document.getElementById("confirmation").open = null;
    //This closes the confirmation dialog in case the user has changed their mind or misclicked
}
function updateDisplay() {
    let keys = Object.keys(gameState);
    let list = keys.map((key) => {
        let seat = gameState[key];
        seat.name = key;
        return seat; //This code updates the map with the latest results
    });

    const compareFn = (a, b) => {
        // This code picks which the least marginal to most marginal seats for use in the electionDay file

        if (a.polling.labor > a.polling.liberal && a.polling.labor > a.polling.other && a.polling.labor > a.polling.green) {
            //This checks if the party is the most popular
            if (a.polling.labor > b.polling.labor) return -1; //This checks if the polling for a is higher than b. If so, a -1 is returned, meaning they swap
            else if (a.polling.labor < b.polling.labor) return 1; //On the other hand, if b is bigger, they don't swap
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

    let sorted = list.sort(compareFn); //This is a modified quicksort function using the sort() function
    let names = sorted.map((seat) => seat.name); //This turns it into an array of the names of the seats in order
    localStorage.setItem("marginal-seats", names); //Once sorted, the code is stored in localStorage for use in the electionDay webpage.
    localStorage.setItem("campaign-trail-game-state", JSON.stringify(gameState));

    const jsTextQuestion = document.getElementById("textQuestion"); //This code updates the question and the answer based on the new questionCount
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
        let id = gameState[seatName]?.id; //It then finds the ID of the seat in question
        let seatElement = document.getElementById(id); //It takes the ID, and uses it to find the svg element in question
        let polling = gameState[seatName].polling; //polling is then extracted from the seat
        let partyNames = Object.keys(parties); //This polling used to construct a list of all the seats in the seat
        let highestParty = partyNames[0]; //This initilizes the highestParty variable
        for (let i = 1; i < partyNames.length; i++) {
            //The code loops through the partynames and checks which is the highest
            let partyName = partyNames[i];
            if (polling[partyName] > polling[highestParty]) {
                highestParty = partyName;
            }
        }

        if (highestParty !== "green") {
            //This is the preference flow code, which simulates the preferential voting system that Australia employs.
            greenFlowedLabPref = polling.green * 0.82; //This is based off the observed flow of preference votes from the greens to labor in 2019
            greenFlowedLibPref = polling.green * 0.178; //What this code ensures is that, in seats where Labor and Greens collectively rank higher than the liberals, that labor wins most of the time as occurs in real life
            greenFlowedLab = polling.labor + greenFlowedLabPref;
            greenFlowedLib = polling.liberal + greenFlowedLibPref;
            if (greenFlowedLab > greenFlowedLib && greenFlowedLab > polling.other) {
                highestParty = "labor"; //It checks the highestParty again in case the preference flows change the outcome
            }
            if (greenFlowedLib > greenFlowedLab && greenFlowedLib > polling.other) {
                highestParty = "liberal";
            }
            if (polling.other > greenFlowedLib && polling.other > greenFlowedLab) {
                highestParty = "other";
            }
        }
        if (highestParty !== "other") {
            //If greens and other aren't the highest, then other will now spill it's preference flows
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
        marginColor = `${polling[highestParty] - 10}%`; //This means that the higher the polling, the brighter the colour will be
        seatElement.style = `fill: ${parties[highestParty].colour}; filter: opacity(${marginColor})`; //This is the code that actually fills in the necessary colour for every seat
    }
}
