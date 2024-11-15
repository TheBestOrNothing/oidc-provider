const uid = document.getElementById('unique-identifier').value;
console.log('This is a client-side script running in the browser.', uid);
    

// Because the init process of MetaMask SDK is async.
setTimeout(() => {
    // You can also access via window.ethereum.
    //const ethereum = MMSDK.getProvider();

    //ethereum.request({ method: 'eth_requestAccounts' });
}, 0);

async function signMessage() {
  const sdk = new MetaMaskSDK.MetaMaskSDK({
    dappMetadata: {
      name: "MetaMask Oauth",
    },
    logging: {
      sdk: false,
    }
  });

  const accounts = await sdk.connect();
  console.log(accounts);
  const message = "hello world!!";
  const provider = await sdk.getProvider();

  try {
    const account = await provider.request({ method: 'eth_requestAccounts' });
    console.log(account);
    const signature = await sdk.connectAndSign({ msg: message });
    console.log("Signature:", signature);
  } catch (error) {
    console.error("Error signing message:", error);
  }
}

signMessage();

fetch(`/interaction/${uid}/login`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login:"haha", password:"haha",}),
}).then(response => {
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
}).then(data => {
    console.log('Login successful:', data);
    // Handle success (redirect, show a message, etc.)
}).catch(error => {
    // Handle error (show a message, retry, etc.)
    console.log('Error:', error);
});