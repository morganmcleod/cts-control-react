import './components.css'
import React from "react";
import { Row, Col, Container, Button, ToggleButton } from "react-bootstrap";
const axios = require('axios').default

class PLL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputLOFreq: "",
      isLocking: false,
      lockButtonText: "LOCK",
      lockButtonVariantiant: "primary"
    }
    this.interval = props.interval ?? 5000;
    this.timer = 0;
    this.handleTimer = this.handleTimer.bind(this);
    this.lockTimer = 0;
    this.handleLockTimer = this.handleLockTimer.bind(this);
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
    axios.get(`/lo/pll`)
      .then(res => {
        const yto = res.data;
        this.setState(yto);
      })
    axios.get('/lo/pll/config')
    .then(res => {
      const config = res.data;
      this.setState(config);
    })
  }
  lockHandler() {
    if (this.state.isLocking)
      return;
    this.setState({
      isLocking: true,
      lockButtonText: "LOCKING...",
      lockButtonVariantiant: "warning"
    });
    const params = {
      freqLOGHz: Number(this.state.inputLOFreq),
      coldMultipler: 3
    }
    axios.put("/lo/pll/lock", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
        if (result.success) {
          this.setState({
            lockButtonText: "SUCCESS",
            lockButtonVariantiant: "success"
          });
        } else {
          this.setState({
            lockButtonText: "FAILED",
            lockButtonVariantiant: "danger"
          });
        }
        this.lockTimer = setInterval(this.handleLockTimer, 1500);
      })
  }
  handleLockTimer() {
    clearInterval(this.lockTimer);
    this.lockTimer = 0;
    this.setState({
      lockButtonText: "LOCK",
      lockButtonVariantiant: "primary",
      isLocking: false
    });
  }
  clearUnlockHandler() {
    axios.put("/lo/pll/clearunlock")
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
      })
  }
  pllAdjustHandler() {
    const params = {
      targetCV: 0.0
    }
    axios.put("/lo/pll/adjust", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
      })
  }
  setNullHandler(checked) {
    const params = {
      enable: checked
    }
    axios.put("/lo/pll/nullintegrator", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.setState({nullPLL: params.enable})
        this.fetch();
      })
  }
  setLoopBWHandler(checked) {
    const params = {
      loopBW: checked ? 1 : 0
    }
    axios.put("/lo/pll/config", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.setState({loopBW: params.loopBW})
      })
  }
  setLockSBHandler(checked) {
    const params = {
      lockSB: checked ? 1 : 0
    }
    axios.put("/lo/pll/config", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.setState({lockSB: params.lockSB})
      })
  }
  render() {
    let lockIndicateVariant = (this.state.isLocked) ? "success" : "danger";
    let lockIndicateText = (this.state.isLocked) ? "LOCK" : "UNLOCK";
    let unlockDetectVariant = (!this.state.unlockDetected && this.state.isLocked) ? "success" : "danger";
    let unlockDetectText = (!this.state.unlockDetected && this.state.isLocked) ? "OK" : "UNLOCK";
    let nullVariant = (!this.state.nullPLL) ? "success" : "danger";
    let nullText = (!this.state.nullPLL) ? "NORMAL" : "NULL";
    let loopBWText = (!this.state.loopBW) ? "7.5" : "15";
    let lockSBText = (!this.state.lockSB) ? "BELOW" : "ABOVE";
    let lockProps = {
      size: 'sm',
      onClick: event => this.lockHandler()
    }
    let clearUnlockProps = {
      size: 'sm',
      onClick: event => this.clearUnlockHandler()
    }
    let pllAdjustProps = {
      size: 'sm',
      onClick: event => this.pllAdjustHandler()
    }
    return (
      <Container className="component-data">
        <Row>
          <Col className="component-header">PLL</Col>
        </Row>
        <Row xs={5}>
          <Col xs={4}>
            <Button 
              variant={lockIndicateVariant}
              className="custom-btn"
              size="sm"
              disabled
            >{lockIndicateText}</Button>
          </Col>
          <Col><
            input type="text" 
            name="loFreq" 
            className="component-input"
            onChange={event => {this.setState({inputLOFreq: event.target.value})}}
            value={this.state.inputLOFreq}
            /></Col>
          <Col>GHz</Col>
          <Col>
            <Button 
              variant = {this.state.lockButtonVariantiant}
              className="custom-lock-btn"
              {...lockProps}
            >{this.state.lockButtonText}</Button>
          </Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">Unlock seen:</Col>
          <Col>
            <Button 
              variant={unlockDetectVariant}
              className="custom-btn"
              size="sm"
              disabled 
            >{unlockDetectText}</Button>
          </Col>
          <Col></Col>
          <Col><Button className="custom-lock-btn" size="sm" {...clearUnlockProps}>CLEAR</Button></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">Correction:</Col>
          <Col>{this.state.corrV}&nbsp;V</Col>
          <Col></Col>
          <Col><Button className="custom-lock-btn" size="sm" {...pllAdjustProps}>ADJUST</Button></Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">Ref Tot Pwr:</Col>
          <Col>{this.state.refTP}</Col>
          <Col>PLL:</Col>
          <Col>
            <ToggleButton
              className="custom-lock-btn" 
              id="nullPLL"
              size="sm"
              type="checkbox"
              variant={nullVariant}
              checked={this.state.nullPLL}
              onChange={(event) => {this.setNullHandler(!this.state.nullPLL)}}
            >{nullText}</ToggleButton>
          </Col>        
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">IF Tot Pwr:</Col>
          <Col>{this.state.IFTP}</Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">Temperature:</Col>
          <Col>{this.state.temperature}&nbsp;C</Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">Loop BW:</Col>
          <Col>
            <ToggleButton
              className='custom-btn'
              id="loopBW"
              size="sm"
              type="checkbox"
              variant="info"
              checked={this.state.loopBW}
              onChange={(e) => this.setLoopBWHandler(1 - this.state.loopBW)}
            >{loopBWText}</ToggleButton>
          </Col>
          <Col xs={4}>MHz / Volt</Col>
        </Row>
        <Row xs={5}>
          <Col xs={4} className="component-title">Lock SB:</Col>
          <Col md="auto">
            <ToggleButton
              className='custom-btn'
              style={{width: "65px"}}
              id="lockSB"
              size="sm"
              type="checkbox"
              variant="info"
              checked={this.state.lockSB}
              onChange={(e) => this.setLockSBHandler(1 - this.state.lockSB)}
            >{lockSBText}</ToggleButton>
          </Col>
          <Col xs={4}>Ref.</Col>
        </Row>
      </Container>
    );
  }
};

// "/pll/config"
export default PLL;