import { Box, SimpleGrid } from '@chakra-ui/react';
import type { GetStaticProps } from 'next';
import { BuildOrderList } from '../components/build-orders/BuildOrderList';
import { Container } from '../components/Container';
import { CallToAction } from '../components/home/CallToAction';
import { dbConnect } from '../lib/middlewares';
import { Bo } from '../lib/models/api';
import { BuildOrder as BuildOrderModel, IBoStepDoc } from '../lib/models/database';

interface Props {
  buildOrders: Bo[];
}

const Home = ({ buildOrders }: Props): JSX.Element => {
  return (
    <Container>
      <SimpleGrid spacing={2} columns={[1, null, 2]} >
        <CallToAction />
        <Box my="auto">
          <BuildOrderList title="" size="lg" buildOrders={buildOrders} />
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  await dbConnect();
  const buildOrders = await BuildOrderModel.find().lean().limit(3).exec();
  return {
    props: {
      buildOrders: JSON.parse(JSON.stringify(buildOrders)),
    },
    revalidate: 60 * 60 * 24,
  };
};

export default Home;
