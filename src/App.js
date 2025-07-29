import React, { useState, useEffect } from "react";
import dbQuestions from "./categories/db/questions.json";
import englishQuestions from "./categories/english/questions.json";
import tgoQuestions from "./categories/tgo/questions.json";
import adsQuestions from "./categories/ads/questions.json";

function App() {
  const [currentCategory, setCurrentCategory] = useState("db");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  // Функция для перемешивания массива вопросов
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Получение вопросов для выбранной категории
  const getQuestionsForCategory = (category) => {
    switch (category) {
      case "db":
        return dbQuestions;
      case "english":
        return englishQuestions;
      case "tgo":
        return tgoQuestions;
      case "ads":
        return adsQuestions;
      default:
        return dbQuestions;
    }
  };

  // Перемешивание вопросов при смене категории
  useEffect(() => {
    const questions = getQuestionsForCategory(currentCategory);
    setShuffledQuestions(shuffleArray(questions));
    setCurrent(0);
    setSelected(null);
    setShowAnswer(false);
    setAnsweredQuestions({});
  }, [currentCategory]);

  const q = shuffledQuestions[current];
  const options = q ? Object.entries(q.options) : [];

  const handleSelect = (key) => {
    setSelected(key);
    setShowAnswer(true);

    // Сохраняем ответ на текущий вопрос
    const isCorrect = key === q.correct_answer;
    setAnsweredQuestions((prev) => ({
      ...prev,
      [current]: isCorrect,
    }));
  };

  // Навигационные функции
  const goToNext = () => {
    setSelected(null);
    setShowAnswer(false);
    setCurrent((prev) => (prev + 1 < shuffledQuestions.length ? prev + 1 : 0));
  };

  const goToPrevious = () => {
    setSelected(null);
    setShowAnswer(false);
    setCurrent((prev) => (prev > 0 ? prev - 1 : shuffledQuestions.length - 1));
  };

  const jumpToQuestion = (questionIndex) => {
    setSelected(null);
    setShowAnswer(false);
    setCurrent(questionIndex);
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  // Функция для определения цвета кнопки вопроса
  const getQuestionButtonStyle = (questionIndex) => {
    const isCurrent = questionIndex === current;
    const isAnswered = answeredQuestions.hasOwnProperty(questionIndex);
    const isCorrect = answeredQuestions[questionIndex];

    let backgroundColor = "#e0e0e0"; // Серый - не отвечен
    let color = "#333";
    let border = "1px solid #ccc";

    if (isAnswered) {
      if (isCorrect) {
        backgroundColor = "#4caf50"; // Зеленый - отвечен верно
        color = "white";
      } else {
        backgroundColor = "#f44336"; // Красный - отвечен неверно
        color = "white";
      }
    }

    if (isCurrent) {
      border = "3px solid #1976d2"; // Толстая синяя рамка для текущего вопроса
    }

    return {
      width: "40px",
      height: "40px",
      minWidth: "40px",
      flexShrink: 0,
      margin: "2px",
      padding: "0",
      fontSize: "14px",
      fontWeight: "bold",
      background: backgroundColor,
      color: color,
      border: border,
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    };
  };

  return (
    <div
      style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Подготовка к экзамену
      </h1>

      {/* Кнопки категорий */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => handleCategoryChange("db")}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            background: currentCategory === "db" ? "#1976d2" : "#f5f5f5",
            color: currentCategory === "db" ? "white" : "black",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: currentCategory === "db" ? "bold" : "normal",
          }}
        >
          База данных
        </button>
        <button
          onClick={() => handleCategoryChange("english")}
          disabled={true}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            background: "#e0e0e0",
            color: "#666",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "not-allowed",
            opacity: 0.6,
          }}
        >
          English
        </button>
        <button
          onClick={() => handleCategoryChange("tgo")}
          disabled={true}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            background: "#e0e0e0",
            color: "#666",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "not-allowed",
            opacity: 0.6,
          }}
        >
          TGO
        </button>
        <button
          onClick={() => handleCategoryChange("ads")}
          disabled={true}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            background: "#e0e0e0",
            color: "#666",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "not-allowed",
            opacity: 0.6,
          }}
        >
          ADS
        </button>
      </div>

      {/* Информация о категории */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          padding: "10px",
          background: "#f0f8ff",
          borderRadius: "5px",
        }}
      >
        <h3>
          Категория:{" "}
          {currentCategory === "db"
            ? "База данных"
            : currentCategory === "english"
            ? "English"
            : currentCategory === "tgo"
            ? "TGO"
            : "ADS"}
        </h3>
        <p>
          Вопрос {current + 1} из {shuffledQuestions.length}
        </p>
      </div>

      {/* Навигация по вопросам */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "5px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <button
          onClick={goToPrevious}
          disabled={shuffledQuestions.length === 0}
          style={{
            width: "120px",
            padding: "8px 16px",
            fontSize: "14px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: shuffledQuestions.length === 0 ? "not-allowed" : "pointer",
            opacity: shuffledQuestions.length === 0 ? 0.6 : 1,
          }}
        >
          ← Назад
        </button>

        {/* Кнопки с номерами вопросов */}
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "flex-start",
            gap: "5px",
            maxWidth: "400px",
            overflowX: "auto",
            padding: "5px 0",
          }}
        >
          {shuffledQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => jumpToQuestion(index)}
              style={getQuestionButtonStyle(index)}
              title={`Вопрос ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={shuffledQuestions.length === 0}
          style={{
            width: "120px",
            padding: "8px 16px",
            fontSize: "14px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: shuffledQuestions.length === 0 ? "not-allowed" : "pointer",
            opacity: shuffledQuestions.length === 0 ? 0.6 : 1,
          }}
        >
          Вперед →
        </button>
      </div>

      {/* Вопрос */}
      {q && (
        <div style={{ fontSize: 20, marginBottom: 24, lineHeight: 1.5 }}>
          {q.question}
        </div>
      )}

      {/* Варианты ответов */}
      <div>
        {options.map(([key, text]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={showAnswer}
            style={{
              display: "block",
              width: "100%",
              margin: "8px 0",
              padding: "12px",
              fontSize: 18,
              background:
                showAnswer && key === q.correct_answer
                  ? "#c8e6c9"
                  : showAnswer && selected === key
                  ? "#ffcdd2"
                  : "#f5f5f5",
              border: selected === key ? "2px solid #1976d2" : "1px solid #ccc",
              cursor: showAnswer ? "default" : "pointer",
              borderRadius: "5px",
              transition: "all 0.2s ease",
            }}
          >
            {key}. {text}
          </button>
        ))}
      </div>

      {/* Результат */}
      {showAnswer && (
        <div
          style={{
            margin: "16px 0",
            fontWeight: 500,
            padding: "15px",
            borderRadius: "5px",
            background: selected === q.correct_answer ? "#e8f5e8" : "#ffeaea",
            border:
              selected === q.correct_answer
                ? "1px solid #4caf50"
                : "1px solid #f44336",
          }}
        >
          {selected === q.correct_answer
            ? "✅ Верно!"
            : `❌ Неверно. Правильный ответ: ${q.correct_answer}. ${
                q.options[q.correct_answer]
              }`}
        </div>
      )}

      {/* Кнопка следующего вопроса */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={goToNext}
          style={{
            fontSize: 18,
            padding: "12px 30px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {current + 1 < shuffledQuestions.length
            ? "Следующий вопрос"
            : "Сначала"}
        </button>
      </div>
    </div>
  );
}

export default App;
