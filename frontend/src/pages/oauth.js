import { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import Web3 from "web3";

const GoogleOauth = () => {

  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ethAddress, setEthAddress] = useState("");
  const [isSending, setIsSending] = useState(false);

  const clientId = '327818087416-aej98sjlsa9tidnahdss2us8q7er9rj8.apps.googleusercontent.com';

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
  });

  async function getDrip(address) {
    setIsSending(true)
    console.log("Getting drip...");

    const response = await fetch("http://localhost:4000/request/eth/" + address, { method: 'GET' })

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    console.log("Success!")
    setIsSending(false);

    return "Success!";
}


  const onSuccess = (res) => {
    setIsAuthenticated(true);
    setUserEmail(res.profileObj.email);
    console.log("result: ", res);
  };

  const onFailure = (err) => {
    console.log('failed', err);
  };

  const logOut = () => {
    setIsAuthenticated(false);
    setUserEmail("");
  };

  return (
    <div>
      {isAuthenticated ? (
        <div className='home_content_container__authenticated'>
          <div className='home_content_title_container__authenticated'>
            <h3 className='home_content_title__authenticated'>Request $MATIC Tokens</h3>
          </div>
          <div className='home_content__authenticated'>
            <p>Enter your Ethereum address to receive tokens:</p>
            <input className='home_content_input_container__authenticated' type='text' placeholder='0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B' value={ethAddress} onChange={(e) => { setEthAddress(e.target.value) }}></input>
            {Web3.utils.isAddress(ethAddress) ? (
              <button className='home_content_claim_button__authenticated' onClick={() => getDrip(ethAddress)}>
                {isSending ? <>Sending ..</> : <>Claim</>}
              </button>
            ) : (
              (ethAddress === '') ? (
                <button className='home_content_invalid_address_button__authenticated' disabled>
                  Enter Valid Address
                </button>
              ) : (
                <button className='home_content_invalid_address_button__authenticated' disabled>
                  Invalid Address
                </button>
              )
            )
            }
            <div className='sign_out_button_container__authenticated'>
              <GoogleLogout
                clientId={clientId}
                render={(renderProps) => (
                  <button className='sign_out_button__authenticated' onClick={renderProps.onClick} disabled={renderProps.disabled}>
                    Sign out {userEmail}
                  </button>
                )}
                onLogoutSuccess={logOut} />
            </div>
          </div>
        </div>
      ) : (
        <div className='home_content_container'>
          <div className='home_content_title_container'>
            <h3 className='home_content_title'>Request $MATIC Tokens</h3>
          </div>
          <div className='home_content__unauthenticated'>
            <p>To prevent faucet botting, you must sign in with Google. We request <u>read-only</u> access.</p>
            <GoogleLogin
              clientId={clientId}
              render={(renderProps) => (
                <button className='sign_in_button__unauthenticated' onClick={renderProps.onClick} disabled={renderProps.disabled}>
                  Sign In with Google
                </button>
              )}
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              isSignedIn={true}
            />
          </div>
        </div>
      )}

    </div>
  );

}

export default GoogleOauth;