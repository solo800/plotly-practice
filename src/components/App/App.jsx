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
            year: 2018,
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
        console.log('year', this.state.year, 'data', response.data['Time Series (Digital Currency Daily)']);
        // filter out everything except 2018
        const timeSeries = response.data['Time Series (Digital Currency Daily)'];
        const data = [];

        for (let dateString in timeSeries) {
            if (timeSeries.hasOwnProperty(dateString)) {
                if (this.state.year === new Date(dateString).getFullYear()) {
                    timeSeries[dateString].date = dateString;
                    data.push(timeSeries[dateString]);
                }
            }
        }

        this.setState(prevState => ({year: prevState.year - 1}));

        return data;
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

        plotly.react(domElem, [line]);

        window.addEventListener('resize', () => plotly.Plots.resize(domElem));
    }

    componentDidMount () {
        this.get()
            .then(response => {

                const data = this.processData(response);
                // const data = [{
                //     date: ''
                // }];

                this.setState({data}, () => {
                    console.log('first plot', this.state.data);
                    this.plotData()
                });
            })
            .catch(err => {
                console.log(`Error in initial data retrieval call: ${err}`);
            });
        window.setTimeout(() => {
            console.log('timing out');
            this.get()
                .then(response => {

                    const data = this.processData(response);

                    // const data = [7,8,9,10];

                    this.setState({data}, () => {
                        console.log('plotting', this.state.data);
                        this.plotData()
                    });
                })
                .catch(err => {
                    console.log(`Error in initial data retrieval call: ${err}`);
                });
        }, 3000);
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