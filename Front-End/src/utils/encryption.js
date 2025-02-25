import CryptoJS from "crypto-js";

// Access the encryption key from environment variables
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

if (!SECRET_KEY) {
  throw new Error(
    "Encryption key is missing. Please set VITE_ENCRYPTION_KEY in your .env file."
  );
}

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      throw new Error("Decryption failed. Invalid ciphertext or key.");
    }

    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
