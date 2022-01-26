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
let openBtn = document.getElementById('open');
let closeBtn = document.getElementById('close');
let modalContainer = document.querySelector('.modal-container');

//PopUp for the messages
openBtn.addEventListener('click', function(){
	modalContainer.classList.add('show');
})

closeBtn.addEventListener('click', function(){
	modalContainer.classList.remove('show')
})


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
		
		clearSlideshow.innerHTML = `<p class="question">You completed ${count} and your score is ${currentScore}</p>`;
		clearButton.outerHTML = `<button class="evaluate" onclick="location.reload()">Retry?</button>`;
		
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
		optionsContainer.innerHTML+= `<div id="myChoice${i}"class='unchosen option' onclick="toggleChoice(${i})"><p class='text'> ${options[3].split(';')[i]} </p></div>`
	}
	
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
	let buttonText = document.querySelector(".evaluate").firstChild;


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
		init(res)
		return null;
	}

	//Displaying the result of the choosen answer
	if (correct_answer_index == chosen_answer_index) {
		evMessage.innerHTML = '<p>Awesome!</p>';
		history.push(true);
		currentScore += parseInt(res.a[questionsIndex][5]);
		

	} else {

		// Verifying if we didn't choose and answer 
		if( document.querySelector(".chosen") == null) {
			evMessage.innerHTML = "<p>Wrong answer. <br> You didn't choose an option.</p>";
			//return null;
		}
		else {
			evMessage.innerHTML = '<p>Keep trying!</p>';
		}

		history.push(false);
		// console.log('tryAgain')

	}
	

	// Comunicating next action and avoiding reselection of an answer.
	state = true;
	buttonText.textContent  = "Next Question"
	
}



