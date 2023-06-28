import crypto from 'crypto';

export class CipherController {
    private secret: string;
    constructor(secret: string) {
        this.secret = secret;
    }

    public encrypt(data: string) {
        if (data.includes(':')) throw new Error('Invalid data format. : not allowed\'');
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.secret, 'hex'), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    public decrypt(data: string) {

        let dataParts = data.split(':');
        if (dataParts.length < 2) {
            throw new Error("The input must be in the format 'iv:ciphertext'");
        }
        let iv = dataParts.shift();
        if (iv === undefined) {
            throw new Error("Invalid data format. Expected 'iv:ciphertext'");
        }
        let ivBuffer = Buffer.from(iv, 'hex');
        let encryptedText = Buffer.from(dataParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.secret, 'hex'), ivBuffer);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();

    }
}