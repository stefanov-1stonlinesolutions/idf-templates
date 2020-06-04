import React, {useState, Fragment} from "react";
import { connect } from 'react-redux'
import styled from "styled-components"
import { setIDFVersion } from "../reducers/idf_versions"
import { 
	setTemplate,
	createNewTemplate,
	duplicateTemplate,
	deleteTemplate,
} from "../reducers/templates"
import IDFVersions from "./IDFVersions.jsx"

const TemplateControls = styled.span`
	display: inline-block;
	float: right;
`

export default connect(
	state    => ({
		templates:    state.templates,
		library:      state.library
	}),

	dispatch => ({
		selectTemplate:    (template_id) => setTemplate(template_id),
		duplicateTemplate: (template_id) => duplicateTemplate(template_id),
		deleteTemplate:    (template_id) => deleteTemplate(template_id),

	}),
)
(function ManageTemplates({
	templates: { templates, selected },
	library: { library: { idf_version_id } },
	selectTemplate
}) {

	const [new_template, showNewTemplateForm] = useState(false)

	const [new_template_name, setNewTemplateName] = useState("")

	return <Fragment>

		{ new_template 

		? <div>
    		<label> Template name
    			<input
    				type="text"
    				value={new_template_name}
    				onChange={ ({target:{value}}) => setNewTemplateName(value)}
				/>
			</label>
			<label>
				<button onClick={ ()=>{
					setNewTemplateName("")
					showNewTemplateForm(false)
				}}>Cancel</button>
				<button
					onClick={ ()=>{
						createNewTemplate(new_template_name, idf_version_id)
						setNewTemplateName("")
						showNewTemplateForm(false)
					}}
				>Save</button>
			</label>
    	</div>


		: <Fragment>
			<IDFVersions />
			<br />

			{ idf_version_id && <button
					onClick={ ()=>{
						setNewTemplateName("")
						showNewTemplateForm(true)
				}}
				>New Template</button>
			}

			{ idf_version_id && templates.map( template => <p key={"template-list-item-" + template.id}>
				<span>{template.template_name}</span>
				<TemplateControls>
					<button onClick={ () => selectTemplate(template.id) }>Edit</button>
					<button onClick={ () => duplicateTemplate(template.id) }>Duplicate</button>
					<button onClick={ () => deleteTemplate(template.id) }>Delete</button>
				</TemplateControls>
			</p> )

				


			}
		</Fragment> 


		}

    	
	</Fragment>
})




				// {<label> Select Template
			 //      <select onChange={ ({ target: {value}} ) => selectTemplate(value) } value={selected || ""}>
			 //      	<option key={"idf-template--1"} value={""} >Select template</option>
			 //      	{ templates.map( (template, i) => <option 
			 //      		key={"idf-template-" + i} 
			 //      		value={template.id}>{template.template_name}
			 //      	</option> ) }
			 //      </select>
			 //      <button onClick={ () => showNewTemplateForm(true) }>Create new</button>
		  //   	</label>}
