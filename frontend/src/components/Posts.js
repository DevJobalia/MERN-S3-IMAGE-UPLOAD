import {
  Box,
  Button,
  Text,
  Input,
  SimpleGrid,
  CircularProgress,
  Image,
} from '@chakra-ui/react';
import { useState } from 'react';
import useMutation from '../hooks/useMutation';
import useQuery from '../hooks/useQuery';

const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
const URL = '/image';

const ErrorText = ({ children, ...props }) => (
  <Text fontSize="lg" color="red.300" {...props}>
    {children}
  </Text>
);

const Posts = () => {
  const [refetch, setRefetch] = useState(0);
  const {
    mutate: uploadImage,
    isLoading: uploading,
    error: uploadError,
  } = useMutation({ url: URL });

  const {
    data: imageUrls,
    isLoading: imagesLoading,
    error: fetchError,
  } = useQuery(URL, refetch);

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
    // refetch after some time inorder to first upload on s3
    setTimeout(() => {
      setRefetch(val => val + 1);
    }, 1000);
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
      {error && <ErrorText>{error}</ErrorText>}
      {uploadError && <ErrorText>{uploadError}</ErrorText>}

      <Text textAlign="left" mb={4}>
        Posts
      </Text>
      {imagesLoading && (
        <CircularProgress
          color="gray.600"
          trackColor="blue.300"
          size={7}
          thickness={10}
          isIndeterminate
        />
      )}
      {fetchError && (
        <ErrorText textAlign="left">Failed to load images</ErrorText>
      )}
      {!fetchError && imageUrls?.length === 0 && (
        <Text textAlign="left" fontSize="lg" color="gray.500">
          No images found
        </Text>
      )}
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {imageUrls?.length > 0 &&
          imageUrls?.map(url => (
            <Image src={url} alt="Image" key={url}></Image>
          ))}
      </SimpleGrid>
    </Box>
  );
};
export default Posts;
