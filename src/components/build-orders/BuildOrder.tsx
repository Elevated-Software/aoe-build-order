import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { BoWithPopulatedSteps } from '../../lib/models/api';
import { BoStep } from './bo-steps/BoStep';

export const BuildOrder = ({ buildOrder }: BoWithPopulatedSteps): JSX.Element => {
  return (
    <Box maxW="56rem" px={8}>
      <VStack>
        <Box>
          <Heading>Description</Heading>
          <Text>{buildOrder.description}</Text>
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
