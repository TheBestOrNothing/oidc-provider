/* eslint-disable no-console */

import * as path from 'node:path';
import * as url from 'node:url';

import { dirname } from 'desm';
import express from 'express'; // eslint-disable-line import/no-unresolved
import helmet from 'helmet';

import Provider from '../lib/index.js'; // from 'oidc-provider';

import Account from './support/account.js';
import configuration from './support/configuration.js';
import routes from './routes/express.js';

const __dirname = dirname(import.meta.url);

//const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;
//const { PORT = 3000, ISSUER = `https://oidc.coinsgpt.io`, NODE_ENV = 'production'} = process.env;
const { PORT = 3000, ISSUER = `https://oidc.coinsgpt.io`} = process.env;
console.log('PORT:', PORT);
console.log('ISSUER:', ISSUER);
configuration.findAccount = Account.findAccount;
console.log('Account.id:', Account.accountId);

const app = express();

const defaultCspDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
defaultCspDirectives['script-src']  = ["'self'", 'https://metamask-sdk.api.cx.metamask.io', 'https://c0f4f41c-2f55-4863-921b-sdk-docs.github.io', 'https://cdn.jsdelivr.net'];
defaultCspDirectives['connect-src'] = ["'self'", 'https://metamask-sdk.api.cx.metamask.io', 'wss://metamask-sdk.api.cx.metamask.io', "data:"];
//defaultCspDirectives['default-src'] = ["'self'"];
//defaultCspDirectives['img-src'] = ["'self'", "data:"];
delete defaultCspDirectives['form-action'];
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: defaultCspDirectives,
  },
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let server;
try {
  let adapter;
  if (process.env.MONGODB_URI) {
    ({ default: adapter } = await import('./adapters/mongodb.js'));
    await adapter.connect();
  }

  //const prod = process.env.NODE_ENV === 'production';
  const prod = true;

  const provider = new Provider(ISSUER, { adapter, ...configuration });

  console.log('prod:', prod);
  //console.log('OIDC Configuration:', provider.configuration());

  if (prod) {
    app.enable('trust proxy');
    provider.proxy = true;

    app.use((req, res, next) => {
      if (req.secure) {
        next();
      } else if (req.method === 'GET' || req.method === 'HEAD') {
        res.redirect(url.format({
          protocol: 'https',
          host: req.get('host'),
          pathname: req.originalUrl,
        }));
      } else {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'do yourself a favor and only use https',
        });
      }
    });
  }

  routes(app, provider);
  app.use(provider.callback());
  server = app.listen(PORT, () => {
    console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
  });
} catch (err) {
  if (server?.listening) server.close();
  console.error(err);
  process.exitCode = 1;
}
