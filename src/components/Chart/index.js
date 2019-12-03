/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';

export default class Chart extends Component {
  state = {
    chartData: this.props.chartData,
  };

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    displayLegend: true,
    legendPosition: 'right',
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
      </div>
    );
  }
}
