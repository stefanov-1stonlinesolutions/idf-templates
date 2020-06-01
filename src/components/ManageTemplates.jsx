import React, {useState, Fragment} from "react";
import { connect } from 'react-redux'
import { setIDFVersion } from "../reducers/idf_versions"
import { setTemplate, createNewTemplate } from "../reducers/templates"
import IDFVersions from "./IDFVersions.jsx"

export default connect(
	state    => ({
		templates:    state.templates,
		library:      state.library
	}),

	dispatch => ({
		selectTemplate: (template_id) => {
			setTemplate(template_id);
		}

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
			{idf_version_id && 
				<label> Select Template
			      <select onChange={ ({ target: {value}} ) => selectTemplate(value) } value={selected || ""}>
			      	<option key={"idf-template--1"} value={""} >Select template</option>
			      	{ templates.map( (template, i) => <option 
			      		key={"idf-template-" + i} 
			      		value={template.id}>{template.template_name}
			      	</option> ) }
			      </select>
			      <button onClick={ () => showNewTemplateForm(true) }>Create new</button>
		    	</label>
			}
		</Fragment> 


		}

    	
	</Fragment>
})
