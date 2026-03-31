import { useState, useCallback } from "react";
import CinematicIntro from "@/components/birthday/CinematicIntro";
import EntryScreen from "@/components/birthday/EntryScreen";
import HeroScene from "@/components/birthday/HeroScene";
import CinematicSlideshow from "@/components/birthday/CinematicSlideshow";
import MemoryTimeline from "@/components/birthday/MemoryTimeline";
import MessageReveal from "@/components/birthday/MessageReveal";
import MusicPlayer from "@/components/birthday/MusicPlayer";
import FinalScene from "@/components/birthday/FinalScene";
import EndingScene from "@/components/birthday/EndingScene";
import AmbientSparkles from "@/components/birthday/AmbientSparkles";

type Phase = "intro" | "entry" | "experience";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("intro");

  const handleIntroComplete = useCallback(() => setPhase("entry"), []);
  const handleEnter = useCallback(() => setPhase("experience"), []);
  const handleReplay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setPhase("intro");
  }, []);

  return (
    <div className="bg-deep">
      <AmbientSparkles />
      {phase === "intro" && <CinematicIntro onComplete={handleIntroComplete} />}
      {phase === "entry" && <EntryScreen onEnter={handleEnter} />}

      {phase === "experience" && (
        <>
          <MusicPlayer />
          <div className="snap-y snap-mandatory">
            <HeroScene />
            <CinematicSlideshow />
            <MemoryTimeline />
            <MessageReveal />
            <FinalScene />
            <EndingScene onReplay={handleReplay} />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
