import { FormControl, FormControlProps, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { Field, FieldHookConfig, useField } from 'formik';

interface Props extends InputProps {
  label?: string;
}

export const FieldText = ({ label, ...rest }: Props & FieldHookConfig<string>): JSX.Element => {
  const [field, meta] = useField(rest);
  return (
    <FormControl isInvalid={!!meta.error && meta.touched} isRequired={rest.isRequired}>
      <FormLabel>{label}</FormLabel>
      <Field as={Input} {...field} {...rest} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};
