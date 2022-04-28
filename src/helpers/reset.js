import { initialize, createNewKeys, createNewRows } from "./initialization";

export default function resetGame(
  setCurrent,
  setGameOver,
  setMsg,
  setPopup,
  setKeys,
  setRows,
  setTheWord
) {
  window.localStorage.removeItem("rowsStorage");
  window.localStorage.removeItem("currentStorage");
  window.localStorage.removeItem("theWordStorage");
  window.localStorage.removeItem("gameOverStorage");
  window.localStorage.removeItem("keysStorage");
  setCurrent(initialize("currentStorage", 0));
  setGameOver(initialize("gameOverStorage", null));
  setMsg("");
  setPopup(false);
  setKeys(initialize("keysStorage", createNewKeys()));
  setRows(initialize("rowsStorage", createNewRows()));
  setTheWord("");
}
