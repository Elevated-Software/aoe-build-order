import { FormControl, FormErrorMessage, FormLabel, Select } from '@chakra-ui/react';
import { Field, FieldHookConfig, FormikProps, useField } from 'formik';


interface Props {
  label: string;
  options: { value: string, text: string; }[],
}

export const FieldSelect = ({ label, options, ...rest }: Props & FieldHookConfig<string>) => {
  const [field, meta] = useField(rest);
  return (
    <FormControl isInvalid={!!(meta.error && meta.touched)}>
      <FormLabel>{label}</FormLabel>
      <Field as={Select} {...field} {...rest}>
        {
          options.map(option => (
            <option key={option.value} value={option.value}>{option.text}</option>
          ))
        }
      </Field>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};
