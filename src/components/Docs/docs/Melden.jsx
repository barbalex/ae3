import React from 'react'

import { DokuDate } from '../index.jsx'

const MeldenDoc = () => (
  <>
    <h1>Fehler, Ideen, Vorschläge melden</h1>
    <DokuDate>29.09.2019</DokuDate>
    <p>Das geht so:</p>
    <ul>
      <li>
        Auf{' '}
        <a
          href="https://github.com/barbalex/ae3/issues"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        ...
      </li>
      <li>...schaut ihr bitte zuerst, ob euer Anliegen schon gemeldet wurde</li>
      <li>Wenn nicht, könnt ihr einen neuen `Issue` eröffnen</li>
    </ul>
    <p>
      GitHub ist dafür geeignet, weil man die Übersicht behält, priorisieren und
      den Verlauf dokumentieren kann. Jeder, der sich an einem Issue beteiligt,
      wird bei neuen Bemerkungen (z.B. wenn der Fehler korrigiert wurde)
      automatisch per email darüber informiert. Allerdings ist GitHub
      öffentlich. Man kann mir daher Anliegen auch per{' '}
      <a href="mailto:alex@gabriel-software.ch">email</a> melden.
    </p>
    <p>
      arteigenschaften.ch wird im Auftrag der Fachstelle Naturschutz des Kantons
      Zürich entwickelt. Daher wird in der Regel umgesetzt, was mit ihr
      abgesprochen und von ihr finanziert wurde.
    </p>
  </>
)

export default MeldenDoc
