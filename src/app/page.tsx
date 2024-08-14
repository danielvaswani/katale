"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [currentRow, setCurrentRow] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keyboardHidden, setKeyboardHidden] = useState(false);

  const checkRow = (checkWord: string[]) => {
    const wordOfTheDayArray = wordOfTheDay.toUpperCase().split("");
    console.log(wordOfTheDay);
    const letterAnalysis = checkWord
      .filter((value, index, array) => array.indexOf(value) === index)
      .map((letter) => ({
        letter: letter,
        // total greens - yellows
        // greens: checkWord.filter(
        //   (l, lIndex) =>
        //     checkWord[lIndex] === wordOfTheDayArray[lIndex] && l === letter,
        // ).length,
        // possibleYellows: checkWord
        //   .map((letter) =>
        //     wordOfTheDayArray.indexOf(letter) > -1 ? letter : "-",
        //   )
        //   .filter((item) => item === letter).length,
        // possibleGreens: wordOfTheDayArray.filter((item) => item == letter)
        //   .length,
        yellows:
          wordOfTheDayArray.filter((item) => item == letter).length -
          checkWord.filter(
            (l, lIndex) =>
              checkWord[lIndex] === wordOfTheDayArray[lIndex] && l === letter,
          ).length,
      }));
    console.log(letterAnalysis);
    // eslint-disable-next-line prefer-const
    let yellowsToAdd = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < letterAnalysis.length; i++) {
      for (let o = 0; o < letterAnalysis[i]!.yellows; o++) {
        console.log(letterAnalysis[i]!.letter);
        yellowsToAdd.push(letterAnalysis[i]!.letter);
      }
    }

    const colors = [];
    for (let i = 0; i < checkWord.length; i++) {
      if (checkWord[i] === wordOfTheDayArray[i]) colors.push("bg-green-300");
      else if (yellowsToAdd.indexOf(checkWord[i]!) > -1) {
        for (let o = 0; o < yellowsToAdd.length; o++) {
          if (checkWord[i] === yellowsToAdd[o]) {
            colors.push("bg-yellow-300");
            yellowsToAdd.splice(o, 1);
            break;
          }
        }
      } else colors.push("bg-gray-300");
    }
    return colors;
  };

  const handleLetterClick = (newLetter: string) => {
    if (currentIndex < wordOfTheDay.length) {
      setWords(
        words.map((wordRow, rowIndex) =>
          wordRow.map((letter, letterIndex) =>
            currentIndex === letterIndex && currentRow == rowIndex
              ? newLetter
              : letter,
          ),
        ),
      );
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleEnterClick = () => {
    if (currentIndex !== wordOfTheDay.length) {
      return;
    }
    const colorArray = checkRow(words[currentRow]!);
    setColors(
      colors.map((colorRow, rowIndex) =>
        currentRow === rowIndex ? colorArray : colorRow,
      ),
    );
    setCurrentIndex(0);
    setCurrentRow(currentRow + 1);
    // setYellowz([])
  };

  const handleBackspaceClick = () => {
    // alert(currentIndex + " " + currentRow)
    if (currentIndex === 0) {
      return;
    }
    setWords(
      words.map((word, rowIndex) =>
        word.map((oldLetter, letterIndex) =>
          currentIndex - 1 === letterIndex && currentRow === rowIndex
            ? "-"
            : oldLetter,
        ),
      ),
    );
    setCurrentIndex(currentIndex - 1);
  };

  const keyboardLayout = ["qwertyuiop", "asdfghjkl", "zxcvbnm"].map(
    (keyboardRow) => keyboardRow.toUpperCase().split(""),
  );

  const handleKeyPress = (event: { keyCode: number }) => {
    switch (event.keyCode) {
      case 13:
        // RETURN is 13
        handleEnterClick();
        break;
      case 8:
        // BACKSPACE IS 8
        handleBackspaceClick();
        break;
      default:
        // ALPHA is 65-90
        if (event.keyCode >= 65 && event.keyCode <= 90) {
          handleLetterClick(String.fromCharCode(event.keyCode));
        }
    }
  };

  const [wordOfTheDay, setWordOfTheDay] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://katale-xi.vercel.app/api/today");
      return res.text();
    };

    fetchData()
      .then((data: string) => {
        setWordOfTheDay(data);
        console.log(data);
        const wordOfTheDayArray = data.split("");
        const blankWord = wordOfTheDayArray.map((_item) => "-");
        const numberOfTries = [1, 2, 3, 4, 5, 6];
        const blankColors = wordOfTheDayArray.map((_item) => "bg-white");
        const emptyWords = numberOfTries.map((_item) => blankWord);
        const emptyColors = numberOfTries.map((_item) => blankColors);
        setWords(emptyWords);
        setColors(emptyColors);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, []);

  const [words, setWords] = useState<string[][]>([]);
  const [colors, setColors] = useState<string[][]>([]);

  if (isLoading) return <p>Loading...</p>;
  if (!wordOfTheDay) return <p>No word found</p>;

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyPress}
      className="flex h-full select-none flex-col items-center justify-center gap-4"
    >
      {words.map((currentWord, wordIndex) => (
        <div key={wordIndex} className="flex gap-4 text-black">
          {currentWord.map((letter, letterIndex) => (
            <div
              key={letterIndex}
              className={`flex h-14 w-12 items-center justify-center border ${colors[wordIndex]![letterIndex]}`}
            >
              {letter === "-" ? "" : letter}
            </div>
          ))}
        </div>
      ))}
      {!keyboardHidden ? (
        <>
          <div className="relative">
            <div className="flex flex-col items-center justify-center gap-2">
              {keyboardLayout.map((layoutRow, layoutRowIndex) => (
                <div key={layoutRowIndex} className="flex gap-3 text-black">
                  {layoutRow.map((keyboardKey, keyIndex) => (
                    <div
                      key={keyIndex}
                      onClick={() => handleLetterClick(keyboardKey)}
                      className="flex h-14 w-12 items-center justify-center rounded-sm border"
                    >
                      {keyboardKey === "-" ? "" : keyboardKey}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div
              onClick={handleEnterClick}
              className="absolute bottom-0 right-0 flex h-14 w-20 items-center justify-center rounded-sm border"
            >
              ENTER
            </div>
            <div
              onClick={handleBackspaceClick}
              className="absolute bottom-0 left-0 flex h-14 w-20 items-center justify-center rounded-sm border"
            >
              {"<-"}
            </div>
          </div>
          {/* <div
            onClick={() => setKeyboardHidden(!keyboardHidden)}
            className="border p-4"
          >
            HIDE
          </div> */}
        </>
      ) : (
        <>
          {/* <div
            onClick={() => setKeyboardHidden(!keyboardHidden)}
            className="border p-4"
          >
            UNHIDE
          </div> */}
        </>
      )}
    </div>
  );
}
