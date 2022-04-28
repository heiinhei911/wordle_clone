import keyboardKeys from "../../data/keyboardKeys";
import "./Keyboard.css";

import { nanoid } from "nanoid";

export default function Keyboard({ keys, gameOver, updateGrid }) {
  return (
    <>
      {keyboardKeys.map((row, i) => (
        <div className="key-row" key={`keyrow${i + 1}`}>
          {row.map((letter) => {
            if (letter === "ENTER") {
              return (
                <button
                  key={nanoid()}
                  className="key wide-key"
                  value="enter"
                  onClick={() => !gameOver && updateGrid("enter")}
                >
                  {letter}
                </button>
              );
            } else if (typeof letter === "object") {
              return (
                <button
                  key={nanoid()}
                  className="key wide-key"
                  value="backspace"
                  onClick={() => !gameOver && updateGrid("backspace")}
                >
                  {letter}
                </button>
              );
            }

            for (let j = 0; j < keys.length; j++) {
              if (keys[j].letter === letter) {
                return (
                  <button
                    key={nanoid()}
                    className="key"
                    value={letter}
                    onClick={() => !gameOver && updateGrid(letter)}
                    style={{
                      backgroundColor: keys[j].isInCorrectSpot
                        ? "#008000"
                        : keys[j].isInWord
                        ? "#ac953e"
                        : keys[j].notMatched
                        ? "#555555"
                        : "#808080",
                      cursor: gameOver ? "default" : "pointer",
                    }}
                  >
                    {letter}
                  </button>
                );
              }
            }
            return letter;
          })}
        </div>
      ))}
    </>
  );
}
