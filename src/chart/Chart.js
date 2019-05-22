import React from 'react';
import { VictoryChart, VictoryZoomContainer, VictoryLine } from "victory";

class Chart extends React.Component {
    constructor() {
      super();
      this.state = {
        
        open: false,
        connected: false,
        quotes: []
      };
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
        this.setState(
          {quotes: quotesData}
        )
      };
    }

    handleZoom(domain) {
      this.setState({ zoomDomain: domain });
    }
    
    render() {
      return (
        <div>
          <div>{this.state.quotes.bid}</div>
          <VictoryChart width={600} height={470} >
              <VictoryLine
                style={{
                  data: { stroke: "tomato" }
                }}
                data={[
                  { x: this.state.quotes.bid, y: this.state.quotes.time }
                ]}
              />
  
            </VictoryChart>
            
        </div>
      );
    }
  }
  
  export default Chart;
