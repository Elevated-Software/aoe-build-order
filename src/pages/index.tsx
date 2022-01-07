import { Text } from '@chakra-ui/layout';
import type { NextPage } from 'next';
import { Container } from '../components/Container';

const Home: NextPage = () => {
  return (
    <Container>
      <Text>Hello World</Text>
    </Container>
  );
};

export default Home;
