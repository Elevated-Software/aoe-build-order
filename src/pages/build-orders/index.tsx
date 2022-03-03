import { Box, Button, ButtonGroup, Flex, Grid, GridItem, Heading, Icon, Text, useBreakpoint, useColorModeValue } from '@chakra-ui/react';
import { ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { BuildOrderFilter } from '../../components/build-orders/BuildOrderFilter';
import { BuildOrderList } from '../../components/build-orders/BuildOrderList';
import { Container } from '../../components/Container';
import { Tag } from '../../lib/consts';

const BuildOrders = (): JSX.Element => {
  const breakpoint = useBreakpoint();
  const smallScreen = breakpoint === 'base' || breakpoint === 'sm';
  const activeButtonBg = useColorModeValue('gray.300', 'gray.700');

  const [pageIndex, setPageIndex] = useState(1);
  const [pagesCount, setPagesCount] = useState<number>(1);
  const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);
  const [civFilter, setCivFilter] = useState<string>('');

  return (
    <Container>
      <Grid w={{ base: '90%', md: '60%' }} templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={smallScreen ? undefined : 16}>
        {
          smallScreen &&
          <GridItem colSpan={1} mb={8}>
            <BuildOrderFilter selectedTags={tagsFilter} civ={civFilter} setTagsFilter={setTagsFilter} setCivFilter={setCivFilter} />
          </GridItem>
        }
        <GridItem colSpan={2}>
          <Flex justifyContent="space-between" mb={4}>
            <Heading size="xl">Build Orders</Heading>
            <Button colorScheme="green" size="sm">Create New Build Order</Button>
          </Flex>
          <BuildOrderList page={pageIndex} filters={{ tagsFilter, civFilter }} setPagesCount={setPagesCount} alignContent="start" width="100%" pb={4} />
          <BuildOrderList display={"none"} page={pageIndex + 1} filters={{ tagsFilter, civFilter }} setPagesCount={setPagesCount} alignContent="start" width="100%" />
          <ButtonGroup variant="outline" spacing={2} mb={4}>
            <Button disabled={pageIndex === 1} leftIcon={<Icon as={ArrowSmLeftIcon} />} onClick={() => setPageIndex(pageIndex - 1)}>Prev</Button>
            {
              pageIndex >= 3
                ? <Button onClick={() => setPageIndex(1)}>1</Button>
                : null
            }
            {
              pageIndex >= 4
                ? <Text fontSize="2xl" alignSelf="flex-end">...</Text>
                : null
            }
            {
              pageIndex > 1
                ? <Button onClick={() => setPageIndex(pageIndex - 1)}>{pageIndex - 1}</Button>
                : null
            }
            <Button bgColor={activeButtonBg}>{pageIndex}</Button>
            {
              pagesCount && pageIndex < pagesCount
                ? <Button onClick={() => setPageIndex(pageIndex + 1)} >{pageIndex + 1}</Button>
                : null
            }
            {
              pagesCount && pageIndex < pagesCount - 2
                ? <Text fontSize="2xl" alignSelf="flex-end">...</Text>
                : null
            }
            {
              pagesCount && pageIndex < pagesCount - 1
                ? <Button onClick={() => setPageIndex(pagesCount)}>{pagesCount}</Button>
                : null
            }
            <Button disabled={pageIndex === pagesCount || pagesCount === 0} rightIcon={<Icon as={ArrowSmRightIcon} />} onClick={() => setPageIndex(pageIndex + 1)}>Next</Button>
          </ButtonGroup>
        </GridItem>
        {
          !smallScreen &&
          <GridItem colSpan={1}>
            <BuildOrderFilter selectedTags={tagsFilter} civ={civFilter} setTagsFilter={setTagsFilter} setCivFilter={setCivFilter} />
          </GridItem>
        }
      </Grid>
    </Container>
  );
};

export default BuildOrders;
