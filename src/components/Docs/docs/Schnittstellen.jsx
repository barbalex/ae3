import React from 'react'

import { DokuDate } from '../index.jsx'

const SchnittstellenDoc = () => (
  <>
    <h1>Schnittstellen</h1>
    <DokuDate>25.10.2021</DokuDate>
    <p>
      Unter{' '}
      <a
        href="https://api.arteigenschaften.ch/graphql"
        target="_blank"
        rel="noreferrer"
      >
        https://api.arteigenschaften.ch/graphql
      </a>{' '}
      befindet sich eine GraphQL Daten-Schnittstelle. Benutzer-Oberfläche und
      Dokumentation sind in der Anwendung über das Mehr-Menü oben rechts
      erreichbar oder auf{' '}
      <a
        href="https://api.arteigenschaften.ch/graphiql"
        target="_blank"
        rel="noreferrer"
      >
        https://api.arteigenschaften.ch/graphiql
      </a>
      .
    </p>

    <p>
      Diese GraphQL-Schnittstelle wird auch von arteigenschaften.ch selber
      benutzt. Sie kann daher sehr viel, solange man sich mit ausreichenden
      Benutzerrechten anmeldet.
    </p>

    <p>
      Am 25.10.2021 wurden die Schnittstellen zu EvAB und Artenlistentool
      entfernt, weil diese Werkzeuge von der FNS nicht mehr unterstützt werden.
    </p>
  </>
)

export default SchnittstellenDoc
