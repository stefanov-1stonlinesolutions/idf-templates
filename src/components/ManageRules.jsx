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
	getLibraryObjects
} from "../reducers/templates"

import NewRuleWizard from "./NewRuleWizard.jsx" 



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
			// getObjects(idd_class)
		}

	}),
)
(function ManageRules({
	templates: { selected, templates, classes, selected_class },
	selectClass
}) {

	const [new_rule, showNewRuleWizard] = useState(false)
	const [search, setSearch] = useState("")

	let template
	for(let tpl of templates){
		if (tpl.id === parseInt(selected)){
			template = tpl;
			break;
		}
	}

	return new_rule 
		? <NewRuleWizard showNewRuleWizard={showNewRuleWizard} />

		: <Fragment>
			<h2>{template.template_name}</h2>
			<button onClick={ ()=> setTemplate(null)       }> Cancel   </button>
			{ selected_class && <button onClick={ ()=> showNewRuleWizard(true) }> New Rule </button> }

			<Wrapper>
				<ClassesList>
					<input type="text" value={search} onChange={ ({target: {value}}) => setSearch(value) } />
					{ Object.keys(classes).map( group_name => {
			    		const idd_classes = classes[group_name];
			    		return <div key={"idd-class-group-"+group_name}>
			    			<h2>{group_name}</h2>
					    	{idd_classes
					    		.filter( ({class_name}) => class_name.toLowerCase().indexOf(search.toLowerCase()) > -1 )
					    		.map( idd_class => <p 
					    		key={"class-menu-item-" + idd_class.id} 
					    		style={({"textAlign": "left"})}
					    		onClick={ ()=>selectClass(idd_class) }
					    	>
					    		{idd_class.class_name}
					    	</p> )}
			    		</div>
			    	})}
				</ClassesList>
			</Wrapper>


		</Fragment>

})
