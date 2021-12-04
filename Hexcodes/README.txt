Zur Fragestellung siehe

https://www.facebook.com/groups/rickmaschke/posts/1311783005929090/

Ausgangspunkt ist die Vorlagendatei Template.psd . Wesentlicher Bestandteil
dieser Vorlage sind zwei Textebenen:

- FARBNAME -> Nimmt später den Namen der Farbe auf
- HEXCOSE  -> Nimmt später den zugehörigen Hex-Code auf

sowie eine Farbfläche

- FARBE   -> Wird im 2. Schritt entsprechend des Hex-Codes eingefärbt.

Die Vorlage kann nach Belieben angepasst werden. WICHTIG ist lediglich
dass die drei oben genannten Elemente vorhanden sein müssen und genau die 
o.g. Ebenennamen tragen. Selbstverständlich düerfen keine der evtl.
vorhandenen zusätzlichen Ebenen einen dieser reservierten Ebenennamen haben.

Schritt 1: Die Excel-Tabelle
=============================

Sollte 2 Spalten haben mit den Überschriften FARBNAME und HEXCODE, ein Beispiel
in diesem Verzeichnis.
Die Hex-Codes müssen alle 6-stellig sein (das erwartet das Skript später). Groß-Kleinschreibung
ist egal, ein vogestelltes '#', z.B. #4365AA, ist auch noch OK.

Die Excel Tabelle muss nun im Format CSV exportiert werden. Wichtig dabei ist:

1) Die Überschriften als erste Zeile mit ausgeben
2) Feldtrenner ist ein Komma
3) Als Zeichensatz möglichst UTF-8 verwenden, damit es bei Umlauten kein Chaos gibt.

Die CSV-Datei sollte so aussehen wie die Datei farben.csv hier.


Schritt 2:Variablen in der Template.psd-Datei definieren
=========================================================

Man braucht 2 Variablen (FARBNAME, HEXCODE) die mit dem Textinhalt der jeweilig
gleichnamigen Textebene verknüpft ist.
Dann werden die Datensätze durch Import der CSV-Datei eingelesen.

Wichtig hier:

1) Erste Spalte für Datensatzname verwenden (es sollte eigentlich "Zeile" heißen, aber egal)
2) Den richtigen Zeichensatz wählen - am Besten wieder UTF-8

Schritt 3: Der Zwischenexport
=============================

Mit Datei -> Exportieren -> Datensätze als Dateien...

werden nun die temporären "Zwischendateien" generiert. Am Besten in ein leeres Verzeichnis, sagen wir temp_export.
Dieses temporäre Verzeichnis kann ganz am Schluss gelöscht werden.

Die "Zwischendateien" sollten so aussehen:

- Die Textebenen FARBNAME bzw. HEXCODE sind nun mit den Daten aus der CSV-Datei gefüllt worden.
- Die Farbfläche hat sich natürlich noch nicht geändert. 

Schritt 4: Eine Aktion anlegen
==============================

Dazu brauchen wir erst mal eine neue Aktion.

Dazu eine der Zwischendateien in PS laden und:

1) Einen neuen Aktionssatz anlegen, sagen wir "Hexcodes"
2) Darin eine neue Aktion mit Namen, sagen wir, ebenfalls "Hexcodes"
3) Die Aktion braucht nur einen einzigen Schritt: Datei->Skripten->Durchsuchen....
   Hier muss dann die Datei "hexcode2ff.jsx" aus diesem Verzeichnis ausgewählt werden.
4) Fertig.

Nun kann man die Beispieldate schließen (ohne Speichern)


Schritt 5: Finale mit der Stapelverarbeitung
============================================

Datei -> Automatisieren -> Stapelverarbeitung....

Als Aktion: Die eben erstellte Aktion.

Als Quelle nimmt man das Verzeichnis mit den Zwischendateien

Als Ziel: Am Besten einen anderen, leeren Ordner

Dann sollte PS losrattern und alle Zwischendateien dahingehend verarbeiten,
dass

- Der Farbcode aus der Textebene HEXCODE ausgelesen wird
- dadurch eine neue Farbe für die Farbfläche FARBE bestimmt,
- und schließlich die HEXCODE-Ebene ausgeblendet wird.

Das Ganze wird wieder als PSD abgespeichert.

Man kann aber die Aktion um weitere Schritte ergänzen, so dass es z.B. 
auch möglich ist, alle Ebenen zu reduzieren und das als JPEG oder PNG
zu speichern.... Kommt drauf an, was man am Schluss haben möchte.

+===================+
| ALTERNATIVLOESUNG |
+===================+

Hier braucht man die HEXCODE-Ebene nicht mehr, d.h. am Einfachsten ist es, diese
einfach auszublenden und das Template neu abzuspeichern.

Dann die CSV-Datei vorbereiten, wie obne beschrieben.

Und schließlich, in PS: Datei->Skripten->Durchsuchen...
Hier die Datei batch_hexcode2ff.jsx von hier aussuchen.

Es erscheinen 3 File-Dialoge:

1) Zum Landen der Template-Datei 
2) Zum Laden der CSV-Datei und schließlich
3) Zur ANgabe des Ausgabeverzeichnisses

Fertig. Den Rest erledigt das Skript.

Hier werden die einzelnen Dateien als PNG abgelegt. Für ein anderes Format muss die 
Skriptdatei entsprechend angepasst werden.

