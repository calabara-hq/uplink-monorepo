import busboy from 'busboy';
import dotenv from 'dotenv';
import FormData from 'form-data';
import axios from 'axios';
import { validationResult } from 'express-validator';
const logger = console
dotenv.config();

export const upload = async (req, res) => {
  const bb = busboy({ headers: req.headers });

  // validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  bb.on('file', async (name, file, info) => {
    try {
      const { filename, encoding, mimeType } = info;
      logger.info(`File [${name}]: filename: %j, encoding: %j, mimeType: %j`, filename, encoding, mimeType);

      const formData = new FormData();
      formData.append('file', file, {
        filepath: 'submissionAsset',
      });

      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          'Authorization': `Bearer ${process.env.PINATA_JWT}`,
          ...formData.getHeaders()
        },
      });

      logger.info(`File [${filename}] done`);
      res.status(200).json(response.data);

    } catch (error) {
      logger.error('Error uploading file:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  bb.on('finish', () => {
    logger.info('Finished uploading files');
  });

  bb.on('error', (error) => {
    logger.error('Error processing file upload:', error);
    res.status(500).json({ message: 'Internal server error' });
  });

  req.pipe(bb);
};
