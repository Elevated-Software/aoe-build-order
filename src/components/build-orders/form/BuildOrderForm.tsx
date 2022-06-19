import { Box, Button, Center, Divider, Flex, Grid, GridItem, Heading, HStack, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spinner, StackDivider, Text, useDisclosure, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { FieldArray, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from "yup";
import { BO_DESCRIPTION_MAX_LENGTH, BO_NAME_MAX_LENGTH, Civilization, gameTimeRegex, Patch, STEP_DESCRIPTION_MAX_LENGTH, Tag, youtubeRegex } from '../../../lib/consts';
import { SelectTags } from '../tags/SelectTags';
import { FieldSelect } from './FieldSelect';
import { FieldText } from './FieldText';
import { FieldTextarea } from './FieldTextarea';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import CSVReader from 'react-csv-reader';
import { toaster } from '../../../lib/utils/toaster';

const steps = [
  { label: 'Details' },
  { label: 'Steps' }
];

const civilizationOptions = Object.values(Civilization).map(civ => ({ value: civ, text: civ }));
const patchOptions = Patch.map(patch => ({ value: patch, text: patch }));
const papaparseOptions = {
  header: true,
  skipEmptyLines: true,
  transformHeader: (header: string) => {
    header = header.toLowerCase();
    if (header === 'gametime') {
      return 'gameTime';
    }
    return header;
  }
};

const emptyStep: { [key: string]: any; } = {
  food: '',
  gold: '',
  stone: '',
  wood: '',
  population: '',
  gameTime: '',
  description: '',
};

// This will be used by the edit to populate the fields with the existing data
// So it will need to be moved inside the component
const initialValues = {
  civilization: '',
  name: '',
  description: '',
  tags: [],
  patch: '',
  youtube: '',
  steps: [emptyStep],
};

export const BuildOrderForm = (): JSX.Element => {
  const router = useRouter();

  const [importError, setImportError] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { nextStep, prevStep, reset, activeStep } = useSteps({ initialStep: 0 });

  const setObjValuesToTrue = useCallback((data) => Object.keys(data).reduce((obj, key) => ({ ...obj, [key]: true }), {}), []);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onFileLoaded = (data: any, fileInfo: any, values: any, handleSubmit: Function) => {
    if (!data.length) {
      setImportError(`There's no data here!`);
      return;
    }

    let missingHeaders = [];
    const importedHeaders = Object.keys(data[0]);
    for (const header of Object.keys(emptyStep)) {
      if (!importedHeaders.includes(header)) {
        missingHeaders.push(header);
      }
    }

    if (missingHeaders.length) {
      const errMsg = `${missingHeaders.join(', ')} ${missingHeaders.length > 1 ? 'are' : 'is'} required!`;
      setImportError(errMsg);
      return;
    }

    values.steps = data;
    onClose();

    handleSubmit();
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          civilization: Yup.string().required('Civilization is required'),
          name: Yup.string()
            .required('Name is required')
            .max(BO_NAME_MAX_LENGTH, `Name can only be ${BO_NAME_MAX_LENGTH} characters`),
          desription: Yup.string()
            .max(BO_DESCRIPTION_MAX_LENGTH, `Description can only be ${BO_DESCRIPTION_MAX_LENGTH} characters`),
          youtube: Yup.string().matches(youtubeRegex, { message: 'Must be a YouTube video', excludeEmptyString: true }),
          steps: Yup.array().of(
            Yup.object().shape({
              gameTime: Yup.string().matches(gameTimeRegex, { message: 'Must be in the format 0:00 or 00:00' }),
              description: Yup.string().required('Description required').max(STEP_DESCRIPTION_MAX_LENGTH, `Description can only be ${STEP_DESCRIPTION_MAX_LENGTH} characters`),
            }),
          ),
        })}
        onSubmit={async (values, actions) => {
          const buildOrderBody = {
            name: values.name,
            civilization: values.civilization,
            description: values.description,
            tags: selectedTags,
            patch: values.patch,
            youtube: values.youtube,
          };

          const buildOrderRes = await fetch(`/api/build-orders`, { method: 'POST', body: JSON.stringify(buildOrderBody) });
          const buildOrderJson = await buildOrderRes.json();

          if (!buildOrderJson.buildOrders) {
            toaster({ message: 'There was an error, try again later!', status: 'error' });
            return;
          }

          await fetch(`/api/build-orders/${buildOrderJson.buildOrders._id}/steps`, { method: 'POST', body: JSON.stringify(values.steps) });
          actions.resetForm();

          router.push(`/build-orders/${buildOrderJson.buildOrders._id}`);
        }}
      >
        {({ handleSubmit, values, validateForm, setTouched }) => (
          <VStack
            as="form"
            mb={4}
            spacing={4}
            width={{ base: 'xs', md: 'container.lg' }}
            alignItems="start"
          >
            <Steps activeStep={activeStep} mb={4} w="75%" mx="auto">
              {steps.map(({ label }, index) => (
                <Step key={label} label={label}>
                  {index === 0 && (
                    <>
                      <FieldSelect width={{ base: 'full', md: '50%' }} label="Civilization" options={civilizationOptions} name="civilization" placeholder="Choose A Civilization" isRequired />
                      <FieldText label="Name" name="name" placeholder="Super Strong Build" isRequired maxLength={BO_NAME_MAX_LENGTH} />
                      <FieldTextarea label="Description" name="description" placeholder="This build order will never fail!" maxLength={BO_DESCRIPTION_MAX_LENGTH} />
                      <Box pb={4} w="75%">
                        <Heading fontSize="md" py={4}>Tags</Heading>
                        <SelectTags selectedTags={selectedTags} setTagsFilter={setSelectedTags} />
                      </Box>
                      <FieldSelect width={{ base: 'full', md: '50%' }} label="Patch" options={patchOptions} name="patch" placeholder="Patch Version" />
                      <FieldText label="YouTube Link" name="youtube" placeholder="https://www.youtube.com/watch?v=jiQJU_vS_Cg" />
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <Button colorScheme="green" onClick={onOpen} ml="auto">Import CSV</Button>

                      <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>Build Order Steps</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <Text>It is better and faster to upload your Build Order steps through a CSV file!</Text>
                            <Divider mt={4} />
                            {/* <Text mt={2}>Download an example</Text>
                            <a href="/public/example.csv" download="build_orders_example.csv" target="_blank"> Download Here </a> */}
                            <Grid templateColumns='repeat(3, 1fr)' gap={6} mt={4}>
                              <GridItem>
                                <Text fontWeight="bold">Headers</Text>
                              </GridItem>
                              <GridItem colSpan={2}>
                                <Text fontWeight="bold">Description</Text>
                              </GridItem>
                              <GridItem>
                                <Text borderRight="1px" fontWeight="semibold">food</Text>
                              </GridItem>
                              <GridItem colSpan={2}>
                                <Text>Number of villagers on food</Text>
                              </GridItem>
                              <GridItem>
                                <Text borderRight="1px" fontWeight="semibold">gold</Text>
                              </GridItem>
                              <GridItem colSpan={2}>
                                <Text>Number of villagers on gold</Text>
                              </GridItem>
                              <GridItem>
                                <Text borderRight="1px" fontWeight="semibold">stone</Text>
                              </GridItem>
                              <GridItem colSpan={2}>
                                <Text>Number of villagers on stone</Text>
                              </GridItem>
                              <GridItem>
                                <Text borderRight="1px" fontWeight="semibold">wood</Text>
                              </GridItem>
                              <GridItem colSpan={2}>
                                <Text>Number of villagers on wood</Text>
                              </GridItem>
                              <GridItem>
                                <Text borderRight="1px" fontWeight="semibold">population</Text>
                              </GridItem>
                              <GridItem colSpan={2}>
                                <Text>Current population count</Text>
                              </GridItem>
                              <GridItem>
                                <Text borderRight="1px" fontWeight="semibold">gameTime</Text>
                              </GridItem>
                              <GridItem colSpan={2}>
                                <Text>Current game time (00:00)</Text>
                              </GridItem>
                              <GridItem>
                                <Text borderRight="1px" fontWeight="semibold">description<Box as="span" color="red">*</Box></Text>
                              </GridItem>
                              <GridItem colSpan={2}>
                                <Text>Step description</Text>
                              </GridItem>
                            </Grid>
                          </ModalBody>
                          <VStack padding={4}>
                            <Text mt={2} mb={4} fontWeight="semibold">Select a CSV file to import</Text>
                            <CSVReader parserOptions={papaparseOptions} onFileLoaded={(data, fileInfo) => onFileLoaded(data, fileInfo, values, handleSubmit)} />
                            <Text color="red">{importError}</Text>
                          </VStack>
                        </ModalContent>
                      </Modal>
                      <FieldArray name="steps" validateOnChange={false}>
                        {({ push, remove }) => (
                          <Box>
                            <Grid templateColumns='repeat(12, 1fr)' gap={6}>
                              {['food', 'gold', 'stone', 'wood'].map(resource => (
                                <GridItem key={`${resource}`}>
                                  <Image src={`/images/resources/${resource}.png`} width={31.5} height={24} alt={`${resource} resource`} />
                                </GridItem>
                              ))}
                              <GridItem>
                                <Image src={`/images/other/population.png`} width={24} height={24} alt="population" />
                              </GridItem>
                              <GridItem colSpan={2}>
                                <Image src={`/images/other/game_time.png`} width={16} height={16} alt="game time" />
                              </GridItem>
                              <GridItem colSpan={4} display="flex">
                                Description
                                <Text ml={1} color="red.400">*</Text>
                              </GridItem>
                            </Grid>
                            <Grid templateColumns='repeat(12, 1fr)' gap={6}>
                              {
                                values.steps.length > 0 &&
                                values.steps.map((step, stepIndex) => (
                                  <React.Fragment key={stepIndex}>
                                    <GridItem>
                                      <FieldText name={`steps.${stepIndex}.food`} type="number" placeholder='0' />
                                    </GridItem>
                                    <GridItem>
                                      <FieldText name={`steps.${stepIndex}.gold`} type="number" placeholder='0' />
                                    </GridItem>
                                    <GridItem>
                                      <FieldText name={`steps.${stepIndex}.stone`} type="number" placeholder='0' />
                                    </GridItem>
                                    <GridItem>
                                      <FieldText name={`steps.${stepIndex}.wood`} type="number" placeholder='0' />
                                    </GridItem>
                                    <GridItem>
                                      <FieldText name={`steps.${stepIndex}.population`} type="number" placeholder='0' />
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                      <FieldText name={`steps.${stepIndex}.gameTime`} placeholder='00:00' />
                                    </GridItem>
                                    <GridItem colSpan={4}>
                                      <FieldText name={`steps.${stepIndex}.description`} maxLength={STEP_DESCRIPTION_MAX_LENGTH} />
                                    </GridItem>
                                    <GridItem display="flex">
                                      {
                                        values.steps.length !== 1 && <IconButton size="sm" mr={2} colorScheme="red" aria-label="delete row" icon={<DeleteIcon />} onClick={() => remove(stepIndex)} />
                                      }
                                      {
                                        stepIndex === values.steps.length - 1 && <IconButton size="sm" colorScheme="green" aria-label="add row" icon={<AddIcon />} onClick={() => push(emptyStep)} />
                                      }
                                    </GridItem>
                                  </React.Fragment>
                                ))
                              }
                            </Grid>
                          </Box>
                        )}
                      </FieldArray>
                    </>
                  )}
                </Step>
              ))}
            </Steps>
            {activeStep === steps.length ? (
              <Flex px={4} py={4} width="100%" flexDirection="column">
                <Heading fontSize="xl" textAlign="center" mb={4}>
                  Creating your Build Order for all to see...
                </Heading>
                <Center>
                  <Spinner />
                </Center>
              </Flex>
            ) : (
              <Flex width="100%" justify="flex-end">
                <Button
                  isDisabled={activeStep === 0}
                  mr={4}
                  onClick={prevStep}
                  size="sm"
                  variant="ghost"
                >
                  Prev
                </Button>
                <Button size="sm" onClick={(e) => {
                  validateForm().then(data => {
                    if (activeStep === steps.length - 1) {
                      if (data.steps) {
                        setTouched({ steps: (data.steps as Array<any>).map(_ => ({ description: true })) });
                      } else {
                        nextStep();
                        handleSubmit(e as any);
                      }
                    } else {
                      if (Object.keys(data).length === 1 && data.steps) {
                        onOpen();
                        nextStep();
                      } else {
                        setTouched(setObjValuesToTrue(data));
                      }
                    }
                  });
                }}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Flex>
            )}
          </VStack>
        )}
      </Formik>
    </Box>
  );
};
