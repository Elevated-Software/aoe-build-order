import { Grid, GridItem, Heading, Text, useBreakpoint } from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { BuildOrderDetails } from '../../components/build-orders/BuildOrderDetails';
import { Container } from '../../components/Container';
import { dbConnect } from '../../lib/middlewares';
import { Bo } from '../../lib/models/api';
import { BuildOrder as BuildOrderModel } from '../../lib/models/database';

interface Props {
  buildOrder: Bo;
}

const BuildOrder = ({ buildOrder }: Props): JSX.Element => {
  const breakpoint = useBreakpoint();
  const smallScreen = breakpoint === 'base' || breakpoint === 'sm';

  return (
    <Container>
      <Grid w={{ base: '90%', md: '60%' }} templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={smallScreen ? undefined : 16}>
        {
          smallScreen &&
          <GridItem colSpan={1} mb={8}>
            <BuildOrderDetails buildOrder={buildOrder} />
          </GridItem>
        }
        <GridItem colSpan={2}>
          <Heading mb={4}>{buildOrder.name}</Heading>
          <Heading mb={2} fontSize="xl">Description</Heading>
          <Text>{buildOrder.description}</Text>
        </GridItem>
        {
          !smallScreen &&
          <GridItem colSpan={1}>
            <BuildOrderDetails buildOrder={buildOrder} />
          </GridItem>
        }
      </Grid>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await dbConnect();
  const buildOrder = await BuildOrderModel.findById(params?.boId).lean().exec();
  return {
    props: {
      buildOrder: JSON.parse(JSON.stringify(buildOrder)),
    },
    revalidate: 5,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  await dbConnect();
  const buildOrders = await BuildOrderModel.find().lean().exec();
  const paths = buildOrders.map(buildOrder => ({ params: { boId: buildOrder._id.toString() } }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export default BuildOrder;
