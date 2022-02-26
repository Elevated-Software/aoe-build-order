import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import { Civilization, civToCode, civToColor } from '../lib/consts';

interface Props {
  civilization: Civilization;
}

export const FlagImage = ({ civilization }: Props): JSX.Element => {
  return (
    <Box w="53px" h="29px" boxShadow={`0 0 0 0, 0 0 6px ${civToColor[civilization]}`}>
      <Image src={`/images/flags/${civToCode[civilization]}.png`} width={53} height={29} alt={`${civilization} flag`} />
    </Box>
  );
};
