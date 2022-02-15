import React from "react";
import { Provider } from "react-redux";
import store from "./Redux/store";
import Routes from "./routes/Routes";
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <React.StrictMode>
        <Routes />
      </React.StrictMode>
    </Provider>
  );
}

export default App;
