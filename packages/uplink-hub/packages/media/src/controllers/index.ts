import stream from 'stream';
import busboy from 'busboy';
import axios from 'axios';
import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';
dotenv.config();

const pinata = new pinataSDK({ pinataApiKey: process.env.PINATA_KEY, pinataSecretApiKey: process.env.PINATA_SECRET });


export const upload = async (req, res) => {
    const bb = busboy({ headers: req.headers });
    const fileBuffer = new stream.PassThrough();

    bb.on('file', (name, file, info) => {
        const { filename, encoding, mimeType } = info;
        console.log(
            `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
            filename,
            encoding,
            mimeType
        );
        file.on('data', (data) => {
            console.log(`File [${name}] got ${data.length} bytes`);
            fileBuffer.write(data);
        }).on('end', () => {
            console.log(`File [${name}] done`);
            fileBuffer.end();
        });
    });

    bb.on('finish', async () => {
        try {

            const options = {
                pinataMetadata: {
                    name: 'upload',
                },
                pinataOptions: {
                    // Set your desired pinning options here
                },
            };

            const response = await pinata.pinFileToIPFS(fileBuffer, options);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
    req.pipe(bb);
}