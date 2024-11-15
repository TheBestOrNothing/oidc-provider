const uid = document.getElementById('unique-identifier').value;
console.log('This is a client-side script running in the browser.', uid);


// Because the init process of MetaMask SDK is async.
//setTimeout(() => {
    // You can also access via window.ethereum.
    //const ethereum = MMSDK.getProvider();

    //ethereum.request({ method: 'eth_requestAccounts' });
//}, 0);

let connectStatus = 'Not connected'; // initial status value
document.getElementById('statusDisplay').innerText = connectStatus;

async function signMessage() {
    const sdk = new MetaMaskSDK.MetaMaskSDK({
        dappMetadata: {
            name: "MetaMask Oauth",
        },
        redirectUri: window.location.href,
        logging: {
            sdk: true,
            level: 'debug',
        },
        enableAutomaticQr: true, // for generating QR code automatically if not installed in a browser
        //mobileLinks: ['metamask'], // to handle mobile redirection
        checkInstallationImmediately: true,
        useDeeplink: true,

    });

    let sign = "";
    let account = "";

    try {
        //const accounts = await sdk.connect();
        //console.log(accounts);
        //account = accounts[0];
        //document.getElementById('statusDisplay').innerText = account;

        //const domain = window.location.host;
        const domain = window.location.href;
        const siweMessage = `${domain} wants you to sign in with your account:\nI accept the MetaMask Terms of Service: https://community.metamask.io/tos\n\nURI: https://${domain}\nVersion: 1\nChain ID: 1\nNonce: 32891757\nIssued At: 2021-09-30T16:25:24.000Z`;
        sign = await sdk.connectAndSign({ msg: siweMessage });
        document.getElementById('statusDisplay').innerText = sign;
        console.log(sign);

        account = await sdk.getProvider().request({
                          "method": "eth_accounts",
                          "params": [],
                        });
        document.getElementById('statusDisplay').innerText = account;
    } catch (error) {
        console.error("Error signing message:", error);
        document.getElementById('statusDisplay').innerText = error;
        return;
    }

    if (sign == "" || account == "") {
        document.getElementById('statusDisplay').innerText = 'return because sign or account is null';
        return;
    }

    // Get the form element
    const form = document.getElementById("loginForm");

    // Get the login and password input elements
    const loginInput = form.querySelector('input[name="login"]');
    const passwordInput = form.querySelector('input[name="password"]');

    //assign values 
    loginInput.value = account;    
    passwordInput.value = sign;    

    // Programmatically submit the form
    form.submit();
}

//signMessage();

const metamaskConnectButton = document.getElementById("metamaskConnect");
metamaskConnectButton.addEventListener("click", signMessage);

const deepLinkButton = document.getElementById("deepLink");
function setDeepLink() {
  const dappUrl = window.location.href;
  const deepLinkBase = `https://metamask.app.link/dapp/`;
  document.getElementById('deepLinkDisplay').innerText = deepLinkBase;
  let url = null;
  if(dappUrl.search("https://") !== -1){
	url = deepLinkBase + dappUrl.replace('https://', '');
  }
  document.getElementById('deepLinkDisplay').innerText = url;
  deepLinkButton.href = url;
}
setDeepLink();
