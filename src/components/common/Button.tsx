import { ReactNode } from 'react';
import { colors } from '../../styles/theme';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
    children, 
    onClick, 
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button'
}: ButtonProps) {
    const baseStyles = 'font-semibold transition-colors rounded-lg';
    
    const variantStyles = {
        primary: 'bg-black text-white hover:bg-[#1a1a1a]',
        secondary: 'bg-white text-black border border-black hover:bg-[#f5f5f5]'
    };

    const sizeStyles = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-[6px] text-[13px]',
        lg: 'px-4 py-2 text-sm'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {children}
        </button>
    );
} 