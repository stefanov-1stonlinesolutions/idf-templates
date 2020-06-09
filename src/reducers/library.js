import api   from "../services/api"
import { setMessage } from "./messages"

const SET_LIBRARY   = "SET_LIBRARY"
const SET_LIBRARY_OBJECTS = "SET_LIBRARY_OBJECTS"

const store = ()=>require("../services/store").default

export async function fetchLibrary(idf_version){
	setMessage("Loading IDF Library")
	store().dispatch({
		type: SET_LIBRARY,
		library: await api.getLibrary(idf_version)
	})
}

export async function fetchLibraryObjects(){

	const library = store().getState().library.library

	setMessage("Loading IDF Objects")
	store().dispatch({
		type: SET_LIBRARY_OBJECTS,
		idf_objects: await api.getAllObjects(library.id)
	})
}


export default ( state = {
	message: null,
	library: {},
	idf_objects: {},
	objects_by_class_name: {}
}, action) => {
	switch (action.type){

		case SET_LIBRARY:
			return { ...state, library: action.library}

		case SET_LIBRARY_OBJECTS:
			const by_id = {};
			const by_class_name = {};
			action.idf_objects.forEach( obj => {
				by_id[obj.id] = obj
				if(!by_class_name[obj.class_name]) {
					by_class_name[obj.class_name] = [];
				}
				by_class_name[obj.class_name].push(obj);
			})
			return { ...state, idf_objects: by_id, objects_by_class_name: by_class_name }





		default: return state
	}
}