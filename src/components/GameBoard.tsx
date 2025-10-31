"use client";

import { Stage, Layer, Rect } from "react-konva";

export default function GameBoard() {
  const tileSize = 48;
  const rows = 8;
  const cols = 8;

  return (
    <Stage width={cols * tileSize} height={rows * tileSize}>
      <Layer>
        {[...Array(rows)].map((_, y) =>
          [...Array(cols)].map((_, x) => (
            <Rect
              key={`${x}-${y}`}
              x={x * tileSize}
              y={y * tileSize}
              width={tileSize}
              height={tileSize}
              fill={(x + y) % 2 === 0 ? "#444" : "#999"}
            />
          ))
        )}
      </Layer>
    </Stage>
  );
}

