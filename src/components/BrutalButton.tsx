import { ReactNode } from 'react';
import { THEME } from '../theme';

interface BrutalButtonProps {
    children: ReactNode;
    onClick?: () => void | Promise<void>;
    color?: string;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const BrutalButton = ({
    children,
    onClick,
    color = 'bg-white',
    className = '',
    type = 'button',
    disabled = false
}: BrutalButtonProps) => (
    <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`
      ${THEME.border} ${THEME.shadow} ${THEME.shadowActive}
      ${color} font-black uppercase px-6 py-3 transition-all
      disabled:opacity-50 disabled:cursor-not-allowed
      flex items-center justify-center gap-2
      ${className}
    `}
    >
        {children}
    </button>
);

export default BrutalButton;
