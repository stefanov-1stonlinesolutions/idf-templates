import React, {useState, Fragment} from "react";
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
	createNewTemplate,
	getSecondaryCondition, 
	createTemplateRule, 
} from "../reducers/templates"




export default connect(
	state    => ({
		templates:    console.log("debug: templates: ", state.templates)||state.templates
	}),

	dispatch => ({

	}),
)
(function ManageRules({
	templates: { selected_class, related_classes, idf_objects, secondary_condition },
	showNewRuleWizard
}) {

	const [selected_object_id, selectObjectId] = useState(0)
	const [selected_object, setSelectedObject] = useState(null)

	const [select_class_step, setSelectClassStep] = useState(null)
	const [condition, setCondition] = useState(0)

	const [self_class, setSelfClass] = useState([])

	const {refered, refering} = related_classes

	console.log("debug: SELF_CLASS", self_class)

	const show_finish = (secondary_condition !== null )

	let type = "add"

	if(self_class.length && selected_object && selected_object.class_id === condition){
		type = "modify"
	}


	const rule_data = {
		type, 
		class_id: condition,
		secondary_condition: {}, // secondary_condition,
		source_object_id: selected_object_id
	}

	const createRule = (data) => {
		createTemplateRule(rule_data);
		showNewRuleWizard(false)
	}



	function getSecondaryConditionOptions(class_id){

		const classes = self_class.concat(refering).concat(refered)

		for(let idd_class of classes){
			if(idd_class.ref_class_id === class_id){
				getSecondaryCondition(idd_class.referred_class)
			}
		}

	}

	function selectObject(id){
		selectObjectId(id)
		for(let obj of idf_objects){
			if(obj.id === id) {
				setSelectedObject(obj)
				return setSelfClass([{
					ref_class_id:   obj.class_id,
					referred_class: obj.class_name
				}])
			}
		}
		setSelectedObject(0)
		setSelfClass([])
	}

	return <Fragment>
		<h2>Create new rule [{selected_class.class_name}]</h2>



		<select value={selected_object_id} onChange={ ({target: {value}})=> selectObject(parseInt(value)) }>
			<option value={0}>Select Object</option>
			{ idf_objects.map( idf_object => <option 
				value={idf_object.id}
				key={"lib-object-select-"+idf_object.id}>{idf_object.fields.A1}</option> 
			)}
		</select>


		<button onClick={ ()=> showNewRuleWizard(false) }> Cancel   </button>
		{ selected_object && show_finish 
			? <button onClick={ ()=> createRule(rule_data) }>  Finish </button>
			: <button onClick={ ()=> setSelectClassStep(true) }>  Next </button>
		}

		{ select_class_step && 
			<Fragment>
				<h2>Trigger Condition</h2>
				<br/>
				Select Refered Class
				<select value={condition} onChange={ ({target: {value}}) => {
					console.log("debug: ", value)
					setCondition(parseInt(value))
					getSecondaryConditionOptions(parseInt(value))
				}}>
					<option value={0}>Select Class</option>
					{ self_class.concat(refered).map( idd_class => <option 
						value={idd_class.ref_class_id}
						key={"refered-class-"+idd_class.ref_class_id}>{idd_class.referred_class}</option> 
					)}
				</select>
				<br/>
				Select Refering Class
				<select value={condition} onChange={ ({target: {value}}) => {
					setCondition(parseInt(value))
					getSecondaryConditionOptions(parseInt(value))
				}}>
					<option value={0}>Select Class</option>
					{ refering.map( idd_class => <option 
						value={idd_class.ref_class_id}
						key={"refering-class-"+idd_class.ref_class_id}>{idd_class.referred_class}</option>
					)}
				</select>
			</Fragment>


	}
	{secondary_condition && <h2>Secondary Condition fields here</h2>}
	</Fragment>

})
