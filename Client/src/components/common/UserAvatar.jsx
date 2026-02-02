import React from 'react';
import { getInitials, roleBgClass } from '../../utils/userHelpers';

const UserAvatar = ({ user, size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-[10px]",
        md: "w-10 h-10 text-xs",
        lg: "w-12 h-12 text-sm",
        xl: "w-16 h-16 text-lg",
        "2xl": "w-32 h-32 text-4xl"
    };

    const roundedClasses = {
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
        xl: "rounded-3xl",
        "2xl": "rounded-[2.5rem]"
    };

    if (!user) return null;

    return (
        <div className={`${sizeClasses[size] || sizeClasses.md} ${roundedClasses[size] || roundedClasses.md} flex items-center justify-center text-white font-black shadow-lg ${roleBgClass(user.role)} ${className}`}>
            {getInitials(user.name)}
        </div>
    );
};

export default UserAvatar;
