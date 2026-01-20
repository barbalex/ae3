import {
  MdDone as DoneIcon,
  MdError as ErrorIcon,
  MdInfoOutline as InfoOutlineIcon,
} from 'react-icons/md'

import { appBaseUrl } from '../../../../modules/appBaseUrl.js'
import styles from './Instructions.module.css'

export const RcoInstructions = ({
  existsNoDataWithoutKey,
  idsExist,
  idsAreUuids,
  idsAreUnique,
  objectIdsExist,
  objectIdsAreUuid,
  objectIdsAreReal,
  objectIdsAreRealNotTested,
  objectRelationIdsExist,
  objectRelationIdsAreUuid,
  objectRelationIdsAreReal,
  objectRelationIdsAreRealNotTested,
  relationTypeExist,
  pCOfOriginIdsExist,
  pCOfOriginIdsAreUuid,
  pCOfOriginIdsAreReal,
  pCOfOriginIdsAreRealNotTested,
  propertyKeysDontContainApostroph,
  propertyKeysDontContainBackslash,
  propertyValuesDontContainApostroph,
  propertyValuesDontContainBackslash,
}) => (
  <>
    <h3 className={styles.firstTitle}>
      Anforderungen an zu importierende Beziehungen
    </h3>
    <div className={styles.howToImportContainer}>
      <h4 className={styles.h4}>Autorenrechte</h4>
      <ul className={styles.ul}>
        <li>
          <div className={styles.liContainer}>
            Die Autoren müssen mit der Veröffentlichung einverstanden sein
          </div>
        </li>
        <li>
          <div className={styles.liContainer}>
            Dafür verantwortlich ist, wer Daten importiert
          </div>
        </li>
      </ul>
      <h4 className={styles.h4}>Tabelle</h4>
      <ul className={styles.ul}>
        <li>
          <div className={styles.liContainer}>
            Die erste Zeile enthält Feld-Namen (= Spalten-Titel)
          </div>
        </li>
        <li>
          <div className={styles.liContainer}>
            Jeder Wert hat einen Feld-Namen.
            <br />
            Anders gesagt: Jede Zelle mit einem Wert hat einen Spalten-Titel
            {existsNoDataWithoutKey && <DoneIcon className={styles.doneIcon} />}
            {existsNoDataWithoutKey === false && (
              <ErrorIcon className={styles.errorIcon} />
            )}
          </div>
        </li>
      </ul>
      <h4 className={styles.h4}>Zuordnungs-Felder</h4>
      <ul className={styles.ul}>
        <li>
          <div className={styles.liContainer}>
            Ein Feld namens&nbsp;<span className={styles.emSpan}>id</span>&nbsp;kann
            enthalten sein.
            {idsExist && <DoneIcon className={styles.doneIcon} />}
            {idsExist === false && <div className={styles.inlineDiv}>(ist nicht)</div>}
          </div>
          <div className={styles.liContainer}>
            Wenn nicht, wird eine id erzeugt
            {idsExist === false && <DoneIcon className={styles.doneIcon} />}
          </div>
          <ul>
            <li>
              <div className={styles.liContainer}>
                <span className={styles.emSpan}>id</span>&nbsp;muss gültige&nbsp;
                <a
                  href="https://de.wikipedia.org/wiki/Universally_Unique_Identifier"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UUID
                </a>
                &nbsp; sein&nbsp;
                {idsAreUuids && <DoneIcon className={styles.doneIcon} />}
                {idsAreUuids === false && <ErrorIcon className={styles.errorIcon} />}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <span className={styles.emSpan}>id</span>&nbsp;muss eindeutig
                sein&nbsp;
                {idsAreUnique && <DoneIcon className={styles.doneIcon} />}
                {idsAreUnique === false && <ErrorIcon className={styles.errorIcon} />}
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div className={styles.liContainer}>
            Ein Feld namens&nbsp;<span className={styles.emSpan}>objectId</span>
            &nbsp;muss enthalten sein&nbsp;
            {objectIdsExist && <DoneIcon className={styles.doneIcon} />}
            {objectIdsExist === false && <ErrorIcon className={styles.errorIcon} />}
          </div>
          <ul>
            <li>
              <div className={styles.liContainer}>
                <span className={styles.emSpan}>objectId</span>&nbsp;muss gültige&nbsp;
                <a
                  href="https://de.wikipedia.org/wiki/Universally_Unique_Identifier"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UUID
                </a>
                &nbsp; sein&nbsp;
                {objectIdsAreUuid && <DoneIcon className={styles.doneIcon} />}
                {objectIdsAreUuid === false && (
                  <ErrorIcon className={styles.errorIcon} />
                )}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <span className={styles.emSpan}>objectId</span>&nbsp;muss&nbsp;
                <span className={styles.emSpan}>id</span>&nbsp;eines Objekts aus
                arteigenschaften.ch sein&nbsp;
                {objectIdsAreReal && <DoneIcon className={styles.doneIcon} />}
                {objectIdsAreReal === false && !objectIdsAreRealNotTested && (
                  <ErrorIcon className={styles.errorIcon} />
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
            Ein Feld namens&nbsp;
            <span className={styles.emSpan}>objectIdRelation</span>
            &nbsp; muss enthalten sein&nbsp;
            {objectRelationIdsExist && <DoneIcon className={styles.doneIcon} />}
            {objectRelationIdsExist === false && (
              <ErrorIcon className={styles.errorIcon} />
            )}
          </div>
          <div className={styles.liContainer}>
            Zweck: Der Datensatz beschreibt die Beziehung des Objekts mit
            id&nbsp;
            <span className={styles.emSpan}>objectId</span>&nbsp;zum Objekt mit
            id&nbsp;
            <span className={styles.emSpan}>objectIdRelation</span>
          </div>
          <ul>
            <li>
              <div className={styles.liContainer}>
                <span className={styles.emSpan}>objectIdRelation</span>&nbsp;muss
                gültige&nbsp;
                <a
                  href="https://de.wikipedia.org/wiki/Universally_Unique_Identifier"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UUID
                </a>
                &nbsp; sein&nbsp;
                {objectRelationIdsAreUuid && <DoneIcon className={styles.doneIcon} />}
                {objectRelationIdsAreUuid === false && (
                  <ErrorIcon className={styles.errorIcon} />
                )}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <span className={styles.emSpan}>objectIdRelation</span>
                &nbsp;muss&nbsp;
                <span className={styles.emSpan}>id</span>&nbsp;eines Objekts aus
                arteigenschaften.ch sein&nbsp;
                {objectRelationIdsAreReal && <DoneIcon className={styles.doneIcon} />}
                {objectRelationIdsAreReal === false &&
                  !objectIdsAreRealNotTested && (
                    <ErrorIcon className={styles.errorIcon} />
                  )}
                {objectRelationIdsAreRealNotTested && (
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
            Ein Feld namens&nbsp;<span className={styles.emSpan}>relationType</span>
            &nbsp;muss enthalten sein&nbsp;
            {relationTypeExist && <DoneIcon className={styles.doneIcon} />}
            {relationTypeExist === false && <ErrorIcon className={styles.errorIcon} />}
          </div>
          <div className={styles.liContainer}>
            <div>
              Zweck: Beschreibt&nbsp;<em>die Art der Beziehung</em>&nbsp;des
              Objekts mit id <span className={styles.emSpan}>objectId</span>&nbsp;zum
              Objekt mit id&nbsp;
              <span className={styles.emSpan}>objectIdRelation</span>
              <br />
              Beispiel: "Hund beisst Briefträger"
              <br />
              Mögliche Werte: frisst, parasitiert, meidet...
            </div>
          </div>
        </li>
        <li>
          <div className={styles.liContainer}>
            <div>
              Ein Feld namens&nbsp;
              <span className={styles.emSpan}>propertyCollectionOfOrigin</span>
              &nbsp;kann enthalten sein
            </div>
            {pCOfOriginIdsExist && <DoneIcon className={styles.doneIcon} />}
            {pCOfOriginIdsExist === false && (
              <div>
                <div className={styles.inlineDiv}>(ist nicht)</div>
              </div>
            )}
          </div>
          <div className={styles.liContainer}>
            <div>
              Zweck: In zusammenfassenden Eigenschaften-Sammlungen markieren,
              aus welcher Eigenschaften-Sammlung diese Beziehungen
              stammen.&nbsp;
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
                  <span className={styles.emSpan}>propertyCollectionOfOrigin</span>
                  &nbsp; muss gültige&nbsp;
                  <a
                    href="https://de.wikipedia.org/wiki/Universally_Unique_Identifier"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    UUID
                  </a>
                  &nbsp; sein
                </div>
                {pCOfOriginIdsAreUuid && <DoneIcon className={styles.doneIcon} />}
                {pCOfOriginIdsAreUuid === false && (
                  <ErrorIcon className={styles.errorIcon} />
                )}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <div>
                  <span className={styles.emSpan}>propertyCollectionOfOrigin</span>
                  &nbsp; muss <span className={styles.emSpan}>id</span>&nbsp;einer
                  Eigenschaften-Sammlung aus arteigenschaften.ch sein
                </div>
                {pCOfOriginIdsAreReal && <DoneIcon className={styles.doneIcon} />}
                {pCOfOriginIdsAreReal === false &&
                  !pCOfOriginIdsAreRealNotTested && (
                    <ErrorIcon className={styles.errorIcon} />
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
        Alle weiteren Felder sind Eigenschaften der Beziehung:
      </p>
      <h4 className={styles.h4}>Eigenschaften</h4>
      <ul className={styles.ul}>
        <li>
          <div className={styles.liContainer}>
            Eigenschaften sind nicht zwingend. Die Beziehungs-Art sagt schon
            einiges aus
          </div>
        </li>
        <li>
          Feld-Namen dürfen die folgenden Zeichen nicht enthalten:
          <ul>
            <li>
              <div className={styles.liContainer}>
                <div>{'"'}</div>
                {propertyKeysDontContainApostroph && (
                  <DoneIcon className={styles.doneIcon} />
                )}
                {propertyKeysDontContainApostroph === false && (
                  <ErrorIcon className={styles.errorIcon} />
                )}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <div>\</div>
                {propertyKeysDontContainBackslash && (
                  <DoneIcon className={styles.doneIcon} />
                )}
                {propertyKeysDontContainBackslash === false && (
                  <ErrorIcon className={styles.errorIcon} />
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
                  <DoneIcon className={styles.doneIcon} />
                )}
                {propertyValuesDontContainApostroph === false && (
                  <ErrorIcon className={styles.errorIcon} />
                )}
              </div>
            </li>
            <li>
              <div className={styles.liContainer}>
                <div>\</div>
                {propertyValuesDontContainBackslash && (
                  <DoneIcon className={styles.doneIcon} />
                )}
                {propertyValuesDontContainBackslash === false && (
                  <ErrorIcon className={styles.errorIcon} />
                )}
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <h3 className={styles.h3}>Wirkung des Imports auf bereits vorhandene Daten</h3>
      <ul className={styles.ul}>
        <li>
          Enthält die Beziehungs-Sammlung bereits einen Datensatz für ein Objekt
          (Art oder Lebensraum), wird dieser mit dem importierten Datensatz
          ersetzt.
        </li>
        <li>
          Enthält die Beziehungs-Sammlung für ein Objekt noch keinen Datensatz,
          wird er neu importiert.
        </li>
      </ul>
    </div>
  </>
)
