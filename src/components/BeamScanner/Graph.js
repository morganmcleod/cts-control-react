import '../components.css'
import React, {PureComponent} from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import eventBus from '../EventBus';

class BeamScannerGraph extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      position: [{x: 0, y: 0, pol: 0}]
    }
  }
  
  componentDidMount() {
    eventBus.on("/beamscan/mc/position", (data) => 
      this.setState({position: [data]}));
  }

  componentWillUnmount() {
    eventBus.remove("/beamscan/mc/position");
  }

  render() {
    return (
      <ResponsiveContainer width="90%" height={300}>
        <ScatterChart
          width={300}
          height={300}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="X" domain={[0, 300]}/>
          <YAxis type="number" dataKey="y" name="Y" domain={[0, 300]}/>
          <Scatter name="Position" zAxisId="pol" data={this.state.position} isAnimationActive={false}/>
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
}

export default BeamScannerGraph
