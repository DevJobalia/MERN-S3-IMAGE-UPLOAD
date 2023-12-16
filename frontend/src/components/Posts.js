import { Box, Button, Text, Input } from '@chakra-ui/react';
import { useState } from 'react';
import useMutation from '../hooks/useMutation';

const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
const URL = '/image';

const ErrorText = ({ children, ...props }) => (
  <Text fontSize="lg" color="red.300">
    {children}
  </Text>
);

const Posts = () => {
  const {
    mutate: uploadImage,
    isLoading: uploading,
    error: uploadError,
  } = useMutation({ url: URL });
  const [error, setError] = useState('');
  const handleUpload = async e => {
    const file = e.target.files[0];

    console.log(file);
    if (!validFileTypes.find(type => type === file.type)) {
      setError('File msut be in JPG/PNG format');
      return;
    }
    // FORM DATA OBJECT, SIMILAR TO SENDING HTML FORM TO BACKEND API
    const form = new FormData();
    form.append('image', file);

    await uploadImage(form);
  };

  return (
    <Box mt={6}>
      <Input id="imageInput" type="file" hidden onChange={handleUpload} />
      <Button
        as="label"
        htmlFor="imageInput"
        colorScheme="blue"
        variant="outline"
        mb={4}
        cursor="pointer"
        isLoading={uploading}
      >
        Upload
      </Button>
      {error && (
        <ErrorText fontSize="lg" color="red.300">
          {error}
        </ErrorText>
      )}
      {uploadError && (
        <ErrorText fontSize="lg" color="red.300">
          {uploadError}
        </ErrorText>
      )}

      <Text textAlign="left" mb={4}>
        Posts
      </Text>
    </Box>
  );
};
export default Posts;
