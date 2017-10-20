import React from 'react';

class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clockText: '',
			dateText: '',
			tock: false
		};
	}
	
	componentDidMount() {
		this.tick();
		this.intervalID = setInterval(
			() => this.tick(),
			1000
		);
	}
	
	componentWillUnmount() {
		clearInterval(this.intervalID);
	}
	
	tick() {
		let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let date = new Date();
		
		var hr = date.getHours();
		var ampm = " am";
		var min = date.getMinutes();
		var dots = ':';

		if( hr > 12 ) {
			hr -= 12;
			ampm = " pm";
		}
		
		if (min < 10) {
			min = "0" + min;
		}
		
		if (!this.state.tock)
			dots = ' ';
		
		this.setState({
			clockText: hr + dots + min + ampm,
			dateText: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear(),
			tock: !this.state.tock
		});
	}
	
	render() {
		// 
		return (
			<p className="Header_left">
				{this.state.dateText} &#x1F557; {this.state.clockText}
			</p>
		);
	}
}

export default Clock;