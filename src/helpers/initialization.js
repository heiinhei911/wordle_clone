import keyboardKeys from "../data/keyboardKeys";

function initialize(storage, inital_value) {
  const getStorage = JSON.parse(window.localStorage.getItem(storage));

  if (!getStorage) {
    window.localStorage.setItem(storage, JSON.stringify(inital_value));
    return inital_value;
  }
  return getStorage;
}

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

export { createNewKeys, createNewRows, initialize };
