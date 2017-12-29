/* eslint-disable */
const window = window || {};

let _pidCryptUtil = typeof pidCryptUtil !== "undefined" ? pidCryptUtil : window.pidCryptUtil;
let _pidCrypt = typeof pidCrypt !== "undefined" ? pidCrypt : window.pidCrypt;
let _CryptoJS = typeof CryptoJS !== "undefined" ? CryptoJS : window.CryptoJS;
/**
 * Created by japesh on 20/7/17.
 */
function getRandomString(length) {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

function encryptUsingRSA(plainText) {
  var public_key =
    "-----BEGIN PUBLIC KEY-----\n" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDONZuwbitj2WVra1m+vCQ7PQfQ\n" +
    "jjhas+9jV8qADb1sjoV03moCitvWJICQkWUgdQYXdYAQHv4/qKAh0lSMZboaI47B\n" +
    "nmUkBpExf8YxpZTqJ8qsZCQWMaYqq4kF9Rvy9S+SmF/LD1P7kG7jZtspC/Iqs0GH\n" +
    "sZdLEtdujIFHB3m9nwIDAQAB\n" +
    "-----END PUBLIC KEY-----";

  function certParser(cert) {
    var lines = cert.split("\n");
    var read = false;
    var b64 = false;
    var flag = "";
    var retObj = {};
    retObj.info = "";
    retObj.salt = "";
    retObj.iv;
    retObj.b64 = "";
    retObj.aes = false;
    retObj.mode = "";
    retObj.bits = 0;
    for (var i = 0; i < lines.length; i++) {
      flag = lines[i].substr(0, 9);
      if (
        i === 1 &&
        flag !== "Proc-Type" &&
        flag.indexOf("M") === 0 //unencrypted cert?
      )
        b64 = true;
      switch (flag) {
        case "-----BEGI":
          read = true;
          break;
        case "Proc-Type":
          if (read) retObj.info = lines[i];
          break;
        case "DEK-Info:":
          if (read) {
            var tmp = lines[i].split(",");
            var dek = tmp[0].split(": ");
            var aes = dek[1].split("-");
            retObj.aes = aes[0] === "AES" ? true : false;
            retObj.mode = aes[2];
            retObj.bits = parseInt(aes[1]);
            retObj.salt = tmp[1].substr(0, 16);
            retObj.iv = tmp[1];
          }
          break;
        case "":
          if (read) b64 = true;
          break;
        case "-----END ":
          if (read) {
            b64 = false;
            read = false;
          }
          break;
        default:
          if (read && b64) retObj.b64 += _pidCryptUtil.stripLineFeeds(lines[i]);
      }
    }
    return retObj;
  }

  var params = certParser(public_key);
  var key = _pidCryptUtil.decodeBase64(params.b64);
  var rsa = new _pidCrypt.RSA();
  var asn = _pidCrypt.ASN1.decode(_pidCryptUtil.toByteArray(key));
  var tree = asn.toHexTree();
  rsa.setPublicKeyFromASN(tree);
  var crypted = rsa.encrypt(plainText);
  var fromHex = _pidCryptUtil.encodeBase64(_pidCryptUtil.convertFromHex(crypted));
  return _pidCryptUtil.fragment(fromHex, 64);
}

function encryptUsingAES(plainText, encDecKey) {
  return _CryptoJS.AES.encrypt(plainText, encDecKey).toString();
}

export default function getEncryptedParams(params) {
  var encryptionKey = "rq";
  var aesKey = getRandomString(10);
  var rsaEncryptedAesKey = encryptUsingRSA(aesKey);
  var encryptedBody = {};
  encryptedBody[encryptionKey] = encryptUsingAES(JSON.stringify(params), aesKey);
  encryptedBody[encryptionKey + "k"] = rsaEncryptedAesKey;
  return encryptedBody;
}
