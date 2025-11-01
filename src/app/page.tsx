"use client";

import { useGameStore } from "@/store/useGameStore";
import GameBoard from "@/components/GameBoard";
import GameHUD from "@/components/GameHUD";
import ShopScreen from "@/components/ShopScreen";
import StartMenu from "@/components/StartMenu";
import GameOverScreen from "@/components/GameOverScreen";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function Home() {
  const { status } = useGameStore();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white overflow-hidden">
      <ScreenWrapper keyName={status} className="relative z-10">
        {status === "menu" && <StartMenu />}
        {status === "playing" && (
          <>
            <h1 className="text-gray-400 text-3xl md:text-5xl mb-6">
              CHESS DUNGEON
            </h1>
            <div className="flex justify-center items-start gap-4 p-4 relative z-20">
              <GameHUD />
              <GameBoard />
            </div>
          </>
        )}
        {status === "shop" && <ShopScreen />}
        {status === "lost" && <GameOverScreen />}
      </ScreenWrapper>
    </main>
  );
}



