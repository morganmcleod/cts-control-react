import './components.css'
import React from "react";
import { Row, Col, Container } from "react-bootstrap";
const axios = require('axios').default

class CartridgeTemps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp0: 0,
      temp1: 0,
      temp2: 0,
      temp3: 0,
      temp4: 0,
      temp5: 0
    }
    this.interval = props.interval ? props.interval : 5000;
    this.timer = 0;
    this.handleTimer = this.handleTimer.bind(this);
  }
  componentDidMount() {
    this.fetch();
    if (this.timer === 0) {
      this.timer = setInterval(this.handleTimer, this.interval);
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = 0;
  }
  handleTimer() {
    this.fetch();
  }
  fetch() {
    axios.get(`/cca/tempsensors`)
      .then(res => {
        const temps = res.data;
        this.setState({ 
          temp0: temps.temp0,
          temp1: temps.temp1,
          temp2: temps.temp2,
          temp3: temps.temp3,
          temp4: temps.temp4,
          temp5: temps.temp5
         });
      })
  }
  render() {
    return (
      <Container className="component-data">
        <Row>
            <Col className="component-header">Temperatures</Col>
        </Row>
        <Row>
          <Col className="component-title">MixerP0:</Col>
          <Col>{this.state.temp2}</Col>
          <Col className="component-title">P1:</Col>
          <Col>{this.state.temp5}</Col>
        </Row>
        <Row>
          <Col className="component-title" >4K:</Col>
          <Col>{this.state.temp0}</Col>
          <Col className="component-title">15K:</Col>
          <Col>{this.state.temp4}</Col>
        </Row>
        <Row>
          <Col className="component-title">110K:</Col>
          <Col>{this.state.temp1}</Col>
          <Col></Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
}
export default CartridgeTemps;
