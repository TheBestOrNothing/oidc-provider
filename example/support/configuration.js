export default {
  clients: [
    {
      client_id: 'oidcCLIENT',
      client_secret: 'oidcSECRET',
      grant_types: ['refresh_token', 'authorization_code', 'client_credentials'],
      redirect_uris: ['https://synapse.coinsgpt.io/_synapse/client/oidc/callback', 
	              'https://chat.openai.com/aip/g-4b5fe9af2498079f780a998b4a7c2934c0a0b201/oauth/callback', 
	              'http://sso-client.dev/providers/8/open_id',
	              'https://chat.openai.com/aip/g-27f3c0df56f9ec320cd1dc49fbaa8b8729d0819e/oauth/callback',
	      	      'http://mail.coinsgpt.io/index.php/login/oauth',
	      	      'https://roundcube.gitcoins.io/index.php/login/oauth',
	      	      'http://roundcube.gitcoins.io/index.php/login/oauth',
	              'https://matrix.coinsgpt.io/_synapse/client/oidc/callback',
	      	      'http://gitcoins.io/index.php/login/oauth'],
      //userinfo_signed_response_alg: 'RS256',
    }
  ],
  formats: {
    //AccessToken: 'jwt',
    customizers: {
      async jwt(ctx, token, jwt) {
        jwt.header = { foo: 'bar' };
        jwt.payload.foo = 'bar';
        console.log(jwt);
        //delete jwt.payload.aud;
        //return jwt;
      }
    }
  },
  interactions: {
    url(ctx, interaction) { // eslint-disable-line no-unused-vars
      return `/interaction/${interaction.uid}`;
    },
  },
  cookies: {
    keys: ['some secret key', 'and also the old rotated away some time ago', 'and one more'],
  },
  claims: {
    address: ['address'],
    email: ['email', 'email_verified'],
    phone: ['phone_number', 'phone_number_verified'],
    profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name',
      'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo'],
  },
  pkce: {
    required: () => false,
  },
  features: {
    devInteractions: { enabled: false }, // defaults to true

    deviceFlow: { enabled: true }, // defaults to false
    revocation: { enabled: true }, // defaults to false
    clientCredentials: { enabled: true },
    jwtIntrospection: { enable: true },
    jwtResponseModes: { enable: true },
    userinfo: { enabled: true },
    jwtUserinfo: { enabled: true },
    introspection: { enabled: true },
    resourceIndicators: {
      enabled: true,
      getResourceServerInfo(ctx, resourceIndicator) {
        if (resourceIndicator === 'urn:api') {
          return {
            scope: 'read',
            audience: 'urn:api',
            accessTokenTTL: 1 * 60 * 60, // 1 hour
            accessTokenFormat: 'jwt'
          }
        }

        throw new errors.InvalidTarget();
      }
    },
  },
  enabledJWA: {
    //userinfoSigningAlgValues: ['RS256', 'HS256'], // Add your desired algorithms here
  },
  jwks: {
    keys: [
      {
        use: 'sig',
        alg: 'RS256',
        kty: 'RSA',
        n: 'yXSF5y1i44Ct3YPKEKBrKOk7tJ4xcBYjW8OSByeksJMCeEvvteQUdBMTSA5GsrbfQyFeFkTeNsrnuu5oedTM6y6Gwy5lcJ9pSD5X9WuD59pVy39m-pKsMjswHZkJDoimK-a0wiTKEQ2t2dWC7PTaQsLuzJmWGVL7oxuZm4okdLolxn3dBzo0P1pi5D7B7YBtfOdgArg0Sp48ZArd5hs-8HfANfQpsqSEeRt-EVUMGlB0b3uH4nq8czPMohc317rj_nYElydu-azkQWbU1haXZ77O3JIutvncG7WwVeC4gJxwYhkZNq4SIxdf6eDVx6PjEAtE48it_5SZAOjHF2gfBQ',
        e: 'AQAB',
        d: 'sG_DTsMrVsE-hUGFWaaF8-DBj-D0v4xED3xriqSn0pYOlbk8Cnvlhfum6XbHaIJNa4fv1WUfkbGH3uoqynkbt-aZ1Jvv8AFNvh4L_z_Y2NkaRw4f7NlEwwGflGyRyA7aKpz2Nwrthp4KYzxiXJHeDpaXes4Q7cEF7safc-A7KZbIRIHwpk1vOtShuijrjhrsKDxSQVL692CpcuPcFz8FG3-9U1J6mLYLEvZPUqFmgbzxS4drV3I_5vc3mOLMJQjG-q9q-RbrTXyoy8h4fsEv20CqqYCyKJY7WjxXIwaOBpC34G8wUGz6nSlYA3KFfeExwu9Ela9DWoDArvEs0lcCQQ',
        p: '8KsS1iIORLkqG7dcPD25b5aZ2TKTDLLp5wYJRUJfDt8iUCsHb58IE64-benPJNI8m1ac3G7qY9247W-OCq6BIbkJph2tbLfSlbmBkfk_HQVSFEbjzVgVj9XKywDvC5JHmyTqvZWqJe-osICy_FKSmLHUft1uRyTXveQAHrQpbKk',
        q: '1knx2-z3rKhKgDdfQRYAFrFJwpa2KOAhA123BzWHxXFNVaAUbAdaF-O3xogyV9cSAYDgNYOTz1m-2ZhXClrzkyzR2LABjtijtsv3-XZHbGncn7UcG-B25rcCRPxS0gZlCfhLdgsWloNbd0XO6GolbMgOXgd6TfolKcEoFMvzXP0',
        dp: 'MKZkaGT5_Wpw2Kl4O7U-hxAqiX1vvGFuZwURWq7QCHGSviH0ntvHBjNy60UYWpklJ0Ga8_R37Tgk6dpjHEWqVObSzIGzTQbbyuh1CM0ZtQQeU3sBEcF8mlbdZ6wIpo4ra3FLAof-nSyVLRjXFaqbd8J68ipQ4JDSC9DLNWm19gE',
        dq: 'a3xxxbfqT_-mRwP_Up1fdAJ_lgyU2JH73T1ftk0CimYXvXBrbfiOF1eQ8hOU9PybOofTbuRN-v7wPSMt3bLbZKJhrAg079r425MaElZi4x2CndVxgQYpffakO8g5HsI4YjTaXR6YuOywr3Yjn-7GUPdURZQIpB5qD7SkjzHyI10',
        qi: 'GqkNLKPeY4L5KyfDSgdaoz25T-Ql87qJE5wg1aPUv1IaXy0pElgPPMhIMKnCjHrhQSLqFwGMbOo2NVkR008wcQTwtv0NTKbWTJF0UmCHZr9LV7t60Ufrxkbz-KQQjKcO-tVPjdFaZoZPFaYQ-Cwwczki4vG3QTyS6bBxHtIs13A'
      },      
      {
        use: 'sig',
        alg: 'RS256',
        kty: 'RSA',
        d: 'TtVyQLEE8wNyljsKoYMmFMIOzbEJ1IX-Ogf9JJkNq0dGN79_MejYrRxSX8xGSVSMiu1mVzY1NxhZeQqnI6k7AvU1wG8gIHB4JYGfjkGik-E5Sbmcsryl6w7YwiUymQAclE3ckkiahkVu224Y0hBZ-hjQHsX0pOoiZ6rCkLLuz7_B1EqEqR5_w726jZnsl5G-2YLC6U1hFsGjiiBqtLqgZch_1iDBB6q7DtimfIgdB6cYwSEXOQ0mvMJ3TkBpWYy8UW7NosqoD0YVJ1zFgMUj1W9fNrZYjTek8HEqlg2tgVMdH8ggAMpRsFzo7W18OdhTRTzZEsLvP8gT28LoQh5fJQ',
        dp: 'uYzgL47vR7ZugfRF3zj2JT60jRQxTYB917w0YL1iQPie6rQMktbxUlSVmOjM3-xalMoDuBxPmiAJI5JxHfyu0EM1ZY3R13Aq2attVL2eat-Ibp8Ut7bvdRymbpV76dG9_5QLuMo9UZTfIn4hYSF-GV79E-nJ7Vk_CnqJ0wpoqdc',
        dq: 'XUJlToX7unsczKtW2PVwtEimjVjzm2y-pz1EVjhhMO-BHyztlIDTNSSu1HLUhsMeXMUuwWHh7yzYNj34RwyIyYs8sd8z9q-OClbwve7_jdwn8j-xTzjsLdEwhk-l3_48gzbg2WxGixrmMglzSUkUXNJThRqXvqDWOFqgeZZnua0',
        e: 'AQAB',
        n: 'sR-8gqhCPq9Qjl4_vUeRfHo8AteZDGrH3_fHKz5FbK_bnzF_petB9F8G2v7VXo5RUWIodvpuQtZp1qoAUZbLPxiE0cy7ovCaPKkmHXJWiAz22sB9FbvHF0plcmIKE7xUd9ZfS74CHTCoX_PSDEedubCpsperWZ-BfqDAVvhZ9utKp395GZ-2dEymVROlOcplO9jbm-1vrANcMgCk3jwAv_LbQOzNQ6pjSb4MVH-wh73aPFswZH9ZB366ePNij-vkqn3cIJvHAddW7UpQbBh-lSekkdNyRdqpp3Q2t9bTSAlxV1kX98YjxoTeHusOLGB4J7JjKwQKT8kf9XTfESNtGQ',
        p: '4dDcB5U96Z4SUr1nAkpipy2fLpFMeU7W8Sdnv3hR8t1PgUuWcKeVcY4RljzxhLgjaYPD3UJKiuWA1RqcUYI56n5f--hv367t2CA-0-mYh6V216lEeT2hPKBfvTLJrxGVak-MOBEa2ouWD9_YI-BzIg6bIdZa_obx4m3TN3bg2WM',
        q: 'yMyzUgfKT58JiSS3Ysro6039U0-Fcd1mUo6joZKOnsNgl6R3TqAIhyxbYbGn1lkYCVCnMIAjIZ10-6DHvfefKWWZ8GOhPvUOOtCS2vmAtI4WBa63gkOu2DIuHoPPwQ50HH1ihgoxe37kcCj0IWjkroZEyx2P0EzhJLGjN3u65lM',
        qi: 'lcXV1-VPWylfEWoSi61k2Z0PNuPr9eZyyQwCflk0f-J6Pct991hH9Xhff5waepcuAqHvkrbUW5EGozE7sZp9NMozDySKpLcCzKQqNUBJkDA5gUiFOzOuZJI4SeLP4tHVirJwnQlyRN6w-Blb-hWnZYELt9Xmu2C7ZXzoJ15AN1U'
      },
      {
        crv: 'P-256',
        d: 'K9xfPv773dZR22TVUB80xouzdF7qCg5cWjPjkHyv7Ws',
        kty: 'EC',
        alg: 'ES256',
        use: 'sig',
        x: 'FWZ9rSkLt6Dx9E3pxLybhdM6xgR5obGsj5_pqmnz5J4',
        y: '_n8G69C-A2Xl4xUW2lF0i8ZGZnk_KPYrhv4GbTGu5G4',
      },
    ],
  },
  accessTokenJwt: {
    signingAlg: 'RS256', // Specify the algorithm you want for JWTs
  },
};
