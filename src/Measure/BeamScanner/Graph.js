import React from "react";
import { useSelector } from 'react-redux'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function BeamScannerGraph(props) {
  // Redux store interface
  const position = useSelector((state) => state.MotorControl.position);

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
        <Scatter name="Position" zAxisId="pol" data={[position]} isAnimationActive={false}/>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
