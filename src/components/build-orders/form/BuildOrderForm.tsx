import { Box, Button, Heading, VStack } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from "yup";
import { Civilization, Patch, Tag } from '../../../lib/consts';
import { SelectTags } from '../tags/SelectTags';
import { FieldSelect } from './FieldSelect';
import { FieldText } from './FieldText';
import { FieldTextarea } from './FieldTextarea';

export const BuildOrderForm = (): JSX.Element => {
  const civilizationOptions = Object.values(Civilization).map(civ => ({ value: civ, text: civ }));
  const patchOptions = Patch.map(patch => ({ value: patch, text: patch }));

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  return (
    <Formik
      initialValues={{
        civilization: '',
        name: '',
        description: '',
        patch: '',
      }}
      validationSchema={Yup.object({
        civilization: Yup.string().required('Civilization is required'),
        name: Yup.string()
          .required('Name is required')
          .max(40, 'Name can only be 40 characters'),
        desription: Yup.string()
          .max(1000, 'Description can only be 1000 characters'),
      })}
      onSubmit={(values, actions) => {
        alert(JSON.stringify(values, null, 2));
        actions.resetForm();
      }}
    >
      {formik => (
        <VStack
          as="form"
          onSubmit={e => formik.handleSubmit(e as any)}
          spacing={4}
          width={{ base: 'xs', md: 'container.md' }}
          alignItems="start"
        >
          <FieldSelect width={{ base: 'full', md: '50%' }} label="Civilization" options={civilizationOptions} name="civilization" placeholder="Choose A Civilization" isRequired />
          <FieldText label="Name" name="name" placeholder="Super Strong Build" isRequired />
          <FieldTextarea label="Description" name="description" placeholder="This build order will never fail!" maxLength={1000} />
          <Box pt={2} pb={6} w="75%">
            <Heading fontSize="md" py={4}>Tags</Heading>
            <SelectTags selectedTags={selectedTags} setTagsFilter={setSelectedTags} />
          </Box>
          <FieldSelect width={{ base: 'full', md: '50%' }} label="Patch" options={patchOptions} name="patch" placeholder="Patch Version" />
          <FieldText label="YouTube Link" name="youtube" placeholder="https://www.youtube.com/embed/jiQJU_vS_Cg" />
          <Button type="submit" colorScheme="green">Create Build Order</Button>
        </VStack>
      )}
    </Formik>
  );
};
