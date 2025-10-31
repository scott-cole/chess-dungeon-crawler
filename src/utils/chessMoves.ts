import { Tile } from "@/store/useGameStore";

export type PieceType = "pawn" | "rook" | "bishop" | "knight" | "queen" | "king";

/**
 * Returns all valid moves for a given piece on the board.
 */
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
    case "knight": {
      const offsets = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1],
      ];
      offsets.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (inBounds(nx, ny) && board[ny][nx].type !== "wall") {
          moves.push([nx, ny]);
        }
      });
      break;
    }

    case "rook": {
      const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1]
      ];
      directions.forEach(([dx, dy]) => {
        let nx = x + dx;
        let ny = y + dy;
        while (inBounds(nx, ny)) {
          if (board[ny][nx].type === "wall") break;
          moves.push([nx, ny]);
          if (board[ny][nx].type === "enemy") break;
          nx += dx;
          ny += dy;
        }
      });
      break;
    }

    case "bishop": {
      const diagonals = [
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ];
      diagonals.forEach(([dx, dy]) => {
        let nx = x + dx;
        let ny = y + dy;
        while (inBounds(nx, ny)) {
          if (board[ny][nx].type === "wall") break;
          moves.push([nx, ny]);
          if (board[ny][nx].type === "enemy") break;
          nx += dx;
          ny += dy;
        }
      });
      break;
    }

    case "queen": {
      // combine rook + bishop moves
      const rookMoves = getValidMoves("rook", position, board);
      const bishopMoves = getValidMoves("bishop", position, board);
      moves.push(...rookMoves, ...bishopMoves);
      break;
    }

    case "king": {
      const offsets = [
        [1, 0], [1, 1], [0, 1], [-1, 1],
        [-1, 0], [-1, -1], [0, -1], [1, -1],
      ];
      offsets.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (inBounds(nx, ny) && board[ny][nx].type !== "wall") {
          moves.push([nx, ny]);
        }
      });
      break;
    }

    case "pawn": {
      const forward = y - 1;
      if (inBounds(x, forward) && board[forward][x].type === "floor") {
        moves.push([x, forward]);
      }
      if (inBounds(x - 1, forward) && board[forward][x - 1].type === "enemy") {
        moves.push([x - 1, forward]);
      }
      if (inBounds(x + 1, forward) && board[forward][x + 1].type === "enemy") {
        moves.push([x + 1, forward]);
      }
      break;
    }
  }

  const uniqueMoves = Array.from(new Set(moves.map(([nx, ny]) => `${nx},${ny}`)))
    .map((s) => s.split(",").map(Number) as [number, number]);

  return uniqueMoves;
}

