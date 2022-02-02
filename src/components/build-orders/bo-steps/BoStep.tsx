import { Box } from '@chakra-ui/react';
import { LeanDocument } from 'mongoose';
import { IBoStepDoc } from '../../../lib/models/database';

interface Props {
  step: LeanDocument<IBoStepDoc>;
}

export const BoStep = ({ step }: Props): JSX.Element => {
  return (
    <Box px={8} py={4} bgColor='red.300'>
      {step.description}
    </Box>
  );
};
