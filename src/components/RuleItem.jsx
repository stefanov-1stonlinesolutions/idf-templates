import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux'
import api from "../services/api"
// import moment from 'moment';
// import MenuIcon from '@carbon/icons-react/es/overflow-menu--vertical/16';
import { Dropdown, Button } from 'carbon-components-react';
// import AddonDetails from './AddonDetails';

import {getRelatedClasses, deleteRule, createTemplateRule} from "../reducers/templates"

const Container = styled.div`
  position: relative;
  background: #FFFFFF;
  box-shadow: 1px 1px 5px #00000029;
  border-radius: 3px;
  padding: 0px;
  background-color: #eeeeee;
  margin: 20px;
`;

const BriefContainer = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddonNameContainer = styled.div`
  min-width: 50%;
  margin-right: 15px;
`;

const AddonName = styled.div`
  font-size: 1rem;
  margin-bottom: 8px;
`;

const AddonDescription = styled.div`
  font-size: 0.8rem;
`;

const ShowMoreButton = styled.div`
  color: #5596e6;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  padding-left: 19px;

  i {
    color: #5596e6;
    margin-left: 5px;
  }

  ${props => props.isOpen && css`
    i {
      transform: scaleY(-1);
    }
  `}
`;

const SecondaryConditionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  content-align
  padding: 15px 20px;
  > div {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 50%;
    padding-left: 19px;
  }
`;


const IDFObjectsDropdown = styled(Dropdown)`
  width: 350px;
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

const SecondaryConditionDropdown = styled(Dropdown)`
  width: 50%;
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

const ControlsWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  overflow: visible;
  z-index: 100;
  width: 20px;
  height: 20px;
  background-color: transparent;
  cursor: pointer;

  &:before, &:after {
    content: "";
    width: 2px;
    height: 3px;
    position: absolute;
  }

  &:before{
    top: 2px;
    left: 7px;
    border-top-style: solid;
    border-top-color: black;
    border-top-width: 2px;
  }

  &:after{
    top: 7px;
    left: 7px;
    border-top-style: solid;
    border-top-color: black;
    border-top-width: 2px;

    border-bottom-style: solid;
    border-bottom-color: black;
    border-bottom-width: 2px;
  }
`


const ControlsButtonsWrapper = styled.div`
  position: absolute;
  right: 100%;
  width: 100px;

  span {
    display: block;
    cursor: pointer;
  }
  span:hover {
    color: blue;
  }
`

export default connect(
  state    => ({ library: state.library, template_id: state.templates.selected}),
  dispatch => ({})
)(function RuleItem({
  library: { idf_objects, objects_by_class_name, library },
  template_id,
  idf_object,
  rule,
  style
}){
    const [isOpen, setIsOpen]      = useState(false);
    const [controlsOpen, setControlsOpen] = useState(false);
    const [rule_data, setRuleData] = useState({...rule})
    const [secondary_condition_options, setSecondaryConditionOptions] = useState(null)
    const [secondary_condition_data, setSecondaryConditionData] = useState(rule.condition)
    const [fields_by_idd_name, setFieldsByIDDName] = useState(null)
    const [idd_class, setIDDClass] = useState(null)
    const [source_idd_class, setSourceIDDClass] = useState(null)
    const [selected_object, setSelectedObject] = useState({
      id:   rule.source_object_id,
      text: (source_idd_class && source_idd_class.fields[0].references.length) ? idf_object.fields.A1 : ("#"+idf_object.id)     
    })

    if((source_idd_class && source_idd_class.fields[0].references.length)){
      selected_object.text = idf_object.fields.A1
    }

    const [ref_classes, setRefClasses] = useState(null)

    let [selectedTriggerCondition, setSelectedTriggerCondition] = useState({
      id: rule.class_id
    })

    async function updateRule(data){
      setRuleData(await api.updateRule(data))
    }

    async function selectTriggerCondition(item){
      setSelectedTriggerCondition(item)

      const data = {
        ...rule_data,
        type: idf_object.class_id === item.id ? "modify" : "add",
        class_id: item.id,
        condition: {}
      }

      setRuleData(data)
      updateRule(data)

      setSecondaryConditionOptions({})
      setSecondaryConditionData({})
      setFieldsByIDDName(null)
      setIDDClass(null)

      if(item.id !== null){
        setSecondaryConditionOptions( await api.getSecondaryCondition(item.text, template_id) )
        const idd_class = await api.getIDDClass(library.id, item.text)
        const fields_by_idd = {}
        idd_class.fields.forEach( idd_field => {
          fields_by_idd[idd_field.idd_name] = idd_field
        })
        setFieldsByIDDName(fields_by_idd)
        setIDDClass(idd_class)
      }

    }

    useEffect( () =>{
      async function getRefClasses(){
        const ref_classes = await getRelatedClasses(idf_object.class_name)
        setRefClasses(ref_classes)
        setSourceIDDClass(await api.getIDDClass(library.id, idf_object.class_name) )

        for(let ref_class of ref_classes.refered.concat(ref_classes.refering)){
          if(ref_class.ref_class_id === rule_data.class_id){
            setSecondaryConditionOptions( await api.getSecondaryCondition(ref_class.referred_class, template_id) )
            const idd_class = await api.getIDDClass(library.id, ref_class.referred_class)
            const fields_by_idd = {}
            idd_class.fields.forEach( idd_field => {
              fields_by_idd[idd_field.idd_name] = idd_field
            })
            setFieldsByIDDName(fields_by_idd)
            setIDDClass(idd_class)
            break;
          }
        }
      }
      if(!ref_classes) setTimeout( ()=>getRefClasses(), 0)
    }, [ref_classes, setRefClasses] )

    const class_objects = objects_by_class_name[idf_object.class_name]

    const self_class_item = idd_class ? { id: idd_class.id, text: idd_class.class_name } : null

    async function toggleOpen() {
      if (isOpen) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }

    async function selectObjectAction(selectedObject){
      setSelectedObject(selectedObject)
      const data = {...rule_data, source_object_id: selectedObject.id}
      setRuleData(data)
      updateRule(data)
    }



    return (
      <Container style={style}>
        <ControlsWrapper onClick={ () => setControlsOpen(!controlsOpen) }>
          { controlsOpen && <ControlsButtonsWrapper>
            <span onClick={ ()=>deleteRule(rule.id) }>Delete</span>
            <span onClick={ e => {
              const {id, ...data} = rule
              createTemplateRule(data)
            }}>Duplicate</span>
          </ControlsButtonsWrapper> }
        </ControlsWrapper>
        <BriefContainer>
          <AddonNameContainer>
            <AddonName>{ idf_object.class_name }</AddonName>
            <IDFObjectsDropdown
              id="select-idf-object-from-librray-dropdown"
              label="Select IDF Object"
              ariaLabel="Select IDF Object"
              titleText="Select IDF Object"
              items={ class_objects.map( ({id, fields: {A1} })=>({id, text: (source_idd_class && source_idd_class.fields[0].references.length) ? A1 : ("#"+id) }) ) }
              itemToString={ (item) => item ? item.text : null }
              selectedItem={selected_object}
              onChange={ ({selectedItem})=>selectObjectAction(selectedItem) }
            />



          </AddonNameContainer>


          {ref_classes && <AddonNameContainer>
            <br/><br/>
            <IDFObjectsDropdown
              id={`apply=rule-condition-${rule.id}`}
              label="Select Conditiont"
              ariaLabel="Select Conditiont"
              titleText="Apply on:"
              items={ 

                [ { id: null, text: "Project"} ]
                .concat(self_class_item)
                .concat(ref_classes.refering.map( ({ref_class_id, referred_class}) => ({id: ref_class_id, text: referred_class}) ))
                .concat(ref_classes.refering.map( ({ref_class_id, referred_class}) => ({id: ref_class_id, text: referred_class}) ))
                .filter( item => {
                  if(!item) return false
                  if(rule_data.class_id === item.id) selectedTriggerCondition = item
                  if(self_class_item && self_class_item.id === item.id) return false
                  return true
                })


              }
              itemToString={ (item) => item ? item.text : null }
              selectedItem={selectedTriggerCondition}
              onChange={ ({selectedItem})=>selectTriggerCondition(selectedItem) }
            />

            </AddonNameContainer>
          }







        </BriefContainer>
        
        <br />
        <ShowMoreButton onClick={toggleOpen} isOpen={isOpen}>
          <ShowMoreButton>{isOpen ? 'Show Less' : 'Show More'}</ShowMoreButton>
        </ShowMoreButton>
        <br />

        {isOpen && <div>

            { (secondary_condition_options && fields_by_idd_name) && 
              <SecondaryConditionWrapper>
                { Object.keys(secondary_condition_options).map( idd_name => {
                  const idd_field = fields_by_idd_name[idd_name]
                  const options   = secondary_condition_options[idd_name]

                  return <SecondaryConditionDropdown
                    key={`select-secondary-condition-${idd_field.class_id}-${idd_field.idd_name}`}
                    id={`select-secondary-condition-${idd_field.class_id}-${idd_field.idd_name}`}
                    label={idd_field.field_name}
                    ariaLabel="Select option"
                    titleText={idd_field.field_name}
                    items={ options.map( option => ({id:option, text: option}) ) }
                    itemToString={ (item) => item ? item.text : null }
                    selectedItem={ (secondary_condition_data ? ({id: secondary_condition_data[idd_name], text: secondary_condition_data[idd_name]}||null) : null)}
                    onChange={ ({selectedItem})=>{
                      setSecondaryConditionData({...secondary_condition_data, [idd_name]: selectedItem.id })
                      updateRule({
                        ...rule_data,
                        condition: {
                          ...secondary_condition_data, [idd_name]: selectedItem.id 
                        }
                      })
                    } }
                  />

                }) }

              </SecondaryConditionWrapper>
            }
          </div>

        }
      </Container>
    );
})

