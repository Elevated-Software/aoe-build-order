import { FormControl, FormErrorMessage, FormLabel, Input, Textarea, TextareaProps } from '@chakra-ui/react';
import { Field, FieldHookConfig, useField } from 'formik';

interface Props extends TextareaProps {
  label: string;
}

export const FieldTextarea = ({ label, ...rest }: Props & FieldHookConfig<string>): JSX.Element => {
  const [field, meta] = useField(rest);
  return (
    <FormControl isInvalid={!!meta.error && meta.touched} isRequired={rest.isRequired}>
      <FormLabel>{label}</FormLabel>
      <Field as={Textarea} {...field} {...rest} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};
