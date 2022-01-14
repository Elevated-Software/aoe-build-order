import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode } from '@chakra-ui/react';

export const DarkModeSwitch = (): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      borderRadius={10}
      aria-label="theme-change"
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    />
  );
};
