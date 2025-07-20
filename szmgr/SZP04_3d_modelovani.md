= 3D modelování a datové struktury
:url: ./3d-modelovani-a-datove-struktury/
:page-group: szp
:page-order: SZP04

[NOTE]
====
Mnohoúhelníkové a trojúhelníkové sítě: datové struktury, modelování, pass:[<s>filtrování</s>], změna struktury sítě, **zjednodušování sítě**. Implicitní **a parametrické** reprezentace a modelování **(SDF, CSG, B-Rep)**.

_PA010_
====

== Mnohoúhelníkové a trojúhelníkové sítě

=== Základní pojmy

Geometrie::
* Mění jí deformace.
* Např. to, kde jsou body.
* Zahrnuje zakřivení (curvature), plochu (area), vzdálenosti mezi body, atd. <<pa010-2021>>

Topologie::
* Nemění ji deformace.
* Např. to jak jsou body propojené.
* Sousednost (neighborhood), souvislost (connectedness), adjacency. atd. <<pa010-2021>>
+
.Topology <<topology>>
image::./img/szp04_topology.png[Topology, 500]

Topological manifold::
Prostor/útvar, který lokálně _připomíná_ (je homeomorfní) stem:[n]-dimenzionální Euklidovský prostor. <<pa010-2021>> <<manifold-wiki>>
+
stem:[n]-manifold je takový topologický manifold, kde okolí každého bodu je homeomorfní s stem:[n]-dimenzionálním Euklidovským prostorem. <<manifold-wiki>>
+
Manifoldy jsou typicky fyzikálně validní a efektivní (např. pomocí half-edge).
+
* Souřadnicový prostor stem:[\mathbb{R}^n] je stem:[n]-manifold.
* Libovolný diskrétní prostor je 0-manifold.
* Kruh je 1-manifold.
* Torus (donut) a Kleinova láhev je 2-manifold (povrch).
* Každý povrch je 2-manifold až na neuzavřené hrany. <<pa010-2021>>
* stem:[n]-dimenzionální koule je stem:[n]-manifold.
+
image::./img/szp04_manifold.png[width=100%]

Orientability / orientace::
+
[quote, PA010]
____
* Orientable surfaces allow consistent definition of clockwise and counter-clockwise orientation.
** We can define front/back or inner/outer side.
* In non-orientable surfaces, the orientation can change after running through a surface loop.
____
+
.Möbiova páska a Kleinova láhev
====
Möbiova páska je neorientovatelná, protože po oběhnutí pásu se změní orientace.

Kleinova láhev je orientovatelná, protože po oběhnutí láhve se orientace nezmění.

image:./img/szp04_mobius_strip.jpg[Möbiova páska, 50%]
image:./img/szp04_klein_bottle.jpg[Kleinova láev, 30%]
====

Elementy topologie::
* Vertices (vertexy / vrcholy) (V)
* Edges (hrany) (E)
* Faces (stěny) (F)
* Genus (G)
* Edge loops (L)
* Boundary edge loops (rings, R)
* Shells (S)

Genus::
* Počet "děr" v povrchu.
* Počet "držadel" v povrchu.
* Počet skupin křivek, které nelze stáhnout do bodu.
+
[quote, PA010]
____
Genus of an orientable surface is the maximum number of cuttings along nonintersecting simple closed curves without separating it.
____
+
[TIP]
====
Podle Wikipedie je _genus_ česky _rod plochy_.
====
+
[TIP]
====
Je to *maximální* počet těch řezů.

Následující povrch<<genus>> jde rozdělit podél červené křivky na dva, ale neuvažujeme ji, protože chceme *nejvyší možný* počet řezů, které povrch *nerozdělí*.

image::./img/szp04_genus.png[width=500rem]
====

Boundary edge loops / rings::
Edge loops uvnitř stěn, které nejsou vnějšími hranicemi objektu.
+
"Díry" ve stěnách, ale není to genus.
+
stem:[R = L - F]
+
image::./img/szp04_rings.png[width=200rem]

Shells (S)::
Spojené komponenty povrchu (množiny stěn).
+
image::./img/szp04_shells.png[width=500rem]

Eulerova charakteristika / Euler-Poincaré formula::
Eulerova charakteristika stem:[\chi] popisuje topologický prostor či geometrický útvar stem:[M]. Je to topologický invariant -- nezmění se jakkoli je tento útvar pozohýbán.
+
[stem]
++++
\chi(M) = V - E + F \text{ (bez děr)} \\
\chi(M) = V - E + F - R = 2 \cdot (S - G) \text{ (s děrami)}
++++
+
[IMPORTANT]
====
Pro libovolný mnohostěn (polyhedron) bez děr je stem:[\chi = 2].
====
+
[IMPORTANT]
====
Pro uzavřený 2-manifoldní trojúhelníkový mesh:

Každý trojúhelník má 3 hrany a každá hrana je sdílena dvěma trojúhelníky, takže stem:[E = \frac{3}{2} F].

TIP: Intuitivně: pokud jsme neúsporní, pak máme tři hrany pro každý trojúhelník (stem:[3F]), každou hranu ale "přilepíme" k nějakému dalšímu trojúhelníku, takže každou hranu máme zbytečně dvakrát (stem:[2E]), proto stem:[3F = 2E], tedy stem:[E = \frac{3}{2} F].

Z Euler-Poincaré plyne, že

[stem]
++++
V = 2 + E - F = 2 + \frac{3}{2} F - F = 2 + \frac{1}{2} F \sim \frac{1}{2}
++++

--
* Tedy platí poměr stem:[E:F:V = 3:2:1].
* Tedy průmeřný vertex degree (počet hran, které vycházejí z vertexu) je stem:[2 \cdot \frac{E}{V} \sim 6].
--

[TIP]
--
Každá hrana (ve 2-manifoldu) přispívá k degree právě dvou vertexů, protože někde začíná a končí.

Kdybychom sečetli degree všech vertexů, dostali bychom stem:[2E], proto stem:[2E \sim 6V].
--

====

Simplex::
Nejjednodušší polytop (generalizace mnohoúhelníku, mnohostěnu, atd.). Generalizace trojúhelníku v libovolné dimenzi:
+
* 0D -- bod
* 1D -- úsečka
* 2D -- trojúhelník
* 3D -- tetraedr
* 4D -- 5-cell (5nadstěn)

=== Datové struktury

Seznam trojúhelníků / list of triangles (polygon soup)::
Jednoduchý, ale obsahuje redundantní informace. Neříká nic o sousednosti.

Indexed face set::
Vrcholy trojúhelníků jsou dány pomocí indexů do pole vertexů. Méně redundantní, ale neříká nic o sousednosti.

Adjacency matrix::
Matice vertexů říkající, zda-li je mezi vertexy hrana. Nijak nereprezentuje faces.
+
image::./img/szp04_adjacency_matrix.png[width=500]

Corner table / tabulka rohů::
Pro každý vertex udává sousední rohy. Fajn, pokud nás zajímá sousednost vertexů. Trochu redundantní. Použitelná jen pro trojúhelníkové sítě.
+
--
* stem:[c.v] -- vertex rohu,
* stem:[c.t] -- trojúhelník rohu,
* stem:[c.n] -- následující roh trojúhelníku,
* stem:[c.p] -- předchozí roh trojúhelníku,
* stem:[c.o] -- opačný roh v sousedním trojúhelníku (opačný roh kdyby to byl quad).
* stem:[c.r] -- "pravý" roh v sousedním trojúhelníku,
* stem:[c.l] -- "levý" roh v sousedním trojúhelníku.
--
+
image::./img/szp04_corner_table.png[width=500]

Half-edge data structure::
Použitelná pro 2-manifoldy. Poskytuje rychlé hledání sousednosti. Umožňuje efektivní modifikace meshů.
+
[source, csharp]
----
record HalfEdge // e.g. e
{
    Vertex Start { get; set; } // e.g. A
    // NB: End is optional since you can easily access Twin.Start.
    Vertex End { get; set; } // e.g. B
    HalfEdge Twin { get; set; }

    HalfEdge Next { get; set; }
    // NB: Prev is optional since you can easily access Next.Next.
    HalfEdge Prev { get; set; }
    Face Face { get; set; }
}
----
+
image::./img/szp04_half_edge.png[width=500]


=== Modelování

IMPORTANT: Tahle sekce má docela průnik s otázkou link:../modelovani-3d-postav/[Modelování 3D postav].

Boundary representation model (B-rep)::
Modelování objektů pomocí jejich hranic -- boundaries (hrany, stěny, atd.).

Polygonální síť / mesh::
Síť trojúhelníků. Hrany jsou vždy rovné. Potřebuje velké množství polygonů na hladké povrchy.

B-spline plochy::
Vertexy řídící sítě slouží k aproximaci křivek. Nedokáže popsat libovolnou topologii.

Topologická validita::
* B-rep model splňuje Euler-Poincaré formuli. (Což neimplikuje, že je 2-manifold.)
* Sousedící faces mají stejnou orientaci.
* Žádné faces "nevisí" ven z modelu.

Geometrická validita::
Numerické chyby v geometrii (např. v pozicích vertexů) mohou způsobit konflikty mezi topologickou a geometrickou informací. <<pa010-2021>>
+
_Např.: Rovnice rovin tvrdí, že hrana je uvnitř objektu, ale topologie říká, že je mimo něj._

Eulerovy operátory::
Operátory zachovávající Euler-Poincaré formuli. Jsou dostatečné pro konstrukci užitečných meshů. Pracují s 6 parametry: stem:[V] -- vertices, stem:[E] -- edges, stem:[F] -- faces, stem:[H] -- components, stem:[S] -- shells, stem:[G] -- genus. <<pa010-2021>> <<boundaries>>
+
NOTE: Zdá se, že stem:[H] -- components je ekvivalentní stem:[R] -- rings.
+
Ač Eulerových operátorů se dá zadefinovat mnoho, v praxi stačí:
+
[%header,cols="1,4"]
|====
| Operátor
| Popis

| `MSFV`
| make shell, face, vertex

| `MEV`
| make edge, vertex

| `MFE`
| make face, edge

| `MSH`
| make shell, hole

| `MEKL`
| make edge, kill loop

2+|

| `KEV`
| kill edge, vertex

| `KFE`
| kill face, edge

| `KSFV`
| kill shell, face, vertex

| `KSH`
| kill shell, hole

| `KEML`
| kill edge, make loop
|====

Regularizované booleovské operátory / regularized boolean operators::
Reprezentace těles pomocí booleovských operací. _Regularizované_ značí, že výsledek je vždy platné 2-manifold těleso.
+
--
* `AND` - průnik stem:[\cap^*]
* `OR` - sjednocení stem:[\cup^*]
* `SUB` - rozdíl stem:[\setminus^*]
--
+
Regularizace vypadá tak, že nejprve je provedena booleovská operace, poté je vypočítán _interior_ a následně _closure_. <<rbo>>
+
--
* _Interior point_ stem:[p] tělesa stem:[S] je takový bod, že existuje stem:[r] takové, že otevřená koule s poloměrem stem:[r] a středem v stem:[p] obsahuje jen body z stem:[S].
* _Exterior point_ stem:[p] tělesa stem:[S] je takový bod, že existuje stem:[r] takové, že otevřená koule s poloměrem stem:[r] a střem v stem:[p] *nemá žádný průnik* s stem:[S].
* _Interior_ tělesa stem:[S] je množina všech jeho interior pointů.
* _Exterior_ tělesa stem:[S] je množina všech jeho exterior pointů.
* _Boundary_ tělesa stem:[S] je množina bodů, které nejsou ani interior ani exterior tělesa stem:[S].
* _Clusure_ tělesa stem:[S] je sjednocení jeho interior a boundary.
--
+
[TIP]
--
_Otevřená koule_ je koule bez povrchu. Tedy právě ty body, které jsou jejím "vnitřkem".
--
+
.Schéma interior and a boundary tělesa stem:[A \cap B] <<pa010-2021>>
image::./img/szp04_interior_boundary.png[width=200]
+
.Příklad regularizovaného průniku <<pa010-2021>>
image::./img/szp04_rbo.png[width=100%]

Global deformations (Alan Barr)::
Mění tvar celého meshe. Obvykle jednoduché a snadno implementovatelné. Jsou fajn při modelování.
+
--
* _Translace_,

* _Rotace_,

* _Škálování / scale_,

* _Zkosení / shear_,

* _Tapering / zúžení_ -- nekonstantní škálování,
+
.Tapering in link:https://help.autodesk.com/view/3DSMAX/2016/ENU/?guid=GUID-51233298-312D-4773-AD22-ADB08E70CCE1[3ds Max]
image::./img/szp04_tapering.png[width=300]

* _Twisting / screw / šroubování_ -- nekonstantní rotace okolo osy,
+
.Twisting in link:https://help.autodesk.com/view/3DSMAX/2022/ENU/?guid=GUID-0AD7CE08-9992-4E49-BA11-672DEA3B13CF[3ds Max]
image::./img/szp04_twisting.png[width=300]

* _Bending / ohýbání_ -- ohnutí rozsahu vertexů okolo daného bodu o daný úhel.
+
.Bending in link:https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/transform/bend.html[Blender]
image::./img/szp04_bending.png[width=300]

--

Free-form deformations (FFD)::
Lokální deformace vertexů v dané "kleci" / mřížce / lattice -- Bezierově objemu.
+
--
. Vyrob FFD mřížku (Bezierův objem).
. "Umísti" do objemu objekt, který chceš deformovat.
. Deformuj mřížku (hýbej s jejími body).
. Transformuj vertexy v mřížce podle změn v FFD prostoru.
--
+
image::./img/szp04_ffd.png[width=400]
+
Má řadu rozšíření s různými tvary mřížky.

////

=== Filtrování

Podobně jako 2D obrazy i meshe se dají filtrovat. Používá se k např. k odstranění šumu a zdůraznění důležitých částí.

IMPORTANT: Filtrům se věnuje otázka link:../zpracovani-rastroveho-obrazu/[Zpracování rastrového obrazu].

Gaussian filter::
Vážený součet vertexů. Vyhlazuje i hrany.

Bilateral filter::
Vyhlazuje, ale zachovává hrany.
+
.Bilateral Normal Filtering for Mesh Denoising <<denoising>>
image::./img/szp04_bilateral_filter.png[width=400]

////


=== Změna struktury sítě

IMPORTANT: Modifikace meshů mají značný přesah do otázky link:../krivky-a-povrchy/[Křivky a povrchy] a taky link:../pokrocila-pocitacova-grafika/[Pokročilá počítačová grafika]

Překlápění hrany / edge flip::
Lokální změna, která nahradí hranu stem:[(b,c)] hranou stem:[(a,d)]. Trojúhelníky stem:[(a,b,c)] a stem:[(b,d,c)] se stanou stem:[(a,d,c)] a stem:[(a,b,d)]. <<pa010-2021>>
+
image::./img/szp04_edge_flip.png[width=400]

Rozdělení hrany / edge split::
Lokální změna přidávající další vertex a hrany mezi dva trojúhelníky, které tak rozdělí na čtyři. <<pa010-2021>>
+
image::./img/szp04_edge_split.png[width=400]

Zhroucení grany / edge collapse::
Lokální změna, která nahrazuje hranu vrcholem. <<pa010-2021>>
+
image::./img/szp04_edge_collapse.png[width=400]

Upsampling / subdivision::
Globální změna, která rozdělí jedno primitivum (trojúhelník / quad) na více. Vyhlazuje mesh dělením na menší kousky. <<pa010-2021>>
+
image::./img/szp04_subdivision.png[width=400]

Downsampling / decimation / simplification::
Globální redukce množství primitiv. Často využívá edge collapse.

Regularization / mesh resampling::
Globální upráva s cílem zlepšit kvalitu meshe, např.: tvar trojúhelníků a četnost vertexů. <<pa010-2021>>
+
image::./img/szp04_mesh_regularization.png[width=400]

Isotropic remeshing::
Algoritmus pro regularizaci meshů. Opakuje čtyři kroky:
+
--
. Rozděl hrany delší než stem:[4 / 3] průměrné délky.
. Zhruť hrany kratší než stem:[4 / 5] průměrné délky.
. Překlop hrany, pokud to zlepší stupeň vrcholu (ideální je 6).
. Vycentruj vrcholy.
--
+
Zlepšuje rychlost některých algoritmů, eliminuje podlouhlé trojúhelníky, které se blbě renderují, zlepšuje subdivision, ale nejde použít vždy a může vést ke ztrátě detailů (řeší _Adaptive remeshing_). <<pa010-2021>>
+
image::./img/szp04_isotropic_remeshing.png[width=400]


== Implicitní reprezentace a modelování

_Když máme objekt definovaný polévkou matematických symbolů místo hromádky trojúhelníků._ Jinými slovy máme jednu nebo více reálných funkcí, které klasifikují body v prostoru.

Rovina::
Dána bodem stem:[p] a normálou stem:[N], ohraničuje poloprostor. Vzdálenost bodu od roviny je dána (za předpokladu, že stem:[N] je normalizovaná):
+
[stem]
++++
f(x) = (x - p) \cdot N
++++

Kvadriky / kvadratické plochy::
* _Elipsoid_ (třeba koule): stem:[\frac{x^2}{a^2} + \frac{y^2}{b^2} + \frac{z^2}{c^2} = 1],
+
.An ellipsoid by link:https://commons.wikimedia.org/w/index.php?curid=18447750[Sam Derbyshire]
image::./img/szp04_ellipsoid.png[width=200]

* _Hyperboloid_ (třeba kužel): stem:[\frac{x^2}{a^2} + \frac{y^2}{b^2} - \frac{z^2}{c^2} = 1],
+
.A one-sheeted hyperboloid by link:https://commons.wikimedia.org/w/index.php?curid=18447776[Sam Derbyshire]
image::./img/szp04_hyperboloid.png[width=200]


* _Válec (cylinder)_: stem:[\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1],
+
.A cylinder by link:https://commons.wikimedia.org/w/index.php?curid=18447784[Sam Derbyshire]
image::./img/szp04_cylinder.png[width=200]

* _Paraboloid_ (třeba miska): stem:[\frac{x^2}{a^2} + \frac{y^2}{b^2} - z = 0],
+
.A paraboloid by link:https://commons.wikimedia.org/w/index.php?curid=18447777[Sam Derbyshire]
image::./img/szp04_paraboloid.png[width=200]

Kvartiky / kvartické plochy::
* _Torus_ (donut): stem:[\left( \sqrt{x^2 + y^2} - R \right)^2 + z^2 - r^2 = 0].
+
.link:https://commons.wikimedia.org/w/index.php?curid=979546[A torus]
image::./img/szp04_torus.png[width=200]

Distance surfaces::
Tělesa lze definovat pomocí vzdálenosti od jiných entit:
+
--
* _Sphere_: stem:[d(x, \text{point}) = r],
* _Cylinder / capsule_: stem:[d(x, \text{line}) = r],
* _Torus_: stem:[d(x, \text{circle}) = r],
* _Generalized cylinder_: stem:[d(x, \text{curve}) = r],
* _Offset surface_: stem:[d(x, \text{surface}) = r].
--
+
kde stem:[d(x, A)] je nejmenší vzdálenost bodu stem:[x] od entity stem:[A]. <<pa010-2020>>

Constructive solid geometry (CSG)::
Umožňuje kombinovat implicitní objekty pomocí logických operací. Předpokládáme, že pokud stem:[f(x, y, z) < 0] pak je bod uvnitř objektu daném stem:[f]. Tato metoda nezachovává stem:[C^1] spojitost. Pro dva objekty stem:[f] a stem:[g]: <<pa010-2020>>
+
--
* _Sjednocení_: stem:[\min(f, g)],
* _Průnik_: stem:[\max(f, g)],
* _Rozdíl_: stem:[\max(f, -g)].
* _Komplement_: stem:[-f].
--

Bloby (kapky)::
Součet několika Gaussových křivek. <<pa010-2020>>
+
[stem]
++++
\begin{align*}

r_i^2 (x,y,z) &= (x-x_i)^2 + (y-y_i)^2 + (z-z_i)^2 \\
f(x,y,z) &= -1 + \sum_i \exp \left( -B_i \cdot \frac{r_i^2 (x,y,z)}{R_i^2} + B_i \right) \\
f(x,y,z) &= -1 + \sum_i D(r_i)

\end{align*}
++++
+
kde:
+
--
* stem:[B_i] je "blobbiness",
* stem:[R_i] je poloměr blobu v klidu,
* stem:[D(r_i)] je Gaussova křivka,
* stem:[r_i] je funkce poloměru kapky.
--
+
image::./img/szp04_blobs.png[width=300]

Metaballs::
Podobné blobům, ale nepoužívá exponenciální funkci. Organicky se "slévající" koule. <<pa010-2020>>
+
[stem]
++++
\begin{align*}

D(r_i)= \begin{cases} 

\alpha \left( 1 - \frac{3r_i^2}{R_i^2} \right)
    & 0 \leq r_i \leq R_i/3 \\

\frac{3\alpha}{2} \left( 1 - \frac{r_i}{R_i} \right) ^2
    & R_i/3 \leq r_i \leq R_i  \\

0
    & R_i \leq r_i

\end{cases}

\end{align*}
++++
+
.Metaballs by link:https://commons.wikimedia.org/w/index.php?curid=5237220[SharkD]
image::./img/szp04_metaballs.png[width=100%]


[bibliography]
== Zdroje

* [[[pa010-2021,1]]] Byška, Furmanová, Kozlíková, Trtík: PA010 Intermediate Computer Graphics (podzim 2021)
* [[[pa010-2020,2]]] Sochor: PA010 Intermediate Computer Graphics (podzim 2020)
* [[[notes-pa010,3]]] link:/fi/pa010/[Moje poznámky z PA010 (podzim 2020)]
* [[[manifold-wiki,4]]] link:https://en.wikipedia.org/wiki/Topological_manifold[Wikipedia: Topological manifold]
* [[[klein-bottle,5]]] link:https://plus.maths.org/content/imaging-maths-inside-klein-bottle[Konrad Polthier: Imaging maths - Inside the Klein bottle ]
* [[[genus,6]]] link:https://www.researchgate.net/publication/228393582_Notes_on_the_complex_of_curves[Saul Schleimer: Notes on the complex of curves]
* [[[topology, 7]]] link:https://www.austincc.edu/herbling/shape-of-space.pdf[Topology vs. Geometry]
* [[[boundaries, 8]]] link:https://link.springer.com/book/10.1007/978-1-84628-616-2[Ian Stroud: Boundary Representation Modelling Techniques]
* [[[rbo, 9]]] link:https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/model/closure.html[Interior, Exterior and Closure]
* [[[validity,10]]] link:https://www.sciencedirect.com/science/article/pii/S0010448500000476[Representational validity of boundary representation models]
* [[[denoising,11]]] link:https://ieeexplore.ieee.org/document/5674028[Bilateral Normal Filtering for Mesh Denoising]
