import { Box, Button, Center, Grid, GridItem, Heading, HStack, Spacer, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpoint } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import useSWR from 'swr';
import { BuildOrderDetails } from '../../../components/build-orders/BuildOrderDetails';
import { Tags } from '../../../components/build-orders/tags/Tags';
import { Container } from '../../../components/Container';
import { FlagImage } from '../../../components/FlagImage';
import { BoWithPopulatedSteps } from '../../../lib/models/api';
import { toaster } from '../../../lib/utils/toaster';

const BuildOrder = (): JSX.Element => {
  const router = useRouter();
  const { boId } = router.query;
  const breakpoint = useBreakpoint();
  const smallScreen = breakpoint === 'base' || breakpoint === 'sm';

  const swrKey = `/api/build-orders/${boId}`;
  const { data, error, mutate } = useSWR<{ success: boolean, buildOrder: BoWithPopulatedSteps; }>(boId ? swrKey : null, { dedupingInterval: 5000 });

  const react = useCallback(async (reaction: 'like' | 'dislike', direction: 1 | -1) => {
    if (!data) {
      return;
    }

    const reactServerCall = async (reaction: 'like' | 'dislike', direction: 1 | -1) => {
      const wordDirection = direction === 1 ? 'up' : 'down';
      const res = await fetch(`${swrKey}/${reaction}?direction=${wordDirection}`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message);
      }
      return json;
    };

    const updatedBuildOrder = { ...data.buildOrder };
    const shortReaction = reaction === 'like' ? 'l' : 'd';
    updatedBuildOrder.reactionCounts[shortReaction] = updatedBuildOrder.reactionCounts[shortReaction] + direction;
    mutate({ success: true, buildOrder: updatedBuildOrder }, false);
    try {
      await reactServerCall(reaction, direction);
    } catch (err: any) {
      toaster({ message: err.message, status: 'error' });
    }

    mutate();
  }, [data, mutate, swrKey]);

  if (!data && !error) {
    return (
      <Container>
        <Center><Spinner /></Center>
      </Container>
    );
  }

  if (data) {
    return (
      <Container>
        <Grid w={{ base: '90%', md: '70%' }} templateColumns={{ base: "repeat(1, 1fr)", '2xl': "repeat(3, 1fr)" }} gap={smallScreen ? 10 : 16}>
          <GridItem colSpan={2}>
            <HStack spacing={4} mb={4}>
              <FlagImage civilization={data.buildOrder.civilization} />
              <Heading>{data.buildOrder.name}</Heading>
              <Spacer />
              <Button colorScheme="yellow" mb={8} size="sm">Edit</Button>
            </HStack>
            <Heading mb={2} fontSize="xl">Description</Heading>
            <Tags mb={2} tags={data.buildOrder.tags} size="sm" justify="left" />
            <Text mb={4}>{data.buildOrder.description}</Text>
            <Box borderWidth="1px" borderRadius="md" p={2}>
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    {['food', 'gold', 'stone', 'wood'].map(resource => (
                      <Th key={`${resource}`}><Image src={`/images/resources/${resource}.png`} width={31.5} height={24} alt={`${resource} resource`} /></Th>
                    ))}
                    <Th><Image src={`/images/other/population.png`} width={24} height={24} alt="population" /></Th>
                    <Th><Image src={`/images/other/game_time.png`} width={16} height={16} alt="game time" /></Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.buildOrder.steps.map(step => (
                    <Tr key={step.stepNumber}>
                      <Td>{step.food}</Td>
                      <Td>{step.gold}</Td>
                      <Td>{step.stone}</Td>
                      <Td>{step.wood}</Td>
                      <Td>{step.population}</Td>
                      <Td>{step.gameTime}</Td>
                      <Td>{step.description}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </GridItem>
          <GridItem colSpan={1}>
            <BuildOrderDetails buildOrder={data.buildOrder} react={react} />
          </GridItem>
        </Grid>
      </Container >
    );
  }

  return (
    <Container>
      <Heading fontSize="xl">Something has gone wrong... try again later</Heading>
    </Container>
  );
};

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   await dbConnect();
//   const buildOrder = await BuildOrderModel.findById(params?.boId).lean().exec();
//   return {
//     props: {
//       buildOrder: JSON.parse(JSON.stringify(buildOrder)),
//     },
//     revalidate: 5,
//   };
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   await dbConnect();
//   const buildOrders = await BuildOrderModel.find().lean().exec();
//   const paths = buildOrders.map(buildOrder => ({ params: { boId: buildOrder._id.toString() } }));
//   return {
//     paths,
//     fallback: 'blocking',
//   };
// };

export default BuildOrder;
