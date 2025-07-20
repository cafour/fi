= Křivky a povrchy
:url: ./krivky-a-povrchy/
:page-group: szp
:page-order: SZP05

[NOTE]
====
Implicitní a parametrické reprezentace. Interpolace a aproximace. Cn, Gn spojitost, podmínky spojitosti pro po částech definované funkce. Bézierovy křivky, B-spline křivky, pass:[<s>NURBS, </s>]Coonsovy pass:[<s>křivky a </s>]pláty. Povrchy tvořené rekurzivním dělením polygonů.

_PB009, PA010_
====

== Druhy reprezentace

Jak povrchy tak křivky mohou být reprezentovány třemi způsoby:

=== Explicitní reprezentace

Křivka nebo povrch je vyjádřen pomocí *funkce*.

[stem]
++++
\begin{align*}

y &= f(x) & \text{ pro křivku} \\
z &= f(x, y) & \text{ pro povrch}

\end{align*}
++++

Omezení na funkce je však příliš silné. Spoustu pěkných křivek a povrchů nelze vyjádřit pomocí jediné funkce.

=== Implicitní reprezentace

Máme k dispozici rovnici ve tvaru:

[stem]
++++
\begin{align*}

F(x, y) &= c & \text{ pro křivku} \\
F(x, y, z) &= c & \text{ pro povrch}

\end{align*}
++++

kde stem:[c] je konstanta a je obvykle rovná 0.

Tato rovnice udává množinu bodů, ze které se křivka nebo povrch sestává. Takové množině se někdy říká _level set_ a metodám, které s nimi pracují _level-set methods_.

IMPORTANT: Výhodou implicitně zadaných ploch je kompaktnější reprezentace a jednodušší ray casting. Nicméně výpočty s nimi jsou časově náročné, takže se stejně nejdřív převádí na polygonové meshe -- _polygonizace_.

IMPORTANT: Tahle sekce přesahuje do link:../3d-modelovani-a-datove-struktury/[3D modelování a datové struktury] -> _Implicitní reprezentace a modelování_.

=== Parametrická reprezentace

Udává *dráhu* pohybujícího se bodu, či něco jako *hladinu* povrchu. Snadno se z ní vyjadřuje tečna, čehož se využívá při jejich skládání.

Pro křivky:

[stem]
++++
\begin{align*}

Q(t) &= \lbrack x(t), y(t), z(t) \rbrack & \text{ (bodová rovnice křivky)} \\
\vec{q}(t) &= (x(t), y(t), z(t)) & \text{ (vektorová rovnice křivky)}

\end{align*}
++++

kde stem:[t] je "čas" z intervalu stem:[\lbrack t_\text{min}, t_\text{max} \rbrack], nejčastěji stem:[\lbrack 0, 1 \rbrack]. Výhodné je, že takto zadaná křivka se může sama křížit, uzavírat, a podobně.

Analogicky pro povrchy:

[stem]
++++
Q(u, v) = \lbrack x(u, v), y(u, v), z(u, v) \rbrack
++++

kde pro stem:[u] a stem:[v] už metafora s časem nefunguje. Obvykle obě náleží do intervalu stem:[\lbrack 0, 1 \rbrack].

== Terminologie

Pro zbytek otázky je podstatné znát několik termínů:

Dotykový / tečný / tangent vektor křivky::
Aktuální směr křivky v daném bodě. Z parametricky vyjádřené křivky stem:[\vec{q}] ho lze v čase stem:[t_0] získat jako derivaci:
+
[stem]
++++
\vec{q}'(t_0) = \left(
    \frac{\partial x(t_0)}{\partial t},
    \frac{\partial y(t_0)}{\partial t},
    \frac{\partial z(t_0)}{\partial t}
\right)
++++
+
Rovnice tečny stem:[\vec{p}] je pak stem:[\vec{p}(u) = \vec{q}(t_0) + \vec{q}'(t_0) \cdot u].

Polynomiální křivka::
Velmi častý druh křivek v počítačové grafice. Vypadají jako:
+
[stem]
++++
Q_n(t) = a_0 + a_1 \cdot t + a_2 \cdot t^2 + \ldots + a_n \cdot t^n
++++
+
Je velmi snadné je evaluovat a derivovat. Z nich často skládáme křivky po částech.

Kubika::
Polynomiální křivka třetího stupně.
+
Parametricky:
+
[stem]
++++
\begin{align*}

x(t) = a_{x}t^{3} +  b_{x}t^{2} +  c_{x}t +  d_{x} \\
y(t) = a_{y}t^{3} +  b_{y}t^{2} +  c_{y}t +  d_{y} \\
z(t) = a_{z}t^{3} +  b_{z}t^{2} +  c_{z}t +  d_{z}

\end{align*}
++++
+
Zapsáno pomocí matice:
+
[stem]
++++
Q(t) = T \cdot C = \lbrack t^3, t^2, t, 1 \rbrack \cdot \begin{bmatrix}
a_x & a_y & a_z \\
b_x & b_y & b_z \\
c_x & c_y & c_z \\
d_x & d_y & d_z
\end{bmatrix}
++++
+
Tečný vektor stem:[\vec{q'}] je pak:
+
[stem]
++++
\vec{q'}(t) = \frac{\partial}{\partial t} \cdot C = \lbrack 3t^2, 2t, 1, 0 \rbrack \cdot C
++++
+
U kubik platí, že stem:[C = M \cdot G], kde stem:[M] je bázová matice a stem:[G] je vektor geometrických podmínek.
+
--
* stem:[T \cdot M] definuje polynomiální bázi -- skupinu polynomů -- která je společná pro všechny křivky určitého typu.
* stem:[G] pak obsahuje parametry konkrétní křivky -- řídící a dotykové body.
* stem:[t] udává, jestli jsme na začátku či konci křivky.
--

Tečná rovina::
Rovina, která se povrchu dotýká v konkrétním bodě a její normála je na povrch kolmá. Pro parametrickou plochu stem:[Q] je tečná plocha stem:[T] dána jako:
+
[stem]
++++
\begin{align*}

\vec{q_{u}}(u,v) &= \frac{\partial Q(u,v)}{\partial u}
    = \left(
        \frac{\partial x(u,v)}{\partial u},
        \frac{\partial y(u,v)}{\partial u},
        {\partial z(u,v) \over \partial u}
    \right) \\

\vec{q_{v}}(u,v) &= \frac{\partial Q(u,v)}{\partial v}
    = \left(
        \frac{\partial x(u,v)}{\partial v},
        \frac{\partial y(u,v)}{\partial v},
        {\partial z(u,v) \over \partial v}
    \right) \\

T(r,s) &= Q(u,v) + r.\vec{q_{u}} + s.\vec{q_{v}}, \quad r,s \in \mathbb{R}

\end{align*}
++++
+
kde stem:[\vec{q_u}] je tečný vektor ve směru parametru stem:[u], a analogicky stem:[\vec{q_v}]

Normála / kolmice::
Normálu stem:[\vec{n}] parametricky dané plochy stem:[Q] určíme jako vektorový součin tečných vektorů:
+
[stem]
++++
\vec{n} = \frac{\vec{q_u} \times \vec{q_v}}{\left\lVert \vec{q_u} \times \vec{q_v} \right\rVert}
++++

Gradient::
Funkce, která vrací "směr a velikost největšího růstu". Nejčastěji se používá u povrchů k určení normály, ale lze ji použít v libovolné dimenzi k různým účelům. Pokud je povrch stem:[f] zadán implicitně, pak je gradient:
+
[stem]
++++
\nabla f = \left(
    \frac{\partial f}{\partial x},
    \frac{\partial f}{\partial y},
    \frac{\partial f}{\partial z}
\right)
++++


== Interpolace a aproximace

Interpolace::
Prokládání daných bodů křivkou. Konstrukce křivky, která interpolovanými body prochází.
+
====
V případě kubiky výše to znamená, že stem:[G] obsahuje body, kterými křivka prochází.
====
+
====
Mějmě funkci stem:[f(x)], jejíž hodnotu známe v bodech stem:[f(x_0), f(x_1), \ldots, f(x_n)]. Interpolace znamená nalezení hodnot stem:[f(x)] pro všechna stem:[x_0 < x < x_n].
====

Aproximace::
Přiblížení, odhad. Je nepřesným popisem nějaké jiné entity (např. čísla či funkce). Saháme k ní, pokud pro analytické řešení nemáme dost informací nebo výpočetní kapacity. Aproximace je méně přesná než interpolace, ale výpočetně jednodušší.
+
====
V případě kubiky výše to znamená, že stem:[G] obsahuje _řídící_ body, které sice udávají směr křivky, ale ta jimi neprochází.
====

== Spojitost

Představme si, že máme dva segmenty křivky: stem:[Q_1] a stem:[Q_2], spojené v bodě stem:[t], tedy stem:[Q_1(t) = Q_2(t)]. Tento bod nazýváme _uzlem_ (knot). _Spojitost_ je zjednodušeně způsob, jakým jsou tyhle segmenty spojeny v uzlu.

=== Parametrická spojitost stupně stem:[n] (stem:[C^n])

Křivka stem:[Q] patří do třídy stem:[C^n], pokud má ve všech bodech stem:[t] spojitou derivaci až do řádu stem:[n].

--
* stem:[C^0] -- dva segmenty jsou spojené; konečný bod jednoho segmentu je počátečním bodem druhého.
* stem:[C^1] -- platí stem:[C^0] a navíc je tečný vektor na konci prvního segmentu shodný s tečným vektorem na začátku druhého segmentu -- první derivace v uzlu jsou si rovny.
* stem:[C^2] -- platí stem:[C^1] a druhé derivace v uzlu jsou si rovny.
* stem:[C^n] -- platí stem:[C^{n-1}] a navíc jsou si stem:[n]-té derivace v uzlu rovny.
--

====
* Bod pohybující se po stem:[C^0]-spojité dráze sebou "trhne" *v prostoru*, když projde uzlem.
* V případě stem:[C^1] křivky se při průchodu uzlem směr ani rychlost prudce *nezmění*, může se však změnit zrychlení.
* V případě stem:[C^2] křivky se při průchodu uzlem *nezmění* už ani zrychlení.
====

=== Geometrická spojitost stupně stem:[n] (stem:[G^n])

Je podobná parametrické spojitosti, ale vyžaduje jen "geometrickou" spojitost. Vyžaduje, aby si derivace byly *sobě úměrné*. <<mallinus>> <<geometric-continuity>>

--
* stem:[G^0] -- koncový bod prvního segmentu je totožný s počátečním bodem druhého segmentu (stem:[C^0 = G^0]).
* stem:[G^1] -- platí stem:[G^0] a navíc je *směr* tečny na konci prvního segmentu shodný s *směrem* tečny na začátku druhého segmentu. *Velikost tečného vektoru (rychlost) se však může prudce změnit.*
* stem:[G^2] -- platí stem:[G^1] a navíc mají stejný *střed křivosti* (center of curvature). <<smoothness>>
--

Platí, že stem:[C^n \Rightarrow G^n], ale obráceně stem:[G^n \not\Rightarrow C^n].

NOTE: Podle slidů z PB009 musí faktor úměrnosti být různý od 0. <<pb009-2019>> Podle Barskyho a DeRoseho musí v první derivaci být stem:[> 0] a v dalších už je to šumák. <<geometric-continuity>> Co je správně? Kdo ví. Nemám dost častu to zjistit, takže to ponechávám jako cvičení čtenáři.

== Křivky

=== Lagrangeův interpolační polynom

Základní metoda interpolace funkce, jejíž hodnotu známe jen v stem:[n + 1] diskrétních bodech stem:[P_0, P_1, ... P_n]. Sestává se z pomocných polynomů stem:[\ell_i]: <<lagrange>>

[stem]
++++
\ell_i(x) = \prod_{0 \le k \le n, k \neq i}^n \frac{x - x_k}{x_i - x_k}
++++

Který splňuje podmínku:

[stem]
++++
\ell_i(x_k) = \begin{cases}

1 & \text{ pro } i = k \\
0 & \text{ pro } i \neq k

\end{cases}
++++

Pak polynom stem:[P] interpoluje danou množinu bodů:

[stem]
++++
P(x) = \sum_{i=0}^n P_i \ell_i(x)
++++

Blbé je, že musíme všechny pomocné polynomy přepočítat, když přidáme nový bod.

Hornerovo schéma / Horner's method::
Metoda evaluace polynomů. Vychází z myšlenky, že násobení se dá nestovat: <<horner>>
+
[stem]
++++
\begin{aligned}

& a_0 + a_1 \cdot x + a_2 \cdot x^2 + ... + a_n \cdot x_n \\

&   = a_0 + x(a_1 + x(a_2 + ... + x(a_{n-1} + x \cdot a_n)...))
\end{aligned}
++++
+
Vyžaduje jen stem:[n] násobení a stem:[n] sčítání, což je optimální.

=== Hermitovské křivky

Asi nejznámnější interpolační křivky v počítačové grafice. Jsou určeny dvěma řídícími body -- stem:[P_0] a stem:[P_1] -- a dvěma dotykovými vektory -- stem:[\vec{p_0'}] a stem:[\vec{p_1'}]. Řídící body určují začátek a konec křivky, dotykové vektory její směr a vyklenutí. Pokud jsou oba vektory nulové, je to úsečka.

Je jednoduché je na sebe navázat v stem:[C^1], neboť tečné vektory jsou přímo součástí definice.

Cubic Hermite spline / Ferguson curve::
Pro Hermitovskou kubiku platí: <<hermite-spline>> <<ferguson>>
+
[stem]
++++
\begin{aligned}

Q(t) &=

\begin{bmatrix}
    t^{3} & t^{2} & t & 1
\end{bmatrix}

\cdot

\begin{bmatrix}
    2 & -2 & 1 & 1 \\
    -3 & 3 & -2 & -1 \\
    0 & 0 & 1 & 0 \\
    1 & 0 & 0 & 0
\end{bmatrix}

\cdot

\begin{bmatrix}
    P_{0} \\
    P_{1} \\
    \vec{p'}_{0} \\
    \vec{p'}_{1}
\end{bmatrix} = \\

&= P_0 \cdot F_1(t) + P_1 \cdot F_2(t) + \vec{p'}_0 \cdot F_3(t) + \vec{p'}_1 \cdot F_4(t)

\end{aligned}
++++
+
kde stem:[F_1, F_2, F_3, F_4] jsou Hermitovské polynomy 3. stupně:
+
[stem]
++++
\begin{aligned}

\textcolor{red}{F_1(t)} &= 2t^3 - 3t^2 + 1 \\
\textcolor{blue}{F_2(t)} &= -2t^3 + 3t^2 \\
\textcolor{green}{F_3(t)} &= t^3 - 2t^2 + t \\
\textcolor{cyan}{F_4(t)} &= t^3 - t^2

\end{aligned}
++++
+
image::./img/szp05_hermite.png[width=500]

=== Bézierova křivka

Asi nejčastěji používaná *aproximační* křivka. Využívá se zejména ve 2D grafice, třeba při definici fontů.

--
* Bézierova křivka stem:[n]-tého stupně je definována stem:[n + 1] řídícími body stem:[P_0, P_1, ... P_n].
* Změnou polohy jednoho bodu dojde ke změně celé křivky. Proto se často dělí na segmenty menšího stupně, které se pak navazují na sebe.
--

Základem jsou *Bernsteinovy polynomy* stem:[n]-tého stupně:

[stem] 
++++
b_{\nu,n}(x) = \binom{n}{\nu} x^{\nu} \left( 1 - x \right)^{n - \nu}, \quad \nu = 0, \ldots, n,
++++

Mezi jejich vlastnosti patří:

--
* Nezápornost: stem:[b_{\nu,n}(x) \ge 0] pro stem:[x \in \lbrack 0, 1 \rbrack].
* Jejich součet je roven jedné: stem:[\sum_{\nu = 0}^n b_{\nu,n}(x) = 1].
* Dají se vyjádřit rekurzí: stem:[b_{\nu,n}(x) = (1 - x) \cdot b_{\nu,n-1}(x) + x \cdot b_{\nu-1,n-1}(x)].
--

.Bernstein basis polynomials for 4th degree curve blending by link:https://commons.wikimedia.org/w/index.php?curid=40129768[VisorZ]
image::./img/szp05_bernstein.svg[width=500]

DeCasteljau algorithm::
Rekurzivní algoritmus pro konstrukci Bézierových křivek. Využívá vlastností Bernsteinových polynomů.
+
image::./img/szp05_decasteljau.png[width=100%]

Bézierova kubika::
Bézierova křivka třetího stupně. Je dána čtyřmi řídícími body stem:[P_0, P_1, P_2, P_3]:
+
[stem]
++++
P(t) = (1 - t)^3 \cdot P_0 + 3 \cdot (1 - t)^2 \cdot t \cdot P_1 + 3 \cdot (1 - t) \cdot t^2 \cdot P_2 + t^3 \cdot P_3
++++

=== B-spline

Splajn / spline::
Splajn stupně stem:[n] po částech definovaná polynomiální funkce stupně stem:[n-1] proměnné stem:[x]. <<bspline>>
+
[TIP]
--
_Po částech definovaná / piecewise_ znamená, že má několik intervalů a pro každý z nich jiný polynom.
--
+
--
* Místa, kde se části polynomu dotýkají jsou _uzly_ a jsou značeny pomocí stem:[t_0, t_1, ..., t_n] a řazeny v neklesajícím pořadí.
* Pokud jsou uzly unikátní, pak je splajn v uzlech stem:[C^{n-2}] spojitý. <<bspline>>
* Pokud je stem:[r] uzlů shodných, je v tomto místě pouze stem:[C^{n-r-1}] spojitý.
--

---

*Basis spline / B-spline* stupně stem:[n] je aproximační křivka / splajn daná sekvencí stem:[n] uzlů. Jako funkce vrací užitečné hodnoty jen mezi prvním a posledním uzlem, všude jinde je nulová. Svůj název dostala podle toho, že B-splajny slouží jako bázové funkce pro splajnové křivky.

Lze ji definovat pomocí *Cox-de Boorovy* rekurzivní formule:

TIP: de Boorův algoritmus je generalizací DeCasteljauova algoritmu ale pro B-splajny.

[stem]
++++
\begin{aligned}

B_{i,0}(x) &= \begin{cases}
    1 & \text{pro } t_i \le x < t_{i+1} \\
    0 & \text{jinak}
\end{cases}

\\

B_{i,n}(x) &= \textcolor{red}{\frac{x - t_i}{t_{i+n} - t_i}} B_{i,n-1}(x)
    + \textcolor{blue}{\frac{t_{i+n+1} - x}{t_{i+n+1} - t_{i+1}}} B_{i+1,n-1}(x)

\end{aligned}
++++

Zatímco stem:[x] jde od stem:[t_i] k stem:[t_{i+n}], červený výraz začíná na 1 a klesá k 0.

Podobně, zatímco stem:[x] jde od stem:[t_{i+1}] k stem:[t_{i+n+1}], modrý výraz začíná na 0 a roste k 1.

Navíc platí stem:[\sum_{i=0}^{n} B_{i,n}(x) = 1].

Jejich užitečnost spočívá v tom, že libovolný splajn stupně stem:[n] daný sekvencí uzlů lze vyjádřit jako lineární kombinaci B-splajnů:

[stem]
++++
S(x) = \sum_{i=0} c_i B_{i,n}(x)
++++

NOTE: Uzlů je zpravidla víc než stem:[n+1], protože pak teprve máme víc než jeden B-spline, který kombinujeme.

Uniformní B-splajny::
Uzly jsou rozloženy rovnoměrně. Tedy mezi každými dvěma uzly stem:[t_i] a stem:[t_{i+1}] je stejná vzdálenost stem:[h].
+
Příklad:
+
[stem]
++++
T = \begin{bmatrix}
    t_0 & t_1 & t_2 & t_3
    \end{bmatrix}
= \begin{bmatrix}
    0 & 0.\overline{3} & 0.\overline{6} & 1
\end{bmatrix}
++++

Coonsova kubika::
Kubika stem:[P] daná 4 řídícími body stem:[P_0, P_1, P_2, P_3]. Neprochází ani jedním z kontrolních bodů. <<coons>>
+
[stem]
++++
\begin{aligned}

P(t) &= B_0(t) \cdot P_0 + B_1(t) \cdot P_1 + B_2(t) \cdot P_2 + B_3(t) \cdot P_3, t \in \lbrack 0, 1 \rbrack \\

B_0(t) &= \frac{1}{6} (1 - t)^3 \\
B_1(t) &= \frac{1}{6} (3t^3 - 6t^2 + 4) \\
B_2(t) &= \frac{1}{6} (-3t^3 + 3t^2 + 3t + 1) \\
B_3(t) &= \frac{1}{6} t^3

\end{aligned}
++++
+
image::./img/szp05_coons_basis.png[width=400]
+
NOTE: Něco ohledně tohohle termínu mi hrozně smrdí. Zdá se, že jediní, kdo používají "coons cubic curve" jsme my a ČVUT.

////

Coonsovy křivky / uniformní neracionální B-splajny::
+
--
* Vzniká navazování Coonsových kubik.
* Vyžaduje stem:[m \ge 4] body.
* Skládá se pak z stem:[m - 3] segmentů.
* Každý segment stem:[Q_i] je určený body stem:[P_{i-3}, P_{i-2}, P_{i-1}, P_i].
* Segmenty na sebe navazují s stem:[C^2] spojitostí.
* Změna pozice jednoho kontrolního bodu ovlivňuje jen ty segmenty, které řídí. Tedy nejvýše 3. Zejména tedy ne celou křivku.
* Jsou invariantní (neměnné) vzhledem k otočení, posunutí a škálování.
* Leží v konvexním obalu řídících bodů.
--
+
image::./img/szp05_coons_bspline.png[width=400]

Non-Uniform Rational B-Splines (NURBS)::
Zevšeobecnění uniformních neracionálních B-splajnů.
+
--
* Neuniformní jsou, protože vzdálenost mezi stem:[t_0, t_1, ..., t_n] nemusí být stejná.
* Racionální znamená, že řídící body mají váhy.
** Váhy jsou uloženy pomocí homogenních souřadnic v dimenzi stem:[w].
** S vyšší vahou křivka víc lne ke danému bodu.
** Pokud jsou nezáporné, křivka bude v konvexním obalu polygonu daného řídícími body.
** Při stem:[w = \infty] křivka podem prochází, ale dochází ke ztrátě spojitosti.
* Je dána pomocí:
** stem:[n \ge 4] body stem:[P_0, P_1, ..., P_n],
** řádem stem:[k], který říká, že polynomy budou mít stupeň nejvýše stem:[k-1],
** uzlovým vektorem stem:[(t_0, t_1, ..., t_{n+k})], který obsahuje neklesající posloupnost uzlových hodnot.
* Pro konstrukci se používá de Booreho vztah výše.
--
+
[stem]
++++
Q(t) = \frac{
    \sum_{i=0}^n w_i \cdot P_i \cdot B_{i,k}(t)
}
{
    \sum_{i=0}^n w_i \cdot B_{i,k}(t)
}
++++
+
image::./img/szp05_nurbs.png[width=400]

Kuželosečky pomocí NURBS::
Vahy umožňují NURBS vyjádřit kuželosečky (kruhy, elipsy, atd.).
+
image::./img/szp05_kuzelosecky.png[width=400]

////

== Povrchy

Interpolace je náročná, proto se častěji používají aproximační povrchy.

=== Interpolační plocha

Plocha stem:[\vec{P}].
Dáno:

* stem:[(m + 1) \times (n + 1)] řídících bodů stem:[\vec{P}_{i,j}].
* stem:[m + 1] hodnot stem:[u_k] a stem:[n + 1] hodnot stem:[v_l].

Platí, že stem:[\vec{P}(u_k, u_l) = \vec{P}_{k,l}] pro stem:[k = 0, 1, ..., m] a stem:[l = 0, 1, ..., n].

Interpolujeme vektorovým polynomem stem:[\vec{a}_{i,j}]:

[stem]
++++
\vec{P}(u, v) = \sum_{i = 0}^m \sum{j = 0}^n \vec{a}_{i,j} \cdot u^i \cdot v^j
++++

V případě Lagrangeova polynomu je stem:[\vec{a}_{i,j} = \ell_i^m(u) \cdot \ell_j^n(v)].


=== Hermitovský plát

Interpolační povrch.

12-ti vektorová varianta::
4 rohové body a 8 tečných vektorů.
+
image::./img/szp05_hermite_plate_12.png[width=300]

16-ti vektorová varianta::
4 rohové body, 8 tečných vektorů a 4 zkrutové vektory.
+
image::./img/szp05_hermite_plate_16.png[width=300]


=== Coonsovy pláty / Coonsovy plochy / Coons patch

Plochy vzniknuvší interpolací mezi křivkami udávající jejich okraje. Dají se na sebe pěkně napojovat, právě protože jsou definovány svými okraji.

WARNING: Coonsovy pláty jsou *interpolační*, zatímco Coonsovy křivky jsou *aproximační*.

Bilineární Coonsovy pláty::
+
--
Určeny 4 křivkami stem:[P(u, 0), P(u, 1), P(0, v), P(1, v)], které tvoří okraj plátu.

Implicitně se dá zapsat jako:

[stem]
++++
\begin{bmatrix}
1-u & -1 & u
\end{bmatrix}

\cdot

C

\cdot

\begin{bmatrix}
1-v \\ -1 \\ v
\end{bmatrix}

= 0
++++

Povrch je pak tvořen body stem:[C], které tuto rovnici splňují.

Explicitně se dá zapsat jako:

[stem]
++++
P(u, v) = \begin{bmatrix} 1 - u & u \end{bmatrix} \cdot \begin{bmatrix} P_{0, v} \\ P_{1, v} \end{bmatrix}
    + \begin{bmatrix} P_{u, 0} & P_{u, 1} \end{bmatrix} \cdot \begin{bmatrix} 1 - v \\ v \end{bmatrix}
    - \begin{bmatrix} 1 - u & u \end{bmatrix} \cdot
        \begin{bmatrix}
            P_{0, 0} & P_{0, 1} \\
            P_{1, 0} & P_{1, 1}
        \end{bmatrix}
    \cdot \begin{bmatrix} 1 - v \\ v \end{bmatrix}
++++

image::./img/szp05_bilinear.png[width=400]

Zásadním nedostatek těchto ploch je, že není snadné vyjádřit tečné vektory na okrajích, a proto není snadné je napojovat na sebe.
--

Bikubické Coonsovy pláty::
+
--
Podobné bilineárním, ale používájí Hermitovské polynomy:

[stem]
++++
\begin{aligned}

F_1(t) &= 2t^3 - 3t^2 + 1 \\
F_2(t) &= -2t^3 + 3t^2 \\

\end{aligned}
++++

Implicitně je pak tento plát dán:

[stem]
++++
\begin{bmatrix}
F_1(u) & -1 & F_2(u)
\end{bmatrix}

\cdot

C

\cdot

\begin{bmatrix}
F_1(v) \\ -1 \\ F_2(v)
\end{bmatrix}

= 0
++++

Stejně jako u bilineárních ploch, i tady je těžké získat tečné vektory na okrajích.
--

Obecná bikubická plocha::
+
--
Kromě rohů je parametrizována i tečnými vektory na okrajích. Konečně tedy umožňuje snadné navazování.
--

=== Bézierovy plochy

Aproximační plochy dány stem:[(m + 1) \times (n + 1)] řídícími body. Jsou:

--
* snadno diferencovatelné,
* jednoduše se modelují,
* lze z nich relativně snadno spočítat průnik s paprskem,
* speciální případ NURBS ploch.
--

[stem]
++++
P(u, v) = \sum_{i=0}^m \sum_{j=0}^n B_i^m(u) \cdot B_j^n(v) \cdot \vec{a}_{i,j}
++++

Kde stem:[B_i^m(u)] a stem:[B_j^n(v)] jsou Bernsteinovy polynomy.

image::./img/szp05_bezier_plate.png[width=400]

Při změně jendoho z bodů se změní celá plocha, proto se často více plátů spojuje dohromady. Pro spojitost stem:[G^0] se musí rovnat řídící body na okrajích. Pro stem:[G^0] musí tečné vektory na okrajích být lineárně závislé.

Zobrazují se rekurzivním dělením (patch splitting). Využívá se algoritmu de Casteljau.

=== B-spline plochy

Aproximační plochy analogické B-spline křivkám, ale se dvěma parametry.

--
* Jsou lepší pro modelování než Hermitovské nebo Bézierovy plochy, protože se lépe navazují, jelikož B-splajny stupně stem:[k] garantují spojitost stem:[C^{k-1}].
* Změnou jednoho řídícího bodu nezměníme celou plochu, ale jen část.
* Celá plocha leží v konvexním obalu řídících bodů.
* Průchodu řídícím bodem lze dosáhnout zvýšením jeho násobnosti (a tak snížením spojitosti).
* Invariantní k lineárním transformacím.
--

NURBS plochy::
+
--
Standard v průmyslovém modelování. Umožňují definovat velké množstí ploch: free-form surfaces, plochy založené na přímkách a kuželosečkách, atd. <<nurbs>> Jsou invariantní k lineárním transformacím i k perspektivní projekci.

[stem]
++++
S(u,v) = \sum_{i=1}^k \sum_{j=1}^l R_{i,j}(u,v) \mathbf{P}_{i,j}
++++

kde stem:[\mathbf{P}_{i,j}] jsou řídící body a stem:[R_{i,j}(u,v)] jsou NURBS bázové funkce:

[stem]
++++
R_{i,j}(u,v) = \frac {N_{i,n}(u) N_{j,m}(v) w_{i,j}} {\sum_{p=1}^k \sum_{q=1}^l N_{p,n}(u) N_{q,m}(v) w_{p,q}}
++++

stem:[N_{i,n}(u)] a stem:[N_{j,m}(v)] jsou B-spline bázové funkce stupně stem:[n] a stem:[m]. stem:[w_{i,j}] jsou váhy.
--

TIP: NURBS plochy se využívají v modelovací technice _sweeping_ (šablonování), kdy se množina bodů pohybuje (posunuje, rotuje, ...) prostorem za vniku tělesa. <<sweeping>>


== Surface subdivision / rekurzivní dělení polygonů

Polygonové povrchy dělíme v případě, kdy chceme je zjemnit, vyhladit.

Pravidla dělení::
Dělení dodržují nějaké pravidlo.
+
--
* _Topologická pravidla_: udávají vztahy pro generování nových vrcholů, hran, atd. z topologie objektu.
* _Geometrická pravidla_: generují nové vrcholy, hrany, atd. na základě intepolací sousedních vrcholů.
--

Extraordinary vertices / mimořádné vrcholy::
+
--
Vrcholy, které mají jiný počet sousedů (valenci) než ostatní vrcholy.
--

4-point scheme::
+
--
Interpolace stem:[C^1] křivkou.
--

Catmull-Clark::
+
--
Aproximuje původní mesh. Zachovává stem:[C^2], na mimořádných bodech ale jen stem:[C^1]. Po první iteraci vždy vznikou quady. Založený na bikubických uniformních B-splinech.
--

Doo-Sabin::
+
--
Aproximuje původní mesh. Narozdíl od Catmull-Clark je založený na *bikvadratických* uniformních B-splinech.

image::./img/szp05_doo_sabin.png[width=400]
--

Loop::
+
--
Aproximuje původní mesh. Funguje jen na trojúhelníkové síti.
--

Butterfly::
+
--
*Interpoluje* původní mesh. Funguje jen na trojúhelníkové síti.
--

[bibliography]
== Zdroje

* [[[pa010-2021,1]]] Byška, Furmanová, Kozlíková, Trtík: PA010 Intermediate Computer Graphics (podzim 2021)
* [[[pa010-2020,2]]] Sochor: PA010 Intermediate Computer Graphics (podzim 2020)
* [[[pb009-2019,3]]] Sochor: PB009 Principles of Computer Graphics (jaro 2019)
* [[[smoothness,4]]] link:https://en.wikipedia.org/wiki/Smoothness[Wikipedia: Smoothness]
* [[[mallinus,5]]] link:https://www.cs.helsinki.fi/group/goa/mallinnus/curves/curves.html[Jaakko Kurhila and Matti Mäkelä: Parametric Curves]
// mallinus = modeling in Finnish
* [[[geometric-continuity,6]]] link:https://ieeexplore.ieee.org/document/41470[Geometric Continuity of Parametric Curves: Three Equivalent Characterizations]
* [[[lagrange, 7]]] link:https://en.wikipedia.org/wiki/Lagrange_polynomial[Wikipedia: Lagrange polynomial]
* [[[bspline, 8]]] link:https://en.wikipedia.org/wiki/B-spline[Wikipedia: B-spline]
* [[[hermite-spline, 9]]] link:https://en.wikipedia.org/wiki/Cubic_Hermite_spline[Wikipedia: Cubic Hermite spline]
* [[[ferguson, 10]]] link:https://marian.fsik.cvut.cz/~kongo/download/pcgr/lectures/01%20crv_ferg.pdf[ČVUT: Ferguson curve]
* [[[coons, 11]]] link:https://marian.fsik.cvut.cz/~kongo/download/pcgr/lectures/03%20crv_coons.pdf[ČVUT: Coons curve]
* [[[coons-path, 12]]] link:https://en.wikipedia.org/wiki/Coons_patch[Wikipedia: Coons patch]
* [[[nurbs, 13]]] link:https://en.wikipedia.org/wiki/Non-uniform_rational_B-spline[Wikipedia: Non-uniform rational B-spline]
* [[[sweeping,14]]] link:https://en.wikipedia.org/wiki/Solid_modeling#Sweeping[Wikipedia: Solid modeling]
* [[[horner,15]]] link:https://en.wikipedia.org/wiki/Horner%27s_method[Wikipedia: Horner's method]

== Další zdroje

* link:http://nurbscalculator.in/[NURBS Calculator]
* link:https://mat.fs.cvut.cz/computer-graphics/[ČVUT: Computer Graphics]

[pass]
<div class="fortunate-brain">
</div>
