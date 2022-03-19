import { SimpleGrid } from '@chakra-ui/react';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { BuildOrderList } from '../components/build-orders/BuildOrderList';
import { Container } from '../components/Container';
import { CallToAction } from '../components/home/CallToAction';
import { dbConnect } from '../lib/middlewares';
import { BoListItem } from '../lib/models/api';
import { BuildOrder } from '../lib/models/database';
import { toaster } from '../lib/utils/toaster';

interface Props {
  buildOrders: BoListItem[];
}

const Home = ({ buildOrders }: Props): JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    if (router.query.session_id) {
      toaster({ title: 'Payment Success', message: '💖 Thank you!', status: 'success' });
    }
  }, [router.query.session_id]);

  return (
    <Container>
      <SimpleGrid spacing={{ base: 4, md: 0 }} columns={[1, null, 2]} width="100%" minChildWidth="32rem">
        <CallToAction width="100%" />
        <BuildOrderList buildOrders={buildOrders} maxW="56rem" px={{ base: 6, md: 12 }} pb={4} />
      </SimpleGrid>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  await dbConnect();
  const buildOrders = await BuildOrder.find().select('name description civilization tags reactionCounts updatedAt').lean().limit(5).sort({ wilsonScore: -1 }).exec();
  return {
    props: {
      buildOrders: JSON.parse(JSON.stringify(buildOrders)),
    },
    revalidate: 60 * 60 * 24,
  };
};

export default Home;
