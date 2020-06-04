import React, {useState, Fragment} from "react";
import { connect } from 'react-redux'
import styled from 'styled-components'
import { setIDFVersion } from "../reducers/idf_versions"
import {
	setTemplate,
	createNewTemplate,
	getRules,
	getObjects,
	setClass,
	getRelatedClasses,
	getLibraryObjects,
	deleteRule
} from "../reducers/templates"

import NewRuleWizard from "./NewRuleWizard.jsx"
import EditRuleForm  from "./EditRuleForm.jsx"

const RuleControls = styled.span`
	display: inline-block;
	float: right;
`

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
`

const ClassesList = styled.div`
	flex-basis: 50%;
	flex-grow: 0;
	flex-shrink: 0;
	height: 300px;
	overflow: auto;

`

const SourceObjectsList = styled.div`
	flex-basis: 50%;
	flex-grow: 0;
	flex-shrink: 0;
	height: 300px;
	overflow: auto;

`



export default connect(
	state    => ({
		templates: state.templates
	}),

	dispatch => ({
		selectClass: async (idd_class) => {
			setClass(idd_class)
			getRules(idd_class)
			getRelatedClasses(idd_class)
			getLibraryObjects(idd_class)
		},
		deleteRule

	}),
)
(function ManageRules({
	templates: { selected, templates, classes, selected_class, rules, idf_objects },
	selectClass,
	deleteRule
}) {

	const [new_rule,  showNewRuleWizard] = useState(false)
	const [edit_rule, showEditRuleForm]  = useState(false)

	const [search, setSearch] = useState("")

	const rule_obj_ids = rules.map(({source_object_id}) => source_object_id )
	const rules_data = idf_objects.filter( obj => {
		return rule_obj_ids.indexOf(obj.id) > -1
	}).map( obj => {
		return {
			rule: rules[rule_obj_ids.indexOf(obj.id)],
			idf_object: obj
		}
	})

	let template
	for(let tpl of templates){
		if (tpl.id === parseInt(selected)){
			template = tpl;
			break;
		}
	}

	// function editRule(rule_id){

	// }

	return <Fragment>
		{({
			"true,false": <NewRuleWizard showNewRuleWizard={showNewRuleWizard} />,
			"false,true": <EditRuleForm  showEditRuleForm={showEditRuleForm} rule={edit_rule}  />,
			"false,false": <Fragment>
				<h2>{template.template_name}</h2>
				<input placeholder="Search Class Name" type="text" value={search} onChange={ ({target: {value}}) => setSearch(value) } />
				<button onClick={ ()=> setTemplate(null)       }> Cancel   </button>
				{ selected_class && <button onClick={ ()=> showNewRuleWizard(true) }> New Rule </button> }
				<Wrapper>
					<ClassesList>
						{ Object.keys(classes).map( group_name => {
				    		const idd_classes = classes[group_name];

				    		if(!idd_classes
						    		.filter( ({class_name}) => class_name.toLowerCase().indexOf(search.toLowerCase()) > -1 ).length){
				    			return null
				    		}
				    		return <div key={"idd-class-group-"+group_name}>
				    			<h2>{group_name}</h2>
						    	{idd_classes
						    		.filter( ({class_name}) => class_name.toLowerCase().indexOf(search.toLowerCase()) > -1 )
						    		.map( idd_class => <p 
						    		key={"class-menu-item-" + idd_class.id} 
						    		style={({"textAlign": "left"})}
						    		onClick={ ()=>selectClass(idd_class) }
						    		title={idd_class.class_name}
						    	>
						    		{ idd_class.class_name.length > 25 ? (idd_class.class_name.slice(0,25) + "...") : idd_class.class_name }
						    	</p> )}
				    		</div>
				    	})}
					</ClassesList>


					<SourceObjectsList>
						{ rules_data.map( ({rule, idf_object}) => <p key={"rule-list-item-" + rule.id}>
							{ idf_object.fields.A1 ? idf_object.fields.A1 : "#" + idf_object.id }
							<RuleControls>
								<button onClick={() => showEditRuleForm(rule)}>Edit</button>
								<button onClick={() => deleteRule(rule.id)}>Delete</button>
							</RuleControls>
						</p>
						)}
					</SourceObjectsList>
				</Wrapper>
			</Fragment>,
		})[ [new_rule, !!edit_rule].join(",") ] || null }
	</Fragment>


})
