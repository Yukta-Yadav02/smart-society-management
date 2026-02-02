export const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const roleBgClass = (role) => {
    switch ((role || '').toUpperCase()) {
        case 'ADMIN':
            return 'bg-gradient-to-br from-purple-500 to-indigo-500';
        case 'SECURITY':
            return 'bg-gradient-to-br from-orange-400 to-red-400';
        case 'RESIDENT':
        default:
            return 'bg-gradient-to-br from-indigo-500 to-blue-600';
    }
};
