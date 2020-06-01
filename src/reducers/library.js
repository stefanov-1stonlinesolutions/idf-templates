import api   from "../services/api"

const FETCH_LIBRARY = "FETCH_LIBRARY"
const SET_LIBRARY   = "SET_LIBRARY"

const store = ()=>require("../services/store").default

export async function fetchLibrary(idf_version){
	store().dispatch({type: FETCH_LIBRARY})
	store().dispatch({
		type: SET_LIBRARY,
		library: await api.getLibrary(idf_version)
	})
} 


export default ( state = {
	message: null,
	library: {}
}, action) => {
	switch (action.type){

		case FETCH_LIBRARY:
			return { message: "Fetching library", library:{} }

		case SET_LIBRARY:
			return {message: null, library: action.library}




		default: return state
	}
}