import './components.css'
import React from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
const axios = require('axios').default

class YTO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lowGHz: 0.0,
      highGHz: 0.0,
      inputLowGHz: "",
      inputHighGHz: "",
      courseTune: 0
    }
  }
  componentDidMount() {
    this.fetch();
  }
  componentWillUnmount() {
  }
  fetch() {
    axios.get(`/lo/yto`)
      .then(res => {
        const yto = res.data;
        this.setState({ 
          lowGHz: yto.lowGHz,
          highGHz: yto.highGHz,
          courseTune: yto.courseTune,
        });
        if (this.state.inputLowGHz === "") {
          this.setState({ 
            inputLowGHz: yto.lowGHz,
            inputHighGHz: yto.highGHz
          });
        }
      })
  }
  setLimitsHandler() {
    const params = {
      lowGHz:  Number(this.state.inputLowGHz),
      highGHz: Number(this.state.inputHighGHz)
    }
    axios.put("/lo/yto/limits", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
      })
  }
  tweakYTO(amount) {
    const params = {
      courseTune: this.state.courseTune + amount
    }
    axios.put("/lo/yto/coursetune", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.setState({courseTune : params.courseTune});
      })
  }
  render() {
    let setLimitsProps = {
      size: 'sm',
      onClick: event => this.setLimitsHandler()
    }
    let incYTOProps = {
      size: 'sm',
      onClick: event => this.tweakYTO(1)
    }
    let decYTOProps = {
      size: 'sm',
      onClick: event => this.tweakYTO(-1)
    }
    return (
      <Container className="component-data">
        <Row>
          <Col className="component-header">YTO</Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">low:</Col>
          <Col> {this.state.lowGHz}</Col>
          <Col><
            input type="text"
            name="setLow" 
            className="component-input"
            onChange={event => {this.setState({inputLowGHz: event.target.value})}}
            value = {this.state.inputLowGHz}
          /></Col>
          <Col></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">high:</Col>
          <Col> {this.state.highGHz}</Col>
          <Col><
            input type="text" 
            name="setHigh" 
            className="component-input"
            onChange={event => {this.setState({inputHighGHz: event.target.value})}}
            value = {this.state.inputHighGHz}
          /></Col>
          <Col>
            <Button 
              className="custom-btn" 
              {...setLimitsProps}
            >SET</Button>
          </Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">courseTune:</Col>
          <Col> {this.state.courseTune}</Col>
          <Col>
            <Button 
              className="custom-btn"
              style={{width: "39px"}}
              {...decYTOProps}
            >--</Button>
          </Col>
          <Col>
            <Button 
              className="custom-btn" 
              style={{width: "39px"}}
              {...incYTOProps}
            >++</Button></Col>
        </Row>
      </Container>
    );
  }
};
export default YTO;