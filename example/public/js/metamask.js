
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
        //enableAutomaticQr: true, // for generating QR code automatically if not installed in a browser
        //mobileLinks: ['metamask'], // to handle mobile redirection
        checkInstallationImmediately: true,
        useDeeplink: true,
    });

    let sign = "";
    let accounts = [];
    let url = "";
    let localeDate = "";

    try {
        //const domain = window.location.host;
        url = window.location.href;
        const currentDate = new Date();
        localeDate = currentDate.toLocaleString('en-US');
        //localeDate = currentDate.toISOString();
        console.log(localeDate);
        const siweMessage = `Issued At:\n${localeDate}\n\nURL:\n${url}`;
        //const abc = await sdk.connect();
        sign = await sdk.connectAndSign({ msg: siweMessage });
        console.log(sign);

        accounts = await sdk.getProvider().request({
            "method": "eth_accounts",
            "params": [],
        });
        document.getElementById('statusDisplay').innerText = accounts;
    } catch (error) {
        console.error("Error signing message:", error);
        document.getElementById('statusDisplay').innerText = error;
        return;
    }

    if (sign == "") {
        document.getElementById('statusDisplay').innerText = 'return because sign is null';
        return;
    }

    // Get the form element
    const form = document.getElementById("loginForm");

    // Get the login and password input elements
    const signInput = form.querySelector('input[name="sign"]');
    const urlInput = form.querySelector('input[name="url"]');
    const localeDateInput = form.querySelector('input[name="localeDate"]');

    //assign values 
    signInput.value = sign;
    urlInput.value = url;
    localeDateInput.value = localeDate;

    // Dynamically add account inputs in accountsContainer
    const accountsContainer = document.getElementById('accountsContainer');
    accounts.forEach((account, index) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'accounts'; // Use square brackets to indicate an array
        input.value = account; // Set the value from the accounts array
        input.placeholder = `Account ${index + 1}`;
        accountsContainer.appendChild(input);
    });

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
    let deeplink = deepLinkBase;
    if (dappUrl.search("https://") !== -1) {
        deeplink = deepLinkBase + dappUrl.replace('https://', '');
    }
    deepLinkButton.innerText = deeplink;
    deepLinkButton.href = deeplink;
}
//setDeepLink();
