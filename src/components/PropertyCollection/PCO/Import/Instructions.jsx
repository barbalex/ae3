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

const StyledErrorIcon = styled(ErrorIcon)`
  color: red !important;
`
const StyledInfoOutlineIcon = styled(InfoOutlineIcon)`
  color: orange !important;
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
                <Icon className={inlineIcon}>
                  <DoneIcon className={doneIcon} />
                </Icon>
              </div>
            )}
            {existsNoDataWithoutKey === false && (
              <div>
                <Icon className={inlineIcon}>
                  <StyledErrorIcon />
                </Icon>
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
              Ein Feld namens <span className={emSpan}>id</span> kann enthalten
              sein.
            </div>
            {idsExist && (
              <div>
                <Icon className={inlineIcon}>
                  <DoneIcon className={doneIcon} />
                </Icon>
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
                <Icon className={inlineIcon}>
                  <DoneIcon className={doneIcon} />
                </Icon>
              </div>
            )}
          </div>
          <ul>
            <li>
              <div className={liContainer}>
                <div>
                  <span className={emSpan}>id</span> muss gültige{' '}
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
                    <Icon className={inlineIcon}>
                      <DoneIcon className={doneIcon} />
                    </Icon>
                  </div>
                )}
                {idsAreUuids === false && (
                  <div>
                    <Icon className={inlineIcon}>
                      <StyledErrorIcon />
                    </Icon>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>
                  <span className={emSpan}>id</span> muss eindeutig sein
                </div>
                {idsAreUnique && (
                  <div>
                    <Icon className={inlineIcon}>
                      <DoneIcon className={doneIcon} />
                    </Icon>
                  </div>
                )}
                {idsAreUnique === false && (
                  <div>
                    <Icon className={inlineIcon}>
                      <StyledErrorIcon />
                    </Icon>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div className={liContainer}>
            <div>
              Ein Feld namens <span className={emSpan}>objectId</span> muss
              enthalten sein
            </div>
            {objectIdsExist && (
              <div>
                <Icon className={inlineIcon}>
                  <DoneIcon className={doneIcon} />
                </Icon>
              </div>
            )}
            {objectIdsExist === false && (
              <div>
                <Icon className={inlineIcon}>
                  <StyledErrorIcon />
                </Icon>
              </div>
            )}
          </div>
          <ul>
            <li>
              <div className={liContainer}>
                <div>
                  <span className={emSpan}>objectId</span> muss gültige{' '}
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
                    <Icon className={inlineIcon}>
                      <DoneIcon className={doneIcon} />
                    </Icon>
                  </div>
                )}
                {objectIdsAreUuid === false && (
                  <div>
                    <Icon className={inlineIcon}>
                      <StyledErrorIcon />
                    </Icon>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>
                  <span className={emSpan}>objectId</span> muss{' '}
                  <span className={emSpan}>id</span> eines Objekts aus
                  arteigenschaften.ch sein
                </div>
                {objectIdsAreReal && (
                  <div>
                    <Icon className={inlineIcon}>
                      <DoneIcon className={doneIcon} />
                    </Icon>
                  </div>
                )}
                {objectIdsAreReal === false && !objectIdsAreRealNotTested && (
                  <div>
                    <Icon className={inlineIcon}>
                      <StyledErrorIcon />
                    </Icon>
                  </div>
                )}
                {objectIdsAreRealNotTested && (
                  <>
                    <Icon className={inlineIcon}>
                      <StyledInfoOutlineIcon />
                    </Icon>
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
              Ein Feld namens{' '}
              <span className={emSpan}>propertyCollectionOfOrigin</span> kann
              enthalten sein.
            </div>
            {pCOfOriginIdsExist && (
              <div>
                <Icon className={inlineIcon}>
                  <DoneIcon className={doneIcon} />
                </Icon>
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
                  <span className={emSpan}>propertyCollectionOfOrigin</span>{' '}
                  muss gültige{' '}
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
                    <Icon className={inlineIcon}>
                      <DoneIcon className={doneIcon} />
                    </Icon>
                  </div>
                )}
                {pCOfOriginIdsAreUuid === false && (
                  <div>
                    <Icon className={inlineIcon}>
                      <StyledErrorIcon />
                    </Icon>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>
                  <span className={emSpan}>propertyCollectionOfOrigin</span>{' '}
                  muss <span className={emSpan}>id</span> einer
                  Eigenschaften-Sammlung aus arteigenschaften.ch sein
                </div>
                {pCOfOriginIdsAreReal && (
                  <div>
                    <Icon className={inlineIcon}>
                      <DoneIcon className={doneIcon} />
                    </Icon>
                  </div>
                )}
                {pCOfOriginIdsAreReal === false &&
                  !pCOfOriginIdsAreRealNotTested && (
                    <div>
                      <Icon className={inlineIcon}>
                        <StyledErrorIcon />
                      </Icon>
                    </div>
                  )}
                {pCOfOriginIdsAreRealNotTested && (
                  <>
                    <Icon className={inlineIcon}>
                      <StyledInfoOutlineIcon />
                    </Icon>
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
      <p className={p}>Alle weiteren Felder sind Eigenschaften des Objekts:</p>
      <h4 className={h4}>Eigenschaften</h4>
      <ul className={ul}>
        <li>
          <div className={liContainer}>
            <div>Es gibt mindestens eine Eigenschaft</div>
            {existsPropertyKey && (
              <div>
                <Icon className={inlineIcon}>
                  <DoneIcon className={doneIcon} />
                </Icon>
              </div>
            )}
            {existsPropertyKey === false && (
              <div>
                <Icon className={inlineIcon}>
                  <StyledErrorIcon />
                </Icon>
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
                    <Icon className={inlineIcon}>
                      <DoneIcon className={doneIcon} />
                    </Icon>
                  </div>
                )}
                {propertyKeysDontContainApostroph === false && (
                  <div>
                    <Icon className={inlineIcon}>
                      <StyledErrorIcon />
                    </Icon>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>\</div>
                {propertyKeysDontContainBackslash && (
                  <div>
                    <Icon className={inlineIcon}>
                      <DoneIcon className={doneIcon} />
                    </Icon>
                  </div>
                )}
                {propertyKeysDontContainBackslash === false && (
                  <div>
                    <Icon className={inlineIcon}>
                      <StyledErrorIcon />
                    </Icon>
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
                    <Icon className={inlineIcon}>
                      <DoneIcon className={doneIcon} />
                    </Icon>
                  </div>
                )}
                {propertyValuesDontContainApostroph === false && (
                  <div>
                    <Icon className={inlineIcon}>
                      <StyledErrorIcon />
                    </Icon>
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>\</div>
                {propertyValuesDontContainBackslash && (
                  <div>
                    <Icon className={inlineIcon}>
                      <DoneIcon className={doneIcon} />
                    </Icon>
                  </div>
                )}
                {propertyValuesDontContainBackslash === false && (
                  <div>
                    <Icon className={inlineIcon}>
                      <StyledErrorIcon />
                    </Icon>
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
