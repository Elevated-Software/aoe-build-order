import { Center, Grid, GridItem, Heading, Spinner, Text, useBreakpoint } from '@chakra-ui/react';
import useSWR from 'swr';
import { BuildOrderFilter } from '../../components/build-orders/BuildOrderFilter';
import { BuildOrderList } from '../../components/build-orders/BuildOrderList';
import { Container } from '../../components/Container';
import { Bo } from '../../lib/models/api';


const BuildOrders = (): JSX.Element => {
  const { data, error } = useSWR<{ success: boolean, buildOrders: Bo[]; }>('/api/build-orders');
  const breakpoint = useBreakpoint();
  const smallScreen = breakpoint === 'base' || breakpoint === 'sm';
  console.log(breakpoint);

  return (
    <Container>
      <Grid w={{ base: '90%', md: '60%' }} templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={20}>
        {
          smallScreen
            ? (
              <GridItem colSpan={1}>
                <BuildOrderFilter />
              </GridItem>
            )
            : null
        }
        <GridItem colSpan={2}>
          <Heading pb={4} size="xl">Build Orders</Heading>
          {
            data
              ? <BuildOrderList buildOrders={data.buildOrders} alignContent="start" width="100%" pb={10} />
              : <Center><Spinner /></Center>
          }
        </GridItem>
        {
          !smallScreen
            ? (
              <GridItem colSpan={1}>
                <BuildOrderFilter />
              </GridItem>
            )
            : null
        }
      </Grid>
    </Container>
  );
};

export default BuildOrders;
