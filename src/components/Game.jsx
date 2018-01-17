import React, { Component } from 'react'
import './Game.css'

import GameLayer from '../Game/index.js'

class Game extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
       GameLayer.init();
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
