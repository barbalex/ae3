import {
  MdDone as DoneIcon,
  MdError as ErrorIcon,
  MdInfoOutline as InfoOutlineIcon,
} from 'react-icons/md'

import { appBaseUrl } from '../../../../modules/appBaseUrl.js'
import {
  ul,
  h3,
  h4,
  firstTitle,
  howToImportContainer,
  liContainer,
  emSpan,
  inlineDiv,
  doneIcon,
  errorIcon,
  infoOutlineIcon,
  p,
} from './Instructions.module.css'

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
    <h3 className={firstTitle}>
      Anforderungen an zu importierende Beziehungen
    </h3>
    <div className={howToImportContainer}>
      <h4 className={h4}>Autorenrechte</h4>
      <ul className={ul}>
        <li>
          <div className={liContainer}>
            Die Autoren müssen mit der Veröffentlichung einverstanden sein
          </div>
        </li>
        <li>
          <div className={liContainer}>
            Dafür verantwortlich ist, wer Daten importiert
          </div>
        </li>
      </ul>
      <h4 className={h4}>Tabelle</h4>
      <ul className={ul}>
        <li>
          <div className={liContainer}>
            Die erste Zeile enthält Feld-Namen (= Spalten-Titel)
          </div>
        </li>
        <li>
          <div className={liContainer}>
            Jeder Wert hat einen Feld-Namen.
            <br />
            Anders gesagt: Jede Zelle mit einem Wert hat einen Spalten-Titel
            {existsNoDataWithoutKey && <DoneIcon className={doneIcon} />}
            {existsNoDataWithoutKey === false && (
              <ErrorIcon className={errorIcon} />
            )}
          </div>
        </li>
      </ul>
      <h4 className={h4}>Zuordnungs-Felder</h4>
      <ul className={ul}>
        <li>
          <div className={liContainer}>
            Ein Feld namens&nbsp;<span className={emSpan}>id</span>&nbsp;kann
            enthalten sein.
            {idsExist && <DoneIcon className={doneIcon} />}
            {idsExist === false && <div className={inlineDiv}>(ist nicht)</div>}
          </div>
          <div className={liContainer}>
            Wenn nicht, wird eine id erzeugt
            {idsExist === false && <DoneIcon className={doneIcon} />}
          </div>
          <ul>
            <li>
              <div className={liContainer}>
                <span className={emSpan}>id</span>&nbsp;muss gültige&nbsp;
                <a
                  href="https://de.wikipedia.org/wiki/Universally_Unique_Identifier"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UUID
                </a>
                &nbsp; sein&nbsp;
                {idsAreUuids && <DoneIcon className={doneIcon} />}
                {idsAreUuids === false && <ErrorIcon className={errorIcon} />}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <span className={emSpan}>id</span>&nbsp;muss eindeutig
                sein&nbsp;
                {idsAreUnique && <DoneIcon className={doneIcon} />}
                {idsAreUnique === false && <ErrorIcon className={errorIcon} />}
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div className={liContainer}>
            Ein Feld namens&nbsp;<span className={emSpan}>objectId</span>
            &nbsp;muss enthalten sein&nbsp;
            {objectIdsExist && <DoneIcon className={doneIcon} />}
            {objectIdsExist === false && <ErrorIcon className={errorIcon} />}
          </div>
          <ul>
            <li>
              <div className={liContainer}>
                <span className={emSpan}>objectId</span>&nbsp;muss gültige&nbsp;
                <a
                  href="https://de.wikipedia.org/wiki/Universally_Unique_Identifier"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UUID
                </a>
                &nbsp; sein&nbsp;
                {objectIdsAreUuid && <DoneIcon className={doneIcon} />}
                {objectIdsAreUuid === false && (
                  <ErrorIcon className={errorIcon} />
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <span className={emSpan}>objectId</span>&nbsp;muss&nbsp;
                <span className={emSpan}>id</span>&nbsp;eines Objekts aus
                arteigenschaften.ch sein&nbsp;
                {objectIdsAreReal && <DoneIcon className={doneIcon} />}
                {objectIdsAreReal === false && !objectIdsAreRealNotTested && (
                  <ErrorIcon className={errorIcon} />
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
            Ein Feld namens&nbsp;
            <span className={emSpan}>objectIdRelation</span>
            &nbsp; muss enthalten sein&nbsp;
            {objectRelationIdsExist && <DoneIcon className={doneIcon} />}
            {objectRelationIdsExist === false && (
              <ErrorIcon className={errorIcon} />
            )}
          </div>
          <div className={liContainer}>
            Zweck: Der Datensatz beschreibt die Beziehung des Objekts mit
            id&nbsp;
            <span className={emSpan}>objectId</span>&nbsp;zum Objekt mit
            id&nbsp;
            <span className={emSpan}>objectIdRelation</span>
          </div>
          <ul>
            <li>
              <div className={liContainer}>
                <span className={emSpan}>objectIdRelation</span>&nbsp;muss
                gültige&nbsp;
                <a
                  href="https://de.wikipedia.org/wiki/Universally_Unique_Identifier"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UUID
                </a>
                &nbsp; sein&nbsp;
                {objectRelationIdsAreUuid && <DoneIcon className={doneIcon} />}
                {objectRelationIdsAreUuid === false && (
                  <ErrorIcon className={errorIcon} />
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <span className={emSpan}>objectIdRelation</span>
                &nbsp;muss&nbsp;
                <span className={emSpan}>id</span>&nbsp;eines Objekts aus
                arteigenschaften.ch sein&nbsp;
                {objectRelationIdsAreReal && <DoneIcon className={doneIcon} />}
                {objectRelationIdsAreReal === false &&
                  !objectIdsAreRealNotTested && (
                    <ErrorIcon className={errorIcon} />
                  )}
                {objectRelationIdsAreRealNotTested && (
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
            Ein Feld namens&nbsp;<span className={emSpan}>relationType</span>
            &nbsp;muss enthalten sein&nbsp;
            {relationTypeExist && <DoneIcon className={doneIcon} />}
            {relationTypeExist === false && <ErrorIcon className={errorIcon} />}
          </div>
          <div className={liContainer}>
            <div>
              Zweck: Beschreibt&nbsp;<em>die Art der Beziehung</em>&nbsp;des
              Objekts mit id <span className={emSpan}>objectId</span>&nbsp;zum
              Objekt mit id&nbsp;
              <span className={emSpan}>objectIdRelation</span>
              <br />
              Beispiel: "Hund beisst Briefträger"
              <br />
              Mögliche Werte: frisst, parasitiert, meidet...
            </div>
          </div>
        </li>
        <li>
          <div className={liContainer}>
            <div>
              Ein Feld namens&nbsp;
              <span className={emSpan}>propertyCollectionOfOrigin</span>
              &nbsp;kann enthalten sein
            </div>
            {pCOfOriginIdsExist && <DoneIcon className={doneIcon} />}
            {pCOfOriginIdsExist === false && (
              <div>
                <div className={inlineDiv}>(ist nicht)</div>
              </div>
            )}
          </div>
          <div className={liContainer}>
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
              <div className={liContainer}>
                <div>
                  <span className={emSpan}>propertyCollectionOfOrigin</span>
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
                {pCOfOriginIdsAreUuid && <DoneIcon className={doneIcon} />}
                {pCOfOriginIdsAreUuid === false && (
                  <ErrorIcon className={errorIcon} />
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>
                  <span className={emSpan}>propertyCollectionOfOrigin</span>
                  &nbsp; muss <span className={emSpan}>id</span>&nbsp;einer
                  Eigenschaften-Sammlung aus arteigenschaften.ch sein
                </div>
                {pCOfOriginIdsAreReal && <DoneIcon className={doneIcon} />}
                {pCOfOriginIdsAreReal === false &&
                  !pCOfOriginIdsAreRealNotTested && (
                    <ErrorIcon className={errorIcon} />
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
      <p className={p}>
        Alle weiteren Felder sind Eigenschaften der Beziehung:
      </p>
      <h4 className={h4}>Eigenschaften</h4>
      <ul className={ul}>
        <li>
          <div className={liContainer}>
            Eigenschaften sind nicht zwingend. Die Beziehungs-Art sagt schon
            einiges aus
          </div>
        </li>
        <li>
          Feld-Namen dürfen die folgenden Zeichen nicht enthalten:
          <ul>
            <li>
              <div className={liContainer}>
                <div>{'"'}</div>
                {propertyKeysDontContainApostroph && (
                  <DoneIcon className={doneIcon} />
                )}
                {propertyKeysDontContainApostroph === false && (
                  <ErrorIcon className={errorIcon} />
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>\</div>
                {propertyKeysDontContainBackslash && (
                  <DoneIcon className={doneIcon} />
                )}
                {propertyKeysDontContainBackslash === false && (
                  <ErrorIcon className={errorIcon} />
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
                  <DoneIcon className={doneIcon} />
                )}
                {propertyValuesDontContainApostroph === false && (
                  <ErrorIcon className={errorIcon} />
                )}
              </div>
            </li>
            <li>
              <div className={liContainer}>
                <div>\</div>
                {propertyValuesDontContainBackslash && (
                  <DoneIcon className={doneIcon} />
                )}
                {propertyValuesDontContainBackslash === false && (
                  <ErrorIcon className={errorIcon} />
                )}
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <h3 className={h3}>Wirkung des Imports auf bereits vorhandene Daten</h3>
      <ul className={ul}>
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
