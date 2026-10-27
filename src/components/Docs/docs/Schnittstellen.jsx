import styles from '../index.module.css'

const SchnittstellenDoc = () => (
  <>
    <h1>Schnittstellen</h1>
    <p className={styles.dokuDate}>27.10.2026</p>
    <p>
      Unter{' '}
      <a
        href="https://api.arteigenschaften.ch/postgrest"
        target="_blank"
        rel="noreferrer"
      >
        https://api.arteigenschaften.ch/postgrest
      </a>{' '}
      befindet sich eine PostgREST Daten-Schnittstelle. Sie stellt die
      Tabellen der Datenbank als REST-Ressourcen zur Verfügung. Eine
      OpenAPI-Beschreibung der Schnittstelle ist auf{' '}
      <a
        href="https://api.arteigenschaften.ch/postgrest/"
        target="_blank"
        rel="noreferrer"
      >
        https://api.arteigenschaften.ch/postgrest/
      </a>{' '}
      erreichbar, die Dokumentation von PostgREST auf{' '}
      <a href="https://postgrest.org/" target="_blank" rel="noreferrer">
        postgrest.org
      </a>
      .
    </p>
    <p>
      Lesen ist ohne Anmeldung möglich. Für Schreibzugriffe muss man sich mit
      Benutzername und Passwort anmelden (POST-Aufruf von{' '}
      <code>rpc/login</code>); danach ist alles möglich, wozu der angemeldete
      Benutzer berechtigt ist.
    </p>
    <p>
      Am 27.10.2026 wurde die bisherige GraphQL-Schnittstelle auf{' '}
      <a href="https://api.arteigenschaften.ch/graphql">api.arteigenschaften.ch/graphql</a>{' '}
      abgeschaltet und durch diese PostgREST-Schnittstelle ersetzt.
    </p>
    <p>
      Am 25.10.2021 wurden die Schnittstellen zu EvAB und Artenlistentool
      entfernt, weil diese Werkzeuge von der FNS nicht mehr unterstützt werden.
    </p>
  </>
)

export default SchnittstellenDoc
