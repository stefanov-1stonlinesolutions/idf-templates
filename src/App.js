import React, {useState, Fragment} from "react";
import { connect } from 'react-redux'
import styled from "styled-components"
import "./styles.css";
import "carbon-components/css/carbon-components.min.css";

import { Dropdown, Search, Button, TextInput,
	// SideNav, SideNavItems, SideNavMenu, SideNavMenuItem
	Accordion, AccordionItem, SkeletonText
} from 'carbon-components-react';

import Message         from "./components/Message.jsx"
// import ManageRules     from "./components/ManageRules.jsx"
// import ManageTemplates from "./components/ManageTemplates.jsx"
import RuleItem        from "./components/RuleItem.jsx"

// import { setIDFVersion } from "./reducers/idf_versions"
import { fetchTemplates, duplicateTemplate, deleteTemplate } from "./reducers/templates"
import { setTemplate, createNewTemplate, getRules, getRulesObjects, createTemplateRule } from "./reducers/templates"
import { fetchLibrary, fetchLibraryObjects }   from "./reducers/library"
import { setMessage } from "./reducers/messages"





const AddonWrapper=styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;

	.addon-header{
		flex-basis: 75px;
		overflow: visible;
		flex-grow: 0;
		flex-shrink: 0;
	}

	.addon-content {
		flex-grow: 1;
		overflow: auto;

	}

	.addon-content > * {
		display: block;
		height: 100%;
		overflow: auto;
	}

	.bx--accordion__title {
	    line-height: 15px;
	}
`;

const VersionsDropdown = styled(Dropdown)`
  width: 120px;
  background: white;
  margin-right: 10px;
  font-size: 0.9rem;
  box-shadow: none;

  .bx--list-box__menu-item,
  .bx--list-box__label {
    color: #5596e6;
    font-weight: normal;
    text-transform: uppercase;
  }

  .bx--list-box__field {
  }
`;

const TemplatesDropdown = styled(Dropdown)`
  width: 220px;
  background: white;
  margin-right: 10px;
  font-size: 0.9rem;
  box-shadow: none;

  .bx--list-box__menu-item,
  .bx--list-box__label {
    color: #5596e6;
    font-weight: normal;
    text-transform: uppercase;
  }

  .bx--list-box__field {
  }
`;

const HeaderWrapper=styled.div`
	display: flex;
	align-content:   flex-start;
	justify-content: flex-start;
	flex-direction: row;

	> * {
		flex-shrink: 0;
		flex-grow: 0;
	}
`;

const ContentWrapper=styled.div`
	display: flex;
	align-content:   flex-start;
	justify-content: flex-start;
	flex-direction: row;

	> .class-list {
		position: relative;
		overflow: auto;
		flex-shrink: 0;
		flex-grow: 0;
		flex-basis: 350px;
	}

	> .rules-list {
		flex-shrink: 0;
		flex-grow: 1;
		flex-basis: 150px;
	}
`;

const StyledButton = styled(Button)`
    width: 70px;
    height: 45px;
    margin: 18px 0px 0px 5px;
    text-align: center;
    padding:0;

    span{
    	display: block;
    	margin: auto;
    	padding:0;
    }

`;

const ClassListItem = styled.p`
	position: relative;
	width: 125%;
	display: flex;
	flex-direction: row;
	button {
	    flex-basis: 50px;
	    flex-grow: 0;
	    flex-shrink: 0;
	    height: 15px;
	    line-height: 5px;
	    cursor: pointer;
	}
	span{
		display: inline-block;
		flex-grow: 0;
		flex-shrink: 0;
		flex-basis: 250px;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	&:hover {
		color: blue;
	}
`;

export default connect(
	state    => ({
		idf_versions: state.idf_versions,
		library:      state.library,
		templates:    state.templates,
		messages:     state.messages
	}),

	dispatch => ({
		selectVersion: async idf_version => {
			await fetchTemplates(idf_version);
			await fetchLibrary(idf_version);
			await fetchLibraryObjects(idf_version);

			setMessage(null)
		},
		setTemplate:       (template_id) => setTemplate(template_id),
		duplicateTemplate: (template_id) => duplicateTemplate(template_id),
		deleteTemplate:    (template_id) => deleteTemplate(template_id),
	}),
)(function App({
	idf_versions,
	library: { idf_objects, objects_by_class_name},
	templates,
	selectVersion,
	setTemplate,
	duplicateTemplate,
	deleteTemplate,
	messages
}) {

	const [ selected_version,  setSelectedVersion ]  = useState(null);
	const [ selected_template, setSelectedTemplate ] = useState(null);
	const [ show_new_template_form, setShowNewTemplateForm ] = useState(false);
	const [ new_template_name, setNewTemplateName] = useState("")
	const [ rule_search_term, setRuleSearchTerm] = useState("")

	// const message = idf_versions.message 
	// 	|| library.message
	// 	|| templates.message

	if(messages.message) return <Message message={messages.message} />

	const {
		classes,
		rules,
		rules_objects
	} = templates

	async function selectVesion(item){
		setSelectedVersion(item)
		setSelectedTemplate(null)
		await selectVersion(item.id)
	}

	function selectTemplate(item){
		setTemplate(item.id);
		setSelectedTemplate(item);
	}

	function setShowNewTemplateFormAction(){
		setNewTemplateName("")
		setSelectedTemplate(null)
		setShowNewTemplateForm(true)
	}

	async function selectTemplateAction(item){
		selectTemplate(item)
		await getRules()
		await getRulesObjects()
	}

	return <AddonWrapper>
		<HeaderWrapper className="addon-header">
			{ !!idf_versions.versions.length && <Fragment>
					<VersionsDropdown
						id="select-idf-version"
						label="Select"
						ariaLabel="Select"
						titleText="Select IDF Version"
						items={ idf_versions.versions.map( ({version, id})=>({
							id: version,
							text: version,
							version_id: id 
						}) ) }
						itemToString={ (item) => item ? item.text : null }
						selectedItem={selected_version}
						onChange={ ({selectedItem})=>selectVesion(selectedItem) }
					/>

					{ !!templates.templates.length && <TemplatesDropdown
						id="select-idf-template"
						label="Select"
						ariaLabel="Select"
						titleText="Select IDF Template"
						items={ templates.templates.map( ({id, template_name})=>({id, text: template_name}) ) }
						itemToString={ (item) => item ? item.text : null }
						selectedItem={selected_template}
						onChange={ ({selectedItem})=>selectTemplateAction(selectedItem) }
					/>}

					{ !!selected_version 
						&& <StyledButton onClick={ e => setShowNewTemplateFormAction() }>
							<span>New</span>
						</StyledButton>
					}

					{ !!selected_template && <div>
						<StyledButton onClick={ () => duplicateTemplate(selected_template.id) }>
							<span>Duplicate</span>
						</StyledButton>
						<StyledButton onClick={ () =>{
						 	deleteTemplate(selected_template.id)
						 	setSelectedTemplate(null)
						} }>
							<span>Delete</span>
						</StyledButton>
						<div style={({display: "inline-block", marginLeft: "10px" })}>
							<TextInput
								
								id="search-rule-by-class-name-input"
								value={rule_search_term}
								labelText="Search Rule"
								onChange={ e => setRuleSearchTerm(e.target.value) }
							/>							
						</div>

					</div> }


				</Fragment>

			}
		</HeaderWrapper>

		<ContentWrapper className="addon-content">
			{ show_new_template_form 
				? <div>
					<br /><br /><br />
					<TextInput
						id="new-template-name"
						value={new_template_name}
						labelText="Enter New Template Name"
						onChange={ e => setNewTemplateName(e.target.value) }
					/>
					<br />
					<StyledButton onClick={ () => {
						setNewTemplateName("")
						selectTemplate(null)
						setShowNewTemplateForm(false)
					}}>Cancel</StyledButton>
					<StyledButton disabled={!new_template_name} onClick={ async () => {
						const template = await createNewTemplate(new_template_name, selected_version.version_id)
						selectTemplateAction({id: template.id, text: template.template_name})
						setNewTemplateName("")
						setShowNewTemplateForm(false)
					}}>Create</StyledButton>
				</div>

				: <Fragment>
					{ selected_template && <Fragment>
						<Accordion className="class-list">

							{ Object.keys(classes).map( group_name => {
								const group_classes = classes[group_name]
								return <AccordionItem 
									title={ group_name } 
									key={"idd-group-list-"+group_name}>
									{ group_classes.map( idd_class => <ClassListItem 
										key={"idd-class-item-"+idd_class.class_name}>
										<span title={idd_class.class_name}>{idd_class.class_name}</span>
										{ objects_by_class_name[idd_class.class_name] && <button
											onClick={ () => createTemplateRule({
													source_object_id: objects_by_class_name[idd_class.class_name][0].id,
													type: "add",
													class_id: null,
													condition: {},
												})
											 } 
										>+</button>}
										
									</ClassListItem> ) }
								</AccordionItem>

							}) }

						</Accordion>
						<div className="rules-list">
							{ rules
								// .filter( rule => {
								// 	if(!rule_search_term) return true
								// 	const { class_name } = idf_objects[rule.source_object_id]
								// 	return class_name.toLowerCase().indexOf(rule_search_term.toLowerCase()) > -1
								// })
								.sort( (a,b) => idf_objects[a.source_object_id].class_id - idf_objects[b.source_object_id].class_id )
								.map( rule => {
									const idf_object = idf_objects[rule.source_object_id]
									if(!idf_object) return <SkeletonText />

									let style={}
								    const class_name = idf_object.class_name
									if(rule_search_term && class_name.toLowerCase().indexOf(rule_search_term.toLowerCase()) > -1){
										style={ display: "none" }
									}

									return <RuleItem 
										style={style}
										rule={rule}
										idf_object={idf_object}
										key={"rule-item-"+rule.id} 
									/>
							})}

						</div>
					</Fragment>}
				</Fragment>


			}


		</ContentWrapper>
	</AddonWrapper>
	
	// return <ManageTemplates />
	


	// const selected_template = templates.selected || ""
	// if(selected_template) return <ManageRules />



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
