import showPopup from "./popup";
import updateKey from "./keyboard-functions";
import allFiveLettersWords from "../data/fiveLetterEngWords";

function addTile(setRows, current, letter) {
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

function removeTile(setRows, current) {
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

function updateTile(setRows, setGameOver, setKeys, current, rows, commonChar) {
  setRows((prevRows) => {
    let updated = false;
    let total = 0;

    return prevRows.map((row, i) => {
      if (!updated && current === i) {
        return row.map((tile, j) => {
          updated = true;
          for (let k = 0; k < commonChar.length; k++) {
            let startPos = 0;
            // Check if character is in word
            if (commonChar[k].letter === tile.letter) {
              //  Check if character is the correct spot
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
                  updateKey(setKeys, tile.letter, "isInCorrectSpot");

                  return {
                    ...tile,
                    isInCorrectSpot: !tile.isInCorrectSpot,
                  };
                }
              }

              // Character is part of the hidden part, but not in the correct spot
              updateKey(setKeys, tile.letter, "isInWord");
              if (j === row.length - 1 && current === rows.length - 1)
                setGameOver("lost");
              return {
                ...tile,
                isInWord: !tile.isInWord,
              };
            }

            // Character is not part of the hidden part at all
          }
          updateKey(setKeys, tile.letter, "notMatched");
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
function checkRow(
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
) {
  for (let i = 0; i < rows[current].length; i++) {
    if (rows[current][i].letter === "") {
      return showPopup(setMsg, setPopup, "Not enough letters");
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
          commonChar.push(matchedObj);
        } else {
          for (let j = 0; j < commonChar.length; j++) {
            // Check if current "guess" char already exists in commonChar
            if (commonChar[j].letter !== guess[i]) {
              if (j === commonChar.length - 1) {
                // Push current "guess" char into commonChar if current "guess" char does not exist in commonChar
                commonChar.push(matchedObj);
              }
            } else break;
          }
        }
      }
    }

    // If at least one character of "guess" is part of the hidden part
    // or is in the correct spot, update the tile to reflect conditon
    updateTile(setRows, setGameOver, setKeys, current, rows, commonChar);

    // Move onto the next row and set the state "current" by adding 1 to it
    return gameOver === null
      ? setCurrent((prevCurrent) => prevCurrent + 1)
      : current;
  }
  return showPopup(
    setMsg,
    setPopup,
    "Not a Word! Try again with an English word."
  );
}

export { addTile, removeTile, checkRow };
