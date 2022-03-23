import { Box, Button, Center, Flex, Grid, GridItem, Heading, IconButton, Spinner, Text, VStack } from '@chakra-ui/react';
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

const steps = [
  { label: 'Details' },
  { label: 'Steps' }
];

const civilizationOptions = Object.values(Civilization).map(civ => ({ value: civ, text: civ }));
const patchOptions = Patch.map(patch => ({ value: patch, text: patch }));

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

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { nextStep, prevStep, reset, activeStep } = useSteps({ initialStep: 0 });

  const setObjValuesToTrue = useCallback((data) => Object.keys(data).reduce((obj, key) => ({ ...obj, [key]: true }), {}), []);

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
            tags: values.tags,
            patch: values.patch,
            youtube: values.youtube,
          };

          const buildOrderRes = await fetch(`/api/build-orders`, { method: 'POST', body: JSON.stringify(buildOrderBody) });
          const buildOrderJson = await buildOrderRes.json();

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
                                      values.steps.length !== 1 && <IconButton size="sm" mr={2} colorScheme="red" aria-label="delete row" icon={<DeleteIcon />} onClick={() => remove(index)} />
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
