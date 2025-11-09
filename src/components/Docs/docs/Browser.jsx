import {  dokuDate,  } from '../index.module.css'

const BrowserDoc = () => (
  <>
    <h1>Technische Voraussetzungen</h1>
    <p className={dokuDate}>29.09.2019</p>
    <p>Es braucht einen modernen Browser:</p>
    <ul>
      <li>Auf Google Chrome wird arteigenschaften.ch entwickelt</li>
      <li>
        Firefox, Safari, Opera und Edge sollten ebenfalls gut funktionieren
      </li>
      <li>
        Auf älteren Browsern wie z.B. dem Internet Explorer oder älteren
        Versionen obiger Browser funktioniert arteigenschaften.ch nicht
      </li>
      <li>
        Wer auf Windows arbeitet und keinen modernen Browser einsetzen darf (wie
        z.B. die Fachstelle Naturschutz Kt. Zürich), kann{' '}
        <a
          href="https://www.dropbox.com/sh/woc2mg53znyzrh4/AAC8DaKNABkAWYMCidCzMXYpa?dl=0"
          target="_blank"
          rel="noreferrer"
        >
          hier
        </a>{' '}
        die lokal installierbare Version beziehen.
        <br />
        Für die Installation den aktuellsten `arteigenschaften-win32-x64`-Ordner
        in den eigenen Benutzer-Ordner kopieren (oder irgendwo sonst, wo Sie
        über die Rechte verfügen, eine .exe-Datei auszuführen). Dann die darin
        enthaltene `arteigenschaften.exe` starten
      </li>
    </ul>
  </>
)

export default BrowserDoc
