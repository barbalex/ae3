import React from 'react'

import { DokuDate } from '..'

const NeueArtDoc = () => (
  <>
    <h1>Neue Art erfassen</h1>
    <DokuDate>02.11.2021</DokuDate>

    <p>
      Grundsätzlich sind die Autoren einer Taxonomie für deren Nachführung
      zuständig. Publizieren sie eine neue oder aktualisierte Version, wird sie
      in arteigenschaften.ch als neue Taxonomie aufgenommen. Die vorige bleibt
      unverändert erhalten.
    </p>

    <p>
      Das Ergänzen von Arten ist daher keine Kern-Funktionalität von
      arteigenschaften.ch. Man kann aber taxonomische Einheiten erfassen. Das
      wurde schon immer ermöglicht, um Lebensräume zu erfassen. Denn diese sind
      hierarchisch aufgebaut sind und es ist schwierig, hierarchische Systeme
      logisch schlüssig in flachen Tabellen aufzubauen.{' '}
    </p>

    <p>Diese Funktionalität kann auch genutzt werden, um Arten zu ergänzen.</p>

    <p>
      Wer den Vorgang zuerst testen will, kann das auf{' '}
      <a href="https://artdaten.ch" target="_blank" rel="noreferrer">
        https://artdaten.ch
      </a>{' '}
      machen.
    </p>

    <p>
      Sollte etwas völlig misslingen, können die Daten von arteigenschaften.ch
      im schlimmsten Fall aus der täglichen Sicherung wiederhergestellt werden.
    </p>

    <h3>Taxonomische Eigenschaften erfassen</h3>

    <p>Vorgehen:</p>

    <ol>
      <li>Anmelden</li>
      <li>
        Im Strukturbaum dorthin navigieren, wo die neue Art eingefügt werden
        soll
      </li>
      <li>
        Mit der rechten Maustaste auf den Ordner bzw. die Gattung klicken, unter
        dem die Art eingefügt werden soll
      </li>
      <li>`erstelle neues Objekt (eine Ebene tiefer)` wählen</li>
      <li>
        Rechts im Formular: Namen der Art erfassen
        <br />
        Der Name wird im Strukturbaum erst später aktualisiert. Um das zu
        provozieren, kann man die F5-Taste drücken
      </li>
      <li>Bei `Neues Feld` weitere benötigte Felder erfassen (siehe unten)</li>
      <li>
        In der gleichen Art könnten zuvor Familie und Gattung erfasst werden,
        falls sie noch nicht existierten
      </li>
    </ol>
  </>
)

export default NeueArtDoc
