import * as jose from 'jose';
import fs from 'fs';

// Load your PEM file (private key)
const pkcs8 = fs.readFileSync('./private_key.pem', 'utf8');
console.log(pkcs8);

// Convert PEM to JWK
const alg = 'RS256'
const privateKey = await jose.importPKCS8(pkcs8, alg)
const privateJwk = await jose.exportJWK(privateKey);
console.log(privateJwk);


const jwt = await new jose.SignJWT({ 'urn:example:claim': true })
  .setProtectedHeader({ alg })
  .setSubject('0x4477610799e7910f0e40f64da702aa9ffcf929ac')
  .setIssuedAt()
  .setIssuer('https://oidc.coinsgpt.io')
  //.setAudience('oidcCLIENT')
  .setExpirationTime('2h')
  .sign(privateKey)

console.log(jwt)

const jwt1 = await new jose.SignJWT()
  .setProtectedHeader({ alg, typ: 'JWT'})
  .setSubject('0x4477610799e7910f0e40f64da702aa9ffcf929ac')
  .sign(privateKey)

console.log("jwt1")
console.log(jwt1)
