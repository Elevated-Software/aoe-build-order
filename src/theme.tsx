import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
})

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  colors: {
    light: {
      bg: 'gray.50',
      cardBg: '#CBD5E0',
      primary: 'gray.900'
    },
    dark: {
      bg: '#121212',
      cardBg: '#2E2E2E',
      primary: 'white'
    }
  },
  config,
  fonts,
  breakpoints,
})

export default theme