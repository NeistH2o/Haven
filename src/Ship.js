import React from 'react';

class Ship extends React.Component {
	render () {
		let img = this.props.info.type + "_" + this.props.info.team + ".png";
		let css = "Ship_" + this.props.info.type + "_" + this.props.info.team;
		let line_cannon = '';
		let line_healthBar = '';
		let line_cargo = '';
		let line_firing = '';
		if (this.props.info.type === 'Cruiser')
		{
			line_cannon = <img src="CruiserCannon_blue.png" alt="cannon" className="Ship_Cannon" style={{"opacity" : this.props.info.firing ? 1 : 1 - (this.props.info.fireCooldown / 35)}}/>;
			line_healthBar = <div className="Ship_HealthBar" style={{"backgroundColor" : '#19cefb', "width" : Math.floor((this.props.info.hp / this.props.info.hpMax) * 22).toString() + 'px'}}></div>;
		}
		else if (this.props.info.type === 'Harvester')
		{
			if (this.props.info.cargo)
			{
				line_cargo = <img src="HarvesterCargo.png" alt="ship" className="Ship_Cargo"/>;
				css += "_reversed";
			}
		}
		
		if (this.props.info.firing)
			line_firing = <div className="CruiserFiring" ></div>;
		
		if (this.props.info.team === 'red')
		{
			if (this.props.info.type === 'Cruiser')
			{
				line_cannon = <img src="CruiserCannon_red.png" alt="cannon" className="Ship_Cannon" style={{"opacity" : this.props.info.firing ? 1 : 1 - (this.props.info.fireCooldown / 35)}}/>;
				line_healthBar = <div className="Ship_HealthBar" style={{"backgroundColor" : '#fb1919', "width" : Math.floor((this.props.info.hp / this.props.info.hpMax) * 22).toString() + 'px'}}></div>;
			}
		}
		
		return (
			<div className={css} id={this.props.info.id} style={{"left" : this.props.info.posX.toString() + '%', "top" : this.props.info.posY.toString() + '%'}}>
				<img src={img} alt="ship"/>
				{line_healthBar}
				{line_cannon}
				<img src={this.props.info.type + "Thruster.png"} alt="thruster" className={"Ship_" + this.props.info.type + "_Thruster"}/>
				{line_cargo}
				{line_firing}
			</div>
		);
	}
}

export default Ship;