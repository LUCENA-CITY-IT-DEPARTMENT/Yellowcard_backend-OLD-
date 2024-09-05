import CryptoJS = require("crypto-js");
require('dotenv').config();

export const CustomEncryptionTransformer = {
    to: (value: string) => {
        try {
            const encryptedValue = CryptoJS.AES.encrypt(
                value,
                process.env.ENCRYPTION_KEY,

            ).toString();
            return encryptedValue;
        } catch (e) {
            console.log(e.message);
            return value;
        }
    },
    from: (value: string) => {
        try {
            const decrypted_value = CryptoJS.AES.decrypt(
                value, process.env.ENCRYPTION_KEY)
                .toString(CryptoJS.enc.Utf8)
            return decrypted_value
        } catch (e) {
            console.log(e)
            return value
        }
    }
}