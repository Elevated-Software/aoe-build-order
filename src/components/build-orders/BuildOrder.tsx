import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { BoWithPopulatedSteps } from '../../lib/models/api';
import { BoStep } from './bo-steps/BoStep';

interface Props {
  buildOrder: BoWithPopulatedSteps;
}

export const BuildOrder = ({ buildOrder }: Props): JSX.Element => {
  return (
    // This maxW will change. Maybe we won't even use a maxW
    <Box maxW="42rem" px={8}>
      <VStack>
        <Box>
          <Heading>Description</Heading>
          <Text mt={4}>{buildOrder.description}</Text>
        </Box>
        {
          buildOrder.steps.map(step => (
            <BoStep key={step._id} step={step} />
          ))
        }
      </VStack>
    </Box>
  );
};
