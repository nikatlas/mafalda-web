import React, { Component } from 'react'

import logo from '../logo.svg';

import { Button } from 'reactstrap';

class Home extends Component {
	goTo = (stateName) => {
		this.props.resolves.$transition$.router.stateService.go(stateName);
	}

 	render() {
	    return (
			[<header className="App-header" key={1}>
		      <img src={logo} className="App-logo" alt="logo" />
		      <h1 className="App-title">Welcome to Mafalda</h1>
		    </header>,
		    <p className="App-intro" key={2}>
		      <Button color="primary" onClick={() => this.goTo('game')}>Play</Button>
		    </p>,
		    <p className="App-intro" key={3}>
		      <Button color="danger" onClick={() => this.goTo('playground')}>Play</Button>
		    </p>]
	    );
  	}
}

export default Home;
