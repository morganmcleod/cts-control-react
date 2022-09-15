import './components.css'
import React from "react";
import { Row, Col, Container, Button, ToggleButton } from "react-bootstrap";
const axios = require('axios').default

class LNA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "",
      enable: false,
      enableText: "",
      VD1: 0.0,
      VD2: 0.0,
      VD3: 0.0,
      ID1: 0.0,
      ID2: 0.0,
      ID3: 0.0,
      VG1: 0.0,
      VG2: 0.0,
      VG3: 0.0,
    }
    this.pol = props.pol ?? 0;
    this.lna = props.lna ?? 1;
    this.interval = props.interval ?? 5000;
    this.timer = 0;
    this.handleTimer = this.handleTimer.bind(this);
    this.setEnableHandler = this.setEnableHandler.bind(this);
    this.setValueHandler = this.setValueHandler.bind(this);
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
    let params = {
      pol: this.pol,
      lna: this.lna,
    }
    axios.get("/cca/lna", { params: params })
      .then(res => {
        const lna = res.data;
        this.setState({
          key: 'LNA' + this.pol.toString() + this.lna.toString(),
          enable: lna.enable,
          enableText: lna.enable ? "ENABLED" : "DISABLED",
          VD1: lna.VD1,
          VD2: lna.VD2,
          VD3: lna.VD3,
          ID1: lna.ID1,
          ID2: lna.ID2,
          ID3: lna.ID3,
          VG1: lna.VG1,
          VG2: lna.VG2,
          VG3: lna.VG3
        })
      })
  }
  setEnableHandler(enable) {
    console.log('setEnableHandler ' + enable);
    const params = {
      pol: this.pol,
      lna: this.lna,
      enable: enable
    }
    axios.put("/cca/lna/enable", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        if (result.success) {
          this.setState({enable: enable, enableText: enable ? "ENABLED" : "DISABLED",})
        }
      })
  }
  setValueHandler(what) {
    let params = {
      pol: this.pol,
      lna: this.lna
    }
    params[what] =  document.getElementsByName("set" + what)[0].value
    if (params[what]) {
      axios.put("/cca/lna", params)
        .then(res => {
          const result = res.data;
          console.log(result);
        })
    }
  }
  render() {
    return (
      <Container className="component-data">
        <Row>
          <Col className="component-header">LNA {this.lna}</Col>
        </Row>
        <Row xs={5}>
          <Col><ToggleButton
            className="custom-btn" 
            id="LNAenabled"
            size="sm"
            type="checkbox"
            variant="info"
            checked={this.state.enable}
            onChange={(e) => this.setEnableHandler(e.currentTarget.checked)}>{this.state.enableText}</ToggleButton>
          </Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">VD1:</Col>
          <Col>{this.state.VD1}</Col>
          <Col><input type="text" name="setVD1" className="component-input"/></Col>
          <Col><Button className="custom-btn" size='sm' onClick={(e) => this.setValueHandler('VD1')}>SET</Button></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">VD2:</Col>
          <Col>{this.state.VD2}</Col>
          <Col><input type="text" name="setVD2" className="component-input"/></Col>
          <Col><Button className="custom-btn" size='sm' onClick={(e) => this.setValueHandler('VD2')}>SET</Button></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">VD3:</Col>
          <Col>{this.state.VD3}</Col>
          <Col><input type="text" name="setVD3" className="component-input"/></Col>
          <Col><Button className="custom-btn" size='sm' onClick={(e) => this.setValueHandler('VD3')}>SET</Button></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">ID1:</Col>
          <Col>{this.state.ID1}</Col>
          <Col><input type="text" name="setID1" className="component-input"/></Col>
          <Col><Button className="custom-btn" size='sm' onClick={(e) => this.setValueHandler('ID1')}>SET</Button></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">ID2:</Col>
          <Col>{this.state.ID2}</Col>
          <Col><input type="text" name="setID2" className="component-input"/></Col>
          <Col><Button className="custom-btn" size='sm' onClick={(e) => this.setValueHandler('ID2')}>SET</Button></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">ID3:</Col>
          <Col>{this.state.ID3}</Col>
          <Col><input type="text" name="setID3" className="component-input"/></Col>
          <Col><Button className="custom-btn" size='sm' onClick={(e) => this.setValueHandler('ID3')}>SET</Button></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">VG1:</Col>
          <Col>{this.state.VG1}</Col>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">VG2:</Col>
          <Col>{this.state.VG2}</Col>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">VG3:</Col>
          <Col>{this.state.VG3}</Col>
          <Col></Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
}

export default LNA;
