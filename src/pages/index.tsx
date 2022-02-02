import { SimpleGrid } from '@chakra-ui/react';
import type { GetStaticProps } from 'next';
import { BuildOrder } from '../components/build-orders/BuildOrder';
import { Container } from '../components/Container';
import { CallToAction } from '../components/home/CallToAction';
import { dbConnect } from '../lib/middlewares';
import { BoWithPopulatedSteps } from '../lib/models/api';
import { BuildOrder as BuildOrderModel, IBoStepDoc } from '../lib/models/database';

const Home = ({ buildOrder }: BoWithPopulatedSteps): JSX.Element => {
  return (
    <Container>
      <SimpleGrid spacing={2} columns={[1, null, 2]}>
        <CallToAction />
        <BuildOrder buildOrder={buildOrder} />
      </SimpleGrid>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  await dbConnect();
  const buildOrder = await BuildOrderModel.findById('61f2b57d6e523c4f1e498801').populate<{ steps: IBoStepDoc[]; }>('steps').lean().exec();
  return {
    props: {
      buildOrder: JSON.parse(JSON.stringify(buildOrder)),
    },
    revalidate: 60 * 60 * 24,
  };
};

export default Home;
