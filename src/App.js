import React, { Component } from 'react';
//import logo from './logo.svg';
import SpaceCenter from './SpaceCenter.js';
import './App.css';

class App extends Component {
	
	
	render() {
		return (
			<div className="App">
				{/*
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>HAVEN</h2>
				</div>
				*/}
				<SpaceCenter ></SpaceCenter>
			</div>
		);
	}
}

export default App;
