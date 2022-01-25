// this is a basic connection schema to the corresponding data for the table provided.
// this API KEY will expire after January 2022
// Written by GSoosalu & ndr3svt
const API_KEY = 'AIzaSyDQNwROozFi8edyHduP79ZLnoMS6rWLy8E';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
let exerciseIndex;
let exerciseData;
let options;
let questions = 1;
let state = false;
let correct_answer_index;
let chosen_answer_index;
let res;

document.addEventListener('DOMContentLoaded', init);

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
	console.log('in the question func')
	console.log(arr.a[questions][2])
	let options = arr.a[questions];
	correct_answer_index = options[4];
	//console.log(correct_answer_index);
	let questionDisplay = document.querySelector('#question-wrapper');
	let optionsContainer=document.querySelector('#options-wrapper');

	questionDisplay.innerHTML+= `<p> ${options[2]}</p>`
	
	for(let i = 0; i< options[3].split(';').length; i++){
		optionsContainer.innerHTML+= `<div id="myChoice${i}"class='unchosen option' onclick="toggleChoice(${i})"><p class='text'> ${options[3].split(';')[i]} </p></div>`
	}
	// ...
}


function toggleChoice(i){
	
	console.log('hello' + i)
	chosen_answer_index = i;
	if( document.querySelector(".chosen") != null) {
		document.querySelector(".chosen").classList.remove("chosen");
	} 
	let selectedOption = document.querySelector(`#myChoice${i}`);
	selectedOption.classList.add("chosen");
	
}

function upload() {

	var elem = document.getElementById("myBar");  
	var width = 1;
	var id = setInterval(frame, 10);
	function frame() {
	  if (width >= 100) {
		clearInterval(id);
	  } else {
		width++; 
		elem.style.width = width + '%'; 
	  }
	
	}
}

function myEvaluation(){

	//upload()
	//let selectBody = document.querySelector(".bodx")
	//selectBody.classList.add("changeBody");
	console.log('an evaluation function place holder');
	let evMessage = document.querySelector('#evaluation-message');
	let buttonText = document.querySelector("#evaluate").firstChild;

	if (state === true) {
		buttonText.textContent = "Check";
		state = false;
		questions++
		init(res)
		return null;
	}

	if (correct_answer_index == chosen_answer_index) {
		evMessage.innerHTML = '<p>Awesome!</p>';

	} else {
		evMessage.innerHTML = '<p>Keep trying!</p>';
			// console.log('tryAgain')

	}

	buttonText.textContent  = "Next Question"
	state = true;
}



