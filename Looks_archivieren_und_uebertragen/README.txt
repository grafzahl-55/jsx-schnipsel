README : Looks archivieren und uebertragen
==========================================

Hier sind zwei kleine Helferlein, die das Verfahren 
Looks zu archiviern und zu uebertragen etwas weniger "klicklastig"
machen sollen.

Wie das Verfahren grundsaetzlich funktoniert, ist in diesem Video von Armin Staudt beschrieben:

https://www.youtube.com/watch?v=1CjhcBjJOr0&list=PLRdWHyjgsZTD1CuSi4_vRb7UgMRDc9OXo

(0) Installation
----------------
Eine Installation ist nicht notwendig. Die beiden Skriptdateien muessen einfach
in ein beliebiges Verzeichnis kopiert werden, wo man sie bei Bedarf wiederfindet.


(1) Einen Look archivieren
--------------------------

Wie in dem Video beschrieben braucht man 3 Messpunkte, die einen Schwarz-, Grau- und Weisspunkt
fuer das Quellbild festlegen. Das muss natürlich nach wie vor manuell und nach bildgerechten
Gesichtspunkten passieren.

Wichtig fuer das Skript: Es muss sich hierbei um die Messpunkte mit Nummer 1,2 und 3 handeln,
Messpunkte mit hoeheren Nummern werden ignoriert.
Unwichtig ist die Reihenfolge der Messpunkte, weil das Skript diese automatisch nach Helligkeit
anordnet.

Sind die 3 Messpunkte festgelegt, führt man das Skript Look_archivieren.jsx aus,

Datei -> Skripten -> Durchsuchen ....

(Das kann man auch in eine Aktion packen).

Ergebnis: Es wird eine Farbpalette mit den 3 aufgenommenen Farben und einem kleinen
Vorschaubild generiert - verpackt in ein SmartObject.
Das kann man nun z.B. in der Bibliothek ablegen.


(2) Look uebertragen
--------------------

Optionaler Schritt:
--------------------
Im Zielbild wieder drei Messpunkte fuer Schwarz-, Grau- und Weisspunkt festlegen (als Messpunkte
Nummer 1, 2, 3).
Sind keine Messpunkte vorhanden, wird der Look sozusagen "unreflektiert" angewendet.


Dann die in (1) generierte Palette in das Zielbild ziehen. Die Position ist dabei egal, ebenfalls
die Skalierung (nur verzerren sollte man's nicht). Die Palette darf auch ruhig die Messpunkte ueberdecken.

Wichtig: Die Palette muss als aktive Ebene im Ebenenstapel markiert sein, ansonsten funktioniert das
"ablesen" der Farbe nicht.

Nun das Skript Look_uebertragen.jsx ausfuehren, fertig.

Das Skript generiert drei verschiedene Gradationskurven, die zusammen in einer Gruppe verpackt sind.
Die Kurven enthalten jeweils die Korrektur des Schwarz-, Grau- und Weisswerts.
Feinabstimmung über den Deckkraftregler.

Viel Spass.
