import { Box, HStack, StackDivider, Text, VStack } from '@chakra-ui/react';
import { LeanDocument } from 'mongoose';
import Image from 'next/image';
import { IBoStepDoc } from '../../../lib/models/database';

interface Props {
  step: LeanDocument<IBoStepDoc>;
}

export const BoStep = ({ step }: Props): JSX.Element => {
  return (
    <VStack px={8} py={4} divider={<StackDivider />}>
      <HStack divider={<StackDivider />}>
        <VStack>
          <Box>{step.gameTime}</Box>
          <Text>{step.population}</Text>
        </VStack>
        <VStack>
          <Image
            src="/images/resources/food.png"
            alt="Food"
            width={31}
            height={22}
          />
          <Text>{step.food}</Text>
        </VStack>
        <VStack>
          <Image
            src="/images/resources/wood.png"
            alt="Wood"
            width={31}
            height={22}
          />
          <Text>{step.wood}</Text>
        </VStack>
        <VStack>
          <Image
            src="/images/resources/gold.png"
            alt="Gold"
            width={31}
            height={22}
          />
          <Text>{step.gold}</Text>
        </VStack>
        <VStack>
          <Image
            src="/images/resources/stone.png"
            alt="Food Resource"
            width={31}
            height={22}
          />
          <Text>{step.stone}</Text>
        </VStack>
      </HStack>
      <Text>{step.description}</Text>
    </VStack>
  );
};
