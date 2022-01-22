import { Text } from '@chakra-ui/layout';
import { SimpleGrid } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { Container } from '../components/Container';
import { CallToAction } from '../components/home/CallToAction';

const Home: NextPage = () => {
  return (
    <Container>
      <SimpleGrid spacing={2} columns={[ 1, null, 2 ]}>
        <CallToAction />
        <Text>Right</Text>
      </SimpleGrid>
    </Container>
  );
};

export default Home;