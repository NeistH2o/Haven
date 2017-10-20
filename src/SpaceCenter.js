import React from 'react';
import OpenSpace from './OpenSpace.js';
import Asteroid from './Asteroid.js';
import Ship from './Ship.js';
import ExplosionFX from './ExplosionFX.js';
import Interface from './Interface.js';
import Clock from './Clock.js';

class SpaceCenter extends React.Component {
	constructor (props) {
		super (props);
		this.startGame = this.startGame.bind(this);
		this.cruiserFire = this.cruiserFire.bind(this);
		this.cruiserFireEnd = this.cruiserFireEnd.bind(this);
		this.laserRoutine = this.laserRoutine.bind(this);
		this.laserEnd = this.laserEnd.bind(this);
		this.spawnShip = this.spawnShip.bind(this);
		this.update = this.update.bind(this);
		this.updateAI = this.updateAI.bind(this);
		this.updateBlue = this.updateBlue.bind(this);
		this.updateRed = this.updateRed.bind(this);
		this.shipTakeDamage = this.shipTakeDamage.bind(this);
		this.ExplosionStart = this.ExplosionStart.bind(this);
		this.ExplosionEnd = this.ExplosionEnd.bind(this);
		
		this.state = {
			battleStarted: false,
			battleMode: 'solo',
			winner: 'none',
			UI_openFactor: 0,
			UI_opacity: 0,
			mars: {hp: 1000, hpMax: 1000, resources: 500, ships: [], harvesterCount: 0, cruiserCount: 0},
			earth: {hp: 1000, hpMax: 1000, resources: 500, ships: [], harvesterCount: 0, cruiserCount: 0},
			border: 50,
			lasers: [],
			explosions: [],
			asteroids: [{id: 0, img: Math.floor(Math.random() * 2), posX: 13, posY: 80, team: 'neutral'},
						{id: 1, img: Math.floor(Math.random() * 2), posX: 13, posY: 20, team: 'neutral'},
						{id: 2, img: Math.floor(Math.random() * 2), posX: 30, posY: 50, team: 'neutral'},
						{id: 3, img: Math.floor(Math.random() * 2), posX: 45, posY: 50, team: 'neutral'},
						{id: 4, img: Math.floor(Math.random() * 2), posX: 55, posY: 50, team: 'neutral'},
						{id: 5, img: Math.floor(Math.random() * 2), posX: 70, posY: 50, team: 'neutral'},
						{id: 6, img: Math.floor(Math.random() * 2), posX: 87, posY: 20, team: 'neutral'},
						{id: 7, img: Math.floor(Math.random() * 2), posX: 87, posY: 80, team: 'neutral'}]
		};
	}
	
	startGame (mode) {
		if (!this.state.battleStarted)
		{
			this.setState({battleMode: mode});
			let ship = {id: 0, team: 'blue', type:'Harvester', hp:1, hpMax:1, velocity:0, velocityMax:0.08, posX: 0, posY: Math.floor(Math.random() * 101), fireCooldown: 35, firing: false, asteroid: 0, cargo: false};
			this.setState({earth: {hp: 1000, hpMax:1000, resources: 500, ships: [ship], harvesterCount: 1, cruiserCount: 0}});
			ship = {id: 1, team: 'red', type:'Harvester', hp:1, hpMax:1, velocity:0, velocityMax:0.08, posX: 100, posY: Math.floor(Math.random() * 101), fireCooldown: 35, firing: false, asteroid: 7, cargo: false};
			this.setState({mars: {hp: 1000, hpMax:1000, resources: 500, ships: [ship], harvesterCount: 1, cruiserCount: 0}});

			this.state.asteroids.forEach((asteroid) => {
				var newState = {};
				if (asteroid.posX < this.state.border && asteroid.team !== 'blue')
				{
					asteroid.team = 'blue';
					newState[this.state.asteroids[asteroid.id].team] = asteroid.team;
					this.setState(newState);
				}
				else if (asteroid.posX > this.state.border && asteroid.team !== 'red')
				{
					asteroid.team = 'red';
					newState[this.state.asteroids[asteroid.id].team] = asteroid.team;
					this.setState(newState);
				}
			});
			
			this.setState({battleStarted: true, border: 50});
		}
		else
		{
			this.setState({earth: {hp: 1000, hpMax: 1000, resources: 500, ships: [], harvesterCount: 0, cruiserCount: 0}});
			this.setState({mars: {hp: 1000, hpMax: 1000, resources: 500, ships: [], harvesterCount: 0, cruiserCount: 0}});
			this.setState({battleStarted: false, border: 50, winner: 'none'});
			
			this.setState({asteroids: [{id: 0, img: Math.floor(Math.random() * 2), posX: 13, posY: 80, team: 'neutral'},
						{id: 1, img: Math.floor(Math.random() * 2), posX: 13, posY: 20, team: 'neutral'},
						{id: 2, img: Math.floor(Math.random() * 2), posX: 30, posY: 50, team: 'neutral'},
						{id: 3, img: Math.floor(Math.random() * 2), posX: 45, posY: 50, team: 'neutral'},
						{id: 4, img: Math.floor(Math.random() * 2), posX: 55, posY: 50, team: 'neutral'},
						{id: 5, img: Math.floor(Math.random() * 2), posX: 70, posY: 50, team: 'neutral'},
						{id: 6, img: Math.floor(Math.random() * 2), posX: 87, posY: 20, team: 'neutral'},
						{id: 7, img: Math.floor(Math.random() * 2), posX: 87, posY: 80, team: 'neutral'}]});
		
			this.setState({UI_opacity: 0});
		}
	}
	
	componentDidMount () {
		this.intervalID = setInterval(
			() => this.update(),
			10
		);
		this.intervalID = setInterval (
			() => this.updateAI(),
			2000
		);
		this.intervalID = setInterval(
			() => this.updateBlue(),
			10
		);
		this.intervalID = setInterval(
			() => this.updateRed(),
			10
		);
	}
	
	ClampNumber(value, min, max) {
		return (Math.min(Math.max(value, min), max));
	}
	
	update () {
		if (!this.state.battleStarted) {
			if (this.state.UI_openFactor > 0)
				this.setState({UI_openFactor: this.ClampNumber((this.state.UI_openFactor * 0.93) - 1, 0, 400)});
			return;
		}
		else if (this.state.UI_openFactor < 400)
			this.setState({UI_openFactor: this.ClampNumber((this.state.UI_openFactor * 1.07) + 1, 0, 400)});
		else
			this.setState({UI_opacity: this.ClampNumber(this.state.UI_opacity + 0.05, 0, 1)});
		
		if (this.state.winner !== 'none')
			return;
		
		let blueShipsAtBorder = [];
		let redShipsAtBorder = [];
		let borderProgress = 0;
		
		this.state.earth.ships.forEach((ship) => {
			if (ship.type === 'Cruiser' && ship.posX > (this.state.border - 12))
				blueShipsAtBorder.push(ship);
		});
		this.state.mars.ships.forEach((ship) => {
			if (ship.type === 'Cruiser' && ship.posX < (this.state.border + 12))
				redShipsAtBorder.push(ship);
		});
		
		if (blueShipsAtBorder.length + redShipsAtBorder.length > 0)
		{
			if (blueShipsAtBorder.length > 0 &&  redShipsAtBorder.length === 0)
				borderProgress = 0.0034;
			else if (redShipsAtBorder.length > 0 &&  blueShipsAtBorder.length === 0)
				borderProgress = -0.0034;
		
			if (borderProgress !== 0)
			{
				if (borderProgress > 0 || borderProgress < 0)
				{
					this.setState({border: this.ClampNumber(this.state.border + borderProgress, 0, 100)});
					this.state.asteroids.forEach((asteroid) => {
						var newState = {};
						if (asteroid.posX < this.state.border && asteroid.team !== 'blue')
						{
							if (asteroid.team === 'red')
							{
								this.state.mars.ships.forEach((ship) => {
									if (ship.asteroid === asteroid.id)
										this.shipTakeDamage(ship, 1000000);
								});
							}
							asteroid.team = 'blue';
							newState[this.state.asteroids[asteroid.id].team] = asteroid.team;
							this.setState(newState);
						}
						else if (asteroid.posX > this.state.border && asteroid.team !== 'red')
						{
							if (asteroid.team === 'blue')
							{
								this.state.earth.ships.forEach((ship) => {
									if (ship.asteroid === asteroid.id)
										this.shipTakeDamage(ship, 1000000);
								});
							}
							asteroid.team = 'red';
							newState[this.state.asteroids[asteroid.id].team] = asteroid.team;
							this.setState(newState);
						}
					});
				}
				
				if (this.state.border >= 100)
					this.setState({winner: 'blue'});
				else if (this.state.border <= 0)
					this.setState({winner: 'red'});
			}
		}
	}
	
	updateAI () {
		if (!this.state.battleStarted)
			return;
		if (this.state.winner !== 'none')
			return;
		if (this.state.battleMode === 'multi')
			return;
		
		let asteroidCount_blue = 0;
		this.state.asteroids.forEach((asteroid) => {
			if (asteroid.team === 'blue')
				asteroidCount_blue++;
		});
		
		if (this.state.earth.harvesterCount < asteroidCount_blue * 3)
		{
			if (this.state.earth.resources >= 100)
				this.spawnShip('blue', 'Harvester');
		}
		if (this.state.earth.resources >= 250 && this.state.earth.harvesterCount > (asteroidCount_blue * 3) / 2)
		{
			this.spawnShip('blue', 'Cruiser');
		}
		
		if (this.state.battleMode !== 'ai')
			return;
			
		let asteroidCount_red = 0;
		this.state.asteroids.forEach((asteroid) => {
			if (asteroid.team === 'red')
				asteroidCount_red++;
		});
		
		if (this.state.mars.harvesterCount < asteroidCount_red * 3)
		{
			if (this.state.mars.resources >= 100)
				this.spawnShip('red', 'Harvester');
		}
		if (this.state.mars.resources >= 250 && this.state.mars.harvesterCount > (asteroidCount_red * 3) / 2)
		{
			this.spawnShip('red', 'Cruiser');
		}
	}
	
	updateBlue () {
		if (!this.state.battleStarted)
			return;
		if (this.state.winner !== 'none')
			return;
		
		let blueShipsAtRange = [];
		let redShipsAtRange = [];
		var newState = {};
		
		this.state.mars.ships.forEach((ship) => {
			if (ship.type === 'Cruiser' && ship.posX < (this.state.border + 20))
				redShipsAtRange.push(ship);
		});
		
		this.state.earth.ships.forEach((ship) => {
			if (ship.type === 'Cruiser')
			{
				if (ship.posX < (this.state.border - 10)) {
					if (ship.velocity < ship.velocityMax) {
						ship.velocity += ship.velocityMax / 100;
						newState[this.state.earth.ships.indexOf(ship).velocity] = ship.velocity;
					}
				}
				else if (ship.velocity > 0) {
					ship.velocity -= ship.velocityMax / 100;
					newState[this.state.earth.ships.indexOf(ship).velocity] = ship.velocity;
				}
				
				if (ship.fireCooldown > 0) {
					if (!ship.firing) {
						ship.fireCooldown -= 0.1;
						newState[this.state.earth.ships.indexOf(ship).fireCooldown] = ship.fireCooldown;
					}
				}
				else if (ship.posX > (this.state.border - 20))
					blueShipsAtRange.push(ship);
			}
			else if (ship.type === 'Harvester')
			{
				if (ship.asteroid !== undefined && ship.asteroid >= 0 && ship.asteroid < this.state.asteroids.length)
				{
					if (!ship.cargo)
					{
						if (ship.posY < (this.state.asteroids[ship.asteroid].posY - 2)) {
							ship.posY += 0.1;
							newState[this.state.earth.ships.indexOf(ship).posY] = ship.posY;
						}
						else if (ship.posY > (this.state.asteroids[ship.asteroid].posY + 2)) {
							ship.posY -= 0.1;
							newState[this.state.earth.ships.indexOf(ship).posY] = ship.posY;
						}
						
						if (ship.posX < (this.state.asteroids[ship.asteroid].posX - 6)) {
							if (ship.velocity < ship.velocityMax) {
								ship.velocity += ship.velocityMax / 100;
								newState[this.state.earth.ships.indexOf(ship).velocity] = ship.velocity;
							}
						}
						else if (ship.velocity > 0) {
							ship.velocity -= ship.velocityMax / 100;
							newState[this.state.earth.ships.indexOf(ship).velocity] = ship.velocity;
						}
						else
						{
							ship.velocity = 0;
							newState[this.state.earth.ships.indexOf(ship).velocity] = ship.velocity;
							ship.cargo = true;
							newState[this.state.earth.ships.indexOf(ship).cargo] = ship.cargo;
						}
					}
					else
					{
						if (ship.posY < 48) {
							ship.posY += 0.1;
							newState[this.state.earth.ships.indexOf(ship).posY] = ship.posY;
						}
						else if (ship.posY > 52) {
							ship.posY -= 0.1;
							newState[this.state.earth.ships.indexOf(ship).posY] = ship.posY;
						}
						
						if (ship.posX > 6) {
							if (ship.velocity > -ship.velocityMax) {
								ship.velocity -= ship.velocityMax / 100;
								newState[this.state.earth.ships.indexOf(ship).velocity] = ship.velocity;
							}
						}
						else if (ship.velocity < 0) {
							ship.velocity += ship.velocityMax / 100;
							newState[this.state.earth.ships.indexOf(ship).velocity] = ship.velocity;
						}
						else
						{
							ship.velocity = 0;
							newState[this.state.earth.ships.indexOf(ship).velocity] = ship.velocity;
							this.state.earth.resources += 20;
							newState[this.state.earth.resources] = this.state.earth.resources;
							ship.cargo = false;
							newState[this.state.earth.ships.indexOf(ship).cargo] = ship.cargo;
						}
					}
				}
			}
			
			if (ship.velocity !== 0) {
				ship.posX += ship.velocity;
				newState[this.state.earth.ships.indexOf(ship).posX] = ship.posX;
			}
		});
		
		if (blueShipsAtRange.length > 0 && redShipsAtRange.length > 0)
		{
			blueShipsAtRange.forEach((ship) => {
				let tmp_target = redShipsAtRange[Math.floor(Math.random() * redShipsAtRange.length)];
				ship.firing = true;
				newState[this.state.earth.ships[this.state.earth.ships.indexOf(ship)].firing] = ship.firing;
				ship.fireCooldown = 30 + (Math.random() * 5);
				newState[this.state.earth.ships[this.state.earth.ships.indexOf(ship)].fireCooldown] = ship.fireCooldown;
				this.cruiserFire(ship, tmp_target);
			});
		}
		
		this.setState(newState);
	}
	
	updateRed() {
		if (!this.state.battleStarted)
			return;
		if (this.state.winner !== 'none')
			return;
		
		let blueShipsAtRange = [];
		let redShipsAtRange = [];
		var newState = {};
		
		this.state.earth.ships.forEach((ship) => {
			if (ship.type === 'Cruiser' && ship.posX > (this.state.border - 20))
				blueShipsAtRange.push(ship);
		});
		
		this.state.mars.ships.forEach((ship) => {
			if (ship.type === 'Cruiser') {
				if (ship.posX > (this.state.border + 10)) {
					if (ship.velocity < ship.velocityMax) {
						ship.velocity += ship.velocityMax / 100;
						newState[this.state.mars.ships.indexOf(ship).velocity] = ship.velocity;
					}
				}
				else if (ship.velocity > 0) {
					ship.velocity -= ship.velocityMax / 100;
					newState[this.state.mars.ships.indexOf(ship).velocity] = ship.velocity;
				}
				
				if (ship.fireCooldown > 0) {
					if (!ship.firing) {
						ship.fireCooldown -= 0.1;
						newState[this.state.mars.ships.indexOf(ship).fireCooldown] = ship.fireCooldown;
					}
				}
				else if (ship.posX < (this.state.border + 20))
					redShipsAtRange.push(ship);
			}
			else if (ship.type === 'Harvester')
			{
				if (ship.asteroid !== undefined && ship.asteroid >= 0 && ship.asteroid < this.state.asteroids.length)
				{
					if (!ship.cargo)
					{
						if (ship.posY < (this.state.asteroids[ship.asteroid].posY - 2)) {
							ship.posY += 0.1;
							newState[this.state.mars.ships.indexOf(ship).posY] = ship.posY;
						}
						else if (ship.posY > (this.state.asteroids[ship.asteroid].posY + 2)) {
							ship.posY -= 0.1;
							newState[this.state.mars.ships.indexOf(ship).posY] = ship.posY;
						}
						
						if (ship.posX > (this.state.asteroids[ship.asteroid].posX + 6)) {
							if (ship.velocity < ship.velocityMax) {
								ship.velocity += ship.velocityMax / 100;
								newState[this.state.mars.ships.indexOf(ship).velocity] = ship.velocity;
							}
						}
						else if (ship.velocity > 0) {
							ship.velocity -= ship.velocityMax / 100;
							newState[this.state.mars.ships.indexOf(ship).velocity] = ship.velocity;
						}
						else
						{
							ship.velocity = 0;
							newState[this.state.mars.ships.indexOf(ship).velocity] = ship.velocity;
							ship.cargo = true;
							newState[this.state.mars.ships.indexOf(ship).cargo] = ship.cargo;
						}
					}
					else
					{
						if (ship.posY < 48) {
							ship.posY += 0.1;
							newState[this.state.mars.ships.indexOf(ship).posY] = ship.posY;
						}
						else if (ship.posY > 52) {
							ship.posY -= 0.1;
							newState[this.state.mars.ships.indexOf(ship).posY] = ship.posY;
						}
						
						if (ship.posX < 94) {
							if (ship.velocity > -ship.velocityMax) {
								ship.velocity -= ship.velocityMax / 100;
								newState[this.state.mars.ships.indexOf(ship).velocity] = ship.velocity;
							}
						}
						else if (ship.velocity < 0) {
							ship.velocity += ship.velocityMax / 100;
							newState[this.state.mars.ships.indexOf(ship).velocity] = ship.velocity;
						}
						else
						{
							ship.velocity = 0;
							newState[this.state.mars.ships.indexOf(ship).velocity] = ship.velocity;
							this.state.mars.resources += 20;
							newState[this.state.mars.resources] = this.state.mars.resources;
							ship.cargo = false;
							newState[this.state.mars.ships.indexOf(ship).cargo] = ship.cargo;
						}
					}
				}
			}
			
			if (ship.velocity !== 0) {
				ship.posX -= ship.velocity;
				newState[this.state.mars.ships.indexOf(ship).posX] = ship.posX;
			}
		});
		
		if (blueShipsAtRange.length > 0 && redShipsAtRange.length > 0) {
			redShipsAtRange.forEach((ship) => {
				let tmp_target = blueShipsAtRange[Math.floor(Math.random() * blueShipsAtRange.length)];
				ship.firing = true;
				newState[this.state.mars.ships[this.state.mars.ships.indexOf(ship)].firing] = ship.firing;
				ship.fireCooldown = 30 + (Math.random() * 5);
				newState[this.state.mars.ships[this.state.mars.ships.indexOf(ship)].fireCooldown] = ship.fireCooldown;
				this.cruiserFire(ship, tmp_target);
			});
		}
		
		this.setState(newState);
	}
	
	cruiserFire (source, target) {
		setTimeout(this.cruiserFireEnd, 700, source, target);
	}
	
	cruiserFireEnd (source, target) {
		let defined = false;
		var newState = {};
		
		source.firing = false;
		if (source.team === 'blue') {
			if (this.state.earth.ships[this.state.earth.ships.indexOf(source)] !== undefined) {
				newState[this.state.earth.ships[this.state.earth.ships.indexOf(source)].firing] = source.firing;
				defined = true;
			}
		}
		else {
			if (this.state.mars.ships[this.state.mars.ships.indexOf(source)] !== undefined) {
				newState[this.state.mars.ships[this.state.mars.ships.indexOf(source)].firing] = source.firing;
				defined = true;
			}
		}
		
		if (defined) {
			this.setState(newState);
			this.laserRoutine(source, target);
		}
	}
	
	laserRoutine(source, target) {
		let sourceElem = document.getElementById(source.id);
		let targetElem = document.getElementById(target.id);

		if (sourceElem === null || targetElem === null)
			return;
		
		let sourceCenter = [sourceElem.offsetLeft + (sourceElem.offsetWidth / 2), sourceElem.offsetTop + (sourceElem.offsetHeight / 2)];
		let targetCenter = [targetElem.offsetLeft + (targetElem.offsetWidth / 2), targetElem.offsetTop + (targetElem.offsetHeight / 2)];

		let dist = Math.sqrt(Math.pow((targetCenter[0] - sourceCenter[0]), 2) + Math.pow((targetCenter[1] - sourceCenter[1]), 2));
		
		let angle = Math.atan2(sourceCenter[0] - targetCenter[0], - (sourceCenter[1] - targetCenter[1]) ) * (180 / Math.PI);
		
		var laser = <div key={"laser" + source.id.toString() + target.id.toString() + angle.toString()} className={"laser_" + source.team} style={{
				"left": (sourceCenter[0] + (source.team === 'blue' ? -(sourceElem.offsetWidth / 6) : (-sourceElem.offsetWidth + sourceElem.offsetWidth / 6))) + 'px',
				"top": (sourceCenter[1] - (sourceElem.offsetHeight / 2)) + 'px',
				"height": dist + 'px',
				"WebkitTransform": 'rotate(' + angle + 'deg)',
				"transform": 'rotate(' + angle + 'deg)',
				"WebkitTransformOrigin": '0 0',
				"transformOrigin": '0 0'
			}}></div>;

		this.setState((prevState) => {
			let lasers = prevState.lasers;
			lasers.push(laser);
			return { lasers };
		});

		this.shipTakeDamage(target, 100);
		setTimeout(this.laserEnd, 1000, this.state.lasers.indexOf(laser));
	}
	
	laserEnd (index) {
		this.setState((prevState) => {
			let lasers = prevState.lasers;
			delete lasers[index];
			return { lasers };
		});
	}
	
	shipTakeDamage (ship, damage) {
		if (ship.team === 'blue') {
			let index = this.state.earth.ships.indexOf(ship);
			
			if (this.state.earth.ships[index].hp - damage > 0) {
				this.setState((prevState) => {
					let ships = prevState.earth.ships;
					ships[index].hp -= damage;
					return { ships };
				});
			}
			else {
				if (ship.type === 'Cruiser')
				{
					this.state.earth.cruiserCount--;
					this.setState((prevState) => {
						let count = prevState.earth.cruiserCount;
						count--;
						return { count };
					});
				}
				else if (ship.type === 'Harvester')
				{
					this.state.earth.harvesterCount--;
					this.setState((prevState) => {
						let count = prevState.earth.harvesterCount;
						count--;
						return {count};
					});
				}
				
				this.ExplosionStart(this.state.earth.ships[index].id, this.state.earth.ships[index].posX, this.state.earth.ships[index].posY);
				
				this.setState((prevState) => {
					let ships = prevState.earth.ships;
					delete ships[index];
					//ships.clean(undefined);
					return { ships };
				});
			}
		}
		else
		{
			let index = this.state.mars.ships.indexOf(ship);
			
			if (this.state.mars.ships[index].hp - damage > 0) {
				this.setState((prevState) => {
					let ships = prevState.mars.ships;
					ships[index].hp -= damage;
					return { ships };
				});
			}
			else {
				if (ship.type === 'Cruiser')
				{
					this.state.mars.cruiserCount--;
					this.setState((prevState) => {
						let count = prevState.mars.cruiserCount;
						count--;
						return { count };
					});
				}
				else if (ship.type === 'Harvester')
				{
					this.state.mars.harvesterCount--;
					this.setState((prevState) => {
						let count = prevState.mars.harvesterCount;
						count--;
						return { count };
					});
				}
				
				this.ExplosionStart(this.state.mars.ships[index].id, this.state.mars.ships[index].posX, this.state.mars.ships[index].posY);
				
				this.setState((prevState) => {
					let ships = prevState.mars.ships;
					delete ships[index];
					//ships.clean(undefined);
					return { ships };
				});
			}
		}
	}
	
	ExplosionStart (id, posX, posY) {
		var explosion = <ExplosionFX key={"explosion" + id.toString() + posX.toString() + posY.toString()} id={id} posX={posX} posY={posY} ></ExplosionFX>;

		this.setState((prevState) => {
			let explosions = prevState.explosions;
			explosions.push(explosion);
			return { explosions };
		});

		setTimeout(this.ExplosionEnd, 1000, this.state.explosions.indexOf(explosion));
	}
	
	ExplosionEnd (index) {
		this.setState((prevState) => {
			let explosions = prevState.explosions;
			delete explosions[index];
			return { explosions };
		});
	}
	
	spawnShip(team, type) {
		if (!this.state.battleStarted)
			return;
		if (this.state.winner !== 'none')
			return;
		
		let ship = null;
		
		if (type === 'Cruiser')
		{
			if (team === 'blue')
			{	
				if (this.state.earth.cruiserCount >= 20)
					return;
	
				if (this.state.earth.resources >= 250)
				{
					this.state.earth.resources -= 250;
					this.setState((prevState) => {
						let res = prevState.earth.resources;
						res -= 250;
						return { res };
					});
				}
				else
					return;
	
				this.state.earth.cruiserCount++;
				this.setState((prevState) => {
						let count = prevState.earth.cruiserCount;
						count++;
						return { count };
					});
			}
			else
			{
				if (this.state.mars.cruiserCount >= 20)
					return;
			
				if (this.state.mars.resources >= 250)
				{
					this.state.mars.resources -= 250;
					this.setState((prevState) => {
						let res = prevState.mars.resources;
						res -= 250;
						return { res };
					});
				}
				else
					return;
			
				this.state.mars.cruiserCount++;
				this.setState((prevState) => {
						let count = prevState.mars.cruiserCount;
						count++;
						return {count};
					});
			}
			
			ship = {id: this.state.mars.ships.length + this.state.earth.ships.length,
					team: team,
					type: type,
					hp:1000,
					hpMax:1000,
					velocity:0,
					velocityMax:0.05,
					posX: team === 'blue' ? 0 : 100,
					posY: Math.floor(Math.random() * 101),
					fireCooldown: 35,
					firing: false,
					asteroid: -1,
					cargo: false};
		}
		else if (type === 'Harvester')
		{
			let asteroidCount = 0;
			this.state.asteroids.forEach((asteroid) => {
				if (team === asteroid.team)
					asteroidCount++;
			});
			let target_asteroid = -1;
			
			if (team === 'blue')
			{
				if (this.state.earth.harvesterCount + 1 > asteroidCount * 3)
					return;
				
				if (this.state.earth.resources >= 100)
				{
					this.state.earth.resources -= 100;
					this.setState((prevState) => {
						let res = prevState.earth.resources;
						res -= 100;
						return { res };
					});
				}
				else
					return;
				
				target_asteroid = Math.floor((this.state.earth.harvesterCount) / 3);
				this.state.earth.harvesterCount++;
				this.setState((prevState) => {
						let count = prevState.earth.harvesterCount;
						count++;
						return { count };
					});
			}
			else
			{
				if (this.state.mars.harvesterCount + 1 > asteroidCount * 3)
					return;
				
				if (this.state.mars.resources >= 100)
				{
					this.state.mars.resources -= 100;
					this.setState((prevState) => {
						let res = prevState.mars.resources;
						res -= 100;
						return { res };
					});
				}
				else
					return;
			
				target_asteroid = 7 - Math.floor((this.state.mars.harvesterCount) / 3);
				this.state.mars.harvesterCount++;
				this.setState((prevState) => {
						let count = prevState.mars.harvesterCount;
						count++;
						return {count};
					});
			}
			
			ship = {id: this.state.mars.ships.length + this.state.earth.ships.length,
					team: team,
					type: type,
					hp:1,
					hpMax:1,
					velocity:0,
					velocityMax:0.08,
					posX: team === 'blue' ? 0 : 100,
					posY: Math.floor(Math.random() * 101),
					fireCooldown: 35,
					firing: false,
					asteroid: target_asteroid,
					cargo: false};
		}
		
		this.setState((prevState) => {
			let ships = team === 'blue' ? prevState.earth.ships : prevState.mars.ships;
			ships.push(ship);
			return { ships };
		});
	}
	
	render () {
		var ships = [];
		
		this.state.earth.ships.forEach((ship) => {
			ships.push(<Ship key={'ship' + ship.id} info={ship}></Ship>);
		});
		this.state.mars.ships.forEach((ship) => {
			ships.push(<Ship key={'ship' + ship.id} info={ship}></Ship>);
		});
		
		let lasers = [];
		this.state.lasers.forEach((laser) => {
			lasers.push(laser);
		});
		
		let explosions = [];
		this.state.explosions.forEach((explosion) => {
			explosions.push(explosion);
		});
		
		let asteroids = [];
		this.state.asteroids.forEach((asteroid) => {
			asteroids.push(<Asteroid key={'asteroid' + asteroid.id.toString()} info={asteroid} redHarvesters={this.state.mars.harvesterCount} blueHarvesters={this.state.earth.harvesterCount}></Asteroid>);
		});
		
		let header_title = <p className="Header_title">Main Menu</p>;
		
		if (this.state.battleStarted)
		{
			switch (this.state.battleMode) {
				case 'multi' :
					header_title = <p className="Header_title">Multiplayer Battle</p>;
					break;
				case 'ai' :
					header_title = <p className="Header_title">Computer Battle</p>;
					break;
				default :
					header_title = <p className="Header_title">Solo Battle</p>;
			}
		}
		
		let header_user = <p className="Header_right">Not Connected</p>;
		
		return (
			<div className="SpaceCenter">
				<div className="Header">
					<Clock ></Clock>
					{/*<p className="Header_left">Welcome</p>*/}
					{header_title}
					{header_user}
				</div>
				<div className="MiddleLine"></div>
				<div className="Space">
					<div className="BattleSpace">
						{asteroids}
						{ships}
						{lasers}
						{/*
							<div className="Ship_Harvester_red" style={{"left" : (78.2).toString() + '%', "top" : (60).toString() + '%'}}>
								<img src="Harvester_red.png" alt="ship"/>
							</div>
							<Ship info={{id:0, team:'blue', hp:1000, posX:0, posY:50, fireCooldown: 1}}></Ship>
							<Ship info={{id:1, team:'red', hp:1000, posX:100, posY:50, fireCooldown: 1}}></Ship>
						*/}
						{explosions}
					</div>
					<OpenSpace border={this.state.border} ></OpenSpace>
					<div className="SpaceGroup">
						<div className="Earth"></div>	
						<div className="Mars"></div>
					</div>
				</div>
				<Interface startGame={this.startGame} winner={this.state.winner} asteroids={this.state.asteroids} started={this.state.battleStarted} mode={this.state.battleMode} spawn={this.spawnShip} earth={this.state.earth} mars={this.state.mars} top={this.state.UI_openFactor} opacity={this.state.UI_opacity}></Interface>
				<p className="version" style={{"bottom" : "6px"}}>Haven training prototype v 0.16 - best result with Chrome</p>
				<p className="version">Alexis Jouanneaux</p>
			</div>
		);
	}
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

export default SpaceCenter;