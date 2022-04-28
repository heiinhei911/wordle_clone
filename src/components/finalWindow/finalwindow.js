import "./FinalWindow.css";

export default function FinalWindow(props) {
  return (
    <div className="final-window">
      <h1 className="result-title">
        {props.result === "won" ? "Nicely Done" : "Game Over"}
      </h1>
      <h2 className="result-msg">{`You ${props.result[0].toUpperCase()}${props.result.slice(
        1
      )}!`}</h2>
      <p className="theword-msg">
        The word was{" "}
        <span className="theword">{props.theWord.toUpperCase()}</span>
      </p>
      <button className="reset" onClick={props.reset}>
        {props.result === "won" ? "Play" : "Try"} Again
      </button>
    </div>
  );
}
