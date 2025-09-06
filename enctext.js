import CryptoJS from "crypto-js";
const s = process.env.S_KEY;

export function enct(t) {
    return CryptoJS.AES.encrypt(t, s).toString();
}

export function dct(t) {
   // console.log("et",t)
    return CryptoJS.AES.decrypt(t, s).toString(CryptoJS.enc.Utf8);
}
