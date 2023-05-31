// This function is used to upload images to the ipfs network
// the function takes a File object as input

export const IpfsUpload = async (file: File) => {

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/media/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        console.error('Error uploading file:', response.statusText);
        return null;
    }

    const data = await response.json();
    return `https://calabara.mypinata.cloud/ipfs/${data.IpfsHash}`;
};

const handleMediaUpload = async (
    event: any,
    acceptedFormats: string[],
    mimeTypeCallback: (mimeType: string) => void,
    readerCallback: (data: any) => void,
    ipfsCallback: (uri: string) => void
) => {
    const acceptedMimeTypes = acceptedFormats.reduce((acc: string[], format: string) => {
        if (format === 'image') {
            return [...acc, 'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        }
        if (format === 'video') {
            return [...acc, 'video/mp4'];
        }
        return acc;
    }, []);

    const file = event.target.files[0];
    if (!file) {
        throw new Error('No file selected');
    }

    const mimeType = file.type;
    mimeTypeCallback(mimeType);

    if (!acceptedMimeTypes.includes(mimeType)) throw new Error('Invalid file type');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        readerCallback(reader.result);
    };
    reader.onerror = (error) => {
        throw new Error(`Error reading file: ${error}`);
    };

    const ipfsUri = await IpfsUpload(file);
    if (!ipfsUri) throw new Error('Error uploading file to ipfs');
    ipfsCallback(ipfsUri);
};

export default handleMediaUpload;
