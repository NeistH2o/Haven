import React from 'react';

class Interface extends React.Component {
	constructor (props) {
		super (props);
		this.handleStart_solo = this.handleStart_solo.bind(this);
		this.handleStart_multi = this.handleStart_multi.bind(this);
		this.handleStart_ai = this.handleStart_ai.bind(this);
		this.handleSpawn = this.handleSpawn.bind(this);
	}
	
	handleStart_solo () {
		this.props.startGame('solo');
	}
	
	handleStart_multi () {
		this.props.startGame('multi');
	}
	
	handleStart_ai () {
		this.props.startGame('ai');
	}
	
	handleSpawn (team, type) {
		this.props.spawn(team, type);
	}
	
	render () {
		return (
			<div className="Interface" style={{"top": (this.props.top + 20).toString() + 'px'}}>
				{this.props.started ? this.props.winner === 'none' ? this.MenuUI_Started() : this.MenuUI_Ended() : this.MenuUI()}
				{this.props.started && this.props.winner === 'none' ? this.InGameUI() : ''}
			</div>
		);
	}
	
	MenuUI () {
		return (
			<div className="InterfaceConnection">
				{this.props.top === 400 ? '' : <img src="Title_big.jpg" alt="Title Haven" className="TitleImgBig" style={{"opacity": this.props.mode === 'ai' ? 1 : (1 - (this.props.top / 400)).toString()}}/>}
				<button className="Interface_MenuBtn_0" onClick={this.handleStart_solo} style={{"opacity": (1 - (this.props.top / 400)).toString()}}>Solo</button>
				<button className="Interface_MenuBtn_1" onClick={this.handleStart_multi} style={{"opacity": (1 - (this.props.top / 400)).toString()}}>Local Multiplayer</button>
				<button className="Interface_MenuBtn_2" onClick={this.handleStart_ai} style={{"opacity": (1 - (this.props.top / 400)).toString()}}>AI versus AI</button>
			</div>
		);
	}
	
	MenuUI_Started () {
		return (
			<div className="InterfaceConnection">
				{this.props.top === 400 && this.props.mode !== 'ai' ? '' : <img src="Title_big.jpg" alt="Title Haven" className="TitleImgBig" style={{"opacity": this.props.mode === 'ai' ? 1 : (1 - (this.props.top / 400)).toString()}}/>}
				<button className="Interface_MenuBtn_0" onClick={this.handleStart_solo} style={{"opacity": this.props.opacity.toString()}}>{this.props.mode === 'solo' ? "Surrender" : "Stop Battle"}</button>
			</div>
		);
	}
	
	MenuUI_Ended () {
		let looser_color = 'red';
		if (this.props.winner === 'red')
			looser_color = 'blue';
		
		return (
			<div className="InterfaceConnection">
				<div className="TitleImgBig">
					<p className="WinnerText" style={{"color": this.props.winner}}>{this.props.winner.toUpperCase()} team WINS<br/><span style={{"color": looser_color}}>gg wp</span></p>
				</div>
				<button className="Interface_MenuBtn_0" onClick={this.handleStart_solo} style={{"opacity": this.props.opacity.toString()}}>Return to Main Menu</button>
			</div>
		);
	}
	
	InGameUI () {
		
		let blueCruiser_Btn = '';
		let blueHarvester_Btn = '';
		let blue_asteroidCount = 0;
		let blue_cruiserCount = 0;
		let blue_harvesterCount = 0;
		
		let redCruiser_Btn = '';
		let redHarvester_Btn = '';
		let red_asteroidCount = 0;
		let red_cruiserCount = 0;
		let red_harvesterCount = 0;
		if (this.props.started)
		{
			if (this.props.mode === 'multi')
			{
				blueCruiser_Btn = <button onClick={() => this.handleSpawn('blue', 'Cruiser')}>launch blue Cruiser - 250</button>;
				blueHarvester_Btn = <button onClick={() => this.handleSpawn('blue', 'Harvester')}>launch blue Harvester - 100</button>;
			}
			
			redCruiser_Btn = <button onClick={() => this.handleSpawn('red', 'Cruiser')}>launch red Cruiser - 250</button>;
			redHarvester_Btn = <button onClick={() => this.handleSpawn('red', 'Harvester')}>launch red Harvester - 100</button>;
		}
		
		
		if (this.props.mode === 'multi')
		{
			this.props.asteroids.forEach((asteroid) => {
				if (asteroid.team === 'blue')
					blue_asteroidCount++;
			});
			
			
			this.props.earth.ships.forEach((ship) => {
				if (ship.type === 'Cruiser')
					blue_cruiserCount++;
				else if (ship.type === 'Harvester')
					blue_harvesterCount++;
			});
		}
		
		
		this.props.asteroids.forEach((asteroid) => {
			if (asteroid.team === 'red')
				red_asteroidCount++;
		});
		
		this.props.mars.ships.forEach((ship) => {
			if (ship.type === 'Cruiser')
				red_cruiserCount++;
			else if (ship.type === 'Harvester')
				red_harvesterCount++;
		});
		
		if (this.props.mode === 'solo')
		{
			return (
				<div className="Interface_sub" style={{"opacity": this.props.opacity.toString()}}>
					{this.Interface_red(redCruiser_Btn, redHarvester_Btn, red_asteroidCount, red_cruiserCount, red_harvesterCount)}
				</div>
			);
		}
		else if (this.props.mode === 'multi')
		{
			return (
				<div className="Interface_sub" style={{"opacity": this.props.opacity.toString()}}>
					{this.Interface_blue(blueCruiser_Btn, blueHarvester_Btn, blue_asteroidCount, blue_cruiserCount, blue_harvesterCount)}
					{this.Interface_red(redCruiser_Btn, redHarvester_Btn, red_asteroidCount, red_cruiserCount, red_harvesterCount)}
				</div>
			);
		}
		else
		{
			return (
				<div className="Interface_sub" style={{"opacity": this.props.opacity.toString()}}>
				</div>
			);
		}
	}
	
	Interface_blue(Cruiser_Btn, Harvester_Btn, asteroidCount, cruiserCount, harvesterCount) {
		return (
			<div className="InterfaceBlue">
				<table>
					<tr>
						<td>Ore: {this.props.earth.resources}</td>
						<td>Harvesters: {harvesterCount} / {asteroidCount * 3}</td>
						<td>Cruisers: {cruiserCount} / 20</td>
					</tr>
				</table>
				{Cruiser_Btn}
				{Harvester_Btn}
			</div>
		);
	}
	
	Interface_red(Cruiser_Btn, Harvester_Btn, asteroidCount, cruiserCount, harvesterCount) {
		return (
			<div className="InterfaceRed">
				<table>
					<tr>
						<td>Ore: {this.props.mars.resources}</td>
						<td>Harvesters: {harvesterCount} / {asteroidCount * 3}</td>
						<td>Cruisers: {cruiserCount} / 20</td>
					</tr>
				</table>
				{Cruiser_Btn}
				{Harvester_Btn}
			</div>
		);
	}
}

export default Interface;