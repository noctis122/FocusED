import React from 'react';
import { Features } from './sections/Features';
import { GamifiedPreview } from './sections/GamifiedPreview';
import { DualMode } from './sections/DualMode';
import { Closing } from './sections/Closing';
import { Hero } from './sections/Hero';

// Simplified Hero for sub-pages
const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="pt-32 pb-12 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">{title}</h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">{subtitle}</p>
    </div>
);

export const FeaturesPage: React.FC = () => (
  <div className="animate-in fade-in duration-500">
    <PageHeader title="System Core" subtitle="Advanced learning engines designed to adapt to your cognitive rhythm." />
    <Features />
    <Closing />
  </div>
);

export const StudentPage: React.FC = () => (
  <div className="animate-in fade-in duration-500">
    <PageHeader title="Student Mode" subtitle="Your personal AI companion for academic excellence." />
    <DualMode initialTab="student" hideSwitcher={true} />
    <GamifiedPreview />
    <Closing />
  </div>
);

export const InstitutionPage: React.FC = () => (
  <div className="animate-in fade-in duration-500">
     <PageHeader title="Institution Mode" subtitle="Orchestrate learning at scale with gamified curriculum tools." />
    <DualMode initialTab="uni" hideSwitcher={true} />
    <Closing />
  </div>
);

export const RewardsPage: React.FC = () => (
  <div className="animate-in fade-in duration-500">
    <PageHeader title="Rewards Ecosystem" subtitle="Turn consistency into currency. Unlock aesthetics, badges, and status." />
    <GamifiedPreview />
    <Closing />
  </div>
);