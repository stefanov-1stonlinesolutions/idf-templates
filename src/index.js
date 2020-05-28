import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

// import getContext from "./services/context";

const rootElement = document.getElementById("root");

// console.log("GET CONTEXT HERE");
// getContext(["idf-api"], context => {
//   console.log("CONTEXT: ", context);
// });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
