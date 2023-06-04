var wordList = ["Molino de viento", "Imprenta", "Pólvora", "Brújula", "Reloj mecánico", "Astrolabio", "Arado"];
var usedWords = []; // Palabras utilizadas
var selectedWord = getRandomWord(); // Palabra seleccionada
var lives = 6; // Vidas restantes
var guessedLetters = []; // Letras adivinadas

// Función para obtener una palabra aleatoria de la lista sin repetir
function getRandomWord() {
    if (wordList.length === 0) {
        wordList = usedWords; // Si se han utilizado todas las palabras, reinicia la lista con las palabras utilizadas
        usedWords = [];
    }

    var randomIndex = Math.floor(Math.random() * wordList.length);
    var randomWord = wordList[randomIndex];

    // Remover la palabra seleccionada de la lista para evitar repeticiones
    wordList.splice(randomIndex, 1);
    usedWords.push(randomWord);

    return randomWord;
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
            window.location.href = "win.html";
        }
    } else {
        lives--;
        displayLives();
        displayHangman();

        if (lives === 0) {
            window.location.href = "lose.html?word=" + encodeURIComponent(selectedWord);
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
    window.location.href = "index.html";
}

// Iniciar el juego cuando se cargue la página
window.onload = function () {
    displayWord();
    displayGuesses();
    displayLives();
    document.addEventListener("keyup", handleKeyPress);
};
