/**
 * TODO editing
 * if user is logged in and is orgAdmin or orgTaxonomyWriter
 * and object is not synonym
 * show editing symbol
 * if user klicks it, toggle store > editingTaxonomies
 * edit prop: see https://stackoverflow.com/a/35349699/712005
 */
import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import PropertyList from './PropertyList.jsx'
import { NewProperty } from '../../../../shared/NewProperty.jsx'
import storeContext from '../../../../../storeContext.js'

const PropertiesTitleContainer = styled.div`
  display: flex;
  padding-top: 10px;
`
const PropertiesTitleLabel = styled.p`
  flex-basis: 250px;
  text-align: right;
  padding-right: 5px;
  margin: 3px 0;
  padding: 2px;
  color: grey;
`
const PropertiesTitleLabelEditing = styled.p`
  margin: 3px 0;
  padding-bottom: 2px;
`
const PropertiesTitleLabelStacked = styled.p`
  margin: 3px 0;
  padding-bottom: 2px;
  color: grey;
`
const PropertiesTitleValue = styled.p`
  margin: 3px 0;
  padding: 2px;
  width: 100%;
`

const Properties = ({ id, properties, stacked }) => {
  const store = useContext(storeContext)
  const { editingTaxonomies } = store

  const propertiesArray = Object.entries(properties)

  return (
    <>
      {propertiesArray.length > 0 && (
        <PropertiesTitleContainer>
          {editingTaxonomies ? (
            <PropertiesTitleLabelEditing>
              Eigenschaften:
            </PropertiesTitleLabelEditing>
          ) : stacked ? (
            <PropertiesTitleLabelStacked>
              Eigenschaften:
            </PropertiesTitleLabelStacked>
          ) : (
            <PropertiesTitleLabel>Eigenschaften:</PropertiesTitleLabel>
          )}
          <PropertiesTitleValue />
        </PropertiesTitleContainer>
      )}
      <PropertyList
        propertiesArray={propertiesArray}
        properties={properties}
        editing={editingTaxonomies}
        stacked={stacked}
        id={id}
      />
      {editingTaxonomies && (
        <NewProperty
          key={`${id}/newProperty`}
          id={id}
          properties={properties}
        />
      )}
    </>
  )
}

export default observer(Properties)
