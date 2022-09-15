import './components.css'
import YTO from './YTO'
import PLL from './PLL'
import PA from './PA'
import React from "react";
import { Row, Col, Container } from "react-bootstrap";

class LO extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container> 
        <Row>
          <Col><YTO/></Col>
          <Col><PA/></Col>          
          <Col><PLL/></Col>
        </Row>      
      </Container>
    )
  }
}
export default LO;