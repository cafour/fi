= Modelování a projekce
:url: ./modelovani-a-projekce/
:page-group: szp
:page-order: SZP08

[NOTE]
====
Homogenní souřadnice, modelovací, pohledová a projekční matice, perspektivní a ortografická projekce. Základní afinní transformace.

_PV189, PV112_
====

== Souřadnicové systémy

Right-hand rule::
Mnemotechnická pomůcka pro určení orientace os v kartézské soustavě souřadnic. Taky se používá pro určení směru vektorového součinu.
+
image::./img/szp08_right_hand_rule.svg[Right-hand rule]
+
TIP: Osa X je dána ukazováčkem, osa Y prostředníčkem, osa Z palcem. Pokud Y míří nahoru, pak ano, člověk si u toho může vykroutit ruku, ale alespoň si to zapamatuje.

Kartézská soustava souřadnic::
Right-handed systém definován třemi kolmými osami. Ve 2D jsou to stem:[x] a stem:[y]. Ve 3D jsou to stem:[x], stem:[y] a stem:[z]. Jsou na sebe v zájemně kolmé. Počátek je v bodě, kde se protínají všechny osy, označovaném jako stem:[0].

Homogenní souřadnice::
Hack, kdy reprezentujeme souřadnici v 3D prostoru pomocí 4 čísel, abychom mohli zapsat translaci pomocí matice. Využívá se v projektivní geometrii, pro projekci 3D scén na 2D plochu.
+
Převod z kartézských na homogenní souřadnice: stem:[(x, y, z) \to (x, y, z, 1)].
+
Převod z homogenních na kartézské souřadnice: stem:[(x, y, z, w) \to (\frac{x}{w}, \frac{y}{w}, \frac{z}{w})].
+
Body, kde stem:[w = 0] jsou body v nekonečnu. Využívá se pro popis pohybu k nekonečnu, který se v kartézských souřadnicích nedá popsat.

== MVP matice

IMPORTANT: Pro implementaci v OpenGL viz link:../renderovani-s-vyuzitim-gpu/[Renderování s využitím GPU].

WARNING: Při zápisu matic bacha na to, jestli jsou row-major nebo column-major. Třeba v OpenGL to znamená, že se všechny matice píší v transponované podobě, jelikož OpenGL je column-major a v takovém pořádí jsou i parametery `mat2`, `mat3` a `mat4` V GLSL.

Modelová matice stem:[M]::
Převádí souřadnice z prostoru objektu (local space) do prostoru světa (world space). Využívá se pro rotaci (stem:[R]), škálování (stem:[S]) a translaci (stem:[T]) objektu.
+
[stem]
++++
M = T \cdot R \cdot S
++++

Pohledová matice / view matrix stem:[V]::
Převádí souřadnice z prostoru světa (world space) do prostoru před kamerou (camera space). _Otáčí světem, aby kamera byla jeho středem._ <<camera>>
+
[stem]
++++
V = \begin{bmatrix}
    \color{red}{R_x} & \color{red}{R_y} & \color{red}{R_z} & 0 \\
    \color{green}{U_x} & \color{green}{U_y} & \color{green}{U_z} & 0 \\
    \color{blue}{D_x} & \color{blue}{D_y} & \color{blue}{D_z} & 0 \\
    0 & 0 & 0  & 1
\end{bmatrix}
\cdot
\begin{bmatrix}
    1 & 0 & 0 & -\color{purple}{P_x} \\
    0 & 1 & 0 & -\color{purple}{P_y} \\
    0 & 0 & 1 & -\color{purple}{P_z} \\
    0 & 0 & 0  & 1
\end{bmatrix}
++++
+
kde:
+
* stem:[\color{red}{R}] je vektor, který ukazuje doprava od kamery.
* stem:[\color{green}{U}] je vektor, který ukazuje nahoru od kamery.
* stem:[\color{blue}{D}] je vektor, který ukazuje dopředu od kamery.
* stem:[\color{purple}{P}] je pozice kamery.
+
NOTE: Všimni si, že levá matice je transponovaná a poziční vektor v pravé matici je negovaný. Je to proto, že otáčíme a posouváme celým světem tak, aby kamera byla v počátku, musíme proto provést inverzní operace vůči těm, které chceme provést s kamerou. <<camera>>

Frustum::
Část 3D tělesa (nejčastěji pyramidy nebo jehlanu) mezi dvěma rovnoběžnými rovinami.

Projekční matice / projection matrix stem:[P]::
Převádí souřadnice z prostoru před kamerou (camera space) do clip space.
+
Používá se zejména ortografická projekce (stem:[P_\text{ortho}]) a perspektivní projekce (stem:[P_\text{persp}]).

MVP matice::
Pro převod modelu z jeho lokálního prostoru do clip space použijeme:
+
[stem]
++++
\vec{v}_\text{clip} = P \cdot V \cdot M \cdot \vec{v}_\text{local}
++++

== Projekce

=== Ortografická projekce

Používáme především k vykreslení 2D scén. Osu Z můžeme využít, abychom jeden sprite schovali za jiný. Nicméně objekty dál od kamery jsou stejně velké jako ty blízko kamery. <<camera>>

image::./img/szp08_orthographic_projection.png[width=500]

Je dána 6 parametry:

--
* stem:[\text{left}] - levá hranice (X),
* stem:[\text{right}] - pravá hranice (X),
* stem:[\text{bottom}] - spodní hranice (Y),
* stem:[\text{top}] - horní hranice (Y),
* stem:[\text{near}] - blízká hranice (Z),
* stem:[\text{far}] - daleká hranice (Z).
--

Společně definují boxík, kde je stem:[(\text{left}, \text{bottom}, -\text{near})] levý spodní roh a stem:[(\text{right}, \text{top}, -\text{far})] pravý horní roh. Úkolem matice stem:[P_\text{ortho}] je nasoukat tento boxík do krychle stem:[(-1, -1, -1) \to (1, 1, 1)] (a navíc flipnou Z, protože OpenGL mění handedness).

[stem]
++++
\begin{aligned}

P_\text{ortho} &= C \cdot S \cdot T \\

&=

\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & -1 & 0 \\
    0 & 0 & 0 & 1 \\
\end{bmatrix}
\cdot
\begin{bmatrix}
    \frac{2}{\text{right-left}} & 0 & 0 & 0 \\
    0 & \frac{2}{\text{top-bottom}} & 0 & 0 \\
    0 & 0 & \frac{2}{\text{far-near}} & 0 \\
    0 & 0 & 0 & 1 \\
\end{bmatrix}
\cdot
\begin{bmatrix}
    1 & 0 & 0 & -\frac{\text{right+left}}{2} \\
    0 & 1 & 0 & -\frac{\text{top+bottom}}{2} \\
    0 & 0 & 1 & -\frac{\text{far+near}}{2} \\
    0 & 0 & 0 & 1 \\
\end{bmatrix} \\
&=

\begin{bmatrix}
    \frac{2}{\text{right}-\text{left}} & 0 & 0 & -\frac{\text{right}+\text{left}}{\text{right}-\text{left}} \\
    0 & \frac{2}{\text{top}-\text{bottom}} & 0 & -\frac{\text{top}+\text{bottom}}{\text{top}-\text{bottom}} \\
    0 & 0 & -\frac{2}{\text{far}-\text{near}} & -\frac{\text{far}+\text{near}}{\text{far}-\text{near}} \\
    0 & 0 & 0 & 1 \\
\end{bmatrix}

\end{aligned}
++++

kde:

--
* stem:[C] obrací osu Z, kvůli přechodu z right-handed do left-handed (týká se OpenGL <<ortho>>),
* stem:[S] definuje velikost kvádru, který se vleze do clip space,
* stem:[T] posouvá počátek doprostřed kvádru.
--

=== Perspektivní projekce

Zmenšuje objekty, které jsou dále od kamery. <<camera>>

image::./img/szp08_perspective_projection.png[width=500]

Je definována 4 parametry:

--
* stem:[\text{FOV}_y] - field of view (úhel zorného pole) v ose Y,
* stem:[\text{aspect}] - poměr šířky a výšky okna,
* stem:[\text{near}] - blízká hranice,
* stem:[\text{far}] - daleká hranice.
--

V matici stem:[P_\text{persp}] se vyskytují následující mezihodnoty:

--
* stem:[\text{top} = \text{near} \cdot \tan \left( \frac{\text{FOV}_y}{2} \right)],
* stem:[\text{bottom} = -\text{top}],
* stem:[\text{right} = \text{top} \cdot \text{aspect}],
* stem:[\text{left} = -\text{right}].
--

Translace frustumu::
Posouváme špičku frustumu do počátku souřadného systému. <<perspective>>
+
[stem]
++++
T = 
\begin{bmatrix}
    1 & 0 & 0 & -\frac{\text{left} + \text{right}}{2} \\
    0 & 1 & 0 & -\frac{\text{bottom} + \text{top}}{2} \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & 1 \\
\end{bmatrix}
++++
+
NOTE: Všimni si, že. Pokud používáme 4-parametrickou verzi, tak je to matice identity a tím pádem není potřeba.

Perspective divide::
Objekty blíže k rovině stem:[\text{near}] budou větší než objekty dále. Rovina stem:[\text{near}] reprezentuje plochu obrazovky, na kterou jsou všechny body promítány.
+
.Perspective divide <<perspective>>
image::./img/szp08_perspective_divide.png[width=500]
+
V obrázku výše je bod stem:[(x, y, z)] promítnut na rovinu stem:[\text{near}] jako stem:[(x', y', near)]. Vznikají tak dva trojúhelníky, které jsou si sobě podobné a proto mají stejné poměry stran. Platí tedy stem:[\frac{y'}{\text{near}} = \frac{y}{z}]. Pak stem:[y' = \frac{y \cdot \text{near}}{z}]. Chceme tedy, aby platilo:
+
[stem]
++++
\begin{aligned}
    x' = \frac{x \cdot \text{near}}{z} \\
    y' = \frac{y \cdot \text{near}}{z}
\end{aligned}
++++
+
Což můžeme vyjádřit v homogenních souřadnicích vyjadřít dělením stem:[w] jako:
+
[stem]
++++
D = \begin{bmatrix}
    \text{near} & 0 & 0 & 0 \\
    0 & \text{near} & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & \color{red}{-1} & \color{red}{0} \\
\end{bmatrix}
++++

Velikost okna::
Šířka a výška okna dána pomocí stem:[\text{left}, \text{right}, \text{bottom}, \text{top}] se musí vlézt do intervalu stem:[(-1.0, 1.0)], proto je potřeba provést škálování:
+
[stem]
++++
S = \begin{bmatrix}
    \frac{2}{\text{right} - \text{left}} & 0 & 0 & 0 \\
    0 & \frac{2}{\text{top} - \text{bottom}} & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & 1 \\
\end{bmatrix}
++++

Přemapování hloubky::
Chceme zachovat tu schopnost souřadnice stem:[z] nám říct, že něco je před něčím jiným. Potřebujeme proto přemapovat interval stem:[(-\text{near}, -\text{far})] na stem:[(-1.0, 1.0)]. Jelikož desetinná čísla mají tendenci vytvářet artefakty, chceme aby toto mapování bylo nelineární tak, aby bylo přesnější blíže stem:[\text{near}]. Použijeme stem:[\frac{c_1}{-z} + c_2], kde stem:[c_1] a stem:[c_2] jsou konstanty zvoleny pomocí:
+
NOTE: Interval stem:[(-\text{near}, -\text{far})] obsahuje negace, neboť kamera se dívá do -Z osy, ale tyto hodnoty zadáváme jako kladná čísla.
+
NOTE: stem:[-z] v rovnici výše je zodpovědné za přepnutí mezi right-handed a left-handed systémem souřadnic v OpenGL.
+
.Depth mapping <<perspective>>
image::./img/szp08_depth_mapping.png[width=500]
+
[stem]
++++
\begin{aligned}
    -1.0 &= \frac{c_1}{-(-\text{near})} + c_2 \\
    1.0 &= \frac{c_1}{-(-\text{far})} + c_2
\end{aligned}
++++
+
Tedy:
+
[stem]
++++
\begin{aligned}
    c_1 &= \frac{2 \cdot \text{far} \cdot \text{near}}{\text{near} - \text{far}} \\
    c_2 &= \frac{\text{far} + \text{near}}{\text{far} - \text{near}}
\end{aligned}
++++
+
Pokud stem:[\frac{c_1}{-z} + c_2] přepíšeme jako stem:[\frac{(c_1 + c_2 \cdot (-z))}{-z} = \frac{(-c_2 \cdot z + c_1)}{-z}], můžeme opět použít homogenní souřadnice a dělení stem:[w] a získáme:
+
[stem]
++++
M_\text{depth} = \begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & -c_2 & c_1 \\
    0 & 0 & -1 & 0 \\
\end{bmatrix}
= \begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & -\frac{\text{far} + \text{near}}{\text{far} - \text{near}} & \frac{2 \cdot \text{far} \cdot \text{near}}{\text{near} - \text{far}} \\
    0 & 0 & -1 & 0 \\
\end{bmatrix}
++++

---

Výsledná matice je:

[stem]
++++
P_\text{persp} =  M_\text{depth} \cdot S \cdot D \cdot T =

\begin{bmatrix}
    \textcolor{green}{\frac{2 \cdot \text{near}}{\text{right} - \text{left}}}
        & 0
        & 0
        & \textcolor{purple}{-\text{near} \cdot \frac{\text{right} + \text{left}}{\text{right} - \text{left}}} \\

    0
        & \textcolor{blue}{\frac{2 \cdot \text{near}}{\text{top} - \text{bottom}}}
        & 0
        & \textcolor{#F56FA1}{-\text{near} \cdot \frac{\text{top} + \text{bottom}}{\text{top} - \text{bottom}}} \\
        % Nika: použij cyklamenovou farbu

    0
        & 0
        & -\frac{\text{far} + \text{near}}{\text{far} - \text{near}}
        & \frac{2 \cdot \text{far} \cdot \text{near}}{\text{near} - \text{far}} \\

    0 & 0 & -1 & 0 \\
\end{bmatrix}
++++

Tahle matice funguje pro obecné frustum dané parametry stem:[\text{left}, \text{right}, \text{bottom}, \text{top}, \text{near}, \text{far}]. Pokud dosadíme původní parametry za mezihodnoty:

[stem]
++++
\begin{aligned}

\textcolor{green}{\frac{2 \cdot \text{near}}{\text{right} - \text{left}}}
&= \frac{\textcolor{red}{2} \cdot \text{near}}{\textcolor{red}{2} \cdot \text{right}}
= \frac{\text{near}}{\text{top} \cdot \text{aspect}}
= \frac{\textcolor{red}{\text{near}}}{\textcolor{red}{\text{near}} \cdot \tan \left( \frac{\text{FOV}_y}{2} \right) \cdot \text{aspect}}
= \textcolor{green}{\frac{\cot \left( \frac{\text{FOV}_y}{2} \right)}{\text{aspect}}} \\

\textcolor{blue}{\frac{2 \cdot \text{near}}{\text{top} - \text{bottom}}}
&= \frac{\textcolor{red}{2} \cdot \text{near}}{\textcolor{red}{2} \cdot \text{top}}
= \frac{\textcolor{red}{\text{near}}}{\textcolor{red}{\text{near}} \cdot \tan \left( \frac{\text{FOV}_y}{2} \right)}
= \textcolor{blue}{\cot \left( \frac{\text{FOV}_y}{2} \right)} \\

\textcolor{purple}{-\text{near} \cdot \frac{\text{right} + \text{left}}{\text{right} - \text{left}}}
&= -\text{near} \cdot \frac{\color{red} \text{right} - \text{right}}{2 \cdot \text{right}}
= \textcolor{purple}{0} \\

\textcolor{#F56FA1}{-\text{near} \cdot \frac{\text{top} + \text{bottom}}{\text{top} - \text{bottom}}}
&= -\text{near} \cdot \frac{\color{red} \text{top} - \text{top}}{2 \cdot \text{top}}
= \textcolor{#F56FA1}{0}

\end{aligned}
++++

dostaneme matici, na kterou se trochu lépe kouká: <<gluperspective>>

[stem]
++++
P_\text{persp} = \begin{bmatrix}
    \textcolor{green}{\frac{\cot \left( \frac{\text{FOV}_y}{2} \right)}{\text{aspect}}}
        & 0
        & 0
        & \textcolor{purple}{0} \\
        
    0
        & \textcolor{blue}{\cot \left( \frac{\text{FOV}_y}{2} \right)}
        & 0
        & \textcolor{#F56FA1}{0} \\
    
    0
        & 0
        & -\frac{\text{far} + \text{near}}{\text{far} - \text{near}}
        & \frac{2 \cdot \text{far} \cdot \text{near}}{\text{near} - \text{far}} \\
    
    0 & 0 & -1 & 0 \\
\end{bmatrix}
++++

== Základní afinní transformace

====
Opakování z link:../../szb/linearni-algebra-ii/[Lineární algebry II]:

Afinní prostor stem:[\mathcal{A}]::
Trojice stem:[(A, V, \oplus)], kde stem:[A] je množina bodů, stem:[V] je vektorový prostor (zaměření) a stem:[\oplus] je binární funkce stem:[\oplus : A \times V \to A].

Standardní afinní prostor stem:[\mathcal{A}_n]::
Je afinní prostor stem:[(\mathbb{R}^n, \mathbb{R}^n, +)].

Afinní kombinace bodů::
Výrazy tvaru stem:[t_0 \cdot a_0 + t_1 \cdot a_1 + ... + t_n \cdot a_n], kde stem:[t_i \in \mathbb{R}, a_i \in \mathcal{A}] a stem:[\sum_{i=0}^n t_i = 1].

Afinní zobrazení::
Zobrazení stem:[f : \mathcal{A} \to \mathcal{A}], které zachovává afinní kombinace bodů.
+
Složení nějakého lineárního zobrazení a translace.
====

Translace stem:[T]::
Pro posun v 2D prostoru podél osy stem:[(x, y)]:
+
[stem]
++++
T = \begin{bmatrix}
    1 & 0 & x \\
    0 & 1 & y \\
    0 & 0 & 1
\end{bmatrix}
++++
+
Pro posun ve 3D prostoru podél osy stem:[(x, y, z)]:
+
[stem]
++++
T = \begin{bmatrix}
    1 & 0 & 0 & x \\
    0 & 1 & 0 & y \\
    0 & 0 & 1 & z \\
    0 & 0 & 0 & 1
\end{bmatrix}
++++

Rotace stem:[R]::
Pro rotaci v 2D prostoru o úhel stem:[\theta]:
+
[stem]
++++
R = \begin{bmatrix}
    \cos \theta & -\sin \theta & 0 \\
    \sin \theta & \cos \theta & 0 \\
    0 & 0 & 1 \\
\end{bmatrix}
++++
+
Pro rotaci ve 3D prostoru o úhel stem:[\theta]:
+
* Kolem osy stem:[X]:
+
[stem]
++++
R = \begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & \cos \theta & -\sin \theta & 0 \\
    0 & \sin \theta & \cos \theta & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
++++
+
* Kolem osy stem:[Y]:
+
[stem]
++++
R = \begin{bmatrix}
    \cos \theta & 0 & \sin \theta & 0 \\
    0 & 1 & 0 & 0 \\
    -\sin \theta & 0 & \cos \theta & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
++++
+
* Kolem osy stem:[Z]:
+
[stem]
++++
R = \begin{bmatrix}
    \cos \theta & -\sin \theta & 0 & 0 \\
    \sin \theta & \cos \theta & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
++++

Škálování / scale stem:[S]::
Pro škálování v 2D prostoru:
+
[stem]
++++
S = \begin{bmatrix}
    x & 0 & 0 \\
    0 & y & 0 \\
    0 & 0 & 1 \\
\end{bmatrix}
++++
+
Pro škálování ve 3D prostoru:
+
[stem]
++++
S = \begin{bmatrix}
    x & 0 & 0 & 0 \\
    0 & y & 0 & 0 \\
    0 & 0 & z & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
++++

Zkosení / shear (asi taky stem:[S])::
Pro zkosení v 2D prostoru vektorem stem:[(x, y)]:
+
[stem]
++++
S = \begin{bmatrix}
    1 & x & 0 \\
    y & 1 & 0 \\
    0 & 0 & 1 \\
\end{bmatrix}
++++
+
Pro zkosení ve 3D prostoru podél plochy stem:[YZ]:
+
[stem]
++++
S = \begin{bmatrix}
    1 & Y & Z & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
++++
+
Podél plochy stem:[XZ]:
+
[stem]
++++
S = \begin{bmatrix}
    1 & 0 & 0 & 0 \\
    X & 1 & Z & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
++++
+
Podél plochy stem:[XY]:
+
[stem]
++++
S = \begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & 1 & 0 & 0 \\
    X & Y & 1 & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
++++

[bibliography]
== Zdroje

* [[[camera,1]]] link:https://learnopengl.com/Getting-started/Camera[LearnOpenGL: Camera]
* [[[lookat,2]]] link:https://github.com/g-truc/glm/blob/5c46b9c07008ae65cb81ab79cd677ecc1934b903/glm/ext/matrix_transform.inl#L153[`glm::lookAt`]
* [[[ortho,3]]] link:http://learnwebgl.brown37.net/08_projections/projections_ortho.html[LearnWebGL: Orthographic Projection]
* [[[perspective,4]]] link:http://learnwebgl.brown37.net/08_projections/projections_perspective.html[LearnWebGL: Perspective Projection]
* [[[gluperspective,5]]] link:https://registry.khronos.org/OpenGL-Refpages/gl2.1/xhtml/gluPerspective.xml[`gluPerspective`]

== Další zdroje

* link:https://github.com/g-truc/glm/blob/5c46b9c07008ae65cb81ab79cd677ecc1934b903/glm/ext/matrix_clip_space.inl#L55[`glm::ortho`]
* link:https://github.com/g-truc/glm/blob/5c46b9c07008ae65cb81ab79cd677ecc1934b903/glm/ext/matrix_clip_space.inl#L249[`glm::perspective`]
