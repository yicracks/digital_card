export enum ElementType {
  TEXT = 'TEXT',
  STICKER = 'STICKER'
}

export interface CardElement {
  id: string;
  type: ElementType;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  rotation: number;
  scale: number;
  zIndex: number;
}

export type CardLayout = 'portrait' | 'landscape' | 'folded-h' | 'folded-v';
export type BorderStyle = 'none' | 'simple-gold' | 'double-gold' | 'fancy-red' | 'modern-black';

export interface CardState {
  elements: CardElement[];
  backgroundColor: string;
  backgroundImage?: string;
}

export const STICKERS = [
  '⭐', '✨', '🌟', '💫',
  '💋', '💄', '👄', '💌',
  '🌹', '🌷', '🌸', '💐',
  '🎂', '🍰', '🧁', '🎁',
  '🎈', '🎉', '🕯️', '🧸',
  '❤️', '💖', '💍', '🕊️'
];

export const FONTS = [
  { name: 'Serif', value: 'font-serif' },
  { name: 'Sans', value: 'font-sans' },
  { name: 'Handwritten', value: 'font-hand' },
];

export const COLORS = [
  '#1f2937', // Gray 800
  '#dc2626', // Red 600
  '#d97706', // Amber 600
  '#059669', // Emerald 600
  '#2563eb', // Blue 600
  '#7c3aed', // Violet 600
  '#db2777', // Pink 600
  '#ffffff', // White
];

export const BACKGROUNDS = [
  '#ffffff',
  '#fdf2f8', // Pink 50
  '#fffbeb', // Amber 50
  '#f0fdf4', // Green 50
  '#eff6ff', // Blue 50
  '#fafafa', // Zinc 50
  'linear-gradient(to bottom right, #b91d1d, #7f1d1d)', // Red Envelope (Classic)
  'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
  'linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)',
  'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
];