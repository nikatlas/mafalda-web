import Game from './components/Game';
import Home from './components/Home';
import Playground from './components/Playground';
import Stats from './components/Stats';

export default [
    {
        name : 'home',
        url  : '/home',
        component: Home
    },
    {
        name : 'game',
        url  : '/game',
        component: Game
    },
    {
        name : 'playground',
        url  : '/playground',
        component: Playground
    },
    {
        name : 'stats',
        url  : '/stats',
        component: Stats
    }
];