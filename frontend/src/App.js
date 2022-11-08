import './App.css';
import GoogleOauth from './pages/oauth';
import matic_token from './assets/matic_token.jpg';

function App() {
  return (
    <div className="home">
      <header className="header">
        <h1>Bootstrap your testnet wallet</h1>
        <div className='description'>
          <span>Polygon Faucet funds a wallet with </span>&nbsp;
          <div class="home_token">
            <img src={matic_token} alt={"MATIC"} />
            <span>
              MATIC
            </span>
          </div>
        </div>

      </header>
      <GoogleOauth />
    </div>
  );
}

export default App;
