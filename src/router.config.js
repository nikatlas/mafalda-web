import {UIRouterReact, servicesPlugin, pushStateLocationPlugin} from '@uirouter/react';

//add visualizer
//import {visualizer} from '@uirouter/visualizer';
import appStates from './states';

// Create a new instance of the Router
export const router = new UIRouterReact();
router.plugin(servicesPlugin);
// router.plugin(hashLocationPlugin);
router.plugin(pushStateLocationPlugin);

// Register the initial (eagerly loaded) states
appStates.forEach(state => router.stateRegistry.register(state));

// Global config for router
router.urlService.config.baseHref('/');

router.urlService.rules.initial({ 
	state: 'home' 
});

// Start the router
//router.start();

// Setup the state visualizer
//visualizer(router);