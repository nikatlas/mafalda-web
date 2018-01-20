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