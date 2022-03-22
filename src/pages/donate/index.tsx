/* eslint-disable react/no-children-prop */
import { Button, Heading, Input, InputGroup, InputLeftElement, Stack, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import { Container } from '../../components/Container';
import { AMOUNT_STEP, CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '../../lib/consts';
import getStripe from '../../lib/utils/getStripe';
import { formatAmountForDisplay } from '../../lib/utils/stripe';
import { toaster } from '../../lib/utils/toaster';

const DonatePage = (): JSX.Element => {
  const cardBg = useColorModeValue('light.cardBg', 'dark.cardBg');

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    customDonation: undefined,
  });

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create a Checkout Session.
    try {
      // Default options are marked with *
      const response = await fetch('/api/donate', {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({ amount: input.customDonation }),
      });

      const json = await response.json();
      if (!response.ok) {
        toaster({ message: json.message, status: 'error' });
        setLoading(false);
        return;
      }

      // Redirect to Checkout.
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: json.id,
      });

      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `error.message`.
      if (error?.message) {
        toaster({ message: error.message, status: 'error' });
      }

      setLoading(false);
    } catch (err) {
      toaster({ message: (err as Error).message, status: 'error' });
    }
  };

  return (
    <Container>
      <Stack
        spacing={4}
        w="full"
        maxW="3xl"
        bg={cardBg}
        rounded="xl"
        boxShadow="lg"
        p={6}
        my={12}>
        <Heading fontSize="lg" fontWeight="semibold">Your contribution to Elevated Software will help the creation of Build Orders!</Heading>
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" />
          <Input placeholder="Enter Amount" type="number" step={AMOUNT_STEP} min={MIN_AMOUNT} max={MAX_AMOUNT} value={input.customDonation} name="customDonation" onChange={handleInputChange} />
        </InputGroup>
        <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading} loadingText="Thank You!">Donate {input.customDonation ? formatAmountForDisplay(input.customDonation, CURRENCY) : '$0.00'}</Button>
      </Stack>
    </Container>
  );
};

export default DonatePage;
