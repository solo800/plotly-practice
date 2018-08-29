import React from 'react';
import plotly, {d3} from 'plotly.js-dist';
// import styles from './App.scss';

export default class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {};

        this.onResize = this.onResize.bind(this);

        const width = 60;
        const height = 80;

        const gd3 = d3.select('body')
            .append('div')
            .style({
                width: `${width}%`,
                'margin-left': `${(100 - width) / 2}%`,
                height: `${height}vh`,
                'margin-top': `${(100 - height) / 2}vh`,
            });

        this.gd = gd3.node();

        plotly.plot(this.gd, [{
                type: 'bar',
                x: [1, 2, 3, 4, ],
                y: [5, 10, 2, 8, ],
                marker: {
                    color: '#C8A2C8',
                    line: { width: 2.5 },
                }
            }],
            {
                title: 'Auto-Resize',
                font: { size: 16 },
            });
    }

    onResize () {
        plotly.Plots.resize(this.gd);
    }

    componentDidMount () {
        window.addEventListener('resize', this.onResize);
    }

    render () {
        return (
            <div>
                <h1>Hello my friends!</h1>
            </div>
        );
    }
}