Ein paar Beispiele, wie man in Skripten mit Ebenenkompositionen hantiert.

Ganz einfach ist es, sämtliche Ebenenkompositionen auf einen Schlag zu löschen,
siehe --> RemoveAllLayerCompositions.jsx

Etwas - aber nicht viel - komplizierter ist die folgende Aufgabe:

Stellen wir uns vor, wir haben ein PS-Dokument mit einer Hintergrundebene
und darüber verschiedene "Looks" in Ebenengruppen sortiert.
D.h. z.B. dass jede Look-Gruppe eine gewisse Anzahl von Einstellungsebenen
enthält, mit denen das Hintergrundbild manipuliert wird.
Das ganze soll so aufgebaut sein, dass jede dieser Gruppen einzeln sichtbar
gemacht werden können, wobe dann die anderen Gruppen ausgeschaltet(unsichtbar)
sind.

Nun die Aufgabe:

Erstelle einen Satz von Ebenenkompositionen, die jeweils genau eine der Look-Gruppen 
ein- und die anderen ausblendet.

Der Name der Ebenenkomposition soll dem Gruppennamen entsprechen.

Dazu siehe --> GroupsToLayerComps.jsx

