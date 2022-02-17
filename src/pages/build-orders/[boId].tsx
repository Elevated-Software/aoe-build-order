import { Center, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Container } from '../../components/Container';
import { Bo } from '../../lib/models/api';


const BuildOrder = (): JSX.Element => {
  const router = useRouter();
  const { boId } = router.query;
  const { data, error } = useSWR<{ success: boolean, buildOrder: Bo; }>(`/api/build-orders/${boId}`);
  console.log(data);


  return (
    <Container>
      {
        data
          ? data.buildOrder.name
          : <Center><Spinner /></Center>
      }
    </Container>
  );
};

export default BuildOrder;
