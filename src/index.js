import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

import getContext from "./services/context";
import api, { createAPI } from "./services/api"
import store from "./services/store"
import reducers from "./reducers"
import { Provider } from "react-redux"

import { fetchVersions } from "./reducers/idf_versions"

const rootElement = document.getElementById("root");



async function init(){
	await fetchVersions();


}


getContext(["idf-api"], async context => {
  const { url } = context["idf-api"]
  createAPI(url)
  await init()


  console.log("debug: STORE", store.getState())
  // const templates = (await api.getTemplates()).data.data
  // console.log("debug: ", templates)
});

ReactDOM.render(
  <React.StrictMode>
  	<Provider store = { store }>
  		<App />
  	</Provider>
  </React.StrictMode>,
  rootElement
);


window.parent.postMessage({ type: "ready" }, "*");
