import api   from "../services/api"
import { setMessage } from "./messages"

const store = ()=>require("../services/store").default

const FETCH_IDF_VERSIONS = "FETCH_IDF_VERSIONS"
const SET_IDF_VERSIONS   = "SET_IDF_VERSIONS"

export async function fetchVersions(){

	setMessage("Loading IDF Versions")

	store().dispatch({
		type: SET_IDF_VERSIONS,
		versions: await api.getVersions()
	})

	setMessage(null)
}

export default ( state = {
	message: null,
	versions: []
}, action) => {
	switch (action.type){

		case FETCH_IDF_VERSIONS:
			return { ...state, message: "Loading IDF Versions" }
		
		case SET_IDF_VERSIONS:
			return { versions: action.versions, message: null }

		default: return state
	}
}