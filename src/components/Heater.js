import './components.css'
import React from "react";
import { Row, Col, Container, ToggleButton } from "react-bootstrap";
const axios = require('axios').default

class Heater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: false,
      enableText: "DISABLED",
      current: 0.0
    }
  }
  componentDidMount() {
    this.fetch();
  }
  componentWillUnmount() {
  }
  fetch() {
    axios.get(`/cca/sis/heater`)
      .then(res => {
        const current = res.data.value;
        this.setState({ 
          current: current
         });
      })
  }
  setEnableHandler(enable) {
    console.log('setEnableHandler ' + enable);
    const params = {
      enable: enable
    }
    axios.put("/cca/sis/heater", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        if (result.success) {
            this.setState({
              enable: enable,
              enableText: enable ? "ENABLED" : "DISABLED"
            })
            this.fetch();
        }
      })
  }
  render() {
    return (
      <Container className="component-data">
        <Row>
          <Col className="component-header">SIS HEATER</Col>
        </Row>
        <Row xs={5}>
          <Col><ToggleButton
            className='custom-btn'
            id="HeaterEnabled"
            size="sm"
            type="checkbox"
            variant="info"
            checked={this.state.enable}
            onChange={(e) => this.setEnableHandler(e.currentTarget.checked)}>{this.state.enableText}</ToggleButton>
          </Col>
        </Row>
        <Row xs={5}>
          <Col md={"auto"} className="component-title">current [mA]:</Col>
          <Col>{this.state.current}</Col>          
        </Row>
      </Container>);
  }
}
export default Heater;