import React, {useState, Fragment} from "react";
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
	createNewTemplate,
	getSecondaryCondition, 
	createTemplateRule,
	saveTemplateRule,
} from "../reducers/templates"




export default connect(
	(state, { rule })    => ({
		rule,
		idf_object: state.templates.idf_objects.reduce( (memo, object) => memo 
			? memo 
			: object.id === rule.source_object_id 
				? object
				: null,
		null ),
		templates: state.templates
	}),

	dispatch => ({

	}),
)
(function EditRule({
	rule, idf_object,
	templates: { selected_class, related_classes, idf_objects, secondary_condition },
	showEditRuleForm
}) {



	// const [rule_data, setRuleData] = useState({...rule})

	const [selected_object_id, selectObjectId] = useState(null)
	const [selected_object, setSelectedObject] = useState(idf_object || null)

	// const [select_class_step, setSelectClassStep] = useState(null)
	const [condition, setCondition] = useState(rule.condition)

	const [self_class, setSelfClass] = useState([])

	const [secondary_condition_data, setSecondaryConditionData] = useState({...rule.condition})

	const {refered, refering} = related_classes

	// console.log("debug: SELF_CLASS", self_class)

	// const show_finish = (secondary_condition !== null )

	let type = "add"

	if(self_class.length && selected_object && selected_object.class_id === condition){
		type = "modify"
	}


	const rule_data = {
		id: rule.id,
		template_id: rule.template_id,
		type, 
		class_id: condition,
		condition: secondary_condition_data, // secondary_condition,
		source_object_id: selected_object_id
	}

	const saveRule = (data) => {
		saveTemplateRule(rule_data);
		showEditRuleForm(false)
	}



	function getSecondaryConditionOptions(class_id){

		const classes = self_class.concat(refering).concat(refered)

		for(let idd_class of classes){
			if(idd_class.ref_class_id === class_id){
				getSecondaryCondition(idd_class.referred_class)
			}
		}

	}

	if(condition) getSecondaryConditionOptions(condition)

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

	// if(!self_class.length){
	// 	for(let obj of idf_objects){
	// 		if(obj.id === rule.source_object_id) {
	// 			return setSelfClass([{
	// 				ref_class_id:   obj.class_id,
	// 				referred_class: obj.class_name
	// 			}])
	// 		}
	// 	}		
	// }

	// if(selected_object_id === null) {
	// 	selectObject(rule.source_object_id)
	// 	console.log("debug: INITIAL SELECT OBJECT: ", rule.source_object_id);
	// }




	return <Fragment>
		<h2>Edit new rule [{selected_class.class_name}]</h2>

		<select value={selected_object_id} onChange={ ({target: {value}})=> selectObject(parseInt(value)) }>
			<option value={0}>Select Object</option>
			{ idf_objects.map( idf_object => <option 
				value={idf_object.id}
				key={"lib-object-select-"+idf_object.id}>{idf_object.fields.A1}</option> 
			)}
		</select>

		<br /><br />

		<Fragment>
			<h2>Trigger Condition</h2>
			<br/>
			Select Refered Class
			<select value={condition} onChange={ ({target: {value}}) => {
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

		<br /><br />

		{ secondary_condition && Object.keys(secondary_condition).map( idd_name => {
			const options = secondary_condition[idd_name]

			return <Fragment  key={"secondary-condition-field-"+idd_name}>
				<br />
				<label>
					{ idd_name }
					<select
						onChange={ e => setSecondaryConditionData( {...secondary_condition_data, [idd_name]: e.target.value} ) } 
						value={secondary_condition_data.hasOwnProperty(idd_name) ? secondary_condition_data[idd_name] : null}>
						{ options.map( value => {
							return <option key={"secondary-condition-field-"+idd_name + "-" + value} value={value }>
								{value}
							</option>
						})}
					</select>
				</label>

			</Fragment>


		}) }

		<br /> <br />

		<button onClick={ ()=> showEditRuleForm(false) }> Cancel </button>
		<button onClick={ saveRule }> Save </button>
	</Fragment>


})
	// return <Fragment>
	// 	<h2>Create new rule [{selected_class.class_name}]</h2>



	// 	<select value={selected_object_id} onChange={ ({target: {value}})=> selectObject(parseInt(value)) }>
	// 		<option value={0}>Select Object</option>
	// 		{ idf_objects.map( idf_object => <option 
	// 			value={idf_object.id}
	// 			key={"lib-object-select-"+idf_object.id}>{idf_object.fields.A1}</option> 
	// 		)}
	// 	</select>


	// 	<button onClick={ ()=> showNewRuleWizard(false) }> Cancel   </button>
	// 	{ selected_object && show_finish 
	// 		? <button onClick={ ()=> createRule(rule_data) }>  Finish </button>
	// 		: <button onClick={ ()=> setSelectClassStep(true) }>  Next </button>
	// 	}

	// 	{ select_class_step && 
	// 		<Fragment>
	// 			<h2>Trigger Condition</h2>
	// 			<br/>
	// 			Select Refered Class
	// 			<select value={condition} onChange={ ({target: {value}}) => {
	// 				console.log("debug: ", value)
	// 				setCondition(parseInt(value))
	// 				getSecondaryConditionOptions(parseInt(value))
	// 			}}>
	// 				<option value={0}>Select Class</option>
	// 				{ self_class.concat(refered).map( idd_class => <option 
	// 					value={idd_class.ref_class_id}
	// 					key={"refered-class-"+idd_class.ref_class_id}>{idd_class.referred_class}</option> 
	// 				)}
	// 			</select>
	// 			<br/>
	// 			Select Refering Class
	// 			<select value={condition} onChange={ ({target: {value}}) => {
	// 				setCondition(parseInt(value))
	// 				getSecondaryConditionOptions(parseInt(value))
	// 			}}>
	// 				<option value={0}>Select Class</option>
	// 				{ refering.map( idd_class => <option 
	// 					value={idd_class.ref_class_id}
	// 					key={"refering-class-"+idd_class.ref_class_id}>{idd_class.referred_class}</option>
	// 				)}
	// 			</select>
	// 		</Fragment>


	// }
	// { secondary_condition && Object.keys(secondary_condition).map( idd_name => {
	// 	const options = secondary_condition[idd_name]

	// 	return <Fragment  key={"secondary-condition-field-"+idd_name}>
	// 		<br />
	// 		<label>
	// 			{ idd_name }
	// 			<select
	// 				onChange={ e => setSecondaryConditionData( {...secondary_condition_data, [idd_name]: e.target.value} ) } 
	// 				value={secondary_condition_data.hasOwnProperty(idd_name) ? secondary_condition_data[idd_name] : null}>
	// 				{ options.map( value => {
	// 					return <option key={"secondary-condition-field-"+idd_name + "-" + value} value={value }>
	// 						{value}
	// 					</option>
	// 				})}
	// 			</select>
	// 		</label>

	// 	</Fragment>


	// }) }
	// </Fragment>
