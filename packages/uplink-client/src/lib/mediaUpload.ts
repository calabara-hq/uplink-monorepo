
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



const handleMediaUpload = async (event: any, acceptedFormats: string[], readerCallback: (data: any) => void, ipfsCallback: (uri: string) => void) => {
    // accepted formats looks like this: ['image', 'video']
    // if image is passed in, then we want to accept image/* and svg formats
    // if video is passed in, then we want to accept video/* formats
    // if both are passed in, then we want to accept image/*, video/*, and svg formats
    const acceptedMimeTypes = acceptedFormats.reduce((acc: string[], format: string) => {
        if (format === 'image') {
            return [...acc, 'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        }
        if (format === 'video') {
            return [...acc, 'video/*'];
        }
        return acc;
    }, []);


    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const mimeType = file.type;
    if (!acceptedMimeTypes.includes(mimeType)) throw new Error('Invalid file type');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        readerCallback(reader.result)
    };
    const ipfsUri = await IpfsUpload(file);
    if (!ipfsUri) throw new Error('Error uploading file to ipfs');
    ipfsCallback(ipfsUri);
};

export default handleMediaUpload;