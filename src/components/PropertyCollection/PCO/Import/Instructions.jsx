import {
  MdDone as DoneIcon,
  MdError as ErrorIcon,
  MdInfoOutline as InfoOutlineIcon,
} from 'react-icons/md'

import { appBaseUrl } from '../../../../modules/appBaseUrl.js'
import styles from './Instructions.module.css'

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
    <h3 className={styles.firstTitle}>
      Anforderungen an zu importierende Eigenschaften
    </h3>
    <div className={styles.howToImportContainer}>
      <h4 className={styles.h4}>Autorenrechte</h4>
      <ul className={styles.ul}>
        <li>
          <div className={styles.liContainer}>
            <div>
              Die Autoren müssen mit der Veröffentlichung einverstanden sein
            </div>
          </div>
        </li>
        <li>
          <div className={styles.liContainer}>
            <div>Dafür verantwortlich ist, wer Daten importiert</div>
          </div>
        </li>
      </ul>
      <h4 className={styles.h4}>Tabelle</h4>
      <ul className={styles.ul}>
        <li>
          <div className={styles.liContainer}>
            <div>Die erste Zeile enthält Feld-Namen (= Spalten-Titel)</div>
          </div>
        </li>
        <li>
          <div className={styles.liContainer}>
            <div>
              Jeder Wert hat einen Feld-Namen.
              <br />
              Anders gesagt: Jede Zelle mit einem Wert hat einen Spalten-Titel
            </div>
            {existsNoDataWithoutKey && (
              <div>
                <DoneIcon className={styles.doneIcon} />
              </div>
            )}
            {existsNoDataWithoutKey === false && (
              <div>
                <ErrorIcon className={styles.errorIcon} />
              </div>
            )}
          </div>
        </li>
      </ul>
      <h4 className={styles.h4}>Zuordnungs-Felder</h4>
      <ul className={styles.ul}>
        <li>
          <div className={styles.liContainer}>
            <div>
              Ein Feld namens <span className={styles.emSpan}>id</span> kann
              enthalten sein.
            </div>
            {idsExist && (
              <div>
                <DoneIcon className={styles.doneIcon} />
              </div>
            )}
            {idsExist === false && (
              <div>
                <div className={styles.inlineDiv}>(ist nicht)</div>
              </div>
            )}
          </div>
          <div className={styles.liContainer}>
            <div>Wenn nicht, wird eine id erzeugt</div>
            {idsExist === false && (
              <div>
                <DoneIcon className={styles.doneIcon} />
              </div>
            )}
          </div>
          <ul>
            <li>
              <div className={styles.liContainer}>
                <div>
                  <span className={styles.emSpan}>id</span> muss gültige{' '}
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
                    <DoneIcon className={styles.doneIcon} />
                  </div>
                )}
                {idsAreUuids === false && (
                  <div>
                    <ErrorIcon className={styles.errorIcon} />
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <div>
                  <span className={styles.emSpan}>id</span> muss eindeutig sein
                </div>
                {idsAreUnique && (
                  <div>
                    <DoneIcon className={styles.doneIcon} />
                  </div>
                )}
                {idsAreUnique === false && (
                  <div>
                    <ErrorIcon className={styles.errorIcon} />
                  </div>
                )}
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div className={styles.liContainer}>
            <div>
              Ein Feld namens <span className={styles.emSpan}>objectId</span>{' '}
              muss enthalten sein
            </div>
            {objectIdsExist && (
              <div>
                <DoneIcon className={styles.doneIcon} />
              </div>
            )}
            {objectIdsExist === false && (
              <div>
                <ErrorIcon className={styles.errorIcon} />
              </div>
            )}
          </div>
          <ul>
            <li>
              <div className={styles.liContainer}>
                <div>
                  <span className={styles.emSpan}>objectId</span> muss gültige{' '}
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
                    <DoneIcon className={styles.doneIcon} />
                  </div>
                )}
                {objectIdsAreUuid === false && (
                  <div>
                    <ErrorIcon className={styles.errorIcon} />
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <div>
                  <span className={styles.emSpan}>objectId</span> muss{' '}
                  <span className={styles.emSpan}>id</span> eines Objekts aus
                  arteigenschaften.ch sein
                </div>
                {objectIdsAreReal && (
                  <div>
                    <DoneIcon className={styles.doneIcon} />
                  </div>
                )}
                {objectIdsAreReal === false && !objectIdsAreRealNotTested && (
                  <div>
                    <ErrorIcon className={styles.errorIcon} />
                  </div>
                )}
                {objectIdsAreRealNotTested && (
                  <>
                    <InfoOutlineIcon className={styles.infoOutlineIcon} />
                    <div className={styles.inlineDiv}>
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
          <div className={styles.liContainer}>
            <div>
              Ein Feld namens{' '}
              <span className={styles.emSpan}>propertyCollectionOfOrigin</span>{' '}
              kann enthalten sein.
            </div>
            {pCOfOriginIdsExist && (
              <div>
                <DoneIcon className={styles.doneIcon} />
              </div>
            )}
            {pCOfOriginIdsExist === false && (
              <div>
                <div className={styles.inlineDiv}>(ist nicht)</div>
              </div>
            )}
          </div>
          <div className={styles.liContainer}>
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
              <div className={styles.liContainer}>
                <div>
                  <span className={styles.emSpan}>
                    propertyCollectionOfOrigin
                  </span>{' '}
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
                    <DoneIcon className={styles.doneIcon} />
                  </div>
                )}
                {pCOfOriginIdsAreUuid === false && (
                  <div>
                    <ErrorIcon className={styles.errorIcon} />
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <div>
                  <span className={styles.emSpan}>
                    propertyCollectionOfOrigin
                  </span>{' '}
                  muss <span className={styles.emSpan}>id</span> einer
                  Eigenschaften-Sammlung aus arteigenschaften.ch sein
                </div>
                {pCOfOriginIdsAreReal && (
                  <div>
                    <DoneIcon className={styles.doneIcon} />
                  </div>
                )}
                {pCOfOriginIdsAreReal === false &&
                  !pCOfOriginIdsAreRealNotTested && (
                    <div>
                      <ErrorIcon className={styles.errorIcon} />
                    </div>
                  )}
                {pCOfOriginIdsAreRealNotTested && (
                  <>
                    <InfoOutlineIcon className={styles.infoOutlineIcon} />
                    <div className={styles.inlineDiv}>
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
      <p className={styles.p}>
        Alle weiteren Felder sind Eigenschaften des Objekts:
      </p>
      <h4 className={styles.h4}>Eigenschaften</h4>
      <ul className={styles.ul}>
        <li>
          <div className={styles.liContainer}>
            <div>Es gibt mindestens eine Eigenschaft</div>
            {existsPropertyKey && (
              <div>
                <DoneIcon className={styles.doneIcon} />
              </div>
            )}
            {existsPropertyKey === false && (
              <div>
                <ErrorIcon className={styles.errorIcon} />
              </div>
            )}
          </div>
        </li>
        <li>
          Feld-Namen dürfen die folgenden Zeichen nicht enthalten:
          <ul>
            <li>
              <div className={styles.liContainer}>
                <div>{'"'}</div>
                {propertyKeysDontContainApostroph && (
                  <div>
                    <DoneIcon className={styles.doneIcon} />
                  </div>
                )}
                {propertyKeysDontContainApostroph === false && (
                  <div>
                    <ErrorIcon className={styles.errorIcon} />
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <div>\</div>
                {propertyKeysDontContainBackslash && (
                  <div>
                    <DoneIcon className={styles.doneIcon} />
                  </div>
                )}
                {propertyKeysDontContainBackslash === false && (
                  <div>
                    <ErrorIcon className={styles.errorIcon} />
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
              <div className={styles.liContainer}>
                <div>{'"'}</div>
                {propertyValuesDontContainApostroph && (
                  <div>
                    <DoneIcon className={styles.doneIcon} />
                  </div>
                )}
                {propertyValuesDontContainApostroph === false && (
                  <div>
                    <ErrorIcon className={styles.errorIcon} />
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <div>\</div>
                {propertyValuesDontContainBackslash && (
                  <div>
                    <DoneIcon className={styles.doneIcon} />
                  </div>
                )}
                {propertyValuesDontContainBackslash === false && (
                  <div>
                    <ErrorIcon className={styles.errorIcon} />
                  </div>
                )}
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <h3 className={styles.h3}>
        Wirkung des Imports auf bereits vorhandene Daten
      </h3>
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
