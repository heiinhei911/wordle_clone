export default function updateKey(setKeys, letter, prop) {
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
