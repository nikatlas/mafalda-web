import Game from './components/Game';
import Home from './components/Home';
import Playground from './components/Playground';

export default [
{
  name : "home",
  url  : "/home",
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
}
];