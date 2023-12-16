- htmlFor points to input id
- can use htmlFor on button using `as="label"`
- mutation = changes in data
- working with multer
- when you upload an image to an S3 bucket you can view that image by just clicking on it and then clicking open here and
  you can see here that there's this URL here and this is an AWS signed URL so it
  has a bunch of query parameters like the Amazon signature and the ID and a couple
  other things so you can take this URL and you can view it but this assigned
  URL expires and the default is 15 minutes if you remember this bucket we
  turned off the public access to it so if you come here block Public Access is on
  but here we are viewing the image publicly and that's because of this pre-signed URL so pre-signed URLs allow
  a user or a client to temporarily have access to an object in a bucket and one
  that they normally would not have access to and it's only for a short amount of time and so what we need to do is create
  pre-signed URLs for all of the images in this bucket and then return those URLs to the front end and that front end will
  then create images with the sources being those pre-signed URLs
