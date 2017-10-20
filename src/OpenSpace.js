import React from 'react';

class OpenSpace extends React.Component {
	render () {
		let borderStatus = Math.floor((this.props.border - 50) * 2);
		let textColor = 'grey';
		if (borderStatus > 0)
			textColor = '#19cefb';
		else if (borderStatus < 0)
			textColor = '#fb1919';
		
		return (
			<div className="OpenSpace">
				<span className="Centerer"></span>
				<div className="SpaceAreaBlue" style={{"width" : (this.props.border) + '%'}}></div>
				<div className="SpaceAreaRed" style={{"width" :  (100 - this.props.border) + '%'}}></div>
				<div className="SpaceBorderMiddle"></div>
				<div className="SpaceBorder" style={{"left" : (this.props.border) + '%'}}>
					<p className="BorderText" style={{"color" : textColor}}>
						{Math.abs(borderStatus).toString()}
					</p>
				</div>
			</div>
		);
	}
}

export default OpenSpace;