import React from 'react';
import { Line } from 'react-chartjs-2';

class Chart extends React.Component {
    constructor() {
      super();

      this.state = {
        show: false,
        open: false,
        connected: false,
        quotes: [],
        newDate: [],
        bid: '',

        data: {
          labels: [],
          datasets: [
            {
              label: '',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              borderWidth: 1,
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: []
            }
          ]
        }
      };

      this.options = {
        responsive: true,
        title: {
          display: false,
        },
        legend: {
          display: false
        },
      }

      this.socket = new WebSocket('wss://websocket.uptrader.io/');
      this.socket.onopen = () => {
        this.setState({connected:true})
      }; 
      this.emit = this.emit.bind(this);
    }

    emit() {
      if( this.state.connected ) {
        this.setState(prevState => ({ open: !prevState.open }))
      }
    }
    componentDidMount(){
      this.socket.onopen = () => this.socket.send("BTCUSD");

      this.socket.onmessage = ({data}) => {
        let quotesData = JSON.parse(data)

        let date = new Date(quotesData.time * 1000)
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();
        let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        data.datasets[0].data.push(quotesData.bid)
        data.labels.push(`Time: ${formattedTime}`)

        const updatedData = 
          this.setState(prevState => ({ data: {...prevState.data, datasets:[...prevState.data.datasets[0].data, quotesData.bid] } }))
        

        this.setState(
          {
            quotes: quotesData, 
            show: true, 
            newDate: formattedTime, 
            data: data
          }
        )
      };
    }
    
    render() {

      // Line.update();
      return (
        <div>
          <div>{this.state.quotes.bid}</div>
          <Line
            data={this.state.data}
            options={this.options}
          >
          </Line>
        </div> 
      );
    }
  }
  
  export default Chart;
