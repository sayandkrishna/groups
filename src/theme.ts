// Theme constants and utilities

// Neo-brutalist palette
export const THEME = {
  bg: 'bg-[#f0f0f0]',
  surface: 'bg-white',
  primary: 'bg-[#FF4D00]', // International Orange
  secondary: 'bg-[#00F0FF]', // Cyan
  accent: 'bg-[#CCFF00]', // Lime
  dark: 'bg-[#1a1a1a]',
  border: 'border-black border-2',
  shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
  shadowActive: 'active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px]',
};

// Utility functions
export const generateAvatar = (name: string): string => {
  const seeds = ['😺', '👽', '💀', '🤖', '👾', '🤡', '👹', '👺', '👻'];
  return seeds[name.length % seeds.length];
};

export const formatAura = (num: number): string => {
  return num > 0 ? `+${num}` : `${num}`;
};
