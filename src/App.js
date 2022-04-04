import "./App.css";
import Header from "./components/header/header";
import FinalWindow from "./components/finalWindow/finalwindow";
import keyboardKeys from "./data/keyboardKeys";
import allFiveLettersWords from "./data/fiveLetterEngWords";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

function App() {
  // Initalize states
  const [rows, setRows] = useState(initalize("rowsStorage", createNewRows()));
  const [keys, setKeys] = useState(initalize("keysStorage", createNewKeys()));
  const [current, setCurrent] = useState(initalize("currentStorage", 0));
  const [gameOver, setGameOver] = useState(initalize("gameOverStorage", null));
  const [popup, setPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [theWord, setTheWord] = useState("");

  console.log("rows", rows);

  // Initalize app set up and re-render the app after the game has been won or lost (when
  // theWord changes)
  useEffect(() => {
    // Initalize screen height
    function getScreenHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    // Initalize Localstorage with necessary states if not already exists
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
      } else {
        setTheWord(getTheWordStorage);
        console.log(getTheWordStorage);
      }
    }

    // Listen for any changes in screen height
    window.addEventListener("resize", getScreenHeight);
    getScreenHeight();
    return () => window.removeEventListener("resize", getScreenHeight);
  }, [theWord]);

  // Save any changes in states of "rows", "current", "gameOver", and "keys" in Localstorage
  useEffect(() => {
    window.localStorage.setItem("rowsStorage", JSON.stringify(rows));
    window.localStorage.setItem("currentStorage", JSON.stringify(current));
    window.localStorage.setItem("gameOverStorage", JSON.stringify(gameOver));
    window.localStorage.setItem("keysStorage", JSON.stringify(keys));
  }, [rows, current, gameOver, keys]);

  // Initalize state by checking if there is already storage in Localstorage
  // If not, set up the state storage and save it in Localstorage
  function initalize(storage, inital_value) {
    const getStorage = JSON.parse(window.localStorage.getItem(storage));

    if (!getStorage) {
      window.localStorage.setItem(storage, JSON.stringify(inital_value));
      return inital_value;
    }
    return getStorage;
  }

  // Set up the structure of the state "rows"
  function createNewRows() {
    const rowsArray = [];
    for (let i = 0; i <= 5; i++) {
      const rowArray = [];
      for (let j = 0; j <= 4; j++) {
        rowArray.push({
          letter: "",
          isInCorrectSpot: false,
          isInWord: false,
          notMatched: false,
        });
      }
      rowsArray.push(rowArray);
    }
    return rowsArray;
  }

  // Set up the structure of the state "keys"
  function createNewKeys() {
    const keysArray = [];
    keyboardKeys.forEach((keyRow) =>
      keyRow.forEach((key) => {
        if (
          (key !== "ENTER" && typeof key !== "object") ||
          (typeof key !== "object" && key !== "ENTER")
        ) {
          return keysArray.push({
            letter: key,
            isInCorrectSpot: false,
            isInWord: false,
            notMatched: false,
          });
        }
        return key;
      })
    );
    return keysArray;
  }

  // Reset the game after the game has been won or lost
  function resetGame() {
    window.localStorage.removeItem("rowsStorage");
    window.localStorage.removeItem("currentStorage");
    window.localStorage.removeItem("theWordStorage");
    window.localStorage.removeItem("gameOverStorage");
    window.localStorage.removeItem("keysStorage");
    setCurrent(initalize("currentStorage", 0));
    setGameOver(initalize("gameOverStorage", null));
    setMsg("");
    setPopup(false);
    setKeys(initalize("keysStorage", createNewKeys()));
    setRows(initalize("rowsStorage", createNewRows()));
    setTheWord("");
  }

  // Show popup (error) message on screen
  function showPopup(message) {
    setMsg(message);
    setPopup(true);
    setTimeout(() => {
      setPopup(false);
      setMsg("");
    }, 4000);
  }

  // Update the state "keys" to reflect any changes that are used
  // for updating the color of any keys in the keyboard after a
  // guess has been made
  function updateKey(letter, prop) {
    setKeys((prevKey) =>
      prevKey.map((key) => {
        if (key.letter === letter) {
          switch (prop) {
            case "isInCorrectSpot":
              return { ...key, isInCorrectSpot: true };
            case "isInWord":
              return { ...key, isInWord: true };
            default:
              return { ...key, notMatched: true };
          }
        }
        return key;
      })
    );
  }

  // Update the game grid to reflect latest progress
  function updateGrid(letter) {
    // Update the game grid when a key is pressed on the keyboard
    function addTile() {
      return setRows((prevRows) => {
        let updated = false;

        return prevRows.map((row, i) => {
          if (!updated && current === i) {
            return row.map((tile) => {
              if (tile.letter === "" && !updated) {
                updated = true;
                return { ...tile, letter };
              }
              return tile;
            });
          }
          return row;
        });
      });
    }

    // Remove the previous character from the game grid when "BACKSPACE" is pressed
    function removeTile() {
      setRows((prevRows) => {
        let updated = false;

        return prevRows
          .slice(0)
          .reverse()
          .map((row, i) => {
            if (!updated && current === row.length - i) {
              return row
                .slice(0)
                .reverse()
                .map((tile) => {
                  if (tile.letter !== "" && !updated) {
                    updated = true;
                    return { ...tile, letter: "" };
                  }
                  return tile;
                })
                .reverse();
            }
            return row;
          })
          .reverse();
      });
    }

    // Determine if a character is in the correct spot, is part of the hidden word
    // or is not part of the hidden word at all and update the color of the tile
    // accordingly
    function updateTile(commonChar) {
      setRows((prevRows) => {
        let updated = false;
        let total = 0;

        return prevRows.map((row, i) => {
          if (!updated && current === i) {
            return row.map((tile, j) => {
              updated = true; // Update "updated" if a match is found to prevent any further updates
              for (let k = 0; k < commonChar.length; k++) {
                let startPos = 0;
                // Check if character is in word
                if (commonChar[k].letter === tile.letter) {
                  //  Check if character is the correct spot
                  // (Tile will show up as green in the grid)
                  for (let l = startPos; l < commonChar[k].index.length; l++) {
                    if (commonChar[k].index[l] === j) {
                      startPos = startPos + 1;
                      total = total + 1;

                      if (total === 5) {
                        // If all five characters are in the correct spot, game won
                        setGameOver("won");
                      } else if (current === rows.length - 1 && total < 5) {
                        // If current row is the last row and not all five characters
                        // are in the correct spot, game lost
                        setGameOver("lost");
                      }

                      //  Update keys in the keyboard to reflect condition
                      updateKey(tile.letter, "isInCorrectSpot");

                      return {
                        ...tile,
                        isInCorrectSpot: !tile.isInCorrectSpot,
                      };
                    }
                  }

                  // Character is part of the hidden part, but not in the correct spot
                  // (Tile will show up as yellow in the grid)
                  updateKey(tile.letter, "isInWord");
                  if (j === row.length - 1 && current === rows.length - 1)
                    setGameOver("lost");
                  return {
                    ...tile,
                    isInWord: !tile.isInWord,
                  };
                }

                // Character is not part of the hidden part at all
                // (Tile will show up as gray in the grid)
              }
              updateKey(tile.letter, "notMatched");
              if (j === row.length - 1 && current === rows.length - 1)
                setGameOver("lost");
              return {
                ...tile,
                notMatched: !tile.notMatched,
              };
            });
          }
          return row;
        });
      });
    }

    // Get an array of indexes of where a character of the inputted guess
    // matches the hidden word
    function checkCharPosition(word, guessChar) {
      const indexArray = [];
      for (let i = 0; i < word.length; i++) {
        if (word[i] === guessChar.toLowerCase()) {
          indexArray.push(i);
        }
      }
      return indexArray;
    }

    // Check if there are enough (5) letters in a row
    // If not, return an error message
    function checkRow() {
      for (let i = 0; i < rows[current].length; i++) {
        if (rows[current][i].letter === "") {
          return showPopup("Not enough letters");
        }
      }

      // If there are enough letters in a row, run the following:
      const guess = [];
      const commonChar = [];
      // Iterate through each character of the inputted guess and store
      // each character into the array "guess"
      for (let i = 0; i < rows[current].length; i++) {
        guess.push(rows[current][i].letter);
      }

      // Check if guess is an English word
      if (allFiveLettersWords.includes(guess.join("").toLowerCase())) {
        for (let i = 0; i < rows[current].length; i++) {
          const matchedObj = {
            letter: guess[i],
            index: checkCharPosition(theWord, guess[i]),
          };

          // Check if the current character in "guess" exists in theWord
          if (theWord.indexOf(guess[i].toLowerCase()) !== -1) {
            if (commonChar.length === 0) {
              // Initalize commonChar if commonChar is empty
              commonChar.push(matchedObj);
            } else {
              for (let j = 0; j < commonChar.length; j++) {
                // Check if current "guess" char already exists in commonChar
                if (commonChar[j].letter !== guess[i]) {
                  if (j === commonChar.length - 1) {
                    // Push current "guess" char into commonChar if current "guess" char does not exist in commonChar to prevent duplicate of the same character being pushed into commonChar
                    commonChar.push(matchedObj);
                  }
                } else break; // Break out of the loop if current "guess" char already exists in commonChar
              }
            }
          }
        }

        // If at least one character of "guess" is part of the hidden part
        // or is in the correct spot, update the tile to reflect conditon
        updateTile(commonChar);

        // Move onto the next row and set the state "current" by adding 1 to it
        return gameOver === null
          ? setCurrent((prevCurrent) => prevCurrent + 1)
          : current;
      }
      // If "guess" is not an English word, return error message
      return showPopup("Not a Word! Try again with an English word.");
    }

    // Assign each key in keyboard with its corresponding function
    if (letter === "backspace") {
      removeTile();
    } else if (letter === "enter") {
      checkRow();
    } else addTile();
  }

  // Render the main game grid
  const game = rows.map((row, i) => (
    <div className="game-row" key={nanoid()}>
      {row.map((tile) => (
        <div
          className="game-tile"
          key={nanoid()}
          style={{
            backgroundColor: tile.isInCorrectSpot
              ? "#008000"
              : tile.isInWord
              ? "#ac953e"
              : tile.notMatched
              ? "#555555"
              : "#000000",
            border: `1px solid ${
              tile.isInCorrectSpot
                ? "#008000"
                : tile.isInWord
                ? "#ac953e"
                : tile.notMatched
                ? "#555555"
                : tile.letter !== ""
                ? "#646464"
                : i === current
                ? "#d3d3d3"
                : "#333334e6"
            }`,
          }}
        >
          {tile.letter}
        </div>
      ))}
    </div>
  ));

  // Render the on screen keyboard
  const keyboard = keyboardKeys.map((row, i) => (
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

        // Iterate through the state "keys" to find current key (letter)'s condition
        // and update the color of its tile accordingly
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
  ));

  return (
    <div className="App">
      {gameOver && (
        <FinalWindow result={gameOver} reset={resetGame} theWord={theWord} />
      )}
      {popup && <div className="popup-window">{msg}</div>}
      <Header />

      <div className="game">{game}</div>
      <div className="keyboard">{keyboard}</div>
      <p className="name">Recreated by Steve Sam</p>
    </div>
  );
}

export default App;
