import React from 'react';
import plotly from 'plotly.js-dist';
// import styles from './App.scss';

export default class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {};

        this.alphaVantage = {
            root: 'https://www.alphavantage.co/query',
            apiKey: 'R1IC7R7SN3141VGH',
            market: 'USD',
            function: 'function=DIGITAL_CURRENCY_DAILY',
        };

        // https://www.alphavantage.co/query?apikey=R1IC7R7SN3141VGH&market=USD&symbol=BTC&function=DIGITAL_CURRENCY_DAILY
    }

    render () {
        return (
            <div>
                <h1>Hello my friends!</h1>
            </div>
        );
    }
}