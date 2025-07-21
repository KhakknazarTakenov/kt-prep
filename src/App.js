import React, { useState } from "react";
import questions from "./questions.json";

function App() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const q = questions[current];
  const options = Object.entries(q.options);

  const handleSelect = (key) => {
    setSelected(key);
    setShowAnswer(true);
  };

  const next = () => {
    setSelected(null);
    setShowAnswer(false);
    setCurrent((prev) => (prev + 1 < questions.length ? prev + 1 : 0));
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Вопрос {current + 1} из {questions.length}</h2>
      <div style={{ fontSize: 20, marginBottom: 24 }}>{q.question}</div>
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
              cursor: showAnswer ? "default" : "pointer"
            }}
          >
            {key}. {text}
          </button>
        ))}
      </div>
      {showAnswer && (
        <div style={{ margin: "16px 0", fontWeight: 500 }}>
          {selected === q.correct_answer ? "Верно!" : `Неверно. Правильный ответ: ${q.correct_answer}. ${q.options[q.correct_answer]}`}
        </div>
      )}
      <button onClick={next} style={{ marginTop: 24, fontSize: 18 }}>
        {current + 1 < questions.length ? "Следующий вопрос" : "Сначала"}
      </button>
    </div>
  );
}

export default App;
