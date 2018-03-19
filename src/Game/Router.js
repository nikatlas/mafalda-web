class Router {
	constructor(stage) {
		this.stage = stage;
		this.routes = {};

		this.currentRoute = null;
		this.currentRouteLink = "";
	}

	addRoute = (link, actors) => {
		this.routes[link] = actors;
	}

	clear = () => {
		this.stage.removeChild(this.currentRoute);
		if(this.currentRoute !== null)
			this.currentRoute.destroy();
		this.currentRoute = null;
	}

	go = (link) => {
		const newRoute = this.routes[link];
		if (this.currentRoute !== null)
			this.stage.removeChild(this.currentRoute);
		
		this.stage.addChild(newRoute);
		this.currentRoute = newRoute;
		this.currentRouteLink = link;
	}
}

export default Router;