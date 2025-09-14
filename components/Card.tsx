
import React from 'react';
import { CardValue } from '../types';

interface CardProps {
  value: CardValue;
  onClick: (value: CardValue) => void;
  isSelected: boolean;
  isRevealed: boolean;
}

const Card: React.FC<CardProps> = ({ value, onClick, isSelected, isRevealed }) => {
  return (
    <button
      onClick={() => onClick(value)}
      disabled={isRevealed}
      className={`
        w-20 h-28 sm:w-24 sm:h-36 
        flex items-center justify-center 
        font-bold text-3xl
        rounded-xl border-2 
        cursor-pointer transition-all duration-300 
        transform hover:-translate-y-2
        ${isSelected 
          ? 'bg-brand-primary border-brand-primary text-white shadow-lg' 
          : 'bg-dark-surface border-dark-border text-dark-text-primary hover:border-brand-primary'
        }
        ${isRevealed ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {value}
    </button>
  );
};

export default Card;
