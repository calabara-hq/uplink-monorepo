import gql from 'graphql-tag';



// create a space
export const UploadImageDocument = gql`
    mutation UploadImage($image: Upload!){
        uploadImage(image: $image){
            error
            ipfsHash
        }
    }
`;