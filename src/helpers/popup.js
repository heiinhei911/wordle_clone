export default function showPopup(setMsg, setPopup, message) {
  setMsg(message);
  setPopup(true);
  setTimeout(() => {
    setPopup(false);
    setMsg("");
  }, 4000);
}
