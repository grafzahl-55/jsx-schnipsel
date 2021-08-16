README fuer die "Wohnzimmerbilder" Skripten.
---------------------------------------------

(0) Vorbereitung
----------------

Es muss ein "Arbeitsdokument" erstellt werden im Format TIFF oder PSD.
Das Bild der Wohnzimmerwand muss darin als Hintergrundebene liegen.
Farbraum und Abmessungen dieses Dokuments sind beliebig.

(1) Dummy platzieren
-------------------

Idee: Um die Größenverältnisse einigermassen realistisch hinzubekommen,
wird im Arbeitsdokument eine "Dummy Ebene" (einfach ein graues Quadrat)
platziert. Dieses kann an eine beliebige Stelle im Bild verschoben werden.
Am Mittelpunkt dieses grauen Quadrats werden später die Vorschlagbilder platziert;
d.h. die Mittelpunkte der Vorschaubilder werden in Schritt (2) automatisch
an den Mittelpunkt des grauen Quadrats verschoben.
Das graue Quadrat sollte (proportional) so skaliert werden, dass es so 
wirkt, als hätte man eine 50x50 cm große graue Fläche "aufgehängt".

Dazu dient das Skript: 01_Dummy_platzieren.jsx 

(2) Vorschlagbilder laden
--------------------------

Nun das Skript 02_Vorschlagbilder_laden.jsx ausführen.

Es öffnet sich ein Dateidialog, in dem man ein oder mehrere Bilddateien auswählen kann.

Die ausgewählten Bilder werden als verknüpfte SmartObj. im Arbeitsdokument platziert.

(Sollen es eingebettete SmartObj werden: Im Skript 02_Vorschlagbilder_laden.jsx in der Funktion
placeAndScale die Variable asLinkedSmartObj auf false setzen.)

Aus den platzierten Dokumenten wird die tatsächliche in der Datei hinterlegte Druckbreite ausgelesen.
Die Ebene wird so verschoben, dass der Mittelpunkt genau über dem Mittelpunkt des grauen Dummy-Quadrats sitzt.
Danach wird das Bild noch so skaliert, dass die tatsächliche Druckbreite im richtigen Verhältnis zu den
fiktiven 50cm der grauen Dummy Ebene steht.
(Beispiel: Hat das platzierte Objekt ein Druckbreite von 75cm, dann wird es proportional so skaliert, dass es
1 1/2 mal so breit ist, wie das graue Quadrat; denn 75 cm ist das 1 1/2-fache von 50cm).

Das Skript kann auch mehrmals hintereinander aufgerufen werden. 
Alle platzierten Vorschlagbilder landen in der einschlägigen Ebenengruppe.

Der Ebenenname entsteht aus dem Dateinamen der platzierten Dokumente.

Natürlich kann man die platzierten Vorschlagbilder noch per Hand nachbessern,
d.h. evtl. verschieben oder skalieren.

Der (verknüpfte) Inhalt des Smartobj. wird in keinerlei Weise verändert,
d.h. Abmessungen, DPI, Farbprofil entspricht 1:1 dem Original.

(3) Vorschauen exportieren
--------------------------

Am Schluss wird das Skript 03_Vorschauen_exportieren.jsx aufgerufen.
Zunächst üffnet sich ein Dateidialog, wo man angibt, in welches Verzeichnis die Vorschaublider
gespeichert werden sollen.

In diesem Verzeichnis entstehen dann die Bilder der Wohnzimmerwand, wobei jeweils genau eine 
der platzierten Ebenen sichtbar ist.

Der Name der Vorschaudatei ergibt sich aus dem Muster: Vorschlag_{Name der Ebene}.jpg 
(Siehe die Funktion exportPreview).

ACHTUNG: Bei eventuellen Namesnkonflikten, wird ohne Nachfrage überschrieben!

WICHTIG, damit alles Funktioniert: Die Namen der Ebenengruppe (BILDVORSCHLAEGE) und der 
Dummy-Ebene (__DUMMY__) sollen nicht geändert werden. Alle platzierten Bildvorschläge 
müssen innerhalb der Gruppe bleiben, damit der Export richtig funktioniert. 


(4) Sonstiges
-------------
Das Verzeichnis hier enthält noch meine "Testumgebung" mit einem beispielhaften
Arbeitsdokument (aus dem Internet -- mein Wohnzimmer ist weniger schrecklich),
sowie einer Test "Bilddatenbank" (haha) mit Beispielbildern in verschiedenen 
Druckabmessungen und -auflösungen.

