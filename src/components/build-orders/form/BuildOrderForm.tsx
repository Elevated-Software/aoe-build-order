import { Box, Button, Flex, Grid, GridItem, Heading, IconButton, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { FieldArray, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from "yup";
import { Civilization, Patch, Tag } from '../../../lib/consts';
import { SelectTags } from '../tags/SelectTags';
import { FieldSelect } from './FieldSelect';
import { FieldText } from './FieldText';
import { FieldTextarea } from './FieldTextarea';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const steps = [
  { label: 'Details' },
  { label: 'Steps' }
];

const civilizationOptions = Object.values(Civilization).map(civ => ({ value: civ, text: civ }));
const patchOptions = Patch.map(patch => ({ value: patch, text: patch }));

const emptyStep = {
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
  steps: [emptyStep],
};

export const BuildOrderForm = (): JSX.Element => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { nextStep, prevStep, reset, activeStep } = useSteps({ initialStep: 0 });

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          civilization: Yup.string().required('Civilization is required'),
          name: Yup.string()
            .required('Name is required')
            .max(40, 'Name can only be 40 characters'),
          desription: Yup.string()
            .max(1000, 'Description can only be 1000 characters'),
          youtube: Yup.string().url('Must be a valid YouTube link (don\'t forget the https://)').matches(/(.*youtube.*)/, { message: 'Must be a valid YouTube link', excludeEmptyString: true }),
        })}
        onSubmit={(values, actions) => {
          alert(JSON.stringify(values, null, 2));
          actions.resetForm();
        }}
      >
        {({ handleSubmit, values }) => (
          <VStack
            as="form" onSubmit={e => handleSubmit(e as any)}
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
                      <FieldText label="Name" name="name" placeholder="Super Strong Build" isRequired />
                      <FieldTextarea label="Description" name="description" placeholder="This build order will never fail!" maxLength={1000} />
                      <Box pb={4} w="75%">
                        <Heading fontSize="md" py={4}>Tags</Heading>
                        <SelectTags selectedTags={selectedTags} setTagsFilter={setSelectedTags} />
                      </Box>
                      <FieldSelect width={{ base: 'full', md: '50%' }} label="Patch" options={patchOptions} name="patch" placeholder="Patch Version" />
                      <FieldText label="YouTube Link" name="youtube" placeholder="https://www.youtube.com/embed/jiQJU_vS_Cg" />
                    </>
                  )}
                  {index === 1 && (
                    <FieldArray name="steps">
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
                                <>
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
                                    <FieldText name={`steps.${stepIndex}.description`} />
                                  </GridItem>
                                  <GridItem display="flex">
                                    <IconButton size="sm" mr={2} colorScheme="red" aria-label="delete row" icon={<DeleteIcon />} onClick={() => remove(index)} />
                                    <IconButton size="sm" colorScheme="green" aria-label="add row" icon={<AddIcon />} onClick={() => push(emptyStep)} />
                                  </GridItem>
                                </>
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
          </VStack>
        )}
      </Formik>
      {activeStep === steps.length ? (
        <Flex px={4} py={4} width="100%" flexDirection="column">
          <Heading fontSize="xl" textAlign="center">
            Woohoo! All steps completed!
          </Heading>
          <Button mx="auto" mt={6} size="sm" onClick={reset}>
            Reset
          </Button>
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
          <Button size="sm" onClick={nextStep}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Flex>
      )}
    </Box>
  );
};
