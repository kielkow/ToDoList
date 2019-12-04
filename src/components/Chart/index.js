/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Pie, Bar } from 'react-chartjs-2';

export default class Chart extends Component {
  state = {
    chartData: this.props.chartData,
    chartDataBar: this.props.chartDataBar,
  };

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    displayTitle: false,
    displayLegend: true,
    legendPosition: 'top',
  };

  render() {
    return (
      <div className="chart">
        <Pie
          data={this.state.chartData}
          options={{
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition,
            },
          }}
        />
        <Bar data={this.state.chartDataBar} options={{}} />
      </div>
    );
  }
}
