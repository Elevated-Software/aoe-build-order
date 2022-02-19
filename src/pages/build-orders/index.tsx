import { Box, Button, ButtonGroup, Center, Grid, GridItem, Heading, Icon, Spinner, Text, useBreakpoint, useColorModeValue } from '@chakra-ui/react';
import { ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import useSWR from 'swr';
import { BuildOrderFilter } from '../../components/build-orders/BuildOrderFilter';
import { BuildOrderList } from '../../components/build-orders/BuildOrderList';
import { Container } from '../../components/Container';
import { Bo } from '../../lib/models/api';


const BuildOrders = (): JSX.Element => {
  const breakpoint = useBreakpoint();
  const smallScreen = breakpoint === 'base' || breakpoint === 'sm';
  const activeButtonBg = useColorModeValue('gray.300', 'gray.700');

  const [pageIndex, setPageIndex] = useState(1);
  const [tagsFilter, setTagsFilter] = useState([]);
  const [civFilter, setCivFilter] = useState<string>();
  const { data, error } = useSWR<{ success: boolean, pagesCount: number, page: number, size: number, buildOrders: Bo[]; }>(`/api/build-orders?page=${pageIndex}&tags=${tagsFilter.join(',')}&civ=${civFilter}`);

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
          <ButtonGroup variant="outline" spacing={2}>
            <Button disabled={pageIndex === 1} leftIcon={<Icon as={ArrowSmLeftIcon} />} onClick={() => setPageIndex(pageIndex - 1)}>Prev</Button>
            {
              pageIndex >= 3
                ? (<Box display="inline-flex"><Button onClick={() => setPageIndex(1)} >1</Button><Text pl={2} fontSize="2xl" alignSelf="flex-end">...</Text></Box>)
                : null
            }
            {
              pageIndex > 1
                ? <Button onClick={() => setPageIndex(pageIndex - 1)}>{pageIndex - 1}</Button>
                : null
            }
            <Button bgColor={activeButtonBg}>{pageIndex}</Button>
            {
              data?.pagesCount && pageIndex < data?.pagesCount
                ? <Button onClick={() => setPageIndex(pageIndex + 1)} >{pageIndex + 1}</Button>
                : null
            }
            {
              data?.pagesCount && pageIndex < data?.pagesCount - 1
                ? (<Box display="inline-flex"><Text pr={2} fontSize="2xl" alignSelf="flex-end">...</Text><Button onClick={() => setPageIndex(data.pagesCount)}>{data.pagesCount}</Button></Box>)
                : null
            }

            <Button disabled={pageIndex === data?.pagesCount} rightIcon={<Icon as={ArrowSmRightIcon} />} onClick={() => setPageIndex(pageIndex + 1)}>Next</Button>

          </ButtonGroup>
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
