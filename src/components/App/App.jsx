import React from 'react';
import plotly, {d3} from 'plotly.js-dist';
import axios from 'axios';
// import styles from './App.scss';

// TODO: create Day object to hold each day of the time series
export default class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            data: [],
        };

        this.alphaVantage = {
            root: 'https://www.alphavantage.co/query?',
            apiKey: 'apikey=R1IC7R7SN3141VGH&',
            function: 'function=DIGITAL_CURRENCY_DAILY&',
        };

        // https://www.alphavantage.co/query?apikey=R1IC7R7SN3141VGH&market=USD&symbol=BTC&function=DIGITAL_CURRENCY_DAILY

        this.get = this.get.bind(this);
        this.processData = this.processData.bind(this);
        this.plotData = this.plotData.bind(this);
    }

    get () {
        return axios(`${this.alphaVantage.root}${this.alphaVantage.apiKey}&market=USD&symbol=BTC&${this.alphaVantage.function}`)
            .then(res => res)
            .catch(err => {
                console.log(`error getting data in get ${err}`);
            });
    }

    processData (response) {
        console.log('data', response.data['Time Series (Digital Currency Daily)']['2018-08-28']);
        // filter out everything except 2018
        const timeSeries = response.data['Time Series (Digital Currency Daily)'];
        const data2018 = [];

        for (let dateString in timeSeries) {
            if (timeSeries.hasOwnProperty(dateString)) {
                if (2018 === new Date(dateString).getFullYear()) {
                    timeSeries[dateString].date = dateString;
                    data2018.push(timeSeries[dateString]);
                }
            }
        }

        return data2018;
    }

    plotData () {
        const timeSeries = this.state.data;
        const x = timeSeries.map(day => day.date);
        const y = timeSeries.map(day => day['5. volume']);

        const line = {
            x,
            y,
            mode: 'lines',
            type: 'scatter',
        };

        const lineGraph = d3.select(this.self);

        lineGraph.style = {
            width: '100%',
            height: '100%',
        };

        const domElem = lineGraph.node();

        plotly.plot(domElem, [line]);

        window.addEventListener('resize', () => plotly.Plots.resize(domElem));

        let i = window.setInterval(() => {
            if (0 >= this.state.data.length) {
                window.clearInterval(i);
            }

            this.setState((prevState, props) => {
                console.log('updating', prevState.data.length, prevState.data);
                return {
                    data: prevState.data.slice(0, prevState.data.length - 10),
                };
            }, () => {
                console.log('updated');
                this.plotData();
            });
        }, 1500);
    }

    componentDidMount () {
        this.get()
            .then(response => {
                const data2018 = this.processData(response);
                this.setState({data: data2018}, () => {
                    // console.log('after', this.state);
                    this.plotData()
                });
            })
            .catch(err => {
                console.log(`Error in initial data retrieval call: ${err}`);
            })
    }



    render () {
        return (
            <div>
                <h1>Hello my friends!</h1>
                <div ref={self => {
                    this.self = self;
                }}></div>
            </div>
        );
    }
}