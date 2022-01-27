// this is a basic connection schema to the corresponding data for the table provided.
// this API KEY will expire after January 2022
// Written by GSoosalu & ndr3svt
const API_KEY = 'AIzaSyDQNwROozFi8edyHduP79ZLnoMS6rWLy8E';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
let options;
let questionsIndex = 0;
let history = [];
let state = false;
let correct_answer_index;
let chosen_answer_index;
let res;
let currentScore = 0;


document.addEventListener('DOMContentLoaded', init);
let openBtn = document.querySelector('.open');
let modalContainer = document.querySelector('.modal-container');
let buttonEval = document.querySelector(".evaluate");
let popUp = document.querySelector(".popInfo");
let questionLoad = document.querySelector(".question");
let upperMsg = document.querySelector(".upperMsg")


//PopUp for the messages
openBtn.addEventListener('click', function(){
	if (state === true ) modalContainer.classList.add('show');
})

function popUpClose() {
	modalContainer.classList.remove('show')
}
	


//Callling the gapi
function handleClientLoad() {
	gapi.load('client', initClient);
}

function initClient() {
	gapi.client.init({
	  apiKey: API_KEY,
	  discoveryDocs: DISCOVERY_DOCS
	}).then(function () {
	  getExerciseData();
	}, function(error) {
	  console.log(JSON.stringify(error, null, 2));
	});
}

function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
  
	// While there remain elements to shuffle...
	while (currentIndex != 0) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex--;
  
	  // And swap it with the current element.
	  [array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
  
	return array;
}
  

function getExerciseData() {
	gapi.client.sheets.spreadsheets.values.get({
	  spreadsheetId: '1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc',
	  range: 'Learning!A1:F10',
	}).then(function(response) {
		//console.log('in the response')
		//console.log(response);
		//console.log(response.result.values.splice(1));
		res = {
			a: shuffle(response.result.values.splice(1))
		};
		init(res)

	}, function(response) {
		console.log('Error: ' + response.result.error.message);
	});
}


function init(arr){
	options = arr.a[questionsIndex];
	// Checking if we reach the end of the array to display the score.
	if (arr.a.length === questionsIndex) {
		let count = 0;
		for (let i in history){
			if (history[i] == true) {
				count++
			}
		}

		let clearSlideshow = document.querySelector('.slideshow');
		let clearButton = document.querySelector('.evaluate');
		let celebration = document.querySelector('.body');

		
		upperMsg.innerHTML = '<p id="topMsg">That was a Good Run!<p>';
		clearSlideshow.innerHTML = `<div class="question"> <p class="anim-typewriter" id="finalMsg"> You completed ${count} </p> <p  id="finalMsg-score">You had a score of ${currentScore}</p></div>`;
		clearButton.outerHTML = `<button class="evaluate retry" id="element-delay" onclick="location.reload()">Retry?</button>`;
		celebration.innerHTML += '<div class="confetti"> <div class="confetti-piece"></div> <div class="confetti-piece"></div> <div class="confetti-piece"></div> <div class="confetti-piece"></div><div class="confetti-piece"></div> <div class="confetti-piece"></div> <div class="confetti-piece"></div> <div class="confetti-piece"></div> <div class="confetti-piece"></div> <div class="confetti-piece"></div> <div class="confetti-piece"></div> <div class="confetti-piece"></div> <div class="confetti-piece"></div></div>'

		return null;
	}

	// Obtaining the Index of correct answers
	correct_answer_index = options[4];

	// Selecting ID tagets
	let questionDisplay = document.querySelector('#question-wrapper');
	let optionsContainer=document.querySelector('#options-wrapper');
	//cleaning  the question and options display
	questionDisplay.innerHTML= '';
	optionsContainer.innerHTML= '';
	
	// Populating the questions and options
	questionDisplay.innerHTML+= `<p> ${options[2]}</p>`

	
	for(let i = 0; i< options[3].split(';').length; i++){
		optionsContainer.innerHTML+= `<div id="myChoice${i}"class='unchosen option' onclick="toggleChoice(${i})"><p class='text'> ${options[3].split(';')[i]} </p></div>`;
	}

	buttonEval.classList.remove('hidden');

	// Loading the main question after having the data 
	questionLoad.innerHTML= 'Which is the correct option?';
	
	//Creating a Pop up with extra info
	popUp.innerHTML = `The topic is ${options[0]}. This question is the ${questionsIndex + 1} of ${arr.a.length}. And it has a score of ${options[5]}.`;

}


function toggleChoice(i){
	//console.log('hello' + i)
	// Prevents from selection visualy other options 
	if (state == true) return null;
	// Set current answer
	chosen_answer_index = i;
	// Verifying if chosen answer already exist, if yes, removing previous selection
	if( document.querySelector(".chosen") != null) {
		document.querySelector(".chosen").classList.remove("chosen");
	} 

	// Adding "chosen" class to the selected answer
	let selectedOption = document.querySelector(`#myChoice${i}`);
	selectedOption.classList.add("chosen");
	
}


function myEvaluation(){
	// Selecting ID tagets
	let evMessage = document.querySelector('#evaluation-message');
	let buttonText = buttonEval.firstChild;


	//upload()
	//let selectBody = document.querySelector(".bodx")
	//selectBody.classList.add("changeBody");

	console.log('an evaluation function place holder');
	
	

	// Changing to the next set of questions based on the state
	if (state === true) {
		buttonText.textContent = "Check";
		// reseting the message
		evMessage.innerHTML = '';
		state = false;
		questionsIndex++;
		buttonEval.classList.remove('next-botton')
		init(res)
		return null;
	}

	//Displaying the result of the choosen answer
	if (correct_answer_index == chosen_answer_index) {
		evMessage.innerHTML = '<p>Warning:<br><br> You are too good at this! <br> /(ㆆ◡ㆆ)/ </p> <button id="close" onclick="popUpClose()">Close</button>';
		history.push(true);
		currentScore += parseInt(res.a[questionsIndex][5]);
		chosen_answer_index = -1;

	} else {

		// Verifying if we didn't choose and answer 
		if( document.querySelector(".chosen") == null) {
			evMessage.innerHTML = '<p>Error:<br><br>Wrong answer. <br> You did not choose an option. <br> (ㆆ_ㆆ) </p> <button id="close" onclick="popUpClose()">Close</button>';
			
			//return null;
		}
		else {
			evMessage.innerHTML = '<p> Information: <br><br>Keep trying, you can do it! <br> (ò ^ ó)/ </p> <button id="close" onclick="popUpClose()">Close</button>';
		}

		history.push(false);
		// console.log('tryAgain')

	}

	// Comunicating next action and avoiding reselection of an answer.
	state = true;
	buttonText.textContent  = "Next Question"
	buttonEval.classList.add('next-botton')
	
}



