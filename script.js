let timeLeft = 45;
let timer;
let isPaused = false;
let currentQuestionIndex = 0;
let currentSetIndex = 0;
let usedLifelines = {}; // Track lifeline usage for each set

const setsOfQuestions = [
    [
        // Set 1
        { question: "What is the capital of France?", options: { A: "Berlin", B: "Madrid", C: "Paris", D: "Rome" }, correctAnswer: "C" },
        { question: "What is the largest planet in our solar system?", options: { A: "Earth", B: "Jupiter", C: "Mars", D: "Venus" }, correctAnswer: "B" },
        { question: "Which element has the chemical symbol 'O'?", options: { A: "Gold", B: "Oxygen", C: "Osmium", D: "Oganesson" }, correctAnswer: "B" }
        // Add more questions for Set 1
    ],
    [
        // Set 2
        { question: "What is the capital of Japan?", options: { A: "Tokyo", B: "Osaka", C: "Kyoto", D: "Nagoya" }, correctAnswer: "A" },
        { question: "Which planet is known as the Red Planet?", options: { A: "Earth", B: "Mars", C: "Jupiter", D: "Saturn" }, correctAnswer: "B" },
        { question: "Which gas is most abundant in the Earth's atmosphere?", options: { A: "Oxygen", B: "Carbon Dioxide", C: "Nitrogen", D: "Hydrogen" }, correctAnswer: "C" }
        // Add more questions for Set 2
    ]
    // Add more sets
];

const questionElement = document.getElementById('question');
const timerDisplay = document.getElementById('timer');
const options = {
    A: document.getElementById('optionA'),
    B: document.getElementById('optionB'),
    C: document.getElementById('optionC'),
    D: document.getElementById('optionD')
};
const restartTimerButton = document.getElementById('restart-timer');
const nextQuestionButton = document.getElementById('next-question');
const nextSetButton = document.getElementById('next-set');
const gameContainer = document.getElementById('game-container');
const blackScreen = document.getElementById('black-screen');
const lifelinesContainer = document.getElementById('lifelines');

function startTimer() {
    isPaused = false;
    restartTimerButton.style.display = 'none';
    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                showTimeUp();
            }
        }
    }, 1000);
}

function restartTimer() {
    isPaused = false;
    restartTimerButton.style.display = 'none';
    startTimer();
}

function showTimeUp() {
    document.getElementById('result').textContent = 'Samay Samapt';
    highlightCorrectAnswer();
    setTimeout(() => {
        blackScreen.style.display = 'flex';
    }, 10000);
}

function checkAnswer(selectedOption) {
    clearInterval(timer);
    isPaused = true;

    if (selectedOption === setsOfQuestions[currentSetIndex][currentQuestionIndex].correctAnswer) {
        options[selectedOption].classList.add('correct');
        document.getElementById('result').textContent = 'Correct!';
        nextQuestionButton.style.display = 'block';
    } else {
        options[selectedOption].classList.add('incorrect');
        highlightCorrectAnswer();
        document.getElementById('result').textContent = 'Wrong!';
        setTimeout(() => {
            blackScreen.style.display = 'flex';
        }, 10000);
    }
}

function highlightCorrectAnswer() {
    const correctAnswer = setsOfQuestions[currentSetIndex][currentQuestionIndex].correctAnswer;
    options[correctAnswer].classList.add('correct');
}

function useLifeline(lifeline) {
    clearInterval(timer);
    isPaused = true;

    switch (lifeline) {
        case 'phone':
            alert('Phone a Friend used!');
            restartTimerButton.style.display = 'block';
            break;
        case '5050':
            hideTwoIncorrectOptions();
            break;
        case 'poll':
            alert('Audience Poll results: 80% chose the correct option');
            break;
        case 'change':
            changeQuestion();
            break;
        default:
            break;
    }

    // Mark the used lifeline in red for the current set
    document.getElementById(lifeline).classList.add('used');
    usedLifelines[currentSetIndex] = usedLifelines[currentSetIndex] || {};
    usedLifelines[currentSetIndex][lifeline] = true;

    // Check if all lifelines have been used for this set
    if (Object.keys(usedLifelines[currentSetIndex]).length === Object.keys(options).length) {
        markAllLifelinesRed();
    }
}

function markAllLifelinesRed() {
    for (let lifeline in options) {
        document.getElementById(lifeline).classList.add('used');
    }
}

function hideTwoIncorrectOptions() {
    const correctAnswer = setsOfQuestions[currentSetIndex][currentQuestionIndex].correctAnswer;
    const incorrectOptions = Object.keys(options).filter(opt => opt !== correctAnswer);
    options[incorrectOptions[0]].style.visibility = 'hidden';
    options[incorrectOptions[1]].style.visibility = 'hidden';
}

function changeQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= setsOfQuestions[currentSetIndex].length) {
        currentQuestionIndex = 0;
    }
    loadQuestion();
}

function loadQuestion() {
    const currentQuestion = setsOfQuestions[currentSetIndex][currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    options.A.textContent = `A: ${currentQuestion.options.A}`;
    options.B.textContent = `B: ${currentQuestion.options.B}`;
    options.C.textContent = `C: ${currentQuestion.options.C}`;
    options.D.textContent = `D: ${currentQuestion.options.D}`;
    resetGame();
}

function resetGame() {
    timeLeft = 45;
    timerDisplay.textContent = timeLeft;
    isPaused = false;
    document.getElementById('result').textContent = '';
    for (let option in options) {
        options[option].classList.remove('correct', 'incorrect');
        options[option].style.visibility = 'visible';
    }
    nextQuestionButton.style.display = 'none';
    blackScreen.style.display = 'none';
    startTimer();

    // Reset lifelines color when changing sets
    for (let lifeline in options) {
        document.getElementById(lifeline).classList.remove('used');
    }

    // Reactivate lifelines for the current set
    if (usedLifelines[currentSetIndex]) {
        for (let lifeline in usedLifelines[currentSetIndex]) {
            document.getElementById(lifeline).classList.add('used');
        }
    }
}
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= setsOfQuestions[currentSetIndex].length) {
        currentQuestionIndex = 0;
    }
    loadQuestion();
}

function nextSet() {
    
    // Reset lifelines color when changing sets
    const lifelines = ['phone', '5050', 'poll', 'change'];
    lifelines.forEach(lifeline => {
        document.getElementById(lifeline).classList.remove('used');
    });
    usedLifelines = {}; // Reset used lifelines object
    currentSetIndex++;
    if (currentSetIndex >= setsOfQuestions.length) {
        currentSetIndex = 0;
    }
    currentQuestionIndex = 0;
    loadQuestion();

}

loadQuestion();
