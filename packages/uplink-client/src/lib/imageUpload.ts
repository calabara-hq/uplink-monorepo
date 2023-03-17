
// This function is used to upload images to the ipfs network
// the function takes an input event, reader callback function, and ipfs callback function


const IpfsUpload = async (file: any) => {

    const formData = new FormData();
    formData.append('file', file);

    return await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/media/upload`, {
        method: 'POST',
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            return `https://calabara.mypinata.cloud/ipfs/${data.IpfsHash}`;
        })
        .catch((error) => {
            console.error('Error uploading file:', error);
            return null
        });
};



const handleImageUpload = async (event: any, readerCallback: (data: any) => void, ipfsCallback: (uri: string) => void) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        readerCallback(reader.result)
    };
    const ipfsUri = await IpfsUpload(file);
    ipfsCallback(ipfsUri);
};

export default handleImageUpload;