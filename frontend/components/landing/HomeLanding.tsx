'use client';

import HeroSection from './HeroSection';
import ProjectThinking from './ProjectThinking';
import TechnologiesUsed from './TechnologiesUsed';
import Functionalities from './Functionalities';
import Contributors from './Contributors';
import Disclaimer from './Disclaimer';

type HomeLandingProps = {
  setActiveComponent: (component: string) => void;
};

export default function HomeLanding({ setActiveComponent }: HomeLandingProps) {
  return (
    <section className="relative mt-40 w-full mx-auto px-6 text-center"> {/* Removed max-w-4xl */}
      <HeroSection setActiveComponent={setActiveComponent} />
      <ProjectThinking />
      <TechnologiesUsed />
      <Functionalities />
      <Contributors />
      <Disclaimer />
    </section>
  );
}