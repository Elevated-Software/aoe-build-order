import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
});

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  components: {
    Steps,
  },
  colors: {
    light: {
      bg: '#F7FAFC',
      cardBg: '#CBD5E0',
      primary: '#171923'
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
});

export default theme;
