import { useEffect, useState } from "react";

import blank from "./images/blank.png";
import blueCandy from "./images/blue-candy.png";
import greenCandy from "./images/green-candy.png";
import orangeCandy from "./images/orange-candy.png";
import purpleCandy from "./images/purple-candy.png";
import redCandy from "./images/red-candy.png";
import yellowCandy from "./images/yellow-candy.png";
const width = 8;
const candiColors = [
  yellowCandy,
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
];

// const candiColors = [];

const Board = () => {
  const [boardColorsArray, setBoardColorsArray] = useState([]);
  const [beforDrag, setBeforDrag] = useState(null);
  const [afterDrag, setafterDrag] = useState(null);
  const [score, setScore] = useState(0);

  const createBoard = () => {
    const tempColorsArray = [];
    for (let i = 0; i < width * width; i++) {
      const randomNum = Math.floor(Math.random() * candiColors.length);
      const randomColor = candiColors[randomNum];
      tempColorsArray.push(randomColor);
    }
    setBoardColorsArray(tempColorsArray);
  };

  const sameAtRow = () => {
    for (let i = 0; i < width * width; i++) {
      const bla = i % width;
      const blabla = parseInt(i / width);
      let firstElement = boardColorsArray[i];
      const validArr = [{ color: firstElement, index: i }];
      for (let j = bla + 1; j < width; j++) {
        const newJ = j + blabla * width;
        if (
          firstElement === boardColorsArray[newJ] &&
          firstElement != undefined &&
          firstElement != blank
        ) {
          validArr.push({ color: boardColorsArray[newJ], index: newJ });
          firstElement = boardColorsArray[newJ];
        } else break;
      }
      if (validArr.length >= 3) {
        setScore(score + validArr.length);
        validArr.forEach((color) => {
          boardColorsArray[color.index] = blank;
        });
        return true;
      }
    }
    return false;
  };

  const sameAtCol = () => {
    for (let i = 0; i < width * width; i++) {
      const bla = i % width;
      const blabla = parseInt(i / width);
      let firstElement = boardColorsArray[i];
      const validArr = [{ color: firstElement, index: i }];
      for (let j = blabla + 1; j < width; j++) {
        const newJ = j * width + bla;
        if (
          firstElement === boardColorsArray[newJ] &&
          firstElement !== undefined &&
          firstElement !== blank
        ) {
          validArr.push({ color: boardColorsArray[newJ], index: newJ });
          firstElement = boardColorsArray[newJ];
        } else break;
      }
      if (validArr.length >= 3) {
        setScore(score + validArr.length);
        validArr.forEach((color) => {
          boardColorsArray[color.index] = blank;
        });
        return true;
      }
    }
    return false;
  };

  const drobDown = () => {
    let c = 0;
    for (let i = 0; i < width * (width - 1); i++) {
      if (boardColorsArray[i] !== blank && boardColorsArray[i + 8] == blank) {
        boardColorsArray[i + 8] = boardColorsArray[i];
        boardColorsArray[i] = blank;
      }
    }
  };

  const createNewCandy = () => {
    for (let i = 0; i < 8; i++) {
      if (boardColorsArray[i] === blank) {
        const randomNum = Math.floor(Math.random() * candiColors.length);
        const randomColor = candiColors[randomNum];
        boardColorsArray[i] = randomColor;
      }
    }
  };

  useEffect(() => {
    createBoard();
  }, []);
  useEffect(() => {
    let handler = setInterval(() => {
      sameAtRow();
      sameAtCol();
      createNewCandy();
      drobDown();
      setBoardColorsArray([...boardColorsArray]);
    }, 200);
    return () => {
      clearInterval(handler);
    };
  }, [sameAtRow, sameAtCol, drobDown, createNewCandy]);

  const startDragging = (e) => {
    setBeforDrag(e.target);
    //
  };
  const dropping = (e) => {
    setafterDrag(e.target);
    //
  };
  const isValidMove = (before, after) => {
    const validMoves = [before + 1, before - 1, before + width, before - width];
    for (let i = 0; i < 4; i++) {
      if (after === validMoves[i]) {
        return true;
      }
    }
  };

  const endDragging = () => {
    const before = parseInt(beforDrag.getAttribute("data-id"));
    const after = parseInt(afterDrag.getAttribute("data-id"));
    const colorBefore = beforDrag.getAttribute("src");
    const colorAfter = afterDrag.getAttribute("src");

    if (isValidMove(before, after)) {
      boardColorsArray[before] = colorAfter;
      boardColorsArray[after] = colorBefore;

      if (sameAtCol() || sameAtRow()) {
        setBoardColorsArray([...boardColorsArray]);
      } else {
        boardColorsArray[before] = colorBefore;
        boardColorsArray[after] = colorAfter;
      }
    }
  };
  return (
    <section>
      <div className="game">
        <h1 className="score">Score: {score}</h1>
        <div className="board">
          {boardColorsArray.map((imgSrc, index) => (
            <img
              data-id={index}
              key={index}
              draggable={true}
              src={imgSrc}
              onDragStart={startDragging}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragEnter={(e) => {
                e.preventDefault();
              }}
              onDragLeave={(e) => {
                e.preventDefault();
              }}
              onDrop={dropping}
              onDragEnd={endDragging}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Board;
