import React from 'react';
import plotly, {d3} from 'plotly.js-dist';
import axios from 'axios';
// import styles from './App.scss';

// DUMMY DATA
import mockData from '../../mock-data.json';

// TODO: create Day object to hold each day of the time series
export default class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            data: [],
            xLabels: [],
            yLabels: [],
            year: 2018,
            month: 7,
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
        this.makeDataLabels = this.makeDataLabels.bind(this);
        this.makeAxisLabels = this.makeAxisLabels.bind(this);
    }

    get () {
        return new Promise((res, err) => {
            res(mockData);
        });

        // actual api call
        // return axios(`${this.alphaVantage.root}${this.alphaVantage.apiKey}&market=USD&symbol=BTC&${this.alphaVantage.function}`)
        //     .then(res => res)
        //     .catch(err => {
        //         console.log(`error getting data in get ${err}`);
        //     });
    }

    makeDataLabels (response) {
        const xLabels = [];
        const yLabels = [];
        const data = response.data['Time Series (Digital Currency Daily)'];

        for (let dateString in data) {
            if (data.hasOwnProperty(dateString)) {
                if (this.state.year === new Date(dateString).getFullYear() && this.state.month === new Date(dateString).getMonth()) {
                    let date = new Date(dateString);

                    xLabels.push(`${date.getMonth()}-${date.getDate()}`);
                    yLabels.push(`${data[dateString]['5. volume'].slice(0, 2)}k`);
                }
            }
        }

        return {xLabels, yLabels};
    }

    makeAxisLabels (response, labelsCount) {
        // const data = response.data['Time Series (Digital Currency Daily)'];
        //
        // const xTimeSeries = [];
        // const yTimeSeries = [];
        //
        // for (let date in data) {
        //     if (data.hasOwnProperty(date)) {
        //         if (this.state.year === new Date(date).getFullYear()) {
        //             // get all the x axis data (dates)
        //             xTimeSeries.push(new Date(date).getTime());
        //
        //             // get all the y axis data (trade volume)
        //             yTimeSeries.push(data[date]['5. volume'] * 1);
        //         }
        //     }
        // }
        //
        // // order both series low to high
        // xTimeSeries.sort((prev, next) => prev - next);
        // yTimeSeries.sort((prev, next) => prev - next);
        //
        // // divide range of time series into the number of labels specified by labelsCount
        // const xLow = xTimeSeries[0];
        // const xHigh = xTimeSeries[xTimeSeries.length - 1];
        // const xDiff = xHigh - xLow;
        //
        // const yLow = yTimeSeries[0];
        // const yHigh = yTimeSeries[yTimeSeries.length - 1];
        // const yDiff = yHigh - yLow;
        //
        // const xLabels = [];
        // const yLabels = [];
        //
        // let labelNumber = 0;
        // while (labelNumber < labelsCount) {
        //     xLabels.push(xDiff * labelNumber + xLow);
        //     yLabels.push(yDiff * labelNumber + yLow);
        //     ++labelNumber;
        // }
        //
        // return {xLabels, yLabels};
    }

    processData (response) {
        // filter out everything except 2018
        const timeSeries = response.data['Time Series (Digital Currency Daily)'];
        const data = [];

        for (let dateString in timeSeries) {
            if (timeSeries.hasOwnProperty(dateString)) {
                if (this.state.year === new Date(dateString).getFullYear() && this.state.month === new Date(dateString).getMonth()) {
                    timeSeries[dateString].date = dateString;
                    data.push(timeSeries[dateString]);
                }
            }
        }

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
            hoverinfo: 'text',
            text: this.state.yLabels,
            name: 'BTC Volume',
            marker: { size: 18 },
        };

        const lineGraph = d3.select(this.self);

        lineGraph.style = {
            width: '100%',
            height: '100%',
        };

        const domElem = lineGraph.node();

        const options = {
            showlegend: true,
            title: `BTC Volume ${this.state.year} - Month ${this.state.month + 1}`
        };

        plotly.newPlot(domElem, [line], options);

        window.addEventListener('resize', () => plotly.Plots.resize(domElem));
    }

    componentDidMount () {
        this.get()
            .then(response => {
                const data = this.processData(response);
                const {xLabels, yLabels} = this.makeDataLabels(response);

                this.setState({
                    data,
                    xLabels,
                    yLabels,
                }, () => {
                    this.plotData()
                });
            })
            .catch(err => {
                // eslint-disable-next-line no-console
                console.log(`Error in initial data retrieval call: ${err}`);
            });
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