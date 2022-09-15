import './App.css';
import React from 'react';
import Polarization from './components/Polarization'
import LO from './components/LO'
import { Row, Col, Container } from "react-bootstrap";
const axios = require('axios').default
axios.defaults.baseURL = 'http://localhost:8000';

function App() {
  return (
    <Container fluid className="App">
      <header className="App-header">
        Cold Cartridge
        <Row>
          <Col><Polarization pol="0"/></Col>
          <Col><Polarization pol="1"/></Col>
        </Row>
        Local Oscillator
        <Row>
          <LO/>
        </Row>
      </header>
    </Container>
  );
}

export default App;
