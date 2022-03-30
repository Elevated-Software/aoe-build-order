import { Box, Button, ButtonGroup, Flex, Grid, GridItem, Heading, Icon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Text, useColorModeValue } from '@chakra-ui/react';
import { ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/react/outline';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { BuildOrderFilter } from '../../components/build-orders/BuildOrderFilter';
import { BuildOrderList } from '../../components/build-orders/BuildOrderList';
import { Container } from '../../components/Container';
import { Tag } from '../../lib/consts';

const BuildOrders = (): JSX.Element => {
  const { data: session, status } = useSession();
  const activeButtonBg = useColorModeValue('gray.300', 'gray.700');

  const [pageIndex, setPageIndex] = useState(1);
  const [pagesCount, setPagesCount] = useState<number>(1);
  const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);
  const [civFilter, setCivFilter] = useState<string>('');

  return (
    <Container>
      <Grid w={{ base: '90%', md: '60%' }} templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={{ base: undefined, md: 16 }}>
        <Box display={{ base: 'flex', md: 'none' }}>
          <GridItem colSpan={1} mb={8}>
            <BuildOrderFilter selectedTags={tagsFilter} civ={civFilter} setTagsFilter={setTagsFilter} setCivFilter={setCivFilter} />
          </GridItem>
        </Box>
        <GridItem colSpan={2}>
          <Flex justifyContent="space-between" mb={4}>
            <Heading size="xl">Build Orders</Heading>
            {session ? (
              <Link href={`/build-orders/create`} passHref>
                <Button colorScheme="green" size="sm" >Create New Build Order</Button>
              </Link>)
              : (
                <Popover>
                  <PopoverTrigger>
                    <Button colorScheme="green" size="sm" >Create New Build Order</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight="bold">Sign In</PopoverHeader>
                    <PopoverBody>You must sign in to create a Build Order</PopoverBody>
                    <PopoverFooter border={0}>
                      <Button onClick={() => signIn()} colorScheme="blue" size="sm">Sign In</Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              )
            }

          </Flex>
          <BuildOrderList page={pageIndex} filters={{ tagsFilter, civFilter }} setPagesCount={setPagesCount} alignContent="start" width="100%" pb={4} />
          {/* Load the next page behind the scenes */}
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
        <Box display={{ base: 'none', md: 'flex' }}>
          <GridItem colSpan={1}>
            <BuildOrderFilter selectedTags={tagsFilter} civ={civFilter} setTagsFilter={setTagsFilter} setCivFilter={setCivFilter} />
          </GridItem>
        </Box>
      </Grid>
    </Container>
  );
};

export default BuildOrders;
