import { useState } from 'react';
import axiosClient from '../config/axios';
import { useToast } from '@chakra-ui/react';

// abstraction layer
const useMutation = ({ url, method = 'POST' }) => {
  const [state, setState] = useState({
    isLoading: false,
    error: '',
  });
  const toast = useToast();

  const fn = async data => {
    setState(prev => ({
      ...prev,
      isLoading: true,
    }));
    axiosClient({ url, method, data })
      .then(() => {
        setState({ isLoading: false, error: '' });
        toast({
          title: 'Sucessfully Added Image',
          status: 'success',
          duration: 2000,
          position: 'top',
        });
      })
      .catch(error => {
        setState({ isLoading: false, error: error.message });
      });
  };

  return { mutate: fn, ...state };
};

export default useMutation;
