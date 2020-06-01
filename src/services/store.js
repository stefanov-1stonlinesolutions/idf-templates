import { createStore, applyMiddleware, combineReducers } from 'redux'
import combineSectionReducers from 'combine-section-reducers';

import reducers from "../reducers"
const combined_reducers = combineSectionReducers({ ...reducers })


export default createStore(
	combined_reducers,
	{}
)