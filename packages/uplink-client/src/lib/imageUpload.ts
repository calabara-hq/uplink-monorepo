import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { uploadFile } from "./ipfs";
const storage = new ThirdwebStorage();
// This function is used to upload images to the ipfs network
// the function takes an input event, reader callback function, and ipfs callback function


const IpfsUpload = async (file: any) => {
    /*
    const ipfsUri = await storage.upload(file, {
        uploadWithoutDirectory: true,
    });
    return ipfsUri.replace("ipfs://", "");
    */
    /*
    const result = await uploadFile(file);
    console.log(result)
    */
    // await the ipfs create promise. when its ready, add the file to ipfs

    const formData = new FormData();
    formData.append('file', file);

    const ipfsHash = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/media/upload`, {
        method: 'POST',
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('File uploaded:', data);
        })
        .catch((error) => {
            console.error('Error uploading file:', error);
        });


    console.log(ipfsHash)



};



const handleImageUpload = async (event: any, readerCallback: (data: any) => void, ipfsCallback: (uri: string) => void) => {
    console.log('inside handleImageUpload')
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        console.log(reader.result)
        readerCallback(reader.result)
    };
    const ipfsUri = await IpfsUpload(file);
    console.log(ipfsUri)
};

export default handleImageUpload;