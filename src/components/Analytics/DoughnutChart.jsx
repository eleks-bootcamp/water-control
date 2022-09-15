import React from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({drunk, left}) => {

  const data = {
    labels: ['Drunk water', 'Left'],
    datasets: [
      {
        label: '# of Votes',
        data:[drunk, left],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
          borderWidth: 1,
      }
    ]
  }

  return (
    <div>
      <Doughnut data={data}/>
    </div>
  )
}