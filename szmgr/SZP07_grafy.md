= Grafy a grafové algoritmy
:url: ./grafy-a-grafove-algoritmy/
:page-group: szp
:page-order: SZP07

[NOTE]
====
Reprezentace grafů. Souvislost grafu, rovinné grafy. Prohledávání grafu do šířky a do hloubky, nejkratší vzdálenosti, kostry, toky v sítích. Algoritmy: Bellman-Ford, Dijkstra, Ford-Fulkerson, Push-Relabel, maximální párování v bipartitních grafech.

_IB000, IB002, IV003_
====

TIP: Tahle otázka má solidní překryv s bakalářskými otázkami link:../../szb/grafy/[Grafy] a link:../../szb/grafove-problemy/[Grafové problémy].

== Terminologie

Graf::
Dvojice stem:[G = (V, E)] kde:
+
--
* stem:[V] je množina vrcholů; stem:[\lvert V \rvert = n],
* stem:[E] je množina hran; stem:[\lvert E \rvert = m],
* hrana stem:[e \in E] je dvojice vrcholů stem:[e = (u, v)].
--

Váha grafu::
Váha grafu je součet vah hran grafu stem:[G].
+
[stem]
++++
w(G) = \sum_{e \in E(G)} w(e)
++++

Bipartitní graf::
Graf jehož vrcholy lze rozdělit do dvou disjunktních množin tak, že všechny hrany vedou z jedné množiny do druhé.
+
.Example of bipartite graph without cycles by link:https://commons.wikimedia.org/w/index.php?curid=121779105[Watchduck]
image::./img/szp07_bipartite_graph.svg[width=400]

(Silná) souvislost grafu / (strongly) connected graph::
Graf stem:[G] je souvislý, pokud pro každé dva vrcholy stem:[u, v \in V(G)] existuje cesta z stem:[u] do stem:[v].

Slabá souvislost grafu / weakly connected graph::
Graf stem:[G] je slabě souvislý, pokud je souvislý jeho podgraf stem:[G'] vzniklý odebráním orientace hran.
+
[quote]
____
Je souvislý alespoň, pokud zapomeneme, že hrany mají směr?
____

Silně souvislá komponenta / strongly connected component::
Silně souvislá komponenta grafu stem:[G] je jeho maximální podgraf stem:[G'] takový, že je silně souvislý. Jinými slovy pro každé dva vrcholy stem:[u, v \in V(G')] existuje cesta z stem:[u] do stem:[v].

Planární / rovinný graf::
Graf stem:[G] je planární, pokud se dá nakreslit do roviny tak, že se žádné dvě hrany nekříží.
+
Platí v nich Eulerova formule:
+
[stem]
++++
\lvert V \rvert - \lvert E \rvert + \lvert F \rvert = 2
++++
+
Kde stem:[\lvert F \rvert] je počet stěn -- oblastí ohraničených hranami.
+
Vrcholy planárního grafu lze vždy obarvit 4 barvami tak, že žádné dva sousední vrcholy nebudou mít stejnou barvu.

(Hranový) řez / (edge) cut::
Množina hran stem:[C \subseteq E(G)] taková, že po odebrání hran stem:[C] se graf stem:[G] rozpadne na více komponent -- stem:[G' = (V, E \setminus C)] není souvislý.
+
Analogicky se definuje i _vrcholový řez / vertex cut_.

== Reprezentace grafů

Seznam následníků / adjacency list::
Pro každý vrchol stem:[v \in V] máme seznam (např. dynamic array nebo linked list) stem:[N(v)] jeho následníků.
+
Zabírá stem:[\Theta(\lvert V \rvert + \lvert E \rvert)] paměti.

Matice sousednosti / adjacency matrix::
Máme matici velikosti stem:[\lvert V \rvert \times \lvert V \rvert] kde stem:[A_{u,v} = 1] pokud existuje hrana mezi stem:[u] a stem:[v], jinak stem:[A_{u,v} = 0].
+
Dá se pěkně použít k uložení vah.

Matice incidence / incidence matrix::
Máme matici velikosti stem:[\lvert V \rvert \times \lvert E \rvert] kde stem:[A_{u,e} = 1] pokud stem:[u] je vrcholem hrany stem:[e], jinak stem:[A_{u,e} = 0].
+
Dá se z ní pěkně určit stupeň vrcholu.

== Prohledávání grafu

=== Prohlédávání do šířky / breadth-first search (BFS)

Od zadaného vrcholu navštíví nejprve vrcholy vzdálené 1 hranou, poté vrcholy vzdálené 2 hranami, atd.

* Prohledávání po "vrstvách".
* Je implementovaný pomocí _fronty_ (queue / FIFO).
* Časová složitost je stem:[\mathcal{O}(\lvert V \rvert + \lvert E \rvert)].

[source, python]
----
def dfs(graph: List[List[bool]], stamps: List[int], vertex: int) -> None:
    if stamps[vertex] == -1:
        stamps[vertex] = 0
    stamp = stamps[vertex]
    for i in range(0, len(graph)):
        if graph[vertex][i] and stamps[i] != -1:
            stamps[i] = stamp + 1
            dfs(graph, stamps, i)
----

=== Prohlédávání do hloubky / depth-first search (DFS)

Od zadaného vrcholu rekurzivně navštěvuje jeho nenavštívené následníky.

* Prohledání po "slepých uličkách".
* Vynořuje se teprve ve chvíli, kdy nemá kam dál (_backtrackuje_).
* Je implementovaný pomocí _zásobníku_ (stack / LIFO).
* Časová složitost je stem:[\mathcal{O}(\lvert V \rvert + \lvert E \rvert)].

[source, python]
----
def bfs(graph: List[List[bool]], stamps: List[int], vertex: int) -> None:
    stamp = 0
    queue = deque()
    queue.append(vertex)
    while len(queue) > 0:
        current = queue.popleft()
        stamps[current] = stamp
        stamp += 1
        for i in range(0, len(graph)):
            if graph[current][i] and stamps[i] == -1:
                queue.append(i)
----

== Nejkratší vzdálenosti

Problém nalezení buď nejkratší cesty mezi dvěma vrcholy nebo nejkratší cesty z jednoho vrcholu do všech ostatních.

Relaxace hrany stem:[(u, v)]::
Zkrácení vzdálenosti k vrcholu stem:[v] průchodem přes vrchol stem:[u]. Musí platit stem:[u\text{.distance} + w(u, v) < v\text{.distance}]. Hrana stem:[(u, v)] je v takovém případě _napjatá_.

=== Bellman-Fordův algoritmus

Hledá nejkratší cesty z jednoho vrcholu do všech ostatních.

--
* Využívá relaxaci hran.
* Funguje i na grafech se zápornými hranami.
* Má časovou složitost stem:[\mathcal{O}(\lvert V \rvert \cdot \lvert E \rvert)].
--

[source, python]
----
def bellmanford(graph: List[List[Tuple[int, int]]], s: int) \
        -> Tuple[bool, List[int], List[int]]:
    # graph is an adjacency list of tuples (dst, weight)
    distance = [float('inf') for i in range(0, len(graph))]
    distance[s] = 0
    parent = [-1 for i in range(0, len(graph))]

    # relax all edges |V| - 1 times
    for _ in range(1, len(graph)):
        for u in range(0, len(graph)):
            for edge in graph[u]:
                (v, w) = edge
                if distance[u] + w < distance[v]:
                    distance[v] = distance[u] + w
                    parent[v] = u

    # check for negative cycles
    for u in range(0, len(graph)):
        for edge in graph[u]:
            (v, w) = edge
            if distance[u] + w < distance[v]:
                return (False, None, None)

    return (True, distance, parent)
----

=== Dijkstrův algoritmus

Hledá nejkratší cesty z jednoho vrcholu do všech ostatních.

--
* Je podobný BFS, ale používá prioritní frontu.
* Funguje *pouze* na grafech *bez záporných* hran.
--

TIP: Složitost závisí na implementaci prioritní fronty. Je to stem:[\Theta(V)] insertů, stem:[\Theta(V)] hledání nejmenšího prvku, stem:[\Theta(E)] snížení priority.

NOTE: Implementace níže používá pole (resp. Pythoní `list`), tedy složitost je stem:[\Theta(V^2)], jelikož hledání minima je lineární.

[source, python]
----
def dijkstra(graph: List[List[Tuple[int, int]]], s: int) \
        -> Tuple[List[int], List[int]]:
    # graph is an adjacency list of tuples (dst, weight)
    distance = [float('inf') for i in range(0, len(graph))]
    distance[s] = 0
    parent = [-1 for i in range(0, len(graph))]

    queue = list(range(0, len(graph)))
    while len(queue) > 0:
        u = min(queue, lambda v: distance[v])
        queue.remove(u)
        for edge in graph[current]:
            (v, w) = edge
            if distance[u] + w < distance[v]:
                distance[v] = distance[u] + w
                parent[v] = u
    return (distance, parent)
----

V binární haldě by to bylo stem:[\Theta(V \log V + E \log V)] a ve Fibonacciho haldě stem:[\Theta(V \log V + E)].

Dijkstrův algoritmus lze optimalizovat, pokud nás zajímá jen nejkratší cesta mezi dvěma konkrétními vrcholy:

--
* Funkce vrátí výsledek, jakmile je cílový vrchol vytažen z fronty.
* Můžeme hledat zároveň ze začátku a konce pomocí dvou front a skončit, jakmile se někde potkají.
* Můžeme přidat _potenciál_ -- dodatečnou heuristickou váhu.
+
IMPORTANT: Téhle variantě se říká A* (A star). Věnuje se mu část otázky link:../umela-inteligence-v-pocitacovych-hrach/[Umělá inteligence v počítačových hrách].
--

== Kostry

Spanning tree / kostra::
Kostra grafu stem:[G = (V, E)] je podgraf stem:[T \sube G] takový, že stem:[V(T) = V(G)] je stem:[T] je strom.
+
image::./img/szp07_spanning_tree.svg[width=400]

Minimum spanning tree (MST) / minimální kostra::
Je kostra stem:[M] grafu stem:[G] s nejmenší možnou váhou. Tedy pro každou kostru stem:[T] grafu stem:[G]:
+
[stem]
++++
w(M) \le w(T)
++++

Fundamental cycle::
Fundamental cycle je cyklus stem:[C] v grafu stem:[G] takový, že odebráním libovolné hrany stem:[e \in C] získáme kostru.

Fundamental cutset / řez::
Fundamental cutset je množina hran stem:[D] v grafu stem:[G] taková, že přidáním libovolné hrany stem:[e \in D] získáme kostru.

Red rule::
Najdi cyklus bez červených hran, vyber v něm *neobarvenou* hranu s *nejvyšší* cenou a obarvi ji červeně.

Blue rule::
Najdi řez bez modrých hran, vyber v něm *neobarvenou* hranu s *nejmenší* cenou a obarvi ji modře.

Greedy algoritmus::
Nedeterministicky aplikuj red rule a blue rule, dokud to jde (stačí stem:[n-1] iterací). Modré hrany tvoří MST.

Jarníkův / Primův algoritmus::
Speciální případ greedy algoritmu, kdy aplikujeme pouze blue rule. Princip:
+
--
1. Vyber libovolný vrchol stem:[v] a přidej ho do kostry stem:[S].
2. Opakuj stem:[n-1] krát:
  . Vyber hranu stem:[e] s nejmenší cenou, která má právě jeden vrchol v stem:[S].
  . Přidej druhý vrchol stem:[e] do stem:[S].
--
+
_Složitost_: použijeme binární haldu
+
--
* Inicializace (stem:[\infty] jako cena hrany mezi prázdnou kostrou a každým vrcholem): stem:[\mathcal{O}( \lvert  V \rvert )]
* Odstranění minima z binární haldy pro každý vrchol ve stem:[V]: stem:[\mathcal{O}( \lvert V \rvert \log \lvert V \rvert )]
* Procházení každé hrany z stem:[E] a snižování ceny: stem:[\mathcal{O}( \lvert E \rvert \log \lvert V \rvert )]
* Celková složitost: stem:[\mathcal{O}( \lvert E \rvert \log \lvert V \rvert )]
* S Fibonacciho haldou jde zlepšit na: stem:[\mathcal{O}( \lvert E \rvert + \lvert V \rvert \log \lvert V \rvert )]
--

Kruskalův algoritmus::
Princip: Seřaď hrany podle ceny vzestupně. Postupně přidávej hrany do kostry, vynechej ty, které by vytvořily cyklus.
+
--
1. Seřad hrany podle ceny vzestupně.
2. Použij _union-find_ na udržování komponent grafu.
3. Procházej hrany postupně. Pokud oba konce hrany patří do různých množin, přidej ji.
--
+
Je to speciální případ greedy algoritmu.
+
_Složitost_:
+
--
* Inicializace union-findu: stem:[\mathcal{O}( \lvert  V \rvert )]
* Seřazení hran: stem:[\mathcal{O}( \lvert E \rvert \log \lvert E \rvert )]
* Pro každou hranu provádíme dvakrát `find` (stem:[\mathcal{O}(\log \lvert V \rvert )]) a eventuálně `union` (stem:[\mathcal{O}(\log \lvert V \rvert )]): stem:[\mathcal{O}( \lvert E \rvert \log \lvert V \rvert )]
* Celková složitost: stem:[\mathcal{O}( \lvert E \rvert \log \lvert V \rvert )]
--

Borůvkův algoritmus::
Je "paralelní". Buduje modré stromy ze všech vrcholů naráz.
+
--
1. Pro každý vrchol inicializuj modrý strom.
2. Dokud nemáš jen jeden modrý strom, opakuj _fázi_:
.. Pro každý modrý strom najdi nejlevnější odchozí hranu a přidej ji (propojíš tak dva stromy).
--
+
Je to speciální případ greedy algoritmu, který spamuje jen blue rule.
+
_Složitost:_
+
--
* Počet komponent v první fázi: stem:[\lvert V \rvert].
* V každé fázi se zmenší počet komponent na polovin. Tím pádem bude stem:[\log \lvert V \rvert] fází.
* Každá fáze zabere stem:[\mathcal{O}( \lvert E \rvert )] času, protože procházíme všechny hrany.
* Celková složitost: stem:[\mathcal{O}( \lvert E \rvert \log \lvert V \rvert )]
--
+
TIP: Kruskal sice taky buduje stromy na více místech najednou, ale není "paralelní", protože minimalita kostry spoléhá na to, že hrany jsou seřazené. Borůvka takový požadavek nemá, a proto je paralelizovatelnější.


.Složitosti algoritmů
[%header, cols="2,1,1"]
|===
| Algoritmus
| Časová složitost
| Prostorová složitost

| Jarník (Prim) s prioritní frontou
| stem:[\mathcal{O}(\lvert E \rvert \log \lvert V \rvert )]
| stem:[\mathcal{O}( \lvert  V \rvert )]

| Jarník (Prim) s Fibonacciho haldou
| stem:[\mathcal{O}(\lvert E \rvert + \lvert V \rvert \log \lvert V \rvert )]
| stem:[\mathcal{O}( \lvert  V \rvert )]

| Kruskal
| stem:[\mathcal{O}(\lvert E \rvert \log \lvert V \rvert )]
| stem:[\mathcal{O}( \lvert  V \rvert )]

| Borůvka
| stem:[\mathcal{O}(\lvert E \rvert \log \lvert V \rvert )]
| stem:[\mathcal{O}( \lvert  V \rvert )]


|===

== Toky v sítích

Síť toků / flow network::
Je čtveřice stem:[(G, s, t, c)], kde:
+
--
* stem:[G = (V, E)] je orientovaný graf,
* stem:[s \in V] je zdroj / source,
* stem:[t \in V] je cíl / stok / sink; stem:[s \neq t],
* stem:[c: E \rightarrow \mathbb{R}^+] je funkce udávající kapacitu hran.
--

Network flow / tok::
Je funkce stem:[f: E \rightarrow \mathbb{R}^+], která splňuje:
+
--
* podmínku kapacity: stem:[(\forall e \in E)(f(e) \ge 0 \land f(e) \leq c(e))]
** _tok hranou je nezáporný a nepřevyšuje povolennou kapacitu_
* podmínku kontinuity: stem:[(\forall v \in V \setminus \{s, t\})(\sum_{e \in \delta^+(v)} f(e) = \sum_{e \in \delta^-(v)} f(e))]
** _tok do vrcholu je stejný jako tok z vrcholu_
--

Hodnota toku stem:[f]::
+
[stem]
++++
\lvert f \rvert = \sum_{(s, v) \in E} f(s, v) = \sum_{(w, t) \in E} f(w, t)
++++

=== Ford-Fulkerson

Residual network::
Síť, která vzniká, když je už část kapacity hrany využívána tokem stem:[f]. Umožnuje algoritmům změnit přechozí rozhodnutí a získat využitou kapacitu zpět.
+
Je to pětice stem:[G_f = (V, E_f, s, t, c_f)], kde
+
* stem:[E_f = \{ e \in E : f(e) < c(e) \} \cup \{ e^R : f(e) > 0 \}],
* pokud stem:[e = (u, v) \in E], stem:[e^R = (v, u)],
* stem:[
    c_f(e) = \begin{cases}
        c(e) - f(e) & \text{ pokud } e \in E \\
        f(e)        & \text{ pokud } e^R \in E
    \end{cases}
]

Augmenting path stem:[P]::
Jednoduchá stem:[s \rightsquigarrow t] cesta v residuální síti stem:[G_f].
+
NOTE: T.j. cesta která může jít i proti směru toku stem:[f].
+
_Bottleneck kapacita_ je nejmenší kapacita hran v augmenting path stem:[P].
+
To krásné na augmenting cestách je, že pro flow stem:[f] a augmenting path stem:[P] v grafu stem:[G_f], existuje tok stem:[f'] takový, že stem:[\text{val}(f') = \text{val}(f) + \text{bottleneck}(G_f, P)]. Nový tok stem:[f'] lze získat takto:
+
[source,subs=normal]
----
*Augment*(f, c, P)
{
    delta = bottleneck(P)
    *foreach*(e in P)
    {
        *if*(e in E)
        {
            f[e] = f[e] + delta
        }
        *else*
        {
            f[reverse(e)] = f[reverse(e)] - delta
        }
    }
    *return* f
}
----

Algoritmus Ford-Fulkerson::
Hledá maximální tok. Augmentuje cestu v residuální síti dokud to jde.
+
--
1. stem:[f(e) = 0] pro každou stem:[e \in E].
2. Najdi stem:[s \rightsquigarrow t] cestu stem:[P] v reziduální síti stem:[G_f].
3. Augmentuj tok podél stem:[P].
4. Opakuj dokud se nezasekneš.
--
+
[source,subs=normal]
----
*Ford-Fulkerson*(G)
{
    *foreach* (e in E)
    {
        f(e) = 0
    }

    G_f = reziduální síť vzniklá z G vzhledem k toku f
    *while* (existuje s ~> t cesta v G_f)
    {
        f = Augment(f, c, P)
        Updatuj G_f
    }
    *return* f
}
----

=== Push-Relabel

Pre-flow::
_Ne-tak-docela tok._
+
Funkce stem:[f] taková, že
+
* platí _kapacitní podmínka_: stem:[(\forall e \in E)(0 \le f(e) \le c(e))],
* platí _relaxováné zachování toku_: stem:[
    (\forall v \in V - \{ s, t \})(\sum_{e \text{ do } v} f(e) \ge \sum_{e \text{ ven z } v} f(e))
].

Overflowing vertex::
Takový vertex stem:[v \in V - \{ s, t \}], do kterého více přitéká než odtéká.
+
[stem]
++++
\sum_{e \text{ do } v} f(e) > \sum_{e \text{ ven z } v} f(e)
++++

Excess flow::
To, co je v overflowing vertexu navíc.
+
[stem]
++++
e_f(v) = \sum_{e \text{ do } v} f(e) - \sum_{e \text{ ven z } v} f(e)
++++

Height function::
Funkce stem:[h : V \to \N_0]. Řekneme, že stem:[h] je _kompatibilní s preflow stem:[f]_, právě když
+
* _source_: stem:[h(s) = |V| = n],
* _sink_: stem:[h(t) = 0],
* _height difference_: stem:[(\forall (v, w) \in E_{G_f})(h(v) \le h(w) + 1)].
+
NOTE: Pokud mezi dvěma vrcholy stem:[(v, w)] v reziduální síti vede hrana, pak je stem:[v] nejvýše o jednu úroveň výš než stem:[w].

Push operace::
Pro (reziduálně-grafovou) hranu stem:[(v, w)] se pokusí přesunout excess flow z stem:[v] do stem:[w], aniž by porušil (reziduální) kapacitu stem:[(v, w)].
+
[source, subs=normal]
----
// Assumptions: e_f[v] > 0, c_f( (v, w) > 0) > 0, h[v] > h[w]
*Push*(f, h, v, w)
{
    delta_f = min(e_f[v], c_f(v, w))
    *if*( (v, w) in E)
        f[(v, w)] += delta_f
    *else*
        f[(w, v)] -= delta_f
    e_f[v] -= delta_f
    e_f[w] += delta_f
}
----

Relabel operace::
Zvýší výšku stem:[h(v)] natolik, aby neporušil kompatibilitu stem:[h] s stem:[f].
+
[source, subs=normal]
----
// Assumptions:
//   - v is overflowing: e_f[v] > 0
//   - all residual neighbors of v the same height or higher:
//     forall (v, w) in E_f: h[v] \<= h[w]
*Relabel*(f, h, v)
{
    h[v] = 1 + min(h[w] | (v, w) in E_f)
}
----

Algoritmus Push-Relabel (Goldberg-Tarjan)::
Hledá maximální tok.
+
Princip: Pokud je nějaký vrchol overflowing, tak ho pushni nebo relabeluj. Pokud ne, tak jsi našel maximální tok.
+
[source, subs=normal]
----
*Push-Relabel*(V, E, s, t, c)
{
    // initialize preflow -- default values
    *for*(v in V)
    {
        h[v] = 0    // height function
        e_f[v] = 0  // excess flow
    }
    n = |V|
    h[s] = n

    *for*(e in E)
    {
        f[e] = 0    // (pre)flow
    }

    // initialize preflow -- saturate connections from s
    *for*( (s, v) in E)
    {
        f[(s, v)] = c(s, v) // preflow maxes out all capacity
        e_f[v] = c(s, v)    // presume all of it excess
        e_f[s] -= c(s, v)   // yes, it will be negative
    }

    // the juicy part
    *while*(_any vertex is overflowing_)
    {
        v = _an overflowing vertex_ (has e_f[v] > 0)
        *if*(v _has a neighbor_ w _in_ G_f _such that_ h(v) > h(w))
        {
            *Push*(f, h, v, w)
        }
        else
        {
            *Relabel*(f, h, v)
        }
    }
    *return* f
}
----
+
_Korektnost_: V průběhu výpočtu platí:
+
--
* Výška vrcholu nikdy neklesá.
* Pre-flow a výšková funkce jsou kompatibilní.
--
+
_Složitost_:
+
--
* Nejvýše stem:[2^n] Relabelů.
* stem:[2nm] saturujících Push.
* stem:[4n^2m] nesaturujících Push.
* Relabel i Push jsou v stem:[\mathcal{O}(1)].
* Celkem: stem:[O(n^2m)].
--

---

.Srovnání algoritmů Ford-Fulkerson a Push-Relabel
[%header,cols="1,1"]
|===
| Ford-Fulkerson
| Push-Relabel (Goldberg)

| global character
| local character

| update flow along an augmenting path
| update flow on edges

| flow conservation
| preflow
|===

== Maximální párování v bipartitních grafech

Párování / matching::
Množina stem:[M \sube E] taková, že žádné dvě hrany v stem:[M] nemají společný vrchol. <<matching>>
+
Prázdná množina je párováním na každém grafu. Graf bez hran má pouze prázdné párování.
+
.Příklad párování, které je zároveň maximální by link:https://commons.wikimedia.org/w/index.php?curid=45306558[RRPPGG]
image::./img/szp07_matching.jpg[width=400]

Maximální párování::
Takové párování, které má nejvyšší počet hran. Graf může mít několik maximálních párování.

Perfektní párování::
Takové párování, které páruje všechny vrcholy grafu. Každé perfektní párování je zároveň maximální.

Maximum cardinality matching (MCM) v bipartitním grafu::
Problém nalezení maximálního párování v grafu. Ve speciálním případě, kdy graf je bipartitní, se tento problém dá převést na problém nalezení maximálního toku v síti: <<mcm>>
+
--
1. Mejmě bipartitní graf stem:[G=(X+Y,E)].
+
image::./img/szp07_mcm_01.png[width=150]
2. Přidej zdroj stem:[s] a hranu stem:[(s, v)] pro každý vrchol stem:[v] z stem:[X].
3. Přidej stok stem:[t] a ranu stem:[(v, t)] pro každý vrchol stem:[v] z stem:[Y].
+
image::./img/szp07_mcm_02.png[width=300]
4. Každé hraně dej kapacitu 1.
5. Spusť algoritmus Ford-Fulkerson.
+
image::./img/szp07_mcm_03.png[width=300]
--

[bibliography]
== Zdroje

* [[[ib000,1]]] link:https://is.muni.cz/auth/el/fi/podzim2022/IB000/um/[IB000 Matematické základy informatiky (podzim 2022)]
* [[[ib002,2]]] link:https://is.muni.cz/auth/el/fi/jaro2020/IB002/um/[IB002 Algoritmy a datové struktury (jaro 2020)]
* [[[ib003,3]]] link:https://is.muni.cz/auth/el/fi/jaro2021/IV003/um/[IV003 Algoritmy a datové struktury II (jaro 2021)]
* [[[matching,4]]] link:https://cs.wikipedia.org/wiki/P%C3%A1rov%C3%A1n%C3%AD_grafu[Wikipedia: Párování grafu]
* [[[mcm, 5]]] link:https://en.wikipedia.org/wiki/Maximum_cardinality_matching[Wikipedia: Maximum cardinality matching]


== Další zdroje

* link:https://visualgo.net/en/maxflow[Vizualizace max-flow algoritmů]
* link:http://www.adrian-haarbach.de/idp-graph-algorithms/implementation/maxflow-push-relabel/index_en.html[Vizualizace push-relabel]
