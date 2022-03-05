import { Button, VStack } from '@chakra-ui/react';
import { Formik } from 'formik';
import * as Yup from "yup";
import { Civilization } from '../../../lib/consts';
import { FieldSelect } from './FieldSelect';

export const BuildOrderForm = (): JSX.Element => {
  const selectOptions = Object.values(Civilization).map(civ => ({ value: civ, text: civ }));

  return (
    <Formik
      initialValues={{ civilization: '' }}
      validationSchema={Yup.object({
        civilization: Yup.string().required('Civilization is required')
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
        >
          <FieldSelect label="Civilization" options={selectOptions} name="civilization" placeholder="Choose A Civilization" />
          <Button type="submit" colorScheme="blue">Save Build Order</Button>
        </VStack>
      )}
    </Formik>
  );
};
