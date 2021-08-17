Mein naechster Versuch.

(0) Einleitung
--------------

Ich will mich nicht lange darüber auslassen, welche Problematik hier
behandelt werden soll. Das ist alles in diesem Post auf FB zu finden:

https://www.facebook.com/groups/rickmaschke/posts/1240950219679036/

Insbesondere ist dort auch ein Video von Veit, wo der Workflow genau
beschrieben ist.

Mir geht's hier darum,  diesen Workflow zu vereinfachen bzw. weniger "klicklastig" zu machen.

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
3) Das SmartObj. wird ins Profil AdobeRGB umgewandelt
4) Das SmartObj. wird geoeffnet und es erscheint der Bildgroeßen-Dialog, wo man  
   DPI und die gewuenschte Abmessung eintraegt.

Hier haelt die Aktion an, und man kann nun anfangen, verschiedene Bilder aus der Bilddatenbank
in das Smart Obj zu holen.

Wichtig: Diese Bilder sollen alle auf oberster Ebene hübsch übereinanderliegen, also kein Gruppen
oder ähnliche Faxen.
Die Ebenennamen werden später als Name für die Ebenenkomposition und die Exportdateien verwendet.

Bemerkung: Obwohl die Aktion selbst relativ trivial ist, hab' ich sie im Muster einer 
"modularen Aktion" angelegt (Siehe Armin Staudt's Kanal zu diesem Thema). 
Das macht sie leichter erweiterbar/anpassbar.

(3) Haendische Anpassungen
--------------------------

- Smart Obj. speichern und schließen.
- Im Arbeitsdokument anpassen, verschieben, skalieren verzerren usw.
- Arbeitsdokument speichern.
- Das SmartObj. nicht umbenennen.

(4) Export der Vorschlagsbilder
-------------------------------

Im geöffneten Arbeitsdokument das Skript 'vorschlaege-exportieren.jsx' laufen lassen.

Dieses Skript ergeugt nun die Ebenenkompositionen und generiert auch die JPEGs. in denen
jeweils eins der Vorschlagsbilder sichtbar ist. 

Die JPEG Dateien landen automatisch in einem Unterverzeichnis, das im gleichen Verzeichnis
wie das Arbeitsdokument liegt. 



