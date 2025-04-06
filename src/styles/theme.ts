export const colors = {
    primary: '#000000',
    primaryHover: '#1a1a1a',
    background: {
        main: '#F5F5F5',
        dark: '#1A1A1A',
        white: '#FFFFFF'
    },
    text: {
        primary: '#303030',
        secondary: '#616161',
        dark: '#272727',
        darker: '#121212'
    },
    border: '#E3E3E3',
    tooltip: {
        background: '#303030',
        text: '#FFFFFF'
    }
} as const;

export const spacing = {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px'
} as const;

export const borderRadius = {
    sm: '6.5px',
    md: '8px',
    lg: '12px'
} as const;

export const fontSize = {
    xs: '10px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px'
} as const;

export const layout = {
    maxContentWidth: '75vw',
    sidebarWidth: '240px',
    headerHeight: '64px'
} as const; 