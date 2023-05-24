window.onload = getData;

var clickedCards = 0;
var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "H", "Y", "Z"];
var alphaRest = alphabet.slice();
var charsSetted = []
var name = "";
var diff = -1;
var validDiff = false;
var tables = [[4, 3], [5, 4], [8, 5]]; // x, y. A la hora de utilizado le invierten
var logicTable = [];
var t = "";
var fails = 0;
var twoChars = "";
var clicked = [];
var score = 0;

// Funció que demana nom, dificultat i crea el tauler
function getData() {

	do {

		name = prompt("Escriu un nom", "Player");

		if (name.length <= 0 || name == "null") {
			alert("Siusplau introdueix un nom vàlid")
		}

	} while (name.length <= 0 || name == "null");


	do {

		diff = parseInt(prompt("Dificultat \n\n\n 1 = Fàcil (4 x 3) \n 2 = Normal (5 x 4) \n 3 = Difícil (8 x 5) \n ", "1"));

		if (diff == 1 || diff == 2 || diff == 3) {
			validDiff = true;
		} else {
			alert("Escolleix una dificultat vàlida")
		}

	} while (!validDiff)

	setTable();
}

/**
* Funció subministrada pel professorat que agafarà cada carta i farà que escolti l'esdeveniment de ratolí
*/
function addCardListener() {
	let cards;
	cards = document.getElementsByClassName("card");

	for (let i = 0; i < cards.length; i++) {
		cards[i].addEventListener("click", function () { clickCard(this.id) }, false);
	}
}

/**
* Funció subministrada pel professorat que esperarà per paràmetre un array i el retornarà amb els elements desordenats aleatòriament.
* Com que el pas de paràmetres dels arrays és per referència, i no volem desordenar l'array d'entrada, en crearem un clon amb el mètode slice().
* Aquest nou array és el que desordenarem i retornarem.
*
* @param {array} arr
* @return {array}
*/
function shuffleArray(arr) {
	clonedArray = arr.slice();

	return clonedArray.sort(function () {
		return Math.random() - 0.5
	})
}

/**
* Funció (incompleta) subministrada pel professorat que recull el valor de la carta clicada i fa una acció sobre el tauler.
* 
* @param {number} id - Id de la carta
*/
function clickCard(id) {
	if (clickedCards < 2 && !clicked.includes(id)) {
		var oldBackground = document.getElementById(id).style.background;
		console.log(logicTable)
		console.log(logicTable[id.charAt(0)][id.charAt(1)]);
		document.getElementById(id).style.background = "#fff";
		document.getElementById(id).innerHTML = logicTable[id.charAt(0)][id.charAt(1)];
		clickedCards++;
		twoChars += logicTable[id.charAt(0)][id.charAt(1)];
		clicked.push(id)
		console.log(twoChars);

		if (clickedCards == 2) {
			setTimeout(function () {
				if (twoChars.charAt(0) == twoChars.charAt(1)) {
					console.log("True")
					clickedCards = 0;
					score++;
				} else {
					document.getElementById(clicked[0]).style.background = oldBackground;
					document.getElementById(clicked[1]).style.background = oldBackground;
					document.getElementById(clicked[0]).innerHTML = "&nbsp;"
					document.getElementById(clicked[1]).innerHTML = "&nbsp;"
					clickedCards = 0;
					fails++;
					console.log("False")
				}

				clicked = [];
				twoChars = "";
				console.log("score", (tables[diff - 1][0] * tables[diff - 1][1]) / 2)
				if (score == ((tables[diff - 1][0] * tables[diff - 1][1]) / 2)) {
					var playAgain = false;
					playAgain = window.confirm("Has guanyat " + name + "!\n\n  Errors: " + fails + "\n\n Vols tornar a jugar?")
					if (playAgain) {
						restart();
					}

				}
			}, 1000)
		}

	}

}

function setTable() {

	for (var i = 0; i < tables[(diff - 1)][1]; i++) {
		logicTable.push([]);
		for (var j = 0; j < tables[(diff - 1)][0]; j++) {
			logicTable[i].push("-")
		}
	}

	var totalChars = tables[(diff - 1)][1] * tables[(diff - 1)][0];

	for (var i = 0; i < (totalChars / 2); i++) {

		var myChar = getNewChar()
		var valid = false;
		var inserted = 0;

		do {
			var coord = getEmptySlot();

			t = "";
			try {

				if (logicTable[coord[0]][coord[1]] == "-" && !charsSetted.includes(myChar) && myChar != undefined) {
					logicTable[coord[0]][coord[1]] = myChar;
					inserted++;
				} else if (charsSetted.includes(myChar)) {
					console.log("ulso")
					myChar = getNewChar()
				}

			} catch (e) {
				myChar = getNewChar()
			}

			if (inserted == 2) {
				valid = true;
				charsSetted.push(myChar)
				alphaRest.splice(alphaRest.indexOf(myChar), 1);
				//console.log("inserted")
			} else {
				valid = false;
			}

		} while (!valid)

	}

	drawTable();
	console.log(logicTable)
}


function getNewChar() {

	var rand = Math.floor(Math.random() * alphaRest.length)

	return alphaRest[rand];
}

function drawTable() {
	//board

	var text = "";


	for (var i = 0; i < logicTable.length; i++) {
		text += "<div>";

		for (var j = 0; j < logicTable[i].length; j++) {
			//text += '<div class="card checkered" id="' + i + '' + j + '">' + logicTable[i][j] + '</div>'
			text += '<div class="card checkered" id="' + i + '' + j + '"> &nbsp </div>'
		}

		text += "</div>";
	}

	document.getElementById('board').innerHTML = text;
	addCardListener();
}

function getEmptySlot() {

	var emptySlots = [];


	for (var i = 0; i < logicTable.length; i++) {
		for (var j = 0; j < logicTable[i].length; j++) {
			if (logicTable[i][j] === "-") {
				emptySlots.push([i, j]);
				console.log("iftrue " + i + " " + j, logicTable[i][j])
			} else {
				console.log("iffalse" + i + " " + j, logicTable[i][j])
			}
			t += "(" + i + ", " + j + " )" + logicTable[i][j];
		}
	}
	console.log("emptys", emptySlots)


	return emptySlots[Math.floor(Math.random() * emptySlots.length)];

}

function restart() {
	clickedCards = 0;
	alphaRest = alphabet.slice();
	charsSetted = []
	name = "";
	diff = -1;
	validDiff = false;
	logicTable = [];
	t = "";
	fails = 0;
	twoChars = "";
	clicked = [];
	score = 0;
	getData();
}