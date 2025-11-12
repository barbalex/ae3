import styled from '@emotion/styled'
import Icon from '@mui/material/Icon'
import {
  MdDone as DoneIcon,
  MdError as ErrorIcon,
  MdInfoOutline as InfoOutlineIcon,
} from 'react-icons/md'

import { appBaseUrl } from '../../../../modules/appBaseUrl.js'
import {
  h3,
  firstTitle,
  howToImportContainer,
  h4,
  liContainer,
  emSpan,
  inlineIcon,
  inlineDiv,
  doneIcon,
  errorIcon,
  infoOutlineIcon,
  p,
  ul,
} from './Instructions.module.css'

const EmSpan = styled.span`
  background-color: #8d8c8c40;
  padding: 1px 3px;
  border-radius: 4px;
`
const InlineIcon = styled(Icon)`
  margin-left: 8px;
`
const StyledDoneIcon = styled(DoneIcon)`
  color: green !important;
`
const StyledErrorIcon = styled(ErrorIcon)`
  color: red !important;
`
const StyledInfoOutlineIcon = styled(InfoOutlineIcon)`
  color: orange !important;
`
const StyledP = styled.p`
  margin-top: -5px;
`

export const PcoInstructions = ({
  idsExist,
  objectIdsAreReal,
  pCOfOriginIdsAreReal,
  existsPropertyKey,
  existsNoDataWithoutKey,
  idsAreUuids,
  idsAreUnique,
  objectIdsExist,
  objectIdsAreUuid,
  objectIdsAreRealNotTested,
  pCOfOriginIdsExist,
  pCOfOriginIdsAreUuid,
  pCOfOriginIdsAreRealNotTested,
  propertyKeysDontContainApostroph,
  propertyKeysDontContainBackslash,
  propertyValuesDontContainApostroph,
  propertyValuesDontContainBackslash,
}) => (
  <>
    <h3 className={firstTitle}>
      Anforderungen an zu importierende Eigenschaften
    </h3>
    <div className={howToImportContainer}>
      <h4 className={h4}>Autorenrechte</h4>
      <ul className={ul}>
        <li>
          <div className={liContainer}>
            <div>
              Die Autoren müssen mit der Veröffentlichung einverstanden sein
            </div>
          </div>
        </li>
        <li>
          <div className={liContainer}>
            <div>Dafür verantwortlich ist, wer Daten importiert</div>
          </div>
        </li>
      </ul>
      <h4 className={h4}>Tabelle</h4>
      <ul className={ul}>
        <li>
          <div className={liContainer}>
            <div>Die erste Zeile enthält Feld-Namen (= Spalten-Titel)</div>
          </div>
        </li>
        <li>
          <div className={liContainer}>
            <div>
              Jeder Wert hat einen Feld-Namen.
              <br />
              Anders gesagt: Jede Zelle mit einem Wert hat einen Spalten-Titel
            </div>
            {existsNoDataWithoutKey && (
              <div>
                <InlineIcon>
                  <StyledDoneIcon />
                </InlineIcon>
              </div>
            )}
            {existsNoDataWithoutKey === false && (
              <div>
                <InlineIcon>
                  <StyledErrorIcon />
                </InlineIcon>
              </div>
            )}
          </div>
        </li>
      </ul>
      <h4 className={h4}>Zuordnungs-Felder</h4>
      <ul className={ul}>
        <li>
          <div className={liContainer}>
            <div>
              Ein Feld namens <EmSpan>id</EmSpan> kann enthalten sein.
            </div>
            {idsExist && (
              <div>
                <InlineIcon>
                  <StyledDoneIcon />
                </InlineIcon>
              </div>
            )}
            {idsExist === false && (
              <div>
                <div className={inlineDiv}>(ist nicht)</div>
              </div>
            )}
          </div>
          <div className={liContainer}>
            <div>Wenn nicht, wird eine id erzeugt</div>
            {idsExist === false && (
              <div>
                <InlineIcon>
                  <StyledDoneIcon />
                </InlineIcon>
              </div>
            )}
          </div>
          <ul>
            <li>
              <div className={liContainer}>
                <div>
                  <EmSpan>id</EmSpan> muss gültige{' '}
                  <a
                    href="https://de.wikipedia.org/wiki/Universally_Unique_Identifier"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    UUID
                  </a>{' '}
                  sein
                </div>
                {idsAreUuids && (
                  <div>
                    <InlineIcon>
                      <StyledDoneIcon />
                    </InlineIcon>
                  </div>
                )}
                {idsAreUuids === false && (
                  <div>
                    <InlineIcon>
                      <StyledErrorIcon />
                    </InlineIcon>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>
                  <EmSpan>id</EmSpan> muss eindeutig sein
                </div>
                {idsAreUnique && (
                  <div>
                    <InlineIcon>
                      <StyledDoneIcon />
                    </InlineIcon>
                  </div>
                )}
                {idsAreUnique === false && (
                  <div>
                    <InlineIcon>
                      <StyledErrorIcon />
                    </InlineIcon>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div className={liContainer}>
            <div>
              Ein Feld namens <EmSpan>objectId</EmSpan> muss enthalten sein
            </div>
            {objectIdsExist && (
              <div>
                <InlineIcon>
                  <StyledDoneIcon />
                </InlineIcon>
              </div>
            )}
            {objectIdsExist === false && (
              <div>
                <InlineIcon>
                  <StyledErrorIcon />
                </InlineIcon>
              </div>
            )}
          </div>
          <ul>
            <li>
              <div className={liContainer}>
                <div>
                  <EmSpan>objectId</EmSpan> muss gültige{' '}
                  <a
                    href="https://de.wikipedia.org/wiki/Universally_Unique_Identifier"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    UUID
                  </a>{' '}
                  sein
                </div>
                {objectIdsAreUuid && (
                  <div>
                    <InlineIcon>
                      <StyledDoneIcon />
                    </InlineIcon>
                  </div>
                )}
                {objectIdsAreUuid === false && (
                  <div>
                    <InlineIcon>
                      <StyledErrorIcon />
                    </InlineIcon>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>
                  <EmSpan>objectId</EmSpan> muss <EmSpan>id</EmSpan> eines
                  Objekts aus arteigenschaften.ch sein
                </div>
                {objectIdsAreReal && (
                  <div>
                    <InlineIcon>
                      <StyledDoneIcon />
                    </InlineIcon>
                  </div>
                )}
                {objectIdsAreReal === false && !objectIdsAreRealNotTested && (
                  <div>
                    <InlineIcon>
                      <StyledErrorIcon />
                    </InlineIcon>
                  </div>
                )}
                {objectIdsAreRealNotTested && (
                  <>
                    <InlineIcon>
                      <StyledInfoOutlineIcon />
                    </InlineIcon>
                    <div className={inlineDiv}>
                      (nicht getestet, da sehr viele Daten. Datensätze, welche
                      dieses Kriterium nicht erfüllen, werden nicht importiert)
                    </div>
                  </>
                )}
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div className={liContainer}>
            <div>
              Ein Feld namens <EmSpan>propertyCollectionOfOrigin</EmSpan> kann
              enthalten sein.
            </div>
            {pCOfOriginIdsExist && (
              <div>
                <InlineIcon>
                  <StyledDoneIcon />
                </InlineIcon>
              </div>
            )}
            {pCOfOriginIdsExist === false && (
              <div>
                <div className={inlineDiv}>(ist nicht)</div>
              </div>
            )}
          </div>
          <div className={liContainer}>
            <div>
              Zweck: In zusammenfassenden Eigenschaften-Sammlungen markieren,
              aus welcher Eigenschaften-Sammlung diese Eigenschaften stammen.{' '}
              <a
                href={`${appBaseUrl}Dokumentation/projektbeschreibung#zusammenfassende-eigenschaften-sammlungen`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mehr Infos
              </a>
            </div>
          </div>
          <ul>
            <li>
              <div className={liContainer}>
                <div>
                  <EmSpan>propertyCollectionOfOrigin</EmSpan> muss gültige{' '}
                  <a
                    href="https://de.wikipedia.org/wiki/Universally_Unique_Identifier"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    UUID
                  </a>{' '}
                  sein
                </div>
                {pCOfOriginIdsAreUuid && (
                  <div>
                    <InlineIcon>
                      <StyledDoneIcon />
                    </InlineIcon>
                  </div>
                )}
                {pCOfOriginIdsAreUuid === false && (
                  <div>
                    <InlineIcon>
                      <StyledErrorIcon />
                    </InlineIcon>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>
                  <EmSpan>propertyCollectionOfOrigin</EmSpan> muss{' '}
                  <EmSpan>id</EmSpan> einer Eigenschaften-Sammlung aus
                  arteigenschaften.ch sein
                </div>
                {pCOfOriginIdsAreReal && (
                  <div>
                    <InlineIcon>
                      <StyledDoneIcon />
                    </InlineIcon>
                  </div>
                )}
                {pCOfOriginIdsAreReal === false &&
                  !pCOfOriginIdsAreRealNotTested && (
                    <div>
                      <InlineIcon>
                        <StyledErrorIcon />
                      </InlineIcon>
                    </div>
                  )}
                {pCOfOriginIdsAreRealNotTested && (
                  <>
                    <InlineIcon>
                      <StyledInfoOutlineIcon />
                    </InlineIcon>
                    <div className={inlineDiv}>
                      (nicht getestet, da sehr viele Daten. Datensätze, welche
                      dieses Kriterium nicht erfüllen, werden nicht importiert)
                    </div>
                  </>
                )}
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <StyledP>Alle weiteren Felder sind Eigenschaften des Objekts:</StyledP>
      <h4 className={h4}>Eigenschaften</h4>
      <ul className={ul}>
        <li>
          <div className={liContainer}>
            <div>Es gibt mindestens eine Eigenschaft</div>
            {existsPropertyKey && (
              <div>
                <InlineIcon>
                  <StyledDoneIcon />
                </InlineIcon>
              </div>
            )}
            {existsPropertyKey === false && (
              <div>
                <InlineIcon>
                  <StyledErrorIcon />
                </InlineIcon>
              </div>
            )}
          </div>
        </li>
        <li>
          Feld-Namen dürfen die folgenden Zeichen nicht enthalten:
          <ul>
            <li>
              <div className={liContainer}>
                <div>{'"'}</div>
                {propertyKeysDontContainApostroph && (
                  <div>
                    <InlineIcon>
                      <StyledDoneIcon />
                    </InlineIcon>
                  </div>
                )}
                {propertyKeysDontContainApostroph === false && (
                  <div>
                    <InlineIcon>
                      <StyledErrorIcon />
                    </InlineIcon>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>\</div>
                {propertyKeysDontContainBackslash && (
                  <div>
                    <InlineIcon>
                      <StyledDoneIcon />
                    </InlineIcon>
                  </div>
                )}
                {propertyKeysDontContainBackslash === false && (
                  <div>
                    <InlineIcon>
                      <StyledErrorIcon />
                    </InlineIcon>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </li>
        <li>
          Feld-Werte dürfen die folgenden Zeichen nicht enthalten:
          <ul>
            <li>
              <div className={liContainer}>
                <div>{'"'}</div>
                {propertyValuesDontContainApostroph && (
                  <div>
                    <InlineIcon>
                      <StyledDoneIcon />
                    </InlineIcon>
                  </div>
                )}
                {propertyValuesDontContainApostroph === false && (
                  <div>
                    <InlineIcon>
                      <StyledErrorIcon />
                    </InlineIcon>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>\</div>
                {propertyValuesDontContainBackslash && (
                  <div>
                    <InlineIcon>
                      <StyledDoneIcon />
                    </InlineIcon>
                  </div>
                )}
                {propertyValuesDontContainBackslash === false && (
                  <div>
                    <InlineIcon>
                      <StyledErrorIcon />
                    </InlineIcon>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <h3 className={h3}>Wirkung des Imports auf bereits vorhandene Daten</h3>
      <ul>
        <li>
          Enthält die Eigenschaften-Sammlung bereits einen Datensatz für ein
          Objekt (Art oder Lebensraum), wird dieser mit dem importierten
          Datensatz ersetzt.
        </li>
        <li>
          Enthält die Eigenschaften-Sammlung für ein Objekt noch keinen
          Datensatz, wird er neu importiert.
        </li>
      </ul>
    </div>
  </>
)
