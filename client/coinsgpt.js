import { Issuer } from 'openid-client';

const coinsgptIssuer = await Issuer.discover(`https://oidc.coinsgpt.io/`);
console.log('Discovered issuer %s %O', coinsgptIssuer.issuer, coinsgptIssuer.metadata);

