"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [words, setWords] = useState([
    ["-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-"],
  ]);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLetterClick = (newLetter: string) => {
    if (currentIndex < 5) {
      setWords(
        words.map((word, rowIndex) =>
          word.map((letter, letterIndex) =>
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
    if (currentIndex !== 5) {
      return;
    }
    alert(words[currentRow]?.join(""));

    setCurrentIndex(0);
    setCurrentRow(currentRow + 1);
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

  const keyboardLayout = ["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row) =>
    row.toUpperCase().split(""),
  );

  const handleKeyPress = (event) => {
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

  const [wordOfTheDay, setWordOfTheDay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://https://katale-xi.vercel.app/api/today");
      return res;
    };

    fetchData()
      .then((data) => {
        console.log(data);
        setWordOfTheDay(data);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!wordOfTheDay) return <p>No word found</p>;

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyPress}
      className="flex h-full select-none flex-col items-center justify-center gap-4"
    >
      {words.map((word) => (
        <div key="word" className="flex gap-4 text-black">
          {word.map((letter) => (
            <div
              key="letter"
              className="flex h-14 w-12 items-center justify-center border"
            >
              {letter === "-" ? "" : letter}
            </div>
          ))}
        </div>
      ))}
      <div className="relative">
        <div className="flex flex-col items-center justify-center gap-2">
          {keyboardLayout.map((word) => (
            <div key="word" className="flex gap-3 text-black">
              {word.map((letter) => (
                <div
                  key="letter"
                  onClick={() => handleLetterClick(letter)}
                  className="flex h-14 w-12 items-center justify-center rounded-sm border"
                >
                  {letter === "-" ? "" : letter}
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
    </div>
  );
}
