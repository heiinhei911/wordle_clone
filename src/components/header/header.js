import "./Header.css";

export default function Header() {
  return (
    <div className="header">
      <h1 className="header-title">Wordle Clone</h1>
      <p className="header-description">
        Inspired by{" "}
        <a
          href="https://www.nytimes.com/games/wordle/index.html"
          target="_blank"
          rel="noreferrer"
        >
          Wordle
        </a>{" "}
        from{" "}
        <a
          href="https://en.wikipedia.org/wiki/Josh_Wardle"
          target="_blank"
          rel="noreferrer"
        >
          Josh Wardle
        </a>{" "}
      </p>
    </div>
  );
}
