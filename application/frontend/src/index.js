import React from 'react';
import ReactDOM from 'react-dom';
import './css/styles.css';
import * as serviceWorker from './components/serviceWorker';
import UIController from './components/UIController';

import screenshot from './assets/images/screenshot.png';

ReactDOM.render(
  <React.StrictMode>
    <div id="game-container">
      <UIController />
    </div>
    <div id="mobile-warning">
      <p>Hello and thanks for your interest in playing</p>
      <h2>AiMessage</h2><br />
      <p>Alas, I did not make the game interface suitable for phones. 
        Would you try playing on a computer or tablet?</p>
      <p>Warm Regards,<br />Gabriel</p>
      <img src={screenshot} alt="AiMessage screenshot" />
      
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
