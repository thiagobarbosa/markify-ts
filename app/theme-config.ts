// Theme configuration
// Modify these values to change the color palette of the application

// Primary color (purple by default)
export const primaryColor = {
  light: '262.1 83.3% 57.8%', // HSL format for light mode
  dark: '263.4 70% 50.4%'     // HSL format for dark mode
};

// Secondary color
export const secondaryColor = {
  light: '220 14.3% 95.9%',
  dark: '215 27.9% 16.9%'
};

// Background color
export const backgroundColor = {
  light: '0 0% 100%',
  dark: '224 71.4% 4.1%'
};

// Foreground/text color
export const foregroundColor = {
  light: '224 71.4% 4.1%',
  dark: '210 20% 98%'
};

// To apply a different color palette:
// 1. Modify the HSL values above
// 2. Update the CSS variables in globals.css if you want to change more than just the primary color
// 3. Restart the development server to see changes