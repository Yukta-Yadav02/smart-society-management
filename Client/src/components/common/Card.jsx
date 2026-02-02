import React from 'react';

const Card = ({ children, className = '', onClick, hover = true }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 ${hover ? 'hover:shadow-xl hover:translate-y-[-4px]' : ''
                } ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
