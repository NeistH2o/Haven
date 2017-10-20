import React from 'react';

class Asteroid extends React.Component {
	render () {
		let img_asteroid = 'asteroid_' + this.props.info.img + '.png';
		let img_flag = 'flag_neutral.png';
		let harvesters = 0;
		
		if (this.props.info.team === 'blue')
		{
			img_flag = 'flag_blue.png';
			harvesters = Math.min(Math.max(3 - ((3 + (this.props.info.id * 3)) - this.props.blueHarvesters), 0), 3);
		}
		else if (this.props.info.team === 'red')
		{
			img_flag = 'flag_red.png';
			harvesters = Math.min(Math.max(3 - ((3 + ((7 - this.props.info.id) * 3)) - this.props.redHarvesters), 0), 3);
		}
		
		return (
			<div className="Asteroid" style={{"left": this.props.info.posX.toString() + '%', "top": this.props.info.posY.toString() + '%'}}>
				<img src={img_asteroid} alt="asteroid" className="AsteroidImg" />
				<img src={img_flag} alt="flag" className="AsteroidFlag" />
				<p className="AsteroidText">{harvesters.toString() + " / 3"}</p>
			</div>
		);
	}
}

export default Asteroid;