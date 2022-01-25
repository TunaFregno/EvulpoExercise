// alert('js loaded!')
// this is a basic structure for evaluation of a single choice exercise
// INTENTIONALLY parts of the code have been deleted. 
//  It should serve as a hint towards finding a suitable solution for single choice exercise
// Written by GSoosalu ndr3svt

let options = ['this','this not', 'this either']
let states = [false,false,false]
let correct_answer_index= 0

document.addEventListener('DOMContentLoaded', question)
document.addEventListener('DOMContentLoaded', init)

function question(){
	let questionDisplay = document.querySelector('#question-wrapper')
	questionDisplay.innerHTML+= "<p> Parts of speech indicate when something happened.</p>"
	
	// ...
}

function init(){
	let optionsContainer=document.querySelector('#options-wrapper')
	for(let i = 0; i< options.length; i++){
		optionsContainer.innerHTML+= `<div class='unchosen option' onclick="toggleChoice(${i})"><p class='text'> ${options[i]} </p></div>`
	}

}

function toggleChoice(i){
	states[i]=true
	console.log('hello')
	let selectedOption = document.querySelector(".chosen").style.border = "4px solid rgb(88, 86, 86);"
	// ...
}



function myEvaluation(){
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