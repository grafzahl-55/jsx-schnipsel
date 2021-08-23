Mein naechster Versuch.

(0) Einleitung
--------------

Ich will mich nicht lange darüber auslassen, welche Problematik hier
behandelt werden soll. Das ist alles in diesem Post auf FB zu finden:

https://www.facebook.com/groups/rickmaschke/posts/1240950219679036/

Insbesondere ist dort auch ein Video von Veit, wo der Workflow genau
beschrieben ist.

Mir geht's hier darum,  diesen Workflow zu vereinfachen bzw. weniger "klicklastig" zu machen.

Änderungen gegenüber der vorigen Version
-----------------------------------------
- Aktion zum Speichern und Schließen des SmartObj. Packt gleich den 
  Bildinhalt in die Zwischenablage und startet auch den Transformationsdialog
- Aktion, um weitere Bilderstapel anzulegen
- Exportskript kommt mit mehreren Bilderstapel zurecht
- Zusätzlich: Ein Skript, das nur die Ebenenkompositionen erstellt


(1) Beschreibung der Versuchsumgebung
-------------------------------------

- Kunde-X.psd   : Kundenbild mit der leeren Wand; als PSD abgespeichert.
- Bilddatenbank : Verzeichnis der Vorschlagsbilder (Alle im Format JPEG; Farbraum AdobeRGB)
- lib           : Enthält Aktion und Skript


(2) Vorbereitung
----------------

Das Bild mit der leeren Wand, an der die Bilder virtuell "aufgehaengt" weden, wird im Folgenden
das "Arbeitsdokument" genannt. Es muss im Format PSD oder TIFF vorliegen und das "Wandbild"
als Hintergrundebene enthalten.

Als Vorbereitung wird die Aktion  'START-Workflow' aufgerufen, die folgende Schritte unternimmt:

1) Das Arbeitsdokument wird in das Profil sRGB umgeandelt.
2) Es wird (als oberste Ebene) ein zunächst leeres SartObj. erzeugt (Name: BEISPIELBILDER).
3) Das SmartObj. geoeffnet wird ins Profil AdobeRGB umgewandelt
4) Es erscheint der Bildgroeßen-Dialog, wo man DPI und die gewuenschte Abmessung eintraegt.

Hier haelt die Aktion an, und man kann nun anfangen, verschiedene Bilder aus der Bilddatenbank
in das Smart Obj zu holen.

Wichtig: Diese Bilder sollen alle auf oberster Ebene hübsch übereinanderliegen, also keine Gruppen
oder ähnliche Faxen.
Die Ebenennamen werden später als Name für die Ebenenkomposition und die Exportdateien verwendet.

Bemerkung: Obwohl die Aktion selbst relativ trivial ist, hab' ich sie im Muster einer 
"modularen Aktion" angelegt (Siehe Armin Staudt's Kanal zu diesem Thema). 
Das macht sie leichter erweiterbar/anpassbar.

(3) Haendische Anpassungen
--------------------------

- Aktion "Stapel schliessen" ausführen
    * Kopiert den aktuellen Inhalt (d.h. das zuletzt ausgesuchte Bild) in die Zwischenablage 
    * Speichert und schliesst das Smartobj 
    * Ermöglicht gleich eine Transformation. 
- Im Arbeitsdokument anpassen, verschieben, skalieren verzerren usw.
- Arbeitsdokument speichern.
- Das SmartObj. nicht umbenennen.

(4) Optional: Weitere Stapel erstellen
--------------------------------------

Falls weite Bilderstapel indas Arbeitsdokument integriert werden sollen, dann
die Aktion "Naechster Stapel" ausfuehren (NICHT nochmal START-Workflow!!!). 
Darin dann wieder Bilder platzierne und am Schluss "Stapel schliessen" ausführen 

Das kann theoretisch beliebig oft wiederholt werden. Durch das exponentielle Wachstum
der Anzahl der Kombinationsmöglichkeiten sind dem natürlich praktische Grenzen gesetzt.

Was ist bei den Bilderstapeln zu beachten? 
------------------------------------------
- Sie muessen auf der obersten Dokumentebene liegen, also nicht in irgendwelchen Ebenengruppen 
- Sie koennen umbenannt werden, muessen aber nicht. Beim Umbenennen ist zu beachten, dass der
  neue Name den String "BEISPIELBILDER" enthält.
- Es kann auch ein bestehender Bilderstapel dupliziert werden ("Smartobj. durch Kopie!!!!"),
  dann kann man dessen Inhalt noch ändern, z.B. ander Bilder einfügen.

(5) Export der Vorschlagsbilder
-------------------------------

Im geöffneten Arbeitsdokument das Skript 'vorschlaege-exportieren.jsx' laufen lassen.

Dieses Skript ergzeugt nun die Ebenenkompositionen und generiert auch die JPEGs. in denen
jeweils eins der Vorschlagsbilder sichtbar ist. 

Die JPEG Dateien landen automatisch in einem Unterverzeichnis, das im gleichen Verzeichnis
wie das Arbeitsdokument liegt. 

Das Benennungsschema der Exportdateien folgt dem Muster:

[Name der 1. Ebenenkomposition]+[Name der 2. Ebenenkomposition]+... 

(In der Reihenfolge der Bilderstapel im Arbeitsdokument; von oben nach unten).

(6) Nur die Ebenenkompositionen erstellen 
------------------------------------------

Nachdem alle Bilderstapel erstellt wurden: Skript 'ebenenkompositionen_erstellen.jsx'
laufen lassen. Das generiert lediglich die Ebenenkompositionen innerhalb der 
Bilderstapel (Smartobjekte), erzeugt aber keine Export-Dateien. 
