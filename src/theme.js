export const theme = {
    colors: {
        sidebarBg: '#2D333D',
        sidebarText: '#B1B5BA',
        sidebarActive: '#FFFFFF',
        sidebarHover: '#3D444F',
        
        headerBg: '#FFFFFF',
        headerText: '#333333',
        
        mainBg: '#F3F4F6',
        
        cardBg: '#FFFFFF',
        cardBorder: '#E5E7EB',
        cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        
        primary: '#3B82F6', // Blue
        primaryHover: '#2563EB',
        
        success: '#10B981', // Emerald
        warning: '#F59E0B', // Amber
        danger: '#EF4444',  // Rose
        
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF'
    },
    
    // Shared Tailwind class compositions
    classes: {
        card: 'bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden',
        btnPrimary: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all active:scale-95 text-sm font-semibold',
        btnGhost: 'px-3 py-1.5 hover:bg-gray-100 text-gray-600 rounded-md transition-all text-sm',
    }
};

export default theme;
