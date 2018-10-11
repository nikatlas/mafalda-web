import React, { Component } from 'react'
import './Game.css'

import GameLayer from '../Game/index.js'

import Navigation from '../Game/views/demo/Navigation';

class Game extends Component {
	constructor(props) {
		super(props);
		
		const router = GameLayer.router();
       	// const app = GameLayer.app;
       	// const gui = GameLayer.gui();

       	const route = new Navigation(GameLayer);
       	router.addRoute('Game', route);
       	router.go('Game');
	}
	componentDidMount() {
       GameLayer.init();
       GameLayer.start();
	}
	componentWillUnmount() {
       GameLayer.destroy();
	}

	goTo = (stateName) => {
		this.props.resolves.$transition$.router.stateService.go(stateName);
	}

	render() {
	    return (
			<div className="game-canvas-container" ref="gameCanvas" style={{overflow: 'hidden'}}>              
			</div>
	    );
	}
}

export default Game;
