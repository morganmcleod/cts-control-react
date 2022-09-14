import React from "react";
import { Row, Col } from "react-bootstrap";
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
  }

  handleTimer() {
    this.fetch();
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

  render() {
    return (
      <fieldset key={this.state.key}>
        <legend style={{ fontSize: "14px" }}>
          <Row>
            <Col>
              SIS
            </Col>
            <Col>
              voltage
            </Col>
            <Col>
            </Col>
            <Col>
              current
            </Col>
            <Col>
            </Col>
          </Row>
          <Row>
            <Col>
              junction
            </Col>
            <Col>
              {this.state.Vj}
            </Col>
            <Col>
              mV
            </Col>
            <Col>
              {this.state.Ij}
            </Col>
            <Col>
              mA
            </Col>
          </Row>
          <Row>
            <Col>
              magnet
            </Col>
            <Col>
              {this.state.Vmag}
            </Col>
            <Col>
              mV
            </Col>
            <Col>
              {this.state.Imag}
            </Col>
            <Col>
              mA
            </Col>
          </Row>
        </legend>
      </fieldset>
    );
  }
}

export default SIS;
