import { Issuer } from 'openid-client';

const tenantId = 'd5e685a9-3e23-42d9-9efa-15cc5c1ce7db';  // Replace with your Azure tenant ID
const link = 'https://login.microsoftonline.com/d5e685a9-3e23-42d9-9efa-15cc5c1ce7db/v2.0';
const microsoftIssuer = await Issuer.discover(`https://login.microsoftonline.com/${tenantId}/v2.0`);
console.log('Discovered issuer %s %O', microsoftIssuer.issuer, microsoftIssuer.metadata);

