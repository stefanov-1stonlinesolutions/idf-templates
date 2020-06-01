import api   from "../services/api"

const store = ()=>require("../services/store").default

const FETCH_IDF_VERSIONS = "FETCH_IDF_VERSIONS"
const SET_IDF_VERSIONS   = "SET_IDF_VERSIONS"

export async function fetchVersions(){

	store().dispatch({type: FETCH_IDF_VERSIONS})

	store().dispatch({
		type: SET_IDF_VERSIONS,
		versions: await api.getVersions()
	})
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