import api   from "../services/api"
import { setMessage } from "./messages"

// import {fetchClasses} from "./library"

const store = ()=>require("../services/store").default

const FETCH_IDF_TEMPLATES = "FETCH_IDF_TEMPLATES"
const SET_IDF_TEMPLATES   = "SET_IDF_TEMPLATES"
const SET_TEMPLATE        = "SET_TEMPLATE"
const ADD_IDF_TEMPLATE    = "ADD_IDF_TEMPLATE"
const SET_IDD_CLASSES     = "SET_IDD_CLASSES"
const SET_RULES           = "SET_RULES"
const SELECT_CLASS 		  = "SELECT_CLASS"
const SET_RELATED_CLASSES = "SET_RELATED_CLASSES"
// const SET_LIBRARY_OBJECTS = "SET_LIBRARY_OBJECTS"
const SET_SECONDARY_CONDITION = "SET_SECONDARY_CONDITION"
const DELETE_IDF_TEMPLATE = "DELETE_IDF_TEMPLATE"


const SET_SOURCE_OBJECTS = "SET_SOURCE_OBJECTS"
const SET_TEMPLATE_RULES = "SET_TEMPLATE_RULES"
const DELETE_RULE = "DELETE_RULE"
const UPDATE_TEMPLATE_RULE = "UPDATE_TEMPLATE_RULE"
const SET_RULES_OBJECTS = "SET_RULES_OBJECTS"

const ADD_RULE = "ADD_RULE"


export async function fetchTemplates(idf_version){

	setMessage("Loadin IDF Templates")

	store().dispatch({
		type: SET_IDF_TEMPLATES,
		templates: await api.getTemplates(idf_version)
	})
	

}

export async function createNewTemplate(template_name, version_id){
	const template = await api.createTemplate({
		template_name, version_id
	})
	store().dispatch({
		type: ADD_IDF_TEMPLATE,
		template
	})
	return template
}

export async function saveTemplateRule(rule){
	store().dispatch({
		type: UPDATE_TEMPLATE_RULE,
		rule: await api.updateRule(rule)
	})
}

export async function setTemplate(id){
	store().dispatch({ type: SET_TEMPLATE, id })

	store().dispatch({
		type: SET_IDD_CLASSES,
		classes: await api.getClasses(id)
	})

	getRules()

	// const rules = (await api.getRules(id))

	// const object_ids = rules.map( ({source_object_id}) => source_object_id )

	// if(object_ids.length){
	// 	const obj_index = {}
	// 	const idf_objects = api.getObjectsByIds(object_ids)
	// 	idf_objects.forEach( obj => {
	// 		obj_index[obj.id] = obj
	// 	})


	// }

	// console.log("debug: object_ids", object_ids)

	// store().dispatch({
	// 	type: SET_TEMPLATE_RULES,
	// 	classes: rules
	// })

}

export async function duplicateTemplate(template_id){
	store().dispatch({
		type: ADD_IDF_TEMPLATE,
		template: await api.duplicateTemplate(template_id)
	})
}

export async function deleteTemplate(template_id){
	store().dispatch({
		type: DELETE_IDF_TEMPLATE,
		...(await api.deleteTemplate(template_id))
	})
}

export function setClass(selected_class){
	store().dispatch({type: SELECT_CLASS, selected_class})

	const class_rules = store().getState().templates.rules

	console.log("debug: SELECT_CLASS", selected_class)

	// store().dispatch({
	// 	type: SET_CLASS_RULES,
	// 	selected_class
	// })

	// store().dispatch({
	// 	type: SET_SOURCE_OBJECTS,
	// 	selected_class
	// })
}

export async function getRules(){
	const template_id = store().getState().templates.selected
	store().dispatch({type: SET_RULES, rules: [] }) // Reset rules before get them
	const rules = await api.getRules(template_id)
	store().dispatch({
		type: SET_RULES,
		rules
	})
	return rules
}

export async function getRulesObjects(){
	const template_id = store().getState().templates.selected
	const library = store().getState().library.library
	const rules = store().getState().templates.rules
	const object_ids = rules.map( ({source_object_id}) => source_object_id )

	if(!object_ids.length) return store().dispatch({
		type: SET_RULES_OBJECTS,
		objects: {}
	})

	const idf_objects = await api.getObjectsByIds(library.id, object_ids)

	const obj_index = {}
	for(let obj of idf_objects) obj_index[obj.id] = obj
	store().dispatch({
		type: SET_RULES_OBJECTS,
		objects: obj_index
	})

	// store().dispatch({type: SET_RULES, rules: [] }) // Reset rules before get them
	// const rules = await api.getRules(template_id)
	// return rules
}

export async function getRelatedClasses(class_name){
	const template_id = store().getState().templates.selected
	return await api.getRelatedClasses(class_name, template_id)
}

export async function getSecondaryCondition(class_name){

	if(class_name === null) return store().dispatch({
		type: SET_SECONDARY_CONDITION,
		secondary_condition: null
	})

	const template_id = store().getState().templates.selected
	store().dispatch({
		type: SET_SECONDARY_CONDITION,
		secondary_condition: await api.getSecondaryCondition(class_name, template_id)
	})
}

// export async function getLibraryObjects({class_name}){
// 	const { library } = store().getState().library
// 	store().dispatch({
// 		type: SET_LIBRARY_OBJECTS,
// 		idf_objects: await api.getLibraryObjects(library.id, class_name)
// 	})

// }

export async function createTemplateRule(rule_data){
	const template_id = store().getState().templates.selected
	rule_data.template_id = template_id;
	store().dispatch({
		type: ADD_RULE,
		rule: await api.createTemplateRule(template_id, rule_data)
	})
	
}

export async function deleteRule(rule_id){
	const template_id = store().getState().templates.selected
	store().dispatch({
		type: DELETE_RULE,
		...(await api.deleteRule(template_id, rule_id))
	})
}

// export function addBlankRule(rule){
// 	store().dispatch({
// 		type: ADD_BLANK_RULE,
// 		rule
// 	})
// }



export default ( state = {
	message: null,
	templates: [],
	selected: null,
	classes: {},
	rules: [],
	selected_class: null,
	related_classes: [],
	idf_objects: [],
	secondary_condition: null,
	rules_objects: {},

}, action) => {
	switch (action.type){

		case SET_RULES_OBJECTS:
			return {...state, rules_objects: action.objects}

		case FETCH_IDF_TEMPLATES:
			return { 
				message: "Fetching templates", 
				templates: [], 
				selected: null, 
				classes: {}, 
				rules: [],
				selected_class: null,
				related_classes: [],
				idf_objects: [],
				secondary_condition: null,
				rules_objects: {},
			}

		case SET_IDF_TEMPLATES:
			return { 
				message: null, 
				templates: action.templates, 
				selected: null, 
				classes: {}, 
				rules: [],
				selected_class: null,
				related_classes: [],
				idf_objects: [],
				secondary_condition: null,
				rules_objects: {},
			}

		case SET_TEMPLATE:
			return { ...state, selected: action.id, classes: {}, rules: [] }
		
		case SELECT_CLASS:
			return { ...state, selected_class: action.selected_class }

		case ADD_IDF_TEMPLATE:
			return { ...state, templates: state.templates.concat([action.template]), classes: {}, rules: [] }

		case DELETE_IDF_TEMPLATE:
			return { ...state, templates: state.templates.filter( template => template.id !== action.deleted ) }

		case DELETE_RULE:
			return {...state, rules: state.rules.filter( ({id})=>id !== action.deleted )}
		
		case ADD_RULE:
			return {...state, rules: state.rules.concat([action.rule])}

		case SET_IDD_CLASSES:
			const groups = {}
			action.classes.forEach( idd_class => {
				if(!groups.hasOwnProperty(idd_class.group_name)){
					groups[idd_class.group_name] = []
				}
				groups[idd_class.group_name].push(idd_class)
			})
			return { ...state, classes: groups, selected_class: null }

		case SET_RULES:
			return { ...state, rules: action.rules }

		case SET_RELATED_CLASSES:
			return { ...state, related_classes: action.related_classes }


		// case SET_LIBRARY_OBJECTS:
		// 	return { ...state, idf_objects: action.idf_objects }

		case SET_SECONDARY_CONDITION:
			return { ...state, secondary_condition: action.secondary_condition }



		default: return state
	}
}