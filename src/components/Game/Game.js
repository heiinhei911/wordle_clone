import { nanoid } from "nanoid";
import "./Game.css";

export default function Game({ rows, current }) {
  return rows.map((row, i) => (
    <div className="game-row" key={nanoid()}>
      {row.map((tile) => {
        const styles = {
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
        };

        return (
          <div className="game-tile" key={nanoid()} style={styles}>
            {tile.letter}
          </div>
        );
      })}
    </div>
  ));
}
