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
  inlineDiv,
  doneIcon,
  errorIcon,
  infoOutlineIcon,
  p,
  ul,
} from './Instructions.module.css'

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
                <DoneIcon className={doneIcon} />
              </div>
            )}
            {existsNoDataWithoutKey === false && (
              <div>
                <ErrorIcon className={errorIcon} />
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
                <DoneIcon className={doneIcon} />
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
                <DoneIcon className={doneIcon} />
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
                    <DoneIcon className={doneIcon} />
                  </div>
                )}
                {idsAreUuids === false && (
                  <div>
                    <ErrorIcon className={errorIcon} />
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
                    <DoneIcon className={doneIcon} />
                  </div>
                )}
                {idsAreUnique === false && (
                  <div>
                    <ErrorIcon className={errorIcon} />
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
                <DoneIcon className={doneIcon} />
              </div>
            )}
            {objectIdsExist === false && (
              <div>
                <ErrorIcon className={errorIcon} />
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
                    <DoneIcon className={doneIcon} />
                  </div>
                )}
                {objectIdsAreUuid === false && (
                  <div>
                    <ErrorIcon className={errorIcon} />
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
                    <DoneIcon className={doneIcon} />
                  </div>
                )}
                {objectIdsAreReal === false && !objectIdsAreRealNotTested && (
                  <div>
                    <ErrorIcon className={errorIcon} />
                  </div>
                )}
                {objectIdsAreRealNotTested && (
                  <>
                    <InfoOutlineIcon className={infoOutlineIcon} />
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
                <DoneIcon className={doneIcon} />
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
                    <DoneIcon className={doneIcon} />
                  </div>
                )}
                {pCOfOriginIdsAreUuid === false && (
                  <div>
                    <ErrorIcon className={errorIcon} />
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
                    <DoneIcon className={doneIcon} />
                  </div>
                )}
                {pCOfOriginIdsAreReal === false &&
                  !pCOfOriginIdsAreRealNotTested && (
                    <div>
                      <ErrorIcon className={errorIcon} />
                    </div>
                  )}
                {pCOfOriginIdsAreRealNotTested && (
                  <>
                    <InfoOutlineIcon className={infoOutlineIcon} />
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
                <DoneIcon className={doneIcon} />
              </div>
            )}
            {existsPropertyKey === false && (
              <div>
                <ErrorIcon className={errorIcon} />
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
                    <DoneIcon className={doneIcon} />
                  </div>
                )}
                {propertyKeysDontContainApostroph === false && (
                  <div>
                    <ErrorIcon className={errorIcon} />
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>\</div>
                {propertyKeysDontContainBackslash && (
                  <div>
                    <DoneIcon className={doneIcon} />
                  </div>
                )}
                {propertyKeysDontContainBackslash === false && (
                  <div>
                    <ErrorIcon className={errorIcon} />
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
                    <DoneIcon className={doneIcon} />
                  </div>
                )}
                {propertyValuesDontContainApostroph === false && (
                  <div>
                    <ErrorIcon className={errorIcon} />
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>\</div>
                {propertyValuesDontContainBackslash && (
                  <div>
                    <DoneIcon className={doneIcon} />
                  </div>
                )}
                {propertyValuesDontContainBackslash === false && (
                  <div>
                    <ErrorIcon className={errorIcon} />
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
