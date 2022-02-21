import { Button, ButtonGroup, Grid, GridItem, Heading, Icon, Text, useBreakpoint, useColorModeValue } from '@chakra-ui/react';
import { ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/react/outline';
import { useCallback, useState } from 'react';
import { BuildOrderFilter } from '../../components/build-orders/BuildOrderFilter';
import { BuildOrderList } from '../../components/build-orders/BuildOrderList';
import { Container } from '../../components/Container';
import { codeToTag, Tag, tagToCode } from '../../lib/consts';


const BuildOrders = (): JSX.Element => {
  const breakpoint = useBreakpoint();
  const smallScreen = breakpoint === 'base' || breakpoint === 'sm';
  const activeButtonBg = useColorModeValue('gray.300', 'gray.700');

  const [pageIndex, setPageIndex] = useState(1);
  const [pagesCount, setPagesCount] = useState<number>(1);
  const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);
  const [civFilter, setCivFilter] = useState<string>();

  const setFilters = useCallback((tags: Tag[], civ?: string) => {
    setTagsFilter(tags);
    setCivFilter(civ);
  }, []);

  const updatePagesCount = useCallback(pagesCount => {
    setPagesCount(pagesCount);
  }, []);

  return (
    <Container>
      <Grid w={{ base: '90%', md: '60%' }} templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={20}>
        {
          smallScreen
            ? (
              <GridItem colSpan={1}>
                <BuildOrderFilter selectedTags={tagsFilter} civ={civFilter} setFilters={setFilters} />
              </GridItem>
            )
            : null
        }
        <GridItem colSpan={2}>
          <Heading pb={4} size="xl">Build Orders</Heading>
          <BuildOrderList page={pageIndex} filters={{ tagsFilter, civFilter }} setPagesCount={updatePagesCount} alignContent="start" width="100%" pb={4} />
          <BuildOrderList display={"none"} page={pageIndex + 1} filters={{ tagsFilter, civFilter }} setPagesCount={updatePagesCount} alignContent="start" width="100%" />
          <ButtonGroup variant="outline" spacing={2} pb={4}>
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
            <Button disabled={pageIndex === pagesCount} rightIcon={<Icon as={ArrowSmRightIcon} />} onClick={() => setPageIndex(pageIndex + 1)}>Next</Button>
          </ButtonGroup>
        </GridItem>
        {
          !smallScreen
            ? (
              <GridItem colSpan={1}>
                <BuildOrderFilter selectedTags={tagsFilter} civ={civFilter} setFilters={setFilters} />
              </GridItem>
            )
            : null
        }
      </Grid>
    </Container>
  );
};

export default BuildOrders;
