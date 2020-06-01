import React, {useState}  from "react";
import { connect }        from 'react-redux'
// import { setIDFVersion }  from "../reducers/idf_versions"
import { fetchTemplates } from "../reducers/templates"
import { fetchLibrary }   from "../reducers/library"

export default connect(
	state    => ({ idf_versions: state.idf_versions, library: state.library }),
	dispatch => ({
		selectVersion: (idf_version) => {
			fetchTemplates(idf_version);
			fetchLibrary(idf_version);
		}
	}),
)
(function IDFVersions({
	idf_versions: { versions },
	library:      { library: { idf_version } },
	selectVersion
}) {
	return <label> Select IDF Version
	      <select 
	      	onChange={ ({ target: {value}} ) => selectVersion(value) }
	      	value={idf_version || ""}
	      >
	      	<option key={"idf-version--1"} value={""} >Select version</option>
	      	{ versions.map( (version, i) => <option key={"idf-version-" + i} value={version.version}>{version.version}</option> ) }
	      </select>
    		
    	</label>
})
