import GameBoard from "@/components/GameBoard";
import GameHUD from "@/components/GameHUD";
import GameShop from '@/components/GameShop';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-white text-3xl font-bold mb-4">
        ♟️ Chess DungeonCrawler Game
      </h1>
      <GameHUD />
      <GameShop />
      <GameBoard />
    </main>
  );
}

