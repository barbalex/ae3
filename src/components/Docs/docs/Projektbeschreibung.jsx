import React from 'react'

import { DokuDate } from '..'

const ProjektbeschreibungDoc = () => (
  <>
    <h1>Projektbeschreibung</h1>
    <DokuDate>29.09.2019</DokuDate>
    <h1>Was ist arteigenschaften.ch?</h1>
    <h2>Ziele</h2>
    <h3>Ausgangspunkt</h3>
    <p>
      ...sind Erfahrungen, welche in der Fachstelle Naturschutz gemacht wurden:
    </p>
    <ul>
      <li>
        Bezieht man Daten aus anderen Quellen, ist es schwierig, sie
        vollständig, fehlerfrei und aktuell zu (er-)halten
      </li>
      <li>
        Entscheidend für die Aktualität der Datenbank ist es, die Informationen
        einfach und mit geringem Aufwand importieren und danach direkt nutzen zu
        können
      </li>
      <li>
        Eigenschaften von Arten und Lebensräumen interessieren nicht nur die
        Fachstelle Naturschutz des Kantons Zürich. Ideal wäre eine von allen in
        diesem Bereich tätigen Stellen gemeinsam nachgeführte Datenbank. Oder
        realistischer: Ein Ort, an dem frei zugängliche Daten mit wenig Aufwand
        vereint werden können
      </li>
    </ul>
    <h3>Was zeichnet arteigenschaften.ch aus?</h3>
    <p>Die wichtigsten Merkmale dürften sein:</p>
    <ul>
      <li>
        Die verwendeten Begriffe und Datenstrukturen sind auf Eigenschaften von
        Arten und Lebensräumen zugeschnitten
      </li>
      <li>Daten können einfach und rasch importiert werden...</li>
      <li>
        ...weshalb prinzipiell alle beteiligten Stellen ihre Daten an einem Ort
        und in einem gemeinsamen Format anbieten könnten. Das mag etwas naiv und
        utopisch sein. Zumindest aber kann man innert Minuten anderswo
        verfügbare Daten in arteigenschaften.ch vereinen und in Auswertungen mit
        anderen Daten kombinieren
      </li>
      <li>
        Daten können beim Export für anschliessende Auswertungen einfach und
        rasch kombiniert werden
      </li>
    </ul>

    <h3>Wozu wird arteigenschaften.ch benutzt?</h3>
    <h4>Nachschlagen</h4>
    <p>
      Man kann arteigenschaften.ch benutzen, um Informationen nachzuschlagen.
      Das dürfte sogar der häufigste Anwendungszweck sein. Die Darstellung ist
      aber eingeschränkt, da die Benutzeroberfläche dynamisch aus flexiblen
      Datenstrukturen generiert wird und arteigenschaften.ch keine Bilder
      enthält. Anwendungen mit statischer Datenstruktur können Informationen
      benutzerfreundlicher darstellen.
    </p>
    <p>
      Hilfreich könnte allerdings sein, wenn der einfache Import (wie erhofft)
      dazu führen sollte, dass arteigenschaften.ch besonders umfassende und
      aktuelle Informationen enthält.
    </p>
    <h4>Auswerten</h4>
    <p>
      arteigenschaften.ch wurde entwickelt, um mit Hilfe der darin enthaltenen
      Daten Auswertungen durchzuführen. Meist in Kombination mit
      Artbeobachtungen oder Lebensraumkartierungen. Beispiele:
    </p>
    <ul>
      <li>
        In einer Liste von Artbeobachtungen die wertvollsten Arten
        identifizieren, z.B. mithilfe des Artwerts, der nationalen Priorität
        oder des Rote-Liste-Status
      </li>
      <li>Aus Vegetationsaufnahmen Zeigerwerte berechnen</li>
      <li>
        In Zeitreihen Veränderungen von ausgewählten Parametern darstellen (z.B.
        Artwerte, Rote-Liste-Arten, Spätblüher, Magerkeitszeiger,
        störungsempfindliche Arten...)
      </li>
      <li>
        Für eine Region, Lebensraum, Förderprogramm oder Massnahme
        geeignete/prioritäre Arten bestimmen
      </li>
      <li>
        Aus Kartierungen und/oder physikalischen Modellen für bestimmte
        Arten/Förderprogramme prioritäre Flächen identifizieren
      </li>
      <li>
        Modellieren, z.B. den Einfluss der Klimaerwärmung auf Arten und
        Schutzprioritäten
      </li>
    </ul>
    <p>
      Besonders geeignet ist arteigenschaften.ch, wenn in einem Projekt eigene
      Art- oder Lebensraumeigenschaften erhoben und mit anderen für die
      Auswertung kombiniert werden sollen.
    </p>
    <h4>Daten für andere Anwendung bereitstellen</h4>
    <p>
      Andere Anwendungen können Daten aus arteigenschaften.ch direkt abholen und
      nutzen. Mehr Infos <a href="#diese-technologien-werden-verwendet">hier</a>
      .
    </p>
    <h4>Nutzungsbedingungen</h4>
    <p>
      arteigenschaften.ch ist ein Werkzeug der Fachstelle Naturschutz des
      Kantons Zürich (FNS). Die Daten stehen frei zur Verfügung. Möchten Sie
      Daten importieren, wenden Sie sich bitte an{' '}
      <a href="mailto:andreas.lienhard@bd.zh.ch">Andreas Lienhard</a>. Die FNS
      behält sich vor, die optimale Integration von Daten in arteigenschaften.ch
      zu besprechen und allenfalls Einfluss darauf zu nehmen.
    </p>
    <p>
      Es können nur Daten akzeptiert werden, deren Eigner mit der
      Veröffentlichung einverstanden sind. Arteigenschaften der FNS sind open
      data.
    </p>
    <p>
      Die Anwendung arteigenschaften.ch ist{' '}
      <a href="#open-source">open source</a>. Es steht allen frei, sie zu
      kopieren und selber zu betreiben, ohne allfälligen Einfluss der FNS oder
      mit Daten, die man nicht veröffentlichen will. Oder besser: gemeinsam
      weiter zu entwickeln.
    </p>
    <h3>Das Zielpublikum</h3>
    <p>
      ...befasst sich mit Arten und Lebensräumen. Es arbeitet primär in den
      Sachbereichen Naturschutz, Jagd und Fischerei, Gewässer, Wald,
      Landwirtschaft und Problemarten. Angesprochen sein dürften Fachstellen bei
      Bund, Kantonen, Gemeinden, Forschungseinrichtungen und freischaffende
      Fachleute bzw. Ökobüros.
    </p>
    <h3>Ziele für die Benutzerin</h3>
    <ul>
      <li>Die Anwendung ist einfach zu bedienen,</li>
      <li>die Datenflut überschaubar,</li>
      <li>möglichst selbsterklärend und</li>
      <li>
        gut verfügbar:
        <ul>
          <li>von jedem Gerät im Internet</li>
          <li>
            als Export in den Formaten{' '}
            <a href="http://de.wikipedia.org/wiki/CSV_(Dateiformat)">csv</a> und
            Excel
          </li>
          <li>
            über die API für GIS und beliebige weitere Applikationen (da die API
            mit <a href="https://github.com/facebook/graphql">GraphQL</a>{' '}
            aufgebaut ist, kann jede Applikation ohne Rückfrage mit der FNS
            flexibel auf die Daten zugreifen. Rückfragen bzw. entsprechende
            Benutzer-Rechte sind nur nötig, um Daten von externen Applikationen
            aus zu verändern)
          </li>
        </ul>
      </li>
      <li>Daten können über alle Artengruppen hinweg exportiert werden</li>
    </ul>
    <h3>Ziele für Datenpfleger und Systemverantwortliche</h3>
    <ul>
      <li>
        Daten können in wenigen Minuten importiert werden.Es werden keine
        besonderen technischen Fähigkeiten vorausgesetzt
      </li>
      <li>Die Datenstruktur ist via die API klar definiert</li>
      <li>
        Der Code ist offen und dokumentiert. Nutzer können eigene Erweiterungen
        entwickeln (lassen) und/oder arteigenschaften.ch gemeinsam weiter
        entwickeln. Oder eine eigene Anwendung entwickeln, welche die Daten via
        die API bezieht oder gar bearbeitet
      </li>
    </ul>
    <h2>Fachliches Konzept</h2>
    <h3>Der Grundgedanke</h3>
    <p>
      Es gibt ein paar (nachfolgend erklärte) Grundbegriffe. Daraus leiten sich
      diese <a href="#aktueller-stand">Grundstrukturen der Datenbank</a> ab:
    </p>
    <ul>
      <li>Taxonomien mit Objekten und Synonymen</li>
      <li>Eigenschaften-Sammlungen mit Eigenschaften und Beziehungen</li>
    </ul>
    <p>Ja, das ist alles.</p>
    <h3>Taxonomien</h3>
    <p>
      <a href="http://de.wikipedia.org/wiki/Taxonomie">Taxonomien</a>{' '}
      klassifizieren{' '}
      <a href="http://de.wikipedia.org/wiki/Objekt_(Philosophie)">Objekte</a>{' '}
      (z.B. Arten) mit einer{' '}
      <a href="http://de.wikipedia.org/wiki/Hierarchie">Hierarchie</a>. Die
      Entwicklung von Taxonomien und der Umgang mit unterschiedlichen und sich
      laufend verändernden Taxonomien sind höchst anspruchsvoll.
    </p>
    <p>
      Andere geläufige Begriffe: Nomenklatur, Index, Flora, Kartierschlüssel,
      Lebensraumschlüssel.
    </p>
    <p>
      Beispiele: Indizes der nationalen Artdatenzentren, &quot;Flora der Schweiz
      (Ausgabe 2012)&quot;, &quot;Lebensraumkartierung Neeracher Riet
      2009&quot;, &quot;Flora Europaea (Ellenberg, 1991)&quot;.
    </p>
    <p>
      Im Idealfall enthielte die aktuell vom nationalen Zentrum verwendete
      Taxonomie nur &quot;offizielle&quot; Arten und z.B. keine Synonyme.
      Stattdessen würden Beziehungen zwischen offiziellen Arten und Arten
      anderer Taxonomien beschrieben. Da die Daten von den nationalen Zentren
      unseres Wissens (noch?) nicht so erhältlich sind, ist das in
      arteigenschaften.ch nicht realisiert aber im Design vorgesehen und bei
      Vorliegen entsprechender Daten direkt umsetzbar. Nachtrag vom 12.12.2019:
      Offenbar ist das in der Checklist 2017 so umgesetzt.
    </p>
    <h3>Objekte</h3>
    <p>
      <a href="https://de.wikipedia.org/wiki/Objekt_(Philosophie)">Objekte</a>{' '}
      bilden die Grundeinheit der Taxonomie. In arteigenschaften.ch sind das
      Arten oder Lebensräume. Aber nicht nur die Arten selbst, sondern jede
      Stufe der Hierarchie darüber und darunter, z.B. Familie, Gattung,
      Unterart.
    </p>
    <h3>Eigenschaften-Sammlungen</h3>
    <p>
      Systematische Informationen über Arten kommen in Sammlungen, z.B. „Flora
      Indicativa 2010“. Solche Sammlungen haben gemeinsame Eigenschaften wie
      z.B.:
    </p>
    <ul>
      <li>Dieselbe Herkunft (Autoren, Publikation, Publikationsdatum)</li>
      <li>
        Denselben Zweck: Die Eigenschaften-Sammlung wurde in der Regel für einen
        bestimmten Zweck erarbeitet. Für das Verständnis der Daten kann diese
        Information sehr hilfreich sein
      </li>
      <li>Bezug auf eine bestimmte Taxonomie</li>
      <li>
        Meist eine bestimmte Artgruppe (z.B. Flora, Fauna, Schmetterlinge…)
      </li>
      <li>
        Innerhalb der Artgruppe eine definierte Auswahl bearbeiteter Arten
      </li>
      <li>Definierte Methodik und Auswahl erfasster Informationen</li>
    </ul>
    <p>
      Statt &quot;Eigenschaften-Sammlung&quot; könnte auch der Begriff
      &quot;Publikation&quot; verwendet werden. Damit würde klar:
    </p>
    <ul>
      <li>
        Dass arteigenschaften.ch an Eigenschaften-Sammlungen minimale
        Qualitätsansprüche stellt. Es muss nicht eine prominent publizierte
        wissenschaftliche Publikation sein. Aber die fachliche Qualität sollte
        dem definierten Zweck entsprechen
      </li>
      <li>
        Dass eine aktualisierte Version einer bestehenden Eigenschaften-Sammlung
        in der Regel als neue Eigenschaften-Sammlung zu behandeln ist
      </li>
    </ul>
    <p>
      Eigenschaften-Sammlungen und Taxonomien sollten nur durch die Autoren
      nachgeführt werden (nicht zu verwechseln mit: importiert).
    </p>
    <p>
      Um Arten- und Lebensraumeigenschaften verstehen und verwalten zu können,
      ist es wichtig, Eigenschaften-Sammlungen als wesentlichen Teil der
      Struktur zu behandeln. Sie erleichtern dem Benutzer, die Übersicht über
      die riesige Menge von Eigenschaften zu gewinnen.
    </p>
    <p>
      arteigenschaften.ch kann auch Eigenschaften und Beziehungen von synonymen
      Objekten anzeigen und exportieren.
    </p>
    <p>
      In fast allen Fällen ist es sinnvoll, Eigenschaften und Beziehungen pro
      Eigenschaften-Sammlung darzustellen. Z.B. bei der Anzeige in der Anwendung
      oder wenn Daten für Exporte ausgewählt werden.
    </p>
    <h3>Zusammenfassende Eigenschaften-Sammlungen</h3>
    <p>
      Für bestimmte Zwecke ist zusätzlich das Gegenteil interessant: Daten aus
      verschiedenen Eigenschaften-Sammlungen zusammenfassen. Z.B. wenn man über
      alle Artengruppen den aktuellsten Rote-Liste-Status darstellen will. Er
      steckt in diversen Eigenschaften-Sammlungen, da er häufig pro Artengruppe
      separat publiziert wird.
    </p>
    <p>Das geht so:</p>
    <ul>
      <li>
        Eine zusätzliche Eigenschaften-Sammlung mit Eigenschaft
        &quot;zusammenfassend&quot; schaffen
      </li>
      <li>Die entsprechenden Daten werden zwei mal importiert:</li>
      <li>Ein mal in die Ursprungs-Eigenschaften-Sammlung</li>
      <li>Ein mal in die zusammenfassende</li>
      <li>
        Die zusammenfassende Eigenschaften-Sammlung kann genau gleich wie alle
        anderen Eigenschaften-Sammlungen in der Anwendung angezeigt, exportiert
        oder über eine Schnittstelle angezapft werden
      </li>
    </ul>
    <p>Beispiel: Für Heuschrecken wird eine neue Rote Liste publiziert:</p>
    <ul>
      <li>
        Es wird eine neue Eigenschaften-Sammlung geschaffen, z.B. &quot;BAFU
        (2012): Rote Liste der Heuschrecken&quot;, und die Eigenschaften
        importiert
      </li>
      <li>
        Die alte Eigenschaften-Sammlung bleibt bestehen, z.B. &quot;BUWAL
        (1985): Rote Liste der Heuschrecken&quot;
      </li>
      <li>
        Die Eigenschaften werden nochmals in die zusammenfassende
        Eigenschaften-Sammlung &quot;Rote Listen (aktuell)&quot; importiert.
        Dabei werden bisherige Rote-Listen-Angaben der entsprechenden
        Heuschrecken überschrieben
      </li>
      <li>
        Falls einige 1985 beschriebene Arten 2012 nicht mehr beschrieben wurden,
        bleibt der Rote-Liste-Status von 1985 erhalten. Um dies kenntlich zu
        machen, soll in der zusammenfassenden Eigenschaften-Sammlung in einem
        zusätzlichen Feld immer der Name der Ursprungs-Eigenschaften-Sammlung
        mitgeliefert werden
      </li>
    </ul>
    <h3>Eigenschaften</h3>
    <p>
      <a href="http://de.wikipedia.org/wiki/Eigenschaft">Eigenschaften</a>{' '}
      beschreiben einzelne Objekte. Beispiele:
    </p>
    <ul>
      <li>Artwert</li>
      <li>Rote-Liste-Status</li>
      <li>nationale Priorität</li>
    </ul>
    <h3>Beziehungen</h3>
    <p>
      <a href="https://de.wikipedia.org/wiki/Relation">Beziehungen</a>{' '}
      beschreiben das Verhältnis zwischen zwei oder mehr Objekten. Beispiele:
    </p>
    <ul>
      <li>Bindung von Arten an Biotope</li>
      <li>Frasspflanzen von Insekten</li>
      <li>Wirte von Parasiten</li>
      <li>Beutespektrum von Räubern</li>
      <li>aber auch taxonomische Beziehungen wie &quot;synonym&quot;</li>
    </ul>
    <h3>Daten decodieren</h3>
    <p>
      Traditionell werden Daten häufig codiert erfasst. Bis 2012 waren auch
      viele Daten in einer früheren Version von arteigenschaften.ch codiert. Die
      entsprechenden Felder enthielten für Menschen unverständliche Codes. Sie
      wurden in einer Codierungstabelle aufgelöst. Damit die Daten verständlich
      dargestellt werden konnten, mussten sie für Darstellung und Export
      decodiert werden. Dieses System ist kompliziert und leistungshungrig. Die
      Rohdaten sind für Menschen nicht mehr lesbar. Deshalb sind (nur) codierte
      Informationen zu vermeiden oder um uncodierte zu ergänzen.
    </p>
    <h3>Eigenschaften-Sammlungen aktualisieren</h3>
    <p>
      Wie soll eine bestehende Eigenschaften-Sammlung aktualisiert werden? Zu
      bedenken sind u.a.:
    </p>
    <ul>
      <li>
        Müssen frühere Auswertungen nachvollzogen bzw. wiederholt werden können?
        Wenn ja, sollten ältere Versionen unverändert erhalten bleiben
      </li>
      <li>
        Wird eine Eigenschaften-Sammlung periodisch teilweise aktualisiert (im
        Gegensatz zu vollständig)? Und soll ersichtlich sein, welche
        Eigenschaften welchen Datenstand haben?
      </li>
    </ul>
    <p>
      Wenn eine von beiden obigen Fragen mit ja beantwortet wurde, kann z.B.
      folgendermassen vorgegangen werden:
    </p>
    <ul>
      <li>
        Neue Daten als neue Eigenschaften-Sammlung erfassen. Z.B. &quot;ZH
        Artwert (2013)&quot;, wobei es schon &quot;ZH Artwert (aktuell)&quot;
        gibt und ev. weitere
      </li>
      <li>
        Für die Auswertung unter Einbezug aller Artwerte eine zusammenfassende
        Eigenschaften-Sammlung schaffen, z.B. &quot;ZH Artwert (aktuell)&quot;
      </li>
    </ul>
    <p>
      <strong>Ideen für die Zukunft</strong>
    </p>
    <ul>
      <li>
        Benutzer können eigene Listen von Objekten (z.B. Art-Beobachtungen,
        Lebensräume) mit Eigenschaften verknüpfen:
        <ul>
          <li>
            Benutzerin lädt eine Tabelle mit ihren Beobachtungen oder
            Lebensräumen (wie bei Importen)
          </li>
          <li>
            Sie wählt, mit welcher ID diese Daten mit Eigenschaften verknüpft
            werden sollen (wie bei Importen)
          </li>
          <li>
            Anwendung meldet, wie erfolgreich die Verknüpfung ist (wie bei
            Importen)
          </li>
          <li>Benutzer wählt Eigenschaften (wie bei Exporten)</li>
          <li>Benutzer lädt Ergebnis herunter (wie bei Exporten)</li>
        </ul>
      </li>
    </ul>
    <h3>Open source</h3>
    <div>
      <a href="https://github.com/barbalex/ae3/blob/master/license.md">
        <img
          src="https://img.shields.io/badge/license-ISC-brightgreen.svg"
          referrerPolicy="no-referrer"
          alt="js-standard-style"
        />
      </a>
    </div>

    <p>
      Die für die Anwendung verwendete{' '}
      <a href="https://github.com/barbalex/ae3/blob/master/license.md">
        Lizenz
      </a>{' '}
      ist sehr freizügig. Auch die von der FNS stammenden Daten sind open data.
      Eine Weiterverbreitung der in der Anwendung enthaltenen und nicht von der
      FNS stammenden Daten ist aber nur mit Einverständnis der Autoren zulässig.
    </p>
    <h2>Neu-Aufbau 2017/2018</h2>
    <h3>Grundlage</h3>
    <p>...sind folgende Erkenntnisse:</p>
    <ul>
      <li>
        Die Anwendung ist nützlich und es gibt bisher keine echte Alternative.
        Es ist daher davon auszugehen, dass sie noch ein paar Jahre benutzt wird
      </li>
      <li>
        Es gibt einige aktuelle Erweiterungs-Wünsche. Das dürften nicht die
        letzten sein
      </li>
      <li>
        Anpassungen an der aktuellen Anwendung sind anspruchsvoll und
        Nebenwirkungen schwierig zu vermeiden
      </li>
      <li>
        Web- und Datenbanktechnologie entwickeln sich rasant weiter. Daher
        stehen heute viel{' '}
        <a href="#diese-technologien-werden-verwendet">
          besser geeignete Mittel
        </a>{' '}
        zur Verfügung, um eine solche Anwendung aufzubauen
      </li>
    </ul>
    <h3>Projektziele</h3>
    <ul>
      <li>
        Hauptziel: Unterhaltbarkeit verbessern und künftige Erweiterungen
        ermöglichen
      </li>
      <li>Abhängigkeit von wenig verbreiteten Technologien verringern</li>
      <li>
        Aufwand für und Risiken bei künftigem Unterhalt und Erweiterungen
        verringern
      </li>
      <li>Verwaltung der Daten vereinfachen</li>
      <li>Datenintegrität besser gewährleisten</li>
    </ul>
    <h3>Funktionale Ziele</h3>
    <ol>
      <li>
        Jedes Objekt (Art oder Lebensraum) kann von beliebig vielen Taxonomien
        beschrieben werden. Ähnlich wie bisher schon jedes Objekt von beliebig
        vielen Eigenschaften-Sammlungen beschrieben werden kann. Das ermöglicht:
        <ul>
          <li>
            Neue Versionen einer Taxonomie werden importiert, ohne die alte zu
            ersetzten.Wie bisher Eigenschaften-Sammlungen
          </li>
          <li>Alle Taxonomien bleiben langfristig erhalten</li>
          <li>
            Der Benutzer kann wählen, nach welcher Taxonomie der Strukturbaum
            aufgebaut wird
          </li>
          <li>
            Anwender oder Anwendungen (welche die Daten über Schnittstellen
            verwenden), werden durch den Import neuer Daten(-strukturen) nicht
            beeinträchtigt bzw. nicht gezwungen, ihre Anwendung anzupassen
          </li>
          <li>
            Mögliche spätere Erweiterung: Import von Taxonomien über die
            Benutzeroberfläche, wie heute Eigenschaften-Sammlungen
          </li>
        </ul>
      </li>
      <li>
        Beziehungssammlungen werden in Eigenschaften-Sammlungen integriert: Es
        sind einfach Eigenschaften-Sammlungen mit Beziehungen
        <ul>
          <li>Ist einfacher zu verstehen</li>
          <li>
            Beziehungen und Eigenschaften einer Sammlung werden am selben Ort
            angezeigt
          </li>
          <li>Vereinfacht die Datenstruktur</li>
          <li>Vereinfacht Exporte und Importe</li>
        </ul>
      </li>
      <li>
        Gruppen sind nicht mehr Teil der Taxonomie Bisher wurden Arten in
        Gruppen eingeteilt (Fauna, Flora, Moose, Pilze). Das wird aufgehoben,
        denn:
        <ul>
          <li>Taxonomien halten sich nicht zwingend an Gruppen</li>
          <li>
            Die bisher verwendeten Kategorien sind letztlich nicht klar
            voneinander abzugrenzen
          </li>
          <li>
            Die Kategorisierung von Biota ist Sache der Taxonomien, nicht dieser
            Datenbank
          </li>
          <li>
            Sollen trotzdem für gewisse Werkzeuge Gruppen gebildet werden, ist
            das einfach mittels Eigenschaften-Sammlung möglich. Beispiele:
            GIS-Layer, Artgruppen-ID in EvAB
          </li>
        </ul>
      </li>
      <li>
        Daten sind vor Veränderung geschützt. Organisationen erteilen
        ausgewählten Benutzern Bearbeitungs-Rechte. Diese Benutzer können Daten
        importieren und teilweise direkt in arteigenschaften.ch bearbeiten
      </li>
      <li>
        Die API stellt umfassende Funktionalitäten bereit. Externe Anwendungen
        können im Rahmen der Benutzerrechte alles realisieren, was mit den
        zugrundeliegenden Daten möglich ist
      </li>
    </ol>
    <h3>Technologien</h3>
    <ul>
      <li>
        Als Datenbank <a href="https://www.postgresql.org">PostgreSQL</a>
        <ul>
          <li>
            Benutzer können dank{' '}
            <a href="https://www.postgresql.org/docs/current/datatype-json.html">
              JSONB
            </a>{' '}
            eigene Datenstrukturen importieren (Eigenschaften-Sammlungen und
            Taxonomien)
          </li>
          <li>
            Alle übrigen Datenstrukturen sind relational und ermöglichen damit:
            <ul>
              <li>Einfachere Verwaltung,</li>
              <li>Datenauswertung,</li>
              <li>die Datenintegrität zu gewährleisten</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <a href="https://github.com/facebook/graphql">GraphQL</a> in Form von{' '}
        <a href="https://github.com/graphile/postgraphile">PostGraphile</a>
        <ul>
          <li>
            API-Server mit einer Zeile bauen und konfigurieren. Das sind{' '}
            <em>tausende</em> weniger als bisher!
          </li>
          <li>
            Daten-Logik und Rechte-Verwaltung obliegen der Datenbank - wie es
            sein sollte
          </li>
          <li>
            GraphQL ist die kommende API-Technologie. Verglichen mit REST ist
            GraphQL extrem flexibel. Somit steht ein aussergewöhnlich
            benutzerfreundlicher API-Server zur Verfügung, mit dem jede(r) ganz
            nach eigenen Bedürfnissen alle öffentlichen Daten aus
            arteigenschaften.ch abfragen und - im Rahmen der Benutzer-Rechte -
            bearbeiten kann
          </li>
        </ul>
      </li>
      <li>
        <a href="https://www.apollodata.com">Apollo</a>. Komponenten definieren,
        welche Daten sie brauchen. GraphQL und Apollo kümmern sich um die
        Bereitstellung. React (siehe unten), GraphQL und Apollo haben die
        Entwicklung von Anwendungen revolutioniert
      </li>
      <li>
        <a href="https://facebook.github.io/react/index.html">React</a>
        <ul>
          <li>
            Die Benutzeroberfläche ist eine Funktion der anwendungsseitigen
            Daten,
          </li>
          <li>viel einfacher zu steuern</li>
          <li>
            ...und aus wiederverwertbaren und testbaren Komponenten aufgebaut
          </li>
        </ul>
      </li>
    </ul>
  </>
)

export default ProjektbeschreibungDoc
