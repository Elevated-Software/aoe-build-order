import { FormControl, FormControlProps, FormErrorMessage, FormLabel, Select, SelectProps } from '@chakra-ui/react';
import { Field, FieldHookConfig, FormikProps, useField } from 'formik';


interface Props extends SelectProps {
  label: string;
  options: { value: string, text: string; }[],
}

export const FieldSelect = ({ label, options, ...rest }: Props & FieldHookConfig<string> & SelectProps) => {
  const [field, meta] = useField(rest);
  return (
    <FormControl isInvalid={!!(meta.error && meta.touched)} isRequired={rest.isRequired}>
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
