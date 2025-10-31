export type PieceType = "pawn" | "rook" | "bishop" | "knight" | "queen" | "king";

export const PLAYER_PIECES: Record<PieceType, string> = {
  pawn: "♙",
  rook: "♖",
  knight: "♘",
  bishop: "♗",
  queen: "♕",
  king: "♔",
};

export const ENEMY_PIECES: Record<PieceType, string> = {
  pawn: "♟",
  rook: "♜",
  knight: "♞",
  bishop: "♝",
  queen: "♛",
  king: "♚",
};

export const LOOT_SYMBOL = "💰";

