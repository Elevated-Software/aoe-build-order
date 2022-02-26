import { Center, Grid, GridItem, Heading, HStack, Spinner, Text, useBreakpoint } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import useSWR from 'swr';
import { BuildOrderDetails } from '../../components/build-orders/BuildOrderDetails';
import { Container } from '../../components/Container';
import { FlagImage } from '../../components/FlagImage';
import { Bo } from '../../lib/models/api';
import { toaster } from '../../lib/utils/toaster';

const BuildOrder = (): JSX.Element => {
  const router = useRouter();
  const { boId } = router.query;
  const breakpoint = useBreakpoint();
  const smallScreen = breakpoint === 'base' || breakpoint === 'sm';

  const swrKey = `/api/build-orders/${boId}`;
  const { data, error, mutate } = useSWR<{ success: boolean, buildOrder: Bo; }>(boId ? swrKey : null, { dedupingInterval: 5000 });

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
        <Grid w={{ base: '90%', md: '60%' }} templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={smallScreen ? 10 : 16}>
          <GridItem colSpan={2}>
            <HStack spacing={4} mb={4}>
              <FlagImage civilization={data.buildOrder.civilization} />
              <Heading>{data.buildOrder.name}</Heading>
            </HStack>
            <Heading mb={2} fontSize="xl">Description</Heading>
            <Text>{data.buildOrder.description}</Text>
          </GridItem>
          <GridItem colSpan={1}>
            <BuildOrderDetails buildOrder={data.buildOrder} react={react} />
          </GridItem>
        </Grid>
      </Container>
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
