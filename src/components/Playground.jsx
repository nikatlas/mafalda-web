import React, { Component } from 'react';
import './Game.css';

import GameLayer from '../Game/index.js';

import Loader from '../Playground/Loader.js';

class Playground extends Component {
	constructor(props) {
		super(props);
		
		const router = GameLayer.router();
       	const app = GameLayer.app;
       	const gui = GameLayer.gui();

       	const route = new Loader(GameLayer);

       	router.addRoute('Loader', route);
       	router.go('Loader');
	}

	componentDidMount() {
       GameLayer.init();
       
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

export default Playground;
