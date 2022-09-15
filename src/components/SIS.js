import React from "react";
import { Row, Col, Button } from "react-bootstrap";
const axios = require('axios').default

class SIS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "",
      Vj: 0.0,
      Ij: 0.0,
      Vmag: 0.0,
      Imag: 0.0,
      averaging: props.averaging ? props.averaging : 1
    };
    this.pol = props.pol ? props.pol : 0;
    this.sis = props.sis ? props.sis : 1;
    this.interval = props.interval ? props.interval : 5000;
    this.timer = 0;
    this.handleTimer = this.handleTimer.bind(this);
    this.setVjHandler = this.setVjHandler.bind(this);
    this.setImagHandler = this.setImagHandler.bind(this);
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
      sis: this.sis,
      averaging: this.state.averaging
    }
    axios.get("/cca/sis", { params: params })
      .then(res => {
        const sis = res.data;
        this.setState({
          key: 'SIS' + this.pol.toString() + this.sis.toString(),
          Vj: sis.Vj,
          Ij: sis.Ij,
          Vmag: sis.Vmag,
          Imag: sis.Imag,
          averaging: sis.averaging
        })
      })
  }
  setVjHandler() {
    const params = {
      pol: this.pol,
      sis: this.sis,
      Vj: document.getElementsByName("setVj")[0].value
    }
    axios.put("/cca/sis", params)
      .then(res => {
        const result = res.data;
      })
  }
  setImagHandler() {
    const params = {
      pol: this.pol,
      sis: this.sis,
      Imag: document.getElementsByName("setImag")[0].value
    }
    axios.put("/cca/sis", params)
      .then(res => {
        const result = res.data;
      })
  }
  render() {
    let setVjProps = {
      size: 'sm',
      onClick: this.setVjHandler
    }
    let setImagProps = {
      size: 'sm',
      onClick: this.setImagHandler
    }
    return (
      <div style={{ fontSize: "16px"}}>
        <Row>
          <Col style={{ width: "150px" }}></Col>
          <Col style={{ fontSize: '22px'}}>SIS</Col>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row>
          <Col style={{width: "150px"}}>Vj [mV]</Col>
          <Col>{this.state.Vj}</Col>
          <Col><input type="text" name="setVj" style={{width: "50px"}}/></Col>
          <Col><Button {...setVjProps}>SET</Button></Col>
        </Row>
        <Row>          
          <Col style={{width: "150px"}}>Ij mV</Col>
          <Col>{this.state.Ij}</Col>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row>
          <Col style={{ width: "150px" }}></Col>
          <Col style={{ fontSize: '22px' }}>Magnet</Col>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row>
          <Col style={{width: "150px"}}>Imag</Col>
          <Col>{this.state.Imag}</Col>
          <Col><input type="text" name="setImag" style={{width: "50px"}}/></Col>
          <Col><Button {...setImagProps}>SET</Button></Col>
        </Row>
        <Row>
          <Col style={{width: "150px"}}>Imag mV</Col>
          <Col>{this.state.Vmag}</Col>
          <Col></Col>
          <Col></Col>
        </Row>
        </div>
    );
  }
}

export default SIS;
