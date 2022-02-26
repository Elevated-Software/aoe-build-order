import { createStandaloneToast } from '@chakra-ui/react';
import theme from '../../theme';

interface ToasterOpts {
  title?: string;
  message: string;
  status: 'success' | 'error' | 'warning' | 'info';
}

export const toaster = ({ title, message, status }: ToasterOpts) => {
  const toast = createStandaloneToast({ theme });
  if (!toast.isActive(message)) {
    toast({
      id: message,
      position: 'top-right',
      title: title || status.charAt(0).toUpperCase() + status.slice(1),
      description: message,
      status,
      duration: 4000,
      isClosable: true,
    });
  }
};
