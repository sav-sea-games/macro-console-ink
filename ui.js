
const robot = require("robotjs");
const React = require('react');
const {render, Color, Box} = require('ink');
const nc = require('node-notifier');
const getWindows = require('mac-windows').getWindows;
const activateWindow = require('mac-windows').activateWindow;
const path = require('path');
const tesseract = require('node-tesseract');
const robotjsCombos = require('robotjs-combo');

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			counter: 0,
			activeWindows: [],
			windowsList: []
		};
		this.findBlueStacks = this.findBlueStacks.bind(this);
	}
	componentWillMount() {
		robot.setMouseDelay(500);
	}
	findBlueStacks() {
		if (this.state.windowsList.includes('BlueStacks')) {
			nc.notify({
				title: 'BlueStacks Found!',
				sound: 'Pop',
				icon: path.join(__dirname, 'skull.png'), // Absolute path (doesn't work on balloons)
				message: 'Found BlueStacks',
				wait: true,
				closeLabel: 'Wait',
				actions: 'Calibrate'
			},
				(err,response,metadata) => {
					if (err) throw err;
					console.log(metadata);
					if (metadata.activationValue !== 'Calibrate') {
						return;
					}
					activateWindow('BlueStacks');
					let bsObject = this.state.activeWindows[this.state.windowsList.indexOf('BlueStacks')];
					nc.notify({
						title: 'Calibrating',
						sound: 'Pop',
						icon: path.join(__dirname, 'skull.png'), // Absolute path (doesn't work on balloons)
						message: `the window dimensions are h: ${bsObject.height}, w: ${bsObject.width}, the window location is x: ${bsObject.x}, y: ${bsObject.y}`,
						wait: true,
						timeout: 5,
						sticky: true
					});
					robot.keyToggle("command", "down", "shift");
				}
			);
		} else {
			nc.notify({
				title: 'peniliam error',
				icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
				message: 'BlueStacks not running'
			});
		}
	}
	componentDidMount() {
		getWindows().then(windows => {
      let windowsList = windows.map(w => {
        return w.ownerName;
      });
			this.setState((p, props) => ({
				...p,
				activeWindows: windows,
				windowsList: windowsList
			}), () => this.findBlueStacks());
    });
		// this.timer = setInterval(() => {
		// 	this.setState(prevState => ({
		// 		counter: prevState.counter + 1
		// 	}));
		// }, 100);
	}
	render() {;
		return (
			<Box width={20} flexDirection="row">
				<Box width={4}>
					☠️
				</Box>
				<Color blue>
					peniliam
				</Color>
			</Box>
		);
	}
	componentWillUnmount() {
		clearInterval(this.timer);
	}
}

module.exports = App;
