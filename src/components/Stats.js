import React, { Component } from 'react';
import './Stats.css';
import Chart from 'chart.js';

import {random, createRandomDeck} from '../helpers/deckGenerator';

let bgColors = [	
	'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
];

let borderColors = [	
	'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
];

function createChart(chartID, data, title = "Simple Attack", maxScale = 30) {
	let labels = Array.apply(null, Array(data.length)).map((a,i) => i+1);
	let numbers = Array.apply(null, Array(data.length)).map((a,i) => parseInt(random() * 1032132 % 5, 10));
	let borders = numbers.map((a) => borderColors[a]); 
	let bgs = numbers.map((a) => bgColors[a]);

	var ctx = document.getElementById(chartID).getContext('2d');
		new Chart(ctx, {
		    type: 'bar',
		    data: {
		        labels: labels,
		        datasets: [{
		            label: title,
		            data: data,
		            backgroundColor: bgs,
		            borderColor: borders,
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true,
		                    max: maxScale
		                }
		            }]
		        }
		    }
		});
}



class Stats extends Component {
	constructor(props) {
		super(props);

		let {
			deck
		} = props;

		deck = createRandomDeck();
		this.numbers = this.calculateNumbers(deck);
		this.sums    = this.calculateSummables(this.numbers);
		this.wapropabilities = this.findWinning(deck);
		this.losepropabilities = this.findLosing(deck);
		this.samepropabilities = this.findSame(deck);
		this.solosamepropabilities = this.findSoloSame(this.samepropabilities);
		this.plustriggers = this.findPlusTriggers(this.numbers);
	}
	
	componentDidMount() {
        createChart("chart11", this.numbers[0], "Right Numbers Distribution");
        createChart("chart12", this.numbers[1], "Up Numbers Distribution");
        createChart("chart13", this.numbers[2], "Left Numbers Distribution");
        createChart("chart14", this.numbers[3], "Down Numbers Distribution");
        createChart("chart21", this.sums[0], "Right Summable Distribution", 100);
        createChart("chart22", this.sums[1], "Up Summable Distribution", 100);
        createChart("chart23", this.sums[2], "Left Summable Distribution", 100);
        createChart("chart24", this.sums[3], "Down Summable Distribution", 100);
        createChart("chart31", this.wapropabilities[0], "Right Winning Chance", 100);
        createChart("chart32", this.wapropabilities[1], "Up Winning Chance", 100);
        createChart("chart33", this.wapropabilities[2], "Left Winning Chance", 100);
        createChart("chart34", this.wapropabilities[3], "Down Winning Chance", 100);
        createChart("chart41", this.samepropabilities[0], "Right Same Chance", 100);
        createChart("chart42", this.samepropabilities[1], "Up Same Chance", 100);
        createChart("chart43", this.samepropabilities[2], "Left Same Chance", 100);
        createChart("chart44", this.samepropabilities[3], "Down Same Chance", 100);
        createChart("chart51", this.solosamepropabilities, "Same Chance Of card", 100);
        createChart("chart61", this.plustriggers[0], "R-L Plus Triggers", 250);
        createChart("chart62", this.plustriggers[1], "U-D Plus Triggers", 250);
	}

	componentWillUnmount() {
       
	}

	goTo = (stateName) => {
		this.props.resolves.$transition$.router.stateService.go(stateName);
	}

	findSame(deck) {
		let nums = this.calculateNumbers(deck);
		// let sums = this.calculateSummables(nums);

		let cards = deck.map((card) => {
			return [
				nums[2][card[0]-1] || 0,
				nums[3][card[1]-1] || 0,
				nums[0][card[2]-1] || 0,
				nums[1][card[3]-1] || 0
			];
		});

		// 100 - to find the NOT SAME Chance on side 
		let result = cards[0].map((col, i) => cards.map(row => row[i]));
		return result; 
	}

	findSoloSame(cards) {
		let a = [];
		for(var i=0;i<cards[0].length;i++){
			a[i] = ((100-cards[0][i])/100) * ((100-cards[1][i])/100) * ((100-cards[2][i])/100) * ((100-cards[3][i])/100);
			a[i] = (1-a[i]) * 100;
		}
		return a;
	}

	findPlusTriggers(nums) {
		let c = [
			Array.apply(null, Array(19)).map(Number.prototype.valueOf,0),
			Array.apply(null, Array(19)).map(Number.prototype.valueOf,0)
		];
		for (let i = 0; i < 2; i++) {
			let a = nums[i];
			let b = nums[i+2];
			for (let j=0; j < 9; j++) {
				for (let z=0; z < 9; z++) {
					c[i][j+z+1] += a[j] + b[z];
				}
			}
		}
		return c;
	}

	findLosing(deck) {
		let wins = this.findWinning(deck);
		let loses = wins.map((sidewins) => sidewins.map((n) => 100-n));
		return loses;
	}

	findWinning(deck) {
		let nums = this.calculateNumbers(deck);
		let sums = this.calculateSummables(nums);

		let cards = deck.map((card) => {
			return [
				sums[2][card[0]-2],
				sums[3][card[1]-2],
				sums[0][card[2]-2],
				sums[1][card[3]-2]
			];
		});

		let result = cards[0].map((col, i) => cards.map(row => row[i]));
		return result;
	}

	// Athroistiki katanomi arithmwn
	calculateSummables(nums) {
		let sums = nums.map((arr, index) => {
			let sum = 0;
			return arr.map((item) => sum = sum + item);
		});		
		return sums;
	}

	// Katanomi arithmwn
	calculateNumbers(deck) {
		let nums = [
			Array.apply(null, Array(9)).map(Number.prototype.valueOf,0),
			Array.apply(null, Array(9)).map(Number.prototype.valueOf,0),
			Array.apply(null, Array(9)).map(Number.prototype.valueOf,0),
			Array.apply(null, Array(9)).map(Number.prototype.valueOf,0)
		];

		deck.forEach((card) => 
			card.forEach((number,side) => {
				nums[side][number-1] += 1;
			})
		);
		return nums;
	}

	render() {
	    return (
	    <div>
		    <div>
		    	<div className="chartBox-sm">
		    		<canvas id="chart11" width="300" height="200"></canvas>
		    	</div>
		    	<div className="chartBox-sm">
		    		<canvas id="chart12" width="300" height="200"></canvas>
		    	</div>
		    	<div className="chartBox-sm">
		    		<canvas id="chart13" width="300" height="200"></canvas>
		    	</div>
		    	<div className="chartBox-sm">
		    		<canvas id="chart14" width="300" height="200"></canvas>
		    	</div>
		    </div>
		    <div>
		    	<div className="chartBox-sm">
		    		<canvas id="chart21" width="300" height="200"></canvas>
		    	</div>
		    	<div className="chartBox-sm">
		    		<canvas id="chart22" width="300" height="200"></canvas>
		    	</div>
		    	<div className="chartBox-sm">
		    		<canvas id="chart23" width="300" height="200"></canvas>
		    	</div>
		    	<div className="chartBox-sm">
		    		<canvas id="chart24" width="300" height="200"></canvas>
		    	</div>
		    </div>
		    <div>
		    	<div className="chartBox">
		    		<canvas id="chart31" width="250" height="100"></canvas>
		    	</div>
		    	<div className="chartBox">
		    		<canvas id="chart32" width="250" height="100"></canvas>
		    	</div>
		    </div>
		    <div>
		    	<div className="chartBox">
		    		<canvas id="chart33" width="250" height="100"></canvas>
		    	</div>
		    	<div className="chartBox">
		    		<canvas id="chart34" width="250" height="100"></canvas>
		    	</div>
		    </div><div>
		    	<div className="chartBox">
		    		<canvas id="chart41" width="250" height="100"></canvas>
		    	</div>
		    	<div className="chartBox">
		    		<canvas id="chart42" width="250" height="100"></canvas>
		    	</div>
		    </div>
		    <div>
		    	<div className="chartBox">
		    		<canvas id="chart43" width="250" height="100"></canvas>
		    	</div>
		    	<div className="chartBox">
		    		<canvas id="chart44" width="250" height="100"></canvas>
		    	</div>
		    </div>
		    <div>
		    	<div className="chartBox-lg">
		    		<canvas id="chart51" width="200" height="100"></canvas>
		    	</div>
		    </div>
		    <div>
		    	<div className="chartBox-lg">
		    		<canvas id="chart51" width="200" height="100"></canvas>
		    	</div>
		    </div>
		    <div>
		    	<div className="chartBox">
		    		<canvas id="chart61" width="250" height="100"></canvas>
		    	</div>
		    	<div className="chartBox">
		    		<canvas id="chart62" width="250" height="100"></canvas>
		    	</div>
		    </div>
		    
	    </div>
	    );
	}
}

export default Stats;
