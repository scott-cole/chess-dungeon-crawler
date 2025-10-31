import { Tile } from "@/store/useGameStore";

export type PieceType = "pawn" | "rook" | "bishop" | "knight" | "queen" | "king";

export function getValidMoves(
  pieceType: PieceType,
  position: [number, number],
  board: Tile[][]
): [number, number][] {
  const [x, y] = position;
  const size = board.length;
  const moves: [number, number][] = [];

  const inBounds = (nx: number, ny: number) =>
    nx >= 0 && nx < size && ny >= 0 && ny < size;

  switch (pieceType) {
    case "knight":
      const knightOffsets = [
        [2, 1],
        [1, 2],
        [-1, 2],
        [-2, 1],
        [-2, -1],
        [-1, -2],
        [1, -2],
        [2, -1],
      ];
      knightOffsets.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (inBounds(nx, ny) && board[ny][nx].type !== "wall") {
          moves.push([nx, ny]);
        }
      });
      break;

    case "rook":
      // vertical/horizontal until wall
      const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      directions.forEach(([dx, dy]) => {
        let nx = x + dx;
        let ny = y + dy;
        while (inBounds(nx, ny)) {
          if (board[ny][nx].type === "wall") break;
          moves.push([nx, ny]);
          nx += dx;
          ny += dy;
        }
      });
      break;

    case "bishop":
      // diagonals until wall
      const diagonals = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
      diagonals.forEach(([dx, dy]) => {
        let nx = x + dx;
        let ny = y + dy;
        while (inBounds(nx, ny)) {
          if (board[ny][nx].type === "wall") break;
          moves.push([nx, ny]);
          nx += dx;
          ny += dy;
        }
      });
      break;

    case "queen":
      // rook + bishop
      moves.push(...getValidMoves("rook", position, board));
      moves.push(...getValidMoves("bishop", position, board));
      break;

    case "king":
      const kingOffsets = [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
      ];
      kingOffsets.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (inBounds(nx, ny) && board[ny][nx].type !== "wall") {
          moves.push([nx, ny]);
        }
      });
      break;

    case "pawn":
      // simple forward + diagonal attack
      if (inBounds(x, y - 1) && board[y - 1][x].type === "floor") moves.push([x, y - 1]);
      if (inBounds(x - 1, y - 1) && board[y - 1][x - 1].type === "enemy") moves.push([x - 1, y - 1]);
      if (inBounds(x + 1, y - 1) && board[y - 1][x + 1].type === "enemy") moves.push([x + 1, y - 1]);
      break;
  }

  return moves;
}

