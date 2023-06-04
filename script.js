var wordList = ["Molino de viento", "Imprenta", "Pólvora", "Brújula", "Reloj mecánico", "Arado"];
var lastIndex = localStorage.getItem("lastIndex") || -1; // Índice de la última palabra utilizada
var selectedWord = ""; // Palabra seleccionada
var lives = 6; // Vidas restantes
var guessedLetters = []; // Letras adivinadas

// Función para obtener una palabra no utilizada de la lista
function getNextWord() {
    var availableWords = wordList.filter(function(_, index) {
        return index > lastIndex;
    });

    if (availableWords.length === 0) {
        // Si se han utilizado todas las palabras, reinicia el juego
        lastIndex = -1;
        localStorage.removeItem("lastIndex");
        availableWords = wordList;
    }

    var randomIndex = Math.floor(Math.random() * availableWords.length); // Obtener un índice aleatorio
    selectedWord = availableWords[randomIndex]; // Obtener la palabra en el índice aleatorio
    lastIndex = wordList.indexOf(selectedWord); // Actualizar el índice de la última palabra utilizada
    localStorage.setItem("lastIndex", lastIndex); // Guardar el índice en el localStorage

    return selectedWord;
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

    displayedWord = displayedWord.trim(); // Eliminar espacios en blanco al final
    
    if (wordList.length === 0 && displayedWord.indexOf("_") === -1) {
        displayedWord = displayedWord.replace(/_/g, "fin"); // Reemplazar guiones bajos con "fin" si no quedan palabras disponibles y no hay guiones bajos en la palabra
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