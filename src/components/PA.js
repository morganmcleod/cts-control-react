import './components.css'
import React from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
const axios = require('axios').default

class PA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      VDp0: 0.0,
      VDp1: 0.0,
      IDp0: 0.0,
      IDp1: 0.0,
      VGp0: 0.0,
      VGp1: 0.0,
      supply3V: 0.0, 
      supply5V: 0.0,
      inputVDp0: "",
      inputVDp1: "",
      inputVGp0: "",
      inputVGp1: ""
    };
    this.interval = props.interval ?? 5000;
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
    axios.get("/lo/pa")
      .then(res => {
        const pa = res.data;
        this.setState({
          VDp0: pa.VDp0,
          VDp1: pa.VDp1,
          IDp0: pa.IDp0,
          IDp1: pa.IDp1,
          VGp0: pa.VGp0,
          VGp1: pa.VGp1,
          supply3V: pa.supply3V, 
          supply5V: pa.supply5V
        })
        if (this.state.inputVGp0 === "") {
          this.setState({
            inputVGp0: pa.VGp0,
            inputVGp1: pa.VGp1
          })
        }
      })
  }
  setPAHandler(pol) {
    const params = {
      pol: pol,
      VDControl: Number((pol === 0) ? this.state.inputVDp0 : this.state.inputVDp1),
      VG: Number((pol === 0) ? this.state.inputVGp0 : this.state.inputVGp1)
    }
    axios.put("/lo/pa/bias", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
      })
  }
  render() {
    let setP0Props = {
      size: 'sm',
      onClick: event => this.setPAHandler(0)
    }
    let setP1Props = {
      size: 'sm',
      onClick: event => this.setPAHandler(1)
    }
    return (
      <Container className="component-data">
        <Row>
          <Col className="component-header">Power Amp</Col>
        </Row>
        <Row>
          <Col></Col>
          <Col className="component-title">VD</Col>
          <Col className="component-title">VG</Col>
          <Col className="component-title">ID [mA]</Col>
        </Row>
        <Row>
          <Col className="component-title">Pol0:</Col>
          <Col>{this.state.VDp0}</Col>
          <Col>{this.state.VGp0}</Col>
          <Col>{this.state.IDp0}</Col>
        </Row>
        <Row>
          <Col className="component-title">Pol1:</Col>
          <Col>{this.state.VDp1}</Col>
          <Col>{this.state.VGp1}</Col>
          <Col>{this.state.IDp1}</Col>
        </Row>
        <Row>
          <Col className="component-title">Pol0:</Col>
          <Col><
            input type="text" 
            name="set_VDp0" 
            className="component-input"
            onChange={event => {this.setState({inputVDp0: event.target.value})}}
            value={this.state.inputVDp0}
            />
          </Col>
          <Col><
            input type="text" 
            name="set_VGp0" 
            className="component-input"
            onChange={event => {this.setState({inputVGp0: event.target.value})}}
            value={this.state.inputVGp0}
            />
          </Col>
          <Col>
            <Button
              className="custom-btn"
              {...setP0Props}
            >SET</Button>
          </Col>          
        </Row>
        <Row>
          <Col className="component-title">Pol1:</Col>
          <Col><
            input type="text" 
            name="set_VDp1" 
            className="component-input"
            onChange={event => {this.setState({inputVDp1: event.target.value})}}
            value={this.state.inputVDp1}
            />
          </Col>
          <Col><
            input type="text" 
            name="set_VGp1" 
            className="component-input"
            onChange={event => {this.setState({inputVGp1: event.target.value})}}
            value={this.state.inputVGp1}
            />
          </Col>
          <Col>
            <Button
              className="custom-btn"
              {...setP1Props}
            >SET</Button>
          </Col>          
        </Row>
        <div className ="spacer"></div>
        <Row>
          <Col className="component-title">3V&nbsp;supply:</Col>
          <Col>{this.state.supply3V}</Col>
          <Col className="component-title">5V&nbsp;supply:</Col>
          <Col>{this.state.supply5V}</Col>
        </Row>
      </Container>
    );
  }
}
export default PA;