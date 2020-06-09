
const store = ()=>require("../services/store").default
const SET_MESSAGE = "SET_MESSAGE"

export const setMessage = message => {
	store().dispatch({type: SET_MESSAGE, message})
}

export default ( state = { message: null }, action) => {
	switch(action.type){
		case SET_MESSAGE: return { message: action.message };
		default: return state;
	}
}