"use client"
import * as headbreaker from 'headbreaker';
import { ChangeEventHandler, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

function DemoJigsaw(props) {
  const puzzleRef = useRef(null)
  
  useEffect(() => {
    const validatedCanvasOverlay = document.getElementById('validated-canvas-overlay');
    if (validatedCanvasOverlay) {
      const puzzleImage = new Image();
      puzzleImage.onload = () => {
        validatedCanvasOverlay.style.display = 'none'; // 이미지 로드 후 오버레이 감추기

        const puzzle = document.getElementById('puzzle');
        if (puzzle) {
          // @ts-ignore
          const canvas = new headbreaker.Canvas(puzzle.id, {
            width: props.width,
            height: props.height,
            pieceSize: props.pieceSize,
            proximity: props.pieceSize / 5,
            borderFill: props.pieceSize / 10,
            strokeWidth: 2,
            lineSoftness: 0.18,
            outline: new headbreaker.outline.Rounded(),
            image: puzzleImage,
            painter: new headbreaker.painters.Konva(),
            fixed: true
          });

          canvas.autogenerate({
            horizontalPiecesCount: 4,
            verticalPiecesCount: 4,
            insertsGenerator: headbreaker.generators.flipflop,
          });

          // canvas.shuffle(0.7);
          canvas.puzzle.pieces[1].translate(50, -50);
          canvas.draw();
          canvas.attachSolvedValidator();
          canvas.onValid(() => {
            setTimeout(() => {
              validatedCanvasOverlay.setAttribute("class", "active");
            }, 1500);
          });
        }
      };
      puzzleImage.src = "https://health.chosun.com/site/data/img_dir/2024/03/12/2024031202120_0.jpg";
    }
  }, []);

  return <div ref={puzzleRef} id={props.id}></div>
}

export default function Puzzle() {
  const [pieceSize, setPieceSize] = useState(100);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(850);

  function handleClick(f) {
    return function(e) {
      return f(Number(e.target.value));
    };
  }

  return (
    <>
      <main className="">
        <DemoJigsaw id="puzzle" pieceSize={pieceSize} width={width} height={height} />
        <img id="validated-canvas-overlay" src="https://shop.peopet.co.kr/data/goods/388/2022/06/_temp_16557127733930view.jpg" />
      </main>
    </>
  )
}