import GameBoard from "@/components/GameBoard";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-white text-3xl font-bold mb-4">
        ♟️ Chess Dungeon Crawler
      </h1>
      <GameBoard />
    </main>
  );
}

