import React, {useState} from "react";
import { connect } from 'react-redux'
import "./styles.css";

import Message         from "./components/Message.jsx"
import ManageRules     from "./components/ManageRules.jsx"
import ManageTemplates from "./components/ManageTemplates.jsx"

import { setIDFVersion } from "./reducers/idf_versions"
import { setTemplate, createNewTemplate } from "./reducers/templates"

export default connect(
	state    => ({
		idf_versions: state.idf_versions,
		library:      state.library,
		templates:    state.templates
	}),

	dispatch => ({}),
)
(function App({idf_versions, library, templates}) {

	const message = idf_versions.message 
		|| library.message
		|| templates.message

	if(message) return <Message message={message} />
	
	const selected_template = templates.selected || ""

	if(selected_template) return <ManageRules />


	return <ManageTemplates />

	// const [new_template, showNewTemplateForm] = useState(false)

	// const [template_name, setTemplateName] = useState("")
	// const version_id = library.library ? library.library.idf_version_id : ""
	// const idf_version = library.library ? library.library.idf_version : ""

	// const classes = templates.classes


	// if(message) return <h2>{message}</h2>


	// const { versions } = idf_versions

/*
  return (
    <div className="App">
    	<label> Select IDF Version
	      <select onChange={ ({ target: {value}} ) => setIDFVersion(value) } value={idf_version}>
	      	<option key={"idf-version--1"} value={""} >Select version</option>
	      	{ versions.map( (version, i) => <option key={"idf-version-" + i} value={version.version}>{version.version}</option> ) }
	      </select>
    		
    	</label>

    	<br />

    	<label> Select Template
	      <select onChange={ ({ target: {value}} ) => setTemplate(value) } value={selected_template}>
	      	<option key={"idf-template--1"} value={""} >Select template</option>
	      	{ templates.templates.map( (template, i) => <option 
	      		key={"idf-template-" + i} 
	      		value={template.id}>{template.template_name}
	      	</option> ) }
	      </select>
	      <button onClick={ () => showNewTemplateForm(true) }>Create new</button>
    		
    	</label>

    	{ new_template && library.library && <div>
    		<label> Template name
    			<input
    				type="text"
    				value={template_name}
    				onChange={ ({target:{value}}) => setTemplateName(value)}
				/>
			</label>
			<label>
				<button onClick={ ()=>{
					setTemplateName("")
					showNewTemplateForm(false)
				}}>Cancel</button>
				<button
					onClick={ ()=>{
						createNewTemplate(template_name, version_id)
						setTemplateName("")
						showNewTemplateForm(false)
					}}
				>Save</button>
			</label>
    	</div>}



    	{ Object.keys(classes).map( group_name => {
    		const idd_classes = classes[group_name];
    		return <div key={"idd-class-group-"+group_name}>
    			<h2>{group_name}</h2>
		    	{idd_classes.map( idd_class => <p key={"class-menu-item-" + idd_class.id} style={({"text-align": "left"})}>
		    		{idd_class.class_name}
		    	</p> )}
    		</div>
    	})}



    </div>
  );
*/
})
