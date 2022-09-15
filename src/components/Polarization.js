import './components.css'
import SIS from './SIS'
import LNA from './LNA'
import LED from './LED'
import Heater from './Heater';
import CartridgeTemps from './CartridgeTemps';
import React from "react";
import { Row, Col, Container } from "react-bootstrap";

class Polarization extends React.Component {
  constructor(props) {
    super(props);
    this.pol = props.pol ?? 0;
  }
  render() {
    return (
      <Container> 
        <Row>
           <Col className="polarization-header">Polarization {this.pol}</Col>
        </Row>
        <Row>
          <Col><SIS pol={this.pol} sis="1"/></Col>
          <Col><SIS pol={this.pol} sis="2"/></Col>
        </Row>
        <div className ="spacer"></div>
        <Row>
          <Col><LNA pol={this.pol} lna="1"/></Col>
          <Col><LNA pol={this.pol} lna="2"/></Col>
        </Row>
        <div className ="spacer"></div>
        <Row>
          {this.pol === "0" &&
            <Col><CartridgeTemps/></Col>
          }
          <Col><LED pol={this.pol} /></Col>
          {this.pol === "1" &&
            <Col><Heater/></Col>
          }
        </Row>
      </Container>
    )
  }
}
export default Polarization;