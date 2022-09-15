import './components.css'
import React from "react";
import { Row, Col, Container, ToggleButton } from "react-bootstrap";
const axios = require('axios').default

class LED extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: false,
      enableText: ""
    }
    this.pol = props.pol ?? 0;
  }
  componentDidMount() {
    this.fetch();
  }
  componentWillUnmount() {
  }
  fetch() {
    let params = {
      pol: this.pol
    };
    axios.get(`/cca/lna/led`, { params: params })
      .then(res => {
        const led = res.data;
        this.setState({ 
          enable: led.enable,
          enableText: led.enable ? "ENABLED" : "DISABLED"
         });
      })
  }
  setEnableHandler(enable) {
    console.log('setEnableHandler ' + enable);
    const params = {
      pol: this.pol,
      enable: enable
    }
    axios.put("/cca/lna/led", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch()
      })
  }
  render() {
    let buttonId = "LEDenabled" + this.pol;
    return (
      <Container className="component-data">
        <Row>
          <Col className="component-header">LNA LED</Col>
        </Row>
        <Row>
          <Col><ToggleButton
            className='custom-btn'
            id={buttonId}
            size="sm"
            type="checkbox"
            variant="info"
            checked={this.state.enable}
            onChange={(e) => this.setEnableHandler(e.currentTarget.checked)}>{this.state.enableText}</ToggleButton>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default LED;