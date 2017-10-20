import React from 'react';

class ExplosionFX extends React.Component {
	render () {
		//let tmp_posX = this.props.posX.toString();
		//let tmp_posY = this.props.posY.toString();
		
		return (
			<div key={"explosion" + this.props.id.toString() + this.props.posX.toString() + this.props.posY.toString()} className="explosionA" style={{
				"left": this.props.posX.toString() + "%",
				"top": this.props.posY.toString() + "%"}}>
			</div>
			/*
			<img src="explosion_a.gif" alt="explosion" key={"explosion" + this.props.id.toString() + tmp_posX + tmp_posY} className="explosionA" style={{
				"left": tmp_posX + "%",
				"top": tmp_posY + "%"
			}}/>
			*/
		);
	}
}

export default ExplosionFX;