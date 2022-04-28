import "./App.css";
import Div100vh from "react-div-100vh";
import Keyboard from "./components/Keyboard/Keyboard";
import Game from "./components/Game/Game";
import Header from "./components/Header/Header";
import FinalWindow from "./components/FinalWindow/FinalWindow";
import {
  initialize,
  createNewKeys,
  createNewRows,
} from "./helpers/initialization";
import resetGame from "./helpers/reset";
import { addTile, removeTile, checkRow } from "./helpers/updateGrid-functions";
import { useState, useEffect } from "react";

function App() {
  const [rows, setRows] = useState(initialize("rowsStorage", createNewRows()));
  const [keys, setKeys] = useState(initialize("keysStorage", createNewKeys()));
  const [current, setCurrent] = useState(initialize("currentStorage", 0));
  const [gameOver, setGameOver] = useState(initialize("gameOverStorage", null));
  const [popup, setPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [theWord, setTheWord] = useState("");

  // console.log("rows", rows);

  useEffect(() => {
    if (theWord === "") {
      const getTheWordStorage = JSON.parse(
        window.localStorage.getItem("theWordStorage")
      );

      if (!getTheWordStorage) {
        const words = require("random-words")({
          exactly: 10,
          maxLength: 6,
        }).filter((word) => word.length === 5);
        const word = words[Math.floor(Math.random() * words.length)];

        window.localStorage.setItem("theWordStorage", JSON.stringify(word));
        setTheWord(word);
      } else setTheWord(getTheWordStorage);
    }
  }, [theWord]);

  useEffect(() => {
    window.localStorage.setItem("rowsStorage", JSON.stringify(rows));
    window.localStorage.setItem("currentStorage", JSON.stringify(current));
    window.localStorage.setItem("gameOverStorage", JSON.stringify(gameOver));
    window.localStorage.setItem("keysStorage", JSON.stringify(keys));
  }, [rows, current, gameOver, keys]);

  function updateGrid(letter) {
    if (letter === "backspace") {
      removeTile(setRows, current);
    } else if (letter === "enter") {
      checkRow(
        setMsg,
        setPopup,
        setCurrent,
        setRows,
        setKeys,
        setGameOver,
        rows,
        current,
        gameOver,
        theWord
      );
    } else addTile(setRows, current, letter);
  }

  return (
    <Div100vh className="App">
      {gameOver && (
        <FinalWindow
          result={gameOver}
          reset={() =>
            resetGame(
              setCurrent,
              setGameOver,
              setMsg,
              setPopup,
              setKeys,
              setRows,
              setTheWord
            )
          }
          theWord={theWord}
        />
      )}
      {popup && <div className="popup-window">{msg}</div>}
      <Header />

      <div className="game">
        <Game rows={rows} current={current} />
      </div>
      <div className="keyboard">
        <Keyboard
          keys={keys}
          gameOver={gameOver}
          updateGrid={(letter) => updateGrid(letter)}
        />
      </div>
      <p className="name">Recreated by Steve Sam</p>
    </Div100vh>
  );
}

export default App;
