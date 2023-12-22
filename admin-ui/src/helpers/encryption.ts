import CryptoJS from "crypto-js"

export const encrypt = (plainText: string, secret: string) => {
    const key = CryptoJS.enc.Utf8.parse(secret)
    const iv = CryptoJS.lib.WordArray.random(16)
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
    })
    return iv + encrypted.ciphertext.toString()
}

export const decrypt = (cipherText: string, secret: string) => {
    const key = CryptoJS.enc.Utf8.parse(secret)
    const iv = CryptoJS.enc.Hex.parse(cipherText.substring(0, 32))
    const encrypted = CryptoJS.enc.Hex.parse(cipherText.replace(iv, ""));
    
    const decrypted = CryptoJS.AES.decrypt({ciphertext: encrypted}, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    })
    return decrypted.toString(CryptoJS.enc.Utf8);
}