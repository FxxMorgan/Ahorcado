var wordList = ["Molino de viento", "Imprenta", "Pólvora", "Brújula", "Reloj mecánico", "Arado"];
var usedWords = []; // Palabras utilizadas
var selectedWord = ""; // Palabra seleccionada
var lives = 6; // Vidas restantes
var guessedLetters = []; // Letras adivinadas

// Función para obtener una palabra no utilizada de la lista
function getNextWord() {
    if (wordList.length === 0) {
        wordList = usedWords; // Si se han utilizado todas las palabras, reinicia la lista con las palabras utilizadas
        usedWords = [];
    }

    var randomIndex = Math.floor(Math.random() * wordList.length); // Obtener un índice aleatorio
    var nextWord = wordList[randomIndex]; // Obtener la palabra en el índice aleatorio
    wordList.splice(randomIndex, 1); // Eliminar la palabra de la lista original
    usedWords.push(nextWord); // Agregar la palabra a la lista de palabras utilizadas

    return nextWord;
}

// Función para mostrar la palabra oculta
function displayWord() {
    var wordContainer = document.getElementById("word");
    var displayedWord = "";

    for (var i = 0; i < selectedWord.length; i++) {
        var letter = selectedWord[i];
        if (letter === " ") {
            displayedWord += " ";
        } else if (guessedLetters.includes(normalize(letter.toLowerCase()))) {
            displayedWord += letter + " ";
        } else {
            displayedWord += "_ ";
        }
    }

    wordContainer.textContent = displayedWord;
}


// Función para mostrar las letras adivinadas
function displayGuesses() {
    var guessesContainer = document.getElementById("guesses");
    guessesContainer.textContent = "Letras adivinadas: " + guessedLetters.join(", ");
}

// Función para mostrar las vidas restantes
function displayLives() {
    var livesContainer = document.getElementById("lives");
    livesContainer.textContent = "Vidas restantes: " + lives;
}

// Manejar la pulsación de teclas
function handleKeyPress(event) {
    var keyPressed = event.key.toLowerCase();
    if (/^[a-z]$/.test(keyPressed)) {
        processGuess(keyPressed);
    }
}

// Función para procesar la letra ingresada por el jugador
function processGuess(letter) {
    if (guessedLetters.includes(letter)) {
        alert("Ya has adivinado esta letra.");
        return;
    }

    guessedLetters.push(letter);

    var selectedWordLowerCase = normalize(selectedWord.toLowerCase());
    var letterLowerCase = normalize(letter.toLowerCase());

    if (selectedWordLowerCase.includes(letterLowerCase)) {
        displayWord();
        displayGuesses();

        if (checkWin()) {
            window.location.href = "win.html"; // Redireccionar a la página "win.html"
            return;
        }
    } else {
        lives--;
        displayLives();

        if (lives <= 0) {
            // Redireccionar a la página "lose.html" y pasar el valor de la palabra como parámetro
            window.location.href = "lose.html?word=" + encodeURIComponent(selectedWord);
            return;
        }
    }
}

// Función para normalizar una cadena de texto, eliminando los acentos
function normalize(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Función para verificar si se ha adivinado la palabra completa
function checkWin() {
    for (var i = 0; i < selectedWord.length; i++) {
        var letter = selectedWord[i];
        if (letter !== " " && !guessedLetters.includes(normalize(letter.toLowerCase()))) {
            return false;
        }
    }
    return true;
}

// Reiniciar el juego
function restartGame() {
    if (wordList.length === 0) {
        wordList = usedWords;
        usedWords = [];
    }
    selectedWord = getRandomWord();
    window.location.href = "index.html";
}

// Iniciar el juego cuando se cargue la página
window.onload = function () {
    selectedWord = getNextWord(); // Obtener la siguiente palabra
    displayWord();
    displayGuesses();
    displayLives();
    document.addEventListener("keyup", handleKeyPress);
};