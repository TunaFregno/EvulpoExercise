// this is a basic connection schema to the corresponding data for the table provided.
// this API KEY will expire after January 2022
// Written by GSoosalu & ndr3svt
const API_KEY = 'AIzaSyDQNwROozFi8edyHduP79ZLnoMS6rWLy8E';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
let exerciseIndex;
let exerciseData;
let options;
let states = [];
let correct_answer_index;
let chosen_answer_index;

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

function getExerciseData() {
	gapi.client.sheets.spreadsheets.values.get({
	  spreadsheetId: '1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc',
	  range: 'Learning!A1:F10',
	}).then(function(response) {
		console.log('in the response')
		console.log(response);
		//let res = {
		//	a: response.result.values
		//};
		//init(res)
	}, function(response) {
		console.log('Error: ' + response.result.error.message);
	});
}

document.addEventListener('DOMContentLoaded', init)

function init(){
	//let options = arr.a;

	let options = ['this','this not', 'this either']
	//let answerOptions = [];
	let listofOptions = [];
	let optionsContainer=document.querySelector('#options-wrapper')

	//for(let i = 0; i< options.length; i++){
	//	answerOptions.push(options[i][3])
	//}


	for(let i = 0; i< options.length; i++){
		optionsContainer.innerHTML+= `<div class='unchosen option' onclick="toggleChoice(${i})"><p class='text'> ${options[i]} </p></div>`
	}

}

function toggleChoice(i){
	states[i]=true
	console.log('hello')
	let selectedOption = document.querySelector(".option")
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

	upload()
	let selectBody = document.querySelector(".bodx")
	selectBody.classList.add("changeBody");

	console.log('an evaluation function place holder')
	let evMessage = document.querySelector('#evaluation-message')
	for(let i = 0; i<options.length; i++){
		if(states[i] && i == correct_answer_index){
			evMessage.innerHTML = '<p>Awesome!</p>'
			// console.log('awesome')
			break
		}
		else{
			evMessage.innerHTML = '<p>Keep trying!</p>'
			// console.log('tryAgain')
			break
		}
	}
}



