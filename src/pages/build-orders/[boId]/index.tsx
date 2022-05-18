import { Box, Button, ButtonGroup, Center, Grid, GridItem, Heading, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Spacer, Spinner, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';
import useSWR from 'swr';
import { BuildOrderDetails } from '../../../components/build-orders/BuildOrderDetails';
import { Tags } from '../../../components/build-orders/tags/Tags';
import { Container } from '../../../components/Container';
import { FlagImage } from '../../../components/FlagImage';
import { BoWithPopulatedSteps } from '../../../lib/models/api';
import { toaster } from '../../../lib/utils/toaster';

const BuildOrder = (): JSX.Element => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { boId } = router.query;

  const swrKey = `/api/build-orders/${boId}`;
  const { data, error, mutate } = useSWR<{ success: boolean, buildOrder: BoWithPopulatedSteps; }>(boId ? swrKey : null, { dedupingInterval: 5000 });
  const isOwnedByLoggedInUser = data?.buildOrder.user.toString() === session?.user.userId;

  const cancelDeleteRef = useRef();

  const deleteBuildOrder = async () => {
    const res = await fetch(`${swrKey}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) {
      toaster({ message: json.message, status: 'error' });
      return;
    }

    router.replace('/build-orders');
  };

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
        <Grid w={{ base: '90%', md: '70%' }} templateColumns={{ base: "repeat(1, 1fr)", '2xl': "repeat(3, 1fr)" }} gap={{ base: 10, md: 16 }}>
          <GridItem colSpan={2}>
            <HStack spacing={4} mb={4}>
              <FlagImage civilization={data.buildOrder.civilization} />
              <Heading>{data.buildOrder.name}</Heading>
              <Spacer />
              {session && isOwnedByLoggedInUser && (
                <ButtonGroup pb={8}>
                  <Tooltip hasArrow shouldWrapChildren label="Coming soon" placement="top">
                    <Button colorScheme="yellow" size="sm" disabled>Edit</Button>
                  </Tooltip>
                  <Popover initialFocusRef={cancelDeleteRef as any}>
                    {({ onClose }) => (
                      <>
                        <PopoverTrigger>
                          <Button colorScheme="red" size="sm">Delete</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader fontWeight="bold">Delete Build Order</PopoverHeader>
                          <PopoverBody>Are you sure you want to delete this Build Order?</PopoverBody>
                          <PopoverFooter border={0}>
                            <ButtonGroup>
                              <Button ref={cancelDeleteRef as any} onClick={onClose} size="sm">Cancel</Button>
                              <Button onClick={deleteBuildOrder} colorScheme="red" size="sm">Delete</Button>
                            </ButtonGroup>
                          </PopoverFooter>
                        </PopoverContent>

                      </>
                    )}
                  </Popover>
                </ButtonGroup>
              )
              }
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
                    <Tr key={step._id}>
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
