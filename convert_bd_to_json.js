const fs = require("fs");

// Read the БД.txt file
const bdText = fs.readFileSync("БД.txt", "utf8");

// Read existing questions.json
const existingQuestions = JSON.parse(
  fs.readFileSync("./src/categories/db/questions.json", "utf8")
);

// Parse the text file and convert to JSON format
const questions = [];
const lines = bdText.split("\n");
let currentQuestion = "";
let currentOptions = {};
let currentCorrectAnswer = "";
let inQuestion = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Check if this is a new question
  if (line.match(/^Вопрос \d+:/)) {
    // Save previous question if exists
    if (
      currentQuestion &&
      Object.keys(currentOptions).length > 0 &&
      currentCorrectAnswer
    ) {
      questions.push({
        question: currentQuestion,
        options: currentOptions,
        correct_answer: currentCorrectAnswer,
      });
    }

    // Start new question
    currentQuestion = "";
    currentOptions = {};
    currentCorrectAnswer = "";
    inQuestion = true;

    // Get question text from next line
    if (i + 1 < lines.length) {
      currentQuestion = lines[i + 1].trim();
      i++; // Skip the question text line in next iteration
    }
  }
  // Check for options (A), (B), etc.
  else if (inQuestion && line.match(/^[A-Z]\)/)) {
    const optionLetter = line.charAt(0);
    const optionText = line.substring(line.indexOf(")") + 1).trim();
    if (optionText) {
      currentOptions[optionLetter] = optionText;
    }
  }
  // Check for correct answer with asterisk
  else if (inQuestion && line.includes("*")) {
    // Find the option with asterisk
    const asteriskMatch = line.match(/([A-Z])\s*\*/);
    if (asteriskMatch) {
      currentCorrectAnswer = asteriskMatch[1];
    }
  }
  // Check for "Правильный ответ:" line
  else if (
    inQuestion &&
    (line.includes("Правильный ответ:") || line.includes("Правильные ответы:"))
  ) {
    // Extract correct answer(s)
    const answerMatch = line.match(/[A-Z]/g);
    if (answerMatch && answerMatch.length > 0) {
      // For multiple correct answers, use the first one
      currentCorrectAnswer = answerMatch[0];
    }
  }
  // Check for alternative correct answer format in parentheses
  else if (inQuestion && line.includes("(") && line.includes(")")) {
    const parenMatch = line.match(/\(([A-Z])\)/);
    if (parenMatch) {
      currentCorrectAnswer = parenMatch[1];
    }
  }
  // End of question section (empty line or new question)
  else if (inQuestion && (line === "" || line.startsWith("Вопрос"))) {
    inQuestion = false;
  }
}

// Add the last question
if (
  currentQuestion &&
  Object.keys(currentOptions).length > 0 &&
  currentCorrectAnswer
) {
  questions.push({
    question: currentQuestion,
    options: currentOptions,
    correct_answer: currentCorrectAnswer,
  });
}

// Filter out questions that don't have proper structure
const validQuestions = questions.filter(
  (q) => q.question && Object.keys(q.options).length > 0 && q.correct_answer
);

console.log(`Parsed ${validQuestions.length} questions from БД.txt`);

// Log some sample questions for debugging
if (validQuestions.length > 0) {
  console.log("Sample question:");
  console.log(JSON.stringify(validQuestions[0], null, 2));
}

// Merge with existing questions
const allQuestions = [...existingQuestions, ...validQuestions];

// Write the combined questions back to the file
fs.writeFileSync(
  "src/categories/db/questions.json",
  JSON.stringify(allQuestions, null, 2)
);

console.log(`Total questions in file: ${allQuestions.length}`);
console.log(
  "Successfully converted БД.txt to JSON and merged with existing questions!"
);
