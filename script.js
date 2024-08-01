const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
let editBool = false;
let editIndex = null;

// Load flashcards from localStorage
window.onload = () => {
  const storedFlashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  storedFlashcards.forEach(flashcard => {
    addFlashcardToDOM(flashcard.question, flashcard.answer);
  });
};

// Add question when user clicks 'Add Flashcard' button
addQuestion.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

// Hide Create flashcard Card
closeBtn.addEventListener("click", () => {
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
  if (editBool) {
    editBool = false;
    submitQuestion();
  }
});

// Submit Question
cardButton.addEventListener("click", () => {
  editBool = false;
  const tempQuestion = question.value.trim();
  const tempAnswer = answer.value.trim();
  if (!tempQuestion || !tempAnswer) {
    errorMessage.classList.remove("hide");
  } else {
    container.classList.remove("hide");
    errorMessage.classList.add("hide");
    addOrUpdateFlashcard(tempQuestion, tempAnswer);
    question.value = "";
    answer.value = "";
  }
});

// Add or Update flashcard in localStorage and DOM
function addOrUpdateFlashcard(question, answer) {
  const storedFlashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  if (editIndex !== null) {
    storedFlashcards[editIndex] = { question, answer };
    editIndex = null;
  } else {
    storedFlashcards.push({ question, answer });
  }
  localStorage.setItem("flashcards", JSON.stringify(storedFlashcards));
  renderFlashcards();
}

// Render all flashcards from localStorage to DOM
function renderFlashcards() {
  const listCard = document.getElementsByClassName("card-list-container")[0];
  listCard.innerHTML = ''; // Clear existing cards
  const storedFlashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  storedFlashcards.forEach(flashcard => {
    addFlashcardToDOM(flashcard.question, flashcard.answer);
  });
}

// Add flashcard to DOM
function addFlashcardToDOM(question, answer) {
  const listCard = document.getElementsByClassName("card-list-container")[0];
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `
    <p class="question-div">${question}</p>
    <p class="answer-div hide">${answer}</p>
  `;

  const link = document.createElement("a");
  link.setAttribute("href", "#");
  link.setAttribute("class", "show-hide-btn");
  link.innerHTML = "Show/Hide";
  link.addEventListener("click", () => {
    div.querySelector(".answer-div").classList.toggle("hide");
  });

  const buttonsCon = document.createElement("div");
  buttonsCon.classList.add("buttons-con");

  const editButton = document.createElement("button");
  editButton.setAttribute("class", "edit");
  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editButton.addEventListener("click", () => {
    editBool = true;
    modifyElement(editButton, true);
    addQuestionCard.classList.remove("hide");
  });
  buttonsCon.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "delete");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  buttonsCon.appendChild(deleteButton);

  div.appendChild(link);
  div.appendChild(buttonsCon);
  listCard.appendChild(div);
}

// Modify flashcards
const modifyElement = (element, edit = false) => {
  const parentDiv = element.parentElement.parentElement;
  const parentQuestion = parentDiv.querySelector(".question-div").innerText;
  if (edit) {
    const parentAnswer = parentDiv.querySelector(".answer-div").innerText;
    answer.value = parentAnswer;
    question.value = parentQuestion;
    disableButtons(true);
    const storedFlashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
    editIndex = storedFlashcards.findIndex(flashcard => flashcard.question === parentQuestion && flashcard.answer === parentAnswer);
  }
  parentDiv.remove();
  if (!edit) {
    deleteFlashcard(parentQuestion);
  }
};

// Disable edit and delete buttons
const disableButtons = (value) => {
  const editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach(element => {
    element.disabled = value;
  });
};

// Delete flashcard from localStorage
function deleteFlashcard(question) {
  const storedFlashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  const updatedFlashcards = storedFlashcards.filter(flashcard => flashcard.question !== question);
  localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards));
  renderFlashcards();
}
