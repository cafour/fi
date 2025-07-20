= Algoritmy a datové struktury
:url: ./algoritmy-a-datove-struktury/
:page-group: szp
:page-order: SZP01

[NOTE]
====
Pokročilé techniky návrhu algoritmů: dynamické programování, hladové strategie, backtracking. Amortizovaná analýza.

_IV003_
====


== Pokročilé techniky návrhu algoritmů

=== Dynamické programování

[quote,Richard Bellman,Eye of the Hurricane: An Autobiography (1984, page 159)]
____
I thought dynamic programming was a good name. It was something not even a Congressman could object to. So I used it as an umbrella for my activities.
____

Intutivně je _dynamické programování_ spojením dvou věcí: "rozbalené" rekurze (taky se tomu říká _bottom-up přístup_) a _memoizace_.

--
* Je použitelné na problémy, které lze rozdělit na podproblémy.
* Obzvlášť vhodné je pak v těch případech, kde se podproblémy překrývají -- dochází k tomu, že se něco počítá víckrát.
--

Konkrétněji, dynamické programování je vhodnou technikou, pokud:

--
* podproblémů je polynomiální počet,
* (optimální) řešení původního problému lze jednoduše spočítat z (optimálních) řešení jeho podproblémů,
* podproblémy jde přirozeně seřadit od _nejmenšího_ po _největší_.
--

[TIP]
====
O tom, že problémů musí být polynomiální počet, přemýšlím intuitivně tak, že se musí dát vyřešit v nějakém vícenásobném `for`-cyklu a uložit do multi-dimenzionálního pole.

Pokud mám stem:[l] zanořených cyklů, vyřeším nejvíc stem:[n^l] podproblémů.
====

==== Memoizace

_Memoizace_ v zásadě není nic jiného než tabulka, pole, `HashSet`, nebo něco podobného, kam si algoritmus ukládá řešení jednotlivých podproblémů.

TIP: V pseudokódu se označuje jako stem:[M] (asi memory), stem:[A] (asi array), nebo stem:[C] (asi cache).

==== Bottom-up

Rekurze tradičně řeší problém _zeshora_ -- začně celým problémem, který si rozdělí na podproblémy, a ty na podpodproblémy, atd. Bottom-up approach jde na to obráceně. Začně těmi nejmenšími podproblémy a postupně se prokousává k rešení celku.

Jediným háček je v tom přijít na to, které podproblémy jsou ty nejmenší a v jakém pořádí je musíme spočítat, aby byly všechny připravené pro výpočet větších podproblémů. Bez tohohle algoritmus nebude fungovat korektně.

[NOTE]
====
Zjednodušeně jde o to přetransformovat rekurzi na cykly. Pěkný vedlejším efektem je, že je jednodušší určit složitost algoritmu.
====

==== Kuchařka
--
1. Rozděl problém na (překrývající se) podproblémy.
2. Napiš rekurzivní algoritmus nebo alespoň Bellmanův rekurentní vztah (značený stem:[\text{OPT}] protože dává _optimální_ řešení).
3. Urči správné pořadí počítání podproblémů tak, aby se každý počítal právě jednou (bottom-up přístup).
4. Pokud je to nutné, sestav z optimální hodnoty její realizaci (třeba cestu nebo něco).
5. Sepiš pseudokód.
6. Dokaž korektnost rekurentního vztahu, bottom-up pořadí a rekonstrukce (zejména terminace).
7. Okomentuj složitost.
--

==== Problémy

Weighted interval scheduling::
Z množiny stem:[n] intervalů (událostí, úkolů, atd.), které se mohou překrývat v čase, a mají určitou váhu stem:[w_i], vyber takovou množinu intervalů stem:[S], pro kterou je stem:[\sum_{i \in S} w_s] maximální.
+
====
Řešení::
+
--
Řešení využívá toho, že čas plyne výhradně dopředu, takže se můžeme na podproblémy dívat chronologicky a nebudou se překrývat.

Nechť stem:[p(j)] je index takové události stem:[i < j], že stem:[i] a stem:[j] jsou kompatibilní.

[stem]
++++
\text{OPT}(j) = \begin{cases}

0 & \text{pokud } j = 0 \\
\max \{ \text{OPT}(j-1), w_j + \text{OPT}(p(j)) \} & \text{pokud } j > 0

\end{cases}
++++
--
====

Parenthesization::
Mějme hromadu matic, které chceme pronásobit. Víme, že maticové násobení je asociativní, takže můžeme zvolit různé pořadí násobení -- různé odzávorkování. Nicméně, není komutativní, takže nesmíme matice prohazovat. Cena násobení matice o velikosti stem:[i \times j] a stem:[j \times k] je stem:[i \cdot j \cdot k]. Jaké pořadí zvolit, aby byl výsledný součin co nejlevnější?
+
====
Problém::
+
--
Máme matice stem:[A_1, A_2, ..., A_n], které chceme pronásobit.

Potřebujeme najít index stem:[k] takový, že stem:[\textcolor{red}{(A_1 \cdot ... \cdot A_k)} \cdot \textcolor{blue}{(A_{k+1} \cdot ... \cdot A_n)}] je nefektivnější. To nám problém rozděluje na dva podproblémy: červený a modrý.

--

Řešení::
+
[stem]
++++
\text{OPT}(i, j) = \begin{cases}

0 & \text{pokud } i = j \\
\min_{i \leq k < j} \{ \text{OPT}(i, k) + \text{OPT}(k+1, j) + p_{i-1} \cdot p_k \cdot p_j \} & \text{pokud } i < j

\end{cases}
++++
====

Knapsack::
Mějme batoh s nosností stem:[W] a stem:[n] věcí, které bychom do něj rádi naložili. Každá věc stem:[i] má hodnotu stem:[v_i] a váhu stem:[w_i]. Jaké věci vybrat, aby byla hodnota naložených věcí co největší, ale batoh je furt unesl?
+
====
Řešení::
+
--
Vychází z myšlenky, že batoh, ve kterém už něco je, je _jakoby_ batoh s nižší nosností.

Procházíme věci postupně přes index stem:[i] a pro každou řešíme, jestli ji chceme v batohu o nosnosti stem:[w]:

[stem]
++++
\text{OPT}(i, w) = \begin{cases}

0 & \text{pokud } i = 0 \\
\text{OPT}(i - 1, w) & \text{pokud } w_i > w \\
\max \{ \text{OPT}(i - 1, w), v_i + \text{OPT}(i - 1, w - w_i) \} & \text{pokud } w_i \leq w

\end{cases}
++++
--
====

=== Hladové (greedy) strategie

[quote]
____
Přijde Honza na pracovní pohovor a budoucí šéf se ho ptá: "Co je vaše dobrá schopnost?"
Honza odpoví: "Umím rychle počítat."
"Kolik je 1024 na druhou?"
"MILION STO TISÍC," vyhrkne ze sebe Honza.
Šéf se chvíli zamyslí a povídá: "Ale to je špatně, výsledek je 1048576!"
A Honza na to: "No sice špatně, ale sakra rychle!"
____

Greedy algoritmy nachází řešení globálního problému tak, že volí lokálně optimální řešení. Tahle taktika nemusí vést ke globálně optimálnímu řešení, ale alespoň ho spočítá rychle.

--
* Ve výpočtu směřuje bottom-up.
* Ideálně funguje na problémy, kde optimální řešení podproblému je součástí optimálního řešení celého problému.
* Dobře se navrhuje, špatně dokazuje.
--

==== Problémy

Cashier's algorithm (mince)::
Jak zaplatit danou částku s co nejmenším počtem mincí různých hodnot?
+
====
Řešení::
V každé iteraci vol minci s nejvyšší hodnotou, dokud není zaplacena celá částka.
====

Interval scheduling::
Z množiny intervalů, které mají začátek a konec, *ale mají stejnou hodnotu*, vyber největší podmnožinu intervalů, které se nepřekrývají.
+
====
Řešení::
Vybereme ty, které končí nejdřív.
====

=== Backtracking

_Inteligentní brute-force nad prostorem řešení._

Technika hledání řešení problému postupným sestavováním _kandidátního_ řešení. <<backtracking>>

--
* Částečný kandidát může být zavrhnut, pokud nemůže být dokončen.
* Můžeme dokonce zavrhnout kompletní řešení, pokud je chceme najít všechna.
* Pokud je kandidát zavrhnut, algoritmus se vrátí o kus zpět (backtrackuje), upraví parametry a zkusí to znovu.
--

.Porovnání s dynamickým programováním
[%header, cols=2]
|===
| Dynamické programování
| Backtracking

| Hledá řešení _překrývajících se podproblémů_.
| Hledá _všechna_ řešení.

| Hledá _optimální_ řešení.
| Hledá všechna, _libovolná_ řešení, _hrubou silou_.

| Má blíž k BFS -- staví "vrstvy".
| Má blíž k DFS -- zanoří se do jednoho řešení a pak se vrátí.

| Typicky zabírá víc paměti kvůli memoizaci.
| Typicky trvá déle, protože hledá _všechna_ řešení.

| Mívá cykly.
| Mívá rekurzi.
|===


==== Problémy

Sudoku::
Hledá řešení tak, že pro pole vybere možné řešení a zanoří se, pokud funguje tak _hurá_, pokud ne, tak backtrackuje a zkusí jinou možnou cifru.

Eight queens::
Jak rozestavit osm šachových královen na šachovnic tak, aby se vzájemně neohrožovaly?


== Amortizovaná analýza

[quote, Online Etymology Dictionary]
____
_amortize(v)_::
* _amortisen_ -- "to alienate lands", "to deaden, destroy"
* _amortir_ (Old French) -- "deaden, kill, destroy; give up by right"
* _*admortire_ (Vulgar Latin) -- to extinquish
____

Umožňuje přesnější analýzu časové a prostorové složitosti, protože uvažujeme kontext, ve které se analyzovaný algoritmus používá. Určujeme složitost operace v *posloupnosti operací*, [.underline]#*ne samostatně*#.


.Připomenutí
====

TIP: Viz bakalářská otázka link:../../szb/korektnost-a-slozitost-algoritmu/[Korektnost a složitost algoritmu].

Základními pojmy analýzy složitosti jsou:

Časová složitost::
Funkce velikosti vstupu stem:[n] algoritmu. Počítá počet _kroků_ (nějaké výpočetní jednotky) potřebných k vyřešení problému.

Prostorová složitost::
Funkce velikosti vstup stem:[n] algoritmu. Počítá počet _polí_ (nějaké jednotky prostoru), která algoritmus potřebuje navštívit k vyřešení problému.

Asymptotická notace::
Umožňuje zanedbat hardwarové rozdíly. Popisuje, že složitost roste _alespoň tak_, _nejvýš tak_ nebo _stejně_ jako jiná funkce.

Big O::
Horní mez, složitost v nejhorším případě. Množina funkcí rostoucích stejně rychle jako stem:[g], nebo *pomaleji*:
+
[stem]
++++
\mathcal{O}(g(n)) = \{f : (\exists c, n_0 \in \mathbb{N}^+)(\forall n \geq n_0)(f(n) \le c \cdot g(n)) \}
++++

Omega::
Spodní mez, složitost v nejlepším případě. Množina funkcí rostoucích stejně rychle jako stem:[g], nebo *rychleji*.
+
[stem]
++++
\Omega(g) = \{f : (\exists c, n_0 \in \mathbb{N}^+)(\forall n \geq n_0)(f(n) \ge c \cdot g(n)) \}
++++

Theta::
Horní i spodní mez. Množina funkcí rostoucích stejně rychle jako stem:[g].
+
[stem]
++++
\Theta(g) = \mathcal{O}(g) \cap \Omega(g)
++++
====

=== Aggregate method (brute force)

Analyzujeme celou sekvenci operací najednou. Nepoužíváme žádné chytristiky ani fígle.

.Zásobník (brute force)
====
Věta::
Pokud začneme s prázdným zásobníkem, pak libovolná posloupnost stem:[n] operací `Push`, `Pop` a `Multi-Pop` zabere stem:[\mathcal{O}(n)] času.

Důkaz::
* Každý prvek je ``Pop``nut nejvýše jednou pro každý jeho `Push`.
* V posloupnosti je stem:[\le n] ``Push``ů.
* V posloupnosti je stem:[\le n] ``Pop``ů (včetně těch v ``Multi-Pop``u).
* Celá posloupnost má tak nejvýše složitost stem:[2n].
====

=== Accounting method (banker's method)

Používá fígl, kdy velké množství _levných_ operací "předplatí" jednu _drahou_ operaci. Využívá metaforu bankovního účtu.

* Každé operaci přiřadíme fiktivní _kreditovou_ cenu.
* Při realizaci operace zaplatíme _skutečnou_ cenu naspořenými kredity.
* Počáteční stav je 0 kreditů.

Pro každou operaci v posloupnosti:

* Pokud je _skutečná_ cena nižší než _kreditová_, tak zaplatíme skutečnou cenu a přebývající kredity uspoříme na _účtu_.
* Pokud je _skutečná_ cena vyšší než _kreditová_, tak zaplatíme skutečnou cenu a případný nedostatek kreditů doplatíme z úspor na _účtu_.

IMPORTANT: Pokud je po celou dobu provádění operací stav účtu *nezáporný*, pak je _skutečná_ složitost celé posloupnosti operací menší nebo rovna součtu _kreditových_ cen operací.

WARNING: Pokud stav účtu *kdykoliv během posloupnosti* klesne pod nulu, pak jsou kreditové ceny nastaveny [.underline]#*špatně*#!

TIP: Tato metoda se dá upravit tak, že kredity náleží individuálním objektům ve struktuře místo struktury jako celku. Cena operace se pak platí z kreditů objektů, nad kterým operace probíhá.

.Zásobník (kredity)
====
[%header, cols=3]
|===
| Operace
| Skutečná cena
| Kreditová cena

| `Push`
| 1
| 2

| `Pop`
| 1
| 0

| `Multi-Pop`
| stem:[\min(k,\|S\|)]
| 0
|===

Invariant::
Počet kreditů na účtu je rovný počtu prvků na zásobníku.

Důkaz::
* Invariant platí pro prádný zásobník.
* S `Push` operací se na účet připíše právě 1 kredit. (Čímž se předplatí `Pop` nebo `Multi-Pop`.)
* `Pop` a `Multi-Pop` operace spotřebují právě 1 kredit z účtu.
* Tedy stav účtu nikdy neklesne pod 0.
* Tedy složitost posloupnosti je nejvýše součet kreditových cen, tedy stem:[2n].
====


=== Potential method (physicist's method)

Hraje si s představou toho, že struktura je fyzikální systém s nějakou energetickou hladinou -- potenciálem. Výhodou této metody je, že stačí zvolit _jednu_ funkci, která splňuje dané podmínky. Nevýhodou je, že takovou funkci najít je těžké. Člověk zkrátka buď dostane nápad nebo ne.

Potenciálová funkce::
Funkce stem:[\Phi], která přiřadí dané struktuře stem:[S] hodnotu. Platí, že:
+
[stem]
++++
\begin{align*}
\Phi(S_0) &= 0 \text{, kde } S_0 \text{ je počáteční stav} \\
\Phi(S_i) &\ge 0 \text{ pro každou strukturu } S_i
\end{align*}
++++

Amortizovaná cena::
Pokud stem:[c_i] je _skutečná_ cena operace, pak pro amortizovanou cenu stem:[\hat{c_i}] platí:
+
[stem]
++++
\hat{c_i} = c_i + \Phi(S_i) - \Phi(S_{i-1})
++++

Potenciálová věta::
Počínaje počátečním stavem stem:[S_0], celková _skutečná_ cena posloupnosti stem:[n] operací je nejvýše součet jejich amortizovaných cen.

Důkaz::
+
[stem]
++++
\begin{align*}
\sum_{i=1}^n \hat{c_i} &= \sum_{i=1}^n (c_i + \Phi(S_i) - \Phi(S_{i-1})) \\
&= \sum_{i=1}^n c_i + \Phi(S_n) - \Phi(S_0) \\
&\geq \sum_{i=1}^n c_i \quad\tiny\blacksquare
\end{align*}
++++

.Zásobník (potenciálová věta)
====
stem:[\Phi(S) = |S|] (počet prvků na zásobníku)

[%header, cols=3]
|===
| Operace
| Skutečná cena
| Amortizovaná cena

| `Push`
| 1
| stem:[\hat{c_i} = 1 + (\|S\| + 1) - \|S\| = 2]

| `Pop`
| 1
| stem:[\hat{c_i} = 1 + \|S\| - (\|S\| + 1) = 0]

| `Multi-Pop`
| stem:[\min(k,\|S\|)]
a|
[stem]
++++
\hat{c_i} =
\begin{cases}
k + (\|S\| - k) - \|S\| = 0 & \text{pokud } \|S\| > k \\
\|S\| + (\|S\| - \|S\|) - \|S\| = 0 & \text{pokud } \|S\| \le k

\end{cases}
++++
|===

Věta::
Počínaje prázdným zásobníkem, libovolná sekvence operací zabere stem:[\mathcal{O}(n)] času.

Důkaz (případ `Push`)::
* Skutečná cena je stem:[c_i = 1].
* Amortizovaná cena je stem:[\hat{c_i} = c_i + \Phi(S_i) - \Phi(S_{i-1}) = 1 + (|S| + 1) - |S| = 2].

Důkaz (případ `Pop`)::
* Skutečná cena je stem:[c_i = 1].
* Amortizovaná cena je stem:[\hat{c_i} = c_i + \Phi(S_i) - \Phi(S_{i-1}) = 1 - 1 = 0].

Důkaz (případ `Multi-Pop`)::
* Skutečná cena je stem:[c_i = k].
* Amortizovaná cena je stem:[\hat{c_i} = c_i + \Phi(S_i) - \Phi(S_{i-1}) = k - k = 0].

Důkaz (závěr)::
* Amortizovaná cena všech operací je stem:[\hat{c_i} \le 2].
* Součet amortizovaných cen posloupnosti stem:[n] operací je pak stem:[\sum_{i=1}^n \hat{c_i} \le 2n].
* Z potenciálnové věty plyne, že skutečná cena posloupnosti je stem:[\le 2n].

====

---

.Slavné potenciálové funkce
Fibonnacciho halda::
+
[stem]
++++
\Phi(H) = 2 \cdot \text{trees}(H) - 2 \cdot \text{marks}(H)
++++

Splay trees::
Binární vyhledávací stromy, kde poslední přídané prvky jsou přístupné rychleji. link:https://en.wikipedia.org/wiki/Splay_tree[(zdroj)]
+
[stem]
++++
\Phi(T) = \sum_{x \in T} \lfloor \log_2 \text{size}(x) \rfloor
++++

Move-to-front::
Transformace dat používaná při kompresi dat. link:https://en.wikipedia.org/wiki/Move-to-front_transform[(zdroj)]
+
[stem]
++++
\Phi(L) = 2 \cdot \text{inversions}(L, L^*)
++++

Preflow-push (push-relabel)::
+
[stem]
++++
\Phi(f) = \sum_{v \,:\, \text{excess}(v) > 0} \text{height}(v)
++++

Red-black trees::
+
[stem]
++++
\Phi(T) = \sum_{x \in T} w(x)

\\

w(x) = \begin{cases}
0 & \text{pokud } x \text{ je červený} \\
1 & \text{pokud } x \text{ je černý a nemá žádné červené potomky} \\
0 & \text{pokud } x \text{ je černý a má jednoho červeného potomka} \\
2 & \text{pokud } x \text{ je černý a má dva červené potomky}
\end{cases}
++++

[bibliography]

== Zdroje

* [[[iv003, 1]]] link:https://is.muni.cz/auth/el/fi/jaro2021/IV003/[IV003 Algoritmy a datové struktury II (jaro 2021)]
* [[[backtracking,5]]] https://betterprogramming.pub/the-technical-interview-guide-to-backtracking-e1a03ca4abad
