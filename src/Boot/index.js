import { Bootloader } from './Bootloader';

const renderApp = () => {
  const App = new Bootloader();
  App.boot();
};

renderApp();
