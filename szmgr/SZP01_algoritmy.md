---
title: "Algoritmy a datové struktury"
description: "TODO"
---

> [!NOTE]
> Pokročilé techniky návrhu algoritmů: dynamické programování, hladové strategie, backtracking. Amortizovaná analýza. Vyhledávání řetězců: naivní algoritmus pro hledání řetězců, Karp-Rabinův algoritmus, hledání řetězců pomocí konečných automatů. Algoritmus Knuth-Morris-Pratt.
> <br>
> _IV003_


## Pokročilé techniky návrhu algoritmů

### Dynamické programování

> I thought dynamic programming was a good name. It was something not even a Congressman could object to. So I used it as an umbrella for my activities.
>
> — Richard Bellman

Intutivně je _dynamické programování_ spojením dvou věcí: "rozbalené" rekurze (taky se tomu říká _bottom-up přístup_) a _memoizace_.

- Je použitelné na problémy, které lze rozdělit na podproblémy.
- Obzvlášť vhodné je pak v těch případech, kde se podproblémy překrývají -- dochází k tomu, že se něco počítá víckrát.

Konkrétněji, dynamické programování je vhodnou technikou, pokud:

- podproblémů je polynomiální počet,
- (optimální) řešení původního problému lze jednoduše spočítat z (optimálních) řešení jeho podproblémů,
- podproblémy jde přirozeně seřadit od _nejmenšího_ po _největší_.

> [!TIP]
> O tom, že problémů musí být polynomiální počet, přemýšlím intuitivně tak, že se musí dát vyřešit v nějakém vícenásobném `for`-cyklu a uložit do multi-dimenzionálního pole.
> <br>
> Pokud mám $l$ zanořených cyklů, vyřeším nejvíc $n^l$ podproblémů.


#### Memoizace

_Memoizace_ v zásadě není nic jiného než tabulka, pole, `HashSet`, nebo něco podobného, kam si algoritmus ukládá řešení jednotlivých podproblémů.

> [!TIP]
> V pseudokódu se označuje jako $M$ (asi memory), $A$ (asi array), nebo $C$ (asi cache).

#### Bottom-up

Rekurze tradičně řeší problém _zeshora_ -- začně celým problémem, který si rozdělí na podproblémy, a ty na podpodproblémy, atd. Bottom-up approach jde na to obráceně. Začně těmi nejmenšími podproblémy a postupně se prokousává k rešení celku.

Jediným háček je v tom přijít na to, které podproblémy jsou ty nejmenší a v jakém pořádí je musíme spočítat, aby byly všechny připravené pro výpočet větších podproblémů. Bez tohohle algoritmus nebude fungovat korektně.

> [!NOTE]
> Zjednodušeně jde o to přetransformovat rekurzi na cykly. Pěkný vedlejším efektem je, že je jednodušší určit složitost algoritmu.


#### Kuchařka

1. Rozděl problém na (překrývající se) podproblémy.
2. Napiš rekurzivní algoritmus nebo alespoň Bellmanův rekurentní vztah (značený $\text{OPT}$ protože dává _optimální_ řešení).
3. Urči správné pořadí počítání podproblémů tak, aby se každý počítal právě jednou (bottom-up přístup).
4. Pokud je to nutné, sestav z optimální hodnoty její realizaci (třeba cestu nebo něco).
5. Sepiš pseudokód.
6. Dokaž korektnost rekurentního vztahu, bottom-up pořadí a rekonstrukce (zejména terminace).
7. Okomentuj složitost.

#### Problémy

- **Weighted interval scheduling**\
  Z množiny $n$ intervalů (událostí, úkolů, atd.), které se mohou překrývat v čase, a mají určitou váhu $w_i$, vyber takovou množinu intervalů $S$, pro kterou je $\sum_{i \in S} w_s$ maximální.

  - **Řešení**

    Řešení využívá toho, že čas plyne výhradně dopředu, takže se můžeme na podproblémy dívat chronologicky a nebudou se překrývat.

    Nechť $p(j)$ je index takové události $i &lt; j$, že $i$ a $j$ jsou kompatibilní.

    ```math
    \text{OPT}(j) = \begin{cases}

    0 & \text{pokud } j = 0 \\
    \max \{ \text{OPT}(j-1), w_j + \text{OPT}(p(j)) \} & \text{pokud } j > 0

    \end{cases}
    ```

- **Parenthesization**\
  Mějme hromadu matic, které chceme pronásobit. Víme, že maticové násobení je asociativní, takže můžeme zvolit různé pořadí násobení -- různé odzávorkování. Nicméně, není komutativní, takže nesmíme matice prohazovat. Cena násobení matice o velikosti $i \times j$ a $j \times k$ je $i \cdot j \cdot k$. Jaké pořadí zvolit, aby byl výsledný součin co nejlevnější?

  - **Problém**

    Máme matice $A_1, A_2, ..., A_n$, které chceme pronásobit.

    Potřebujeme najít index $k$ takový, že $\textcolor{red}{(A_1 \cdot ... \cdot A_k)} \cdot \textcolor{blue}{(A_{k+1} \cdot ... \cdot A_n)}$ je nefektivnější. To nám problém rozděluje na dva podproblémy: červený a modrý.

  - **Řešení**

    ```math
    \text{OPT}(i, j) = \begin{cases}

    0 & \text{pokud } i = j \\
    \min_{i \leq k < j} \{ \text{OPT}(i, k) + \text{OPT}(k+1, j) + p_{i-1} \cdot p_k \cdot p_j \} & \text{pokud } i < j

    \end{cases}
    ```

- **Knapsack**\
  Mějme batoh s nosností $W$ a $n$ věcí, které bychom do něj rádi naložili. Každá věc $i$ má hodnotu $v_i$ a váhu $w_i$. Jaké věci vybrat, aby byla hodnota naložených věcí co největší, ale batoh je furt unesl?

  - **Řešení**

    Vychází z myšlenky, že batoh, ve kterém už něco je, je _jakoby_ batoh s nižší nosností.

    Procházíme věci postupně přes index $i$ a pro každou řešíme, jestli ji chceme v batohu o nosnosti $w$:

    ```math
    \text{OPT}(i, w) = \begin{cases}

    0 & \text{pokud } i = 0 \\
    \text{OPT}(i - 1, w) & \text{pokud } w_i > w \\
    \max \{ \text{OPT}(i - 1, w), v_i + \text{OPT}(i - 1, w - w_i) \} & \text{pokud } w_i \leq w

    \end{cases}
    ```

### Hladové (greedy) strategie

> Přijde Honza na pracovní pohovor a budoucí šéf se ho ptá: "Co je vaše dobrá schopnost?"
> Honza odpoví: "Umím rychle počítat."
> "Kolik je 1024 na druhou?"
> "MILION STO TISÍC," vyhrkne ze sebe Honza.
> Šéf se chvíli zamyslí a povídá: "Ale to je špatně, výsledek je 1048576!"
> A Honza na to: "No sice špatně, ale sakra rychle!"

Greedy algoritmy nachází řešení globálního problému tak, že volí lokálně optimální řešení. Tahle taktika nemusí vést ke globálně optimálnímu řešení, ale alespoň ho spočítá rychle.

- Ve výpočtu směřuje bottom-up.
- Ideálně funguje na problémy, kde optimální řešení podproblému je součástí optimálního řešení celého problému.
- Dobře se navrhuje, špatně dokazuje.

#### Problémy

- **Cashier’s algorithm (mince)**\
  Jak zaplatit danou částku s co nejmenším počtem mincí různých hodnot?

  - **Řešení**\
    V každé iteraci vol minci s nejvyšší hodnotou, dokud není zaplacena celá částka.

- **Interval scheduling**\
  Z množiny intervalů, které mají začátek a konec, **ale mají stejnou hodnotu**, vyber největší podmnožinu intervalů, které se nepřekrývají.

  - **Řešení**\
    Vybereme ty, které končí nejdřív.

### Backtracking

_Inteligentní brute-force nad prostorem řešení._

Technika hledání řešení problému postupným sestavováním _kandidátního_ řešení. [backtracking](#backtracking)

- Částečný kandidát může být zavrhnut, pokud nemůže být dokončen.
- Můžeme dokonce zavrhnout kompletní řešení, pokud je chceme najít všechna.
- Pokud je kandidát zavrhnut, algoritmus se vrátí o kus zpět (backtrackuje), upraví parametry a zkusí to znovu.

**Porovnání s dynamickým programováním**

| Dynamické programování                                       |
| ------------------------------------------------------------ |
| Backtracking                                                 |
| Hledá řešení _překrývajících se podproblémů_.                |
| Hledá _všechna_ řešení.                                      |
| Hledá _optimální_ řešení.                                    |
| Hledá všechna, _libovolná_ řešení, _hrubou silou_.           |
| Má blíž k BFS -- staví "vrstvy".                             |
| Má blíž k DFS -- zanoří se do jednoho řešení a pak se vrátí. |
| Typicky zabírá víc paměti kvůli memoizaci.                   |
| Typicky trvá déle, protože hledá _všechna_ řešení.           |
| Mívá cykly.                                                  |
| Mívá rekurzi.                                                |

#### Problémy

- **Sudoku**\
  Hledá řešení tak, že pro pole vybere možné řešení a zanoří se, pokud funguje tak _hurá_, pokud ne, tak backtrackuje a zkusí jinou možnou cifru.
- **Eight queens**\
  Jak rozestavit osm šachových královen na šachovnic tak, aby se vzájemně neohrožovaly?

## Amortizovaná analýza

> - **_amortize(v)_**
>   - _amortisen_ -- "to alienate lands", "to deaden, destroy"
>   - _amortir_ (Old French) -- "deaden, kill, destroy; give up by right"
>   - _\*admortire_ (Vulgar Latin) -- to extinquish
>
> — Online Etymology Dictionary

Umožňuje přesnější analýzu časové a prostorové složitosti, protože uvažujeme kontext, ve které se analyzovaný algoritmus používá. Určujeme složitost operace v **posloupnosti operací**, **ne samostatně**.

**Připomenutí**

> [!TIP]
> Viz bakalářská otázka [Korektnost a složitost algoritmu](../../szb/korektnost-a-slozitost-algoritmu/).

Základními pojmy analýzy složitosti jsou:

- **Časová složitost**\
  Funkce velikosti vstupu $n$ algoritmu. Počítá počet _kroků_ (nějaké výpočetní jednotky) potřebných k vyřešení problému.
- **Prostorová složitost**\
  Funkce velikosti vstup $n$ algoritmu. Počítá počet _polí_ (nějaké jednotky prostoru), která algoritmus potřebuje navštívit k vyřešení problému.
- **Asymptotická notace**\
  Umožňuje zanedbat hardwarové rozdíly. Popisuje, že složitost roste _alespoň tak_, _nejvýš tak_ nebo _stejně_ jako jiná funkce.
- **Big O**\
  Horní mez, složitost v nejhorším případě. Množina funkcí rostoucích stejně rychle jako $g$, nebo **pomaleji**:

  ```math
  \mathcal{O}(g(n)) = \{f : (\exists c, n_0 \in \mathbb{N}^+)(\forall n \geq n_0)(f(n) \le c \cdot g(n)) \}
  ```

- **Omega**\
  Spodní mez, složitost v nejlepším případě. Množina funkcí rostoucích stejně rychle jako $g$, nebo **rychleji**.

  ```math
  \Omega(g) = \{f : (\exists c, n_0 \in \mathbb{N}^+)(\forall n \geq n_0)(f(n) \ge c \cdot g(n)) \}
  ```

- **Theta**\
  Horní i spodní mez. Množina funkcí rostoucích stejně rychle jako $g$.

  ```math
  \Theta(g) = \mathcal{O}(g) \cap \Omega(g)
  ```

### Aggregate method (brute force)

Analyzujeme celou sekvenci operací najednou. Nepoužíváme žádné chytristiky ani fígle.

**Zásobník (brute force)**

- **Věta**\
  Pokud začneme s prázdným zásobníkem, pak libovolná posloupnost $n$ operací `Push`, `Pop` a `Multi-Pop` zabere $\mathcal{O}(n)$ času.
- **Důkaz**
  - Každý prvek je `Pop`nut nejvýše jednou pro každý jeho `Push`.
  - V posloupnosti je $\le n$ `Push`ů.
  - V posloupnosti je $\le n$ `Pop`ů (včetně těch v `Multi-Pop`u).
  - Celá posloupnost má tak nejvýše složitost $2n$.

### Accounting method (banker's method)

Používá fígl, kdy velké množství _levných_ operací "předplatí" jednu _drahou_ operaci. Využívá metaforu bankovního účtu.

- Každé operaci přiřadíme fiktivní _kreditovou_ cenu.
- Při realizaci operace zaplatíme _skutečnou_ cenu naspořenými kredity.
- Počáteční stav je 0 kreditů.

Pro každou operaci v posloupnosti:

- Pokud je _skutečná_ cena nižší než _kreditová_, tak zaplatíme skutečnou cenu a přebývající kredity uspoříme na _účtu_.
- Pokud je _skutečná_ cena vyšší než _kreditová_, tak zaplatíme skutečnou cenu a případný nedostatek kreditů doplatíme z úspor na _účtu_.

> [!IMPORTANT]
> Pokud je po celou dobu provádění operací stav účtu **nezáporný**, pak je _skutečná_ složitost celé posloupnosti operací menší nebo rovna součtu _kreditových_ cen operací.

> [!WARNING]
> Pokud stav účtu **kdykoliv během posloupnosti** klesne pod nulu, pak jsou kreditové ceny nastaveny **špatně**!

> [!TIP]
> Tato metoda se dá upravit tak, že kredity náleží individuálním objektům ve struktuře místo struktury jako celku. Cena operace se pak platí z kreditů objektů, nad kterým operace probíhá.

**Zásobník (kredity)**

| Operace         |
| --------------- |
| Skutečná cena   |
| Kreditová cena  |
| `Push`          |
| 1               |
| 2               |
| `Pop`           |
| 1               |
| 0               |
| `Multi-Pop`     |
| stem:[\min(k,\  |
| S\              |
| )]              |
| 0               |

- **Invariant**\
  Počet kreditů na účtu je rovný počtu prvků na zásobníku.
- **Důkaz**
  - Invariant platí pro prádný zásobník.
  - S `Push` operací se na účet připíše právě 1 kredit. (Čímž se předplatí `Pop` nebo `Multi-Pop`.)
  - `Pop` a `Multi-Pop` operace spotřebují právě 1 kredit z účtu.
  - Tedy stav účtu nikdy neklesne pod 0.
  - Tedy složitost posloupnosti je nejvýše součet kreditových cen, tedy $2n$.

### Potential method (physicist's method)

Hraje si s představou toho, že struktura je fyzikální systém s nějakou energetickou hladinou -- potenciálem. Výhodou této metody je, že stačí zvolit _jednu_ funkci, která splňuje dané podmínky. Nevýhodou je, že takovou funkci najít je těžké. Člověk zkrátka buď dostane nápad nebo ne.

- **Potenciálová funkce**\
  Funkce $\Phi$, která přiřadí dané struktuře $S$ hodnotu. Platí, že:

  ```math
  \begin{align*}
  \Phi(S_0) &= 0 \text{, kde } S_0 \text{ je počáteční stav} \\
  \Phi(S_i) &\ge 0 \text{ pro každou strukturu } S_i
  \end{align*}
  ```

- **Amortizovaná cena**\
  Pokud $c_i$ je _skutečná_ cena operace, pak pro amortizovanou cenu $\hat{c_i}$ platí:

  ```math
  \hat{c_i} = c_i + \Phi(S_i) - \Phi(S_{i-1})
  ```

- **Potenciálová věta**\
  Počínaje počátečním stavem $S_0$, celková _skutečná_ cena posloupnosti $n$ operací je nejvýše součet jejich amortizovaných cen.
- **Důkaz**

  ```math
  \begin{align*}
  \sum_{i=1}^n \hat{c_i} &= \sum_{i=1}^n (c_i + \Phi(S_i) - \Phi(S_{i-1})) \\
  &= \sum_{i=1}^n c_i + \Phi(S_n) - \Phi(S_0) \\
  &\geq \sum_{i=1}^n c_i \quad\tiny\blacksquare
  \end{align*}
  ```

**Zásobník (potenciálová věta)**

$\Phi(S) = |S|$ (počet prvků na zásobníku)

| Operace                   |
| ------------------------- |
| Skutečná cena             |
| Amortizovaná cena         |
| `Push`                    |
| 1                         |
| stem:[\hat{c_i} = 1 + (\  |
| S\                        |
| + 1) - \                  |
| S\                        |
| = 2]                      |
| `Pop`                     |
| 1                         |
| stem:[\hat{c_i} = 1 + \   |
| S\                        |
| - (\                      |
| S\                        |
| + 1) = 0]                 |
| `Multi-Pop`               |
| stem:[\min(k,\            |
| S\                        |
| )]                        |
|                           |

```math
\hat{c_i} =
\begin{cases}
k + (\|S\| - k) - \|S\| = 0 & \text{pokud } \|S\| > k \\
\|S\| + (\|S\| - \|S\|) - \|S\| = 0 & \text{pokud } \|S\| \le k

\end{cases}
```

- **Věta**\
  Počínaje prázdným zásobníkem, libovolná sekvence operací zabere $\mathcal{O}(n)$ času.
- **Důkaz (případ `Push`)**
  - Skutečná cena je $c_i = 1$.
  - Amortizovaná cena je $\hat{c_i} = c_i + \Phi(S_i) - \Phi(S_{i-1}) = 1 + (|S| + 1) - |S| = 2$.
- **Důkaz (případ `Pop`)**
  - Skutečná cena je $c_i = 1$.
  - Amortizovaná cena je $\hat{c_i} = c_i + \Phi(S_i) - \Phi(S_{i-1}) = 1 - 1 = 0$.
- **Důkaz (případ `Multi-Pop`)**
  - Skutečná cena je $c_i = k$.
  - Amortizovaná cena je $\hat{c_i} = c_i + \Phi(S_i) - \Phi(S_{i-1}) = k - k = 0$.
- **Důkaz (závěr)**
  - Amortizovaná cena všech operací je $\hat{c_i} \le 2$.
  - Součet amortizovaných cen posloupnosti $n$ operací je pak $\sum_{i=1}^n \hat{c_i} \le 2n$.
  - Z potenciálnové věty plyne, že skutečná cena posloupnosti je $\le 2n$.

---

**Slavné potenciálové funkce**

- **Fibonnacciho halda**

  ```math
  \Phi(H) = 2 \cdot \text{trees}(H) - 2 \cdot \text{marks}(H)
  ```

- **Splay trees**\
  Binární vyhledávací stromy, kde poslední přídané prvky jsou přístupné rychleji. [(zdroj)](https://en.wikipedia.org/wiki/Splay_tree)

  ```math
  \Phi(T) = \sum_{x \in T} \lfloor \log_2 \text{size}(x) \rfloor
  ```

- **Move-to-front**\
  Transformace dat používaná při kompresi dat. [(zdroj)](https://en.wikipedia.org/wiki/Move-to-front_transform)

  ```math
  \Phi(L) = 2 \cdot \text{inversions}(L, L^*)
  ```

- **Preflow-push (push-relabel)**

  ```math
  \Phi(f) = \sum_{v \,:\, \text{excess}(v) > 0} \text{height}(v)
  ```

- **Red-black trees**

  ```math
  \Phi(T) = \sum_{x \in T} w(x)

  \\

  w(x) = \begin{cases}
  0 & \text{pokud } x \text{ je červený} \\
  1 & \text{pokud } x \text{ je černý a nemá žádné červené potomky} \\
  0 & \text{pokud } x \text{ je černý a má jednoho červeného potomka} \\
  2 & \text{pokud } x \text{ je černý a má dva červené potomky}
  \end{cases}
  ```

## Vyhledávání řetězců (string matching)

_String matching_ označuje rodinu problémů obsahující třeba:

- Nalezení prvního přesného výskytu podřetězce (_patternu_) v řetězci (_stringu_ / _textu_).
- Nalezení všech výskytů podřetězce v řetězci.
- Výpočet vzdálenosti dvou řetězců.
- Hledání opakujících se podřetězců.

Většinou je řetězec polem znaků z konečné abecedy $\Sigma$. String matching algoritmy se ale dají použít na ledacos.

Vzorek $P$ se vyskytuje v textu $T$ s posunem $s$, pokud $0 \le s \le n - m$ a zároveň $T\lbrack (s+1) .. (s + m) \rbrack = P$. Pro nalezení platných posunů lze použít řadu algoritmů, které se liší složitostí předzpracování i samotného vyhledávání: [iv003-strings](#iv003-strings)

| Algoritmus                          |
| ----------------------------------- |
| Preprocessing                       |
| Searching                           |
| Brute force / naivní                |
| $0$                                 |
| $\mathcal{O}((n - m + 1) \cdot m)$  |
| Karp-Rabin                          |
| $\Theta(m)$                         |
| $\mathcal{O}((n - m + 1) \cdot m)$  |
| finite automata                     |
| stem:[\Theta(m \cdot \              |
| \Sigma\                             |
| )]                                  |
| $\Theta(n)$                         |
| Knuth-Morris-Pratt                  |
| $\Theta(m)$                         |
| $\Theta(m)$                         |
| Boyer-Moore                         |
| stem:[\Theta(m + \                  |
| \Sigma\                             |
| )]                                  |
| $\mathcal{O}((n - m  + 1) \cdot m)$ |

- $T$ nebo $T\lbrack 1..n \rbrack$ -- text.
- $P$ nebo $P\lbrack 1..m \rbrack$ -- pattern.
- $n$ -- délka textu $T$.
- $m$ -- délka vzorku / podřetězce / patternu $P$.
- $\Sigma$ -- konečná abeceda, ze které je složen text i pattern.

### Brute force / naivní

Prochází všechny pozice v textu a porovnává je s patternem. Pokud se neshodují, posune se o jedno pole dopředu.

Pokud se text neshoduje už v prvním znaku, je složitost lineární. Avšak v nejhorším případě, kdy se pattern shoduje s textem až na poslední znak, je složitost až kvadratická.

```csharp
int Naive(string text, string pattern)
{
    int n = text.Length;
    int m = pattern.Length;
    for (int i = 0; i < n - m + 1; i++)
    {
        // NB: Substring creates a new string but let's not worry about that.
        if (text.Substring(i, m) == pattern)
        {
            return i;
        }
    }
    return -1;
}
```

- **Složitost**\
  Cyklus je proveden $n-m+1$-krát. V každé iteraci se provede přinejhorším až $m$ porovnání. (Zanedbáváme složitost `Substring`, která v C# dělá kopii.)

### Karp-Rabin

Používá hashování. Vytvoří hash z patternu a hashuje i všechny podřetězce délky $m$ v textu. Nejprve eliminuje všechny pozice, kde se hashe neshodují. Pokud se shodují, porovná je znak po znaku.

```csharp
int KarpRabin(string text, string pattern)
{
    int n = text.Length;
    int m = pattern.Length;
    int patternHash = pattern.GetHash();
    for (int i = 0; i < n - m + 1; i++)
    {
        // NB: Assume that `GetHash` is a rolling hash, even though in .NET it's not.
        if (text.Substring(i, m).GetHash() == patternHash)
        {
            if (text.Substring(i, m) == pattern)
            {
                return i;
            }
        }
    }
    return -1;
}
```

- **Hashování**\
  Trik spočívá v použití _rolling_ hashovacího algoritmu. Ten je schopný při výpočtu hashe pro $T\lbrack s .. (s + m) \rbrack$ použít hash $T\lbrack s .. (s + m - 1) \rbrack$ s využitím pouze jednoho dalšího znaku $T\lbrack s + m \rbrack$. Přepočet hashe je tedy $\mathcal{O}(1)$.

  Jeden takový algoritmus lze získat použitím Hornerova schématu pro evaluaci polynomu. [horner](#horner) Předpokládejme, že $\Sigma = \{0, 1, ..., 9\}$ (velikost může být libovolná), pak pro hash $h$ platí

  ```math
  \begin{align*}
  h &= P[1] + 10 \cdot P[2] + 10^2 \cdot P[3] + ... + 10^{m-1} \cdot P[m] \\
    &= P[1] + 10 \cdot (P[2] + 10 \cdot (P[3] + ... + 10 \cdot P[m] ... ))
  \end{align*}
  ```

  Pokud jsou hashe příliš velké, lze navíc použít modulo $q$, kde $10 \cdot q \approx \text{machine word}$.

- **Složitost**\
  Předzpracování zahrnuje výpočet $T \lbrack 1..m \rbrack$ v $\Theta(m)$.

  Složitost výpočtu je v nejhorším případě $\mathcal{O}((n - m + 1) \cdot m)$, jelikož je potřeba porovnat všechny podřetězce délky $m$ s patternem.

  Tento algoritmus se hodí použít, pokud hledáme v textu celé věty, protože neočekáváme velké množství "falešných" shod, které mají stejný hash jako $P$. V tomto případě je průměrná složitost $\mathcal{O}(n)$.

### Konečné automaty

Složitost naivního algortmu lze vylepšit použitím konečného automatu.

Mějmě DFA $A = (\{0, ..., m\}, \Sigma, \delta, \{0\}, \{m\})$, kde přechodobou funkci definujeme jako:

```math
\delta(q, x) = \text{největší } k \text{ takové, že } P[1..k] \text{ je \textbf{prefix} a zároveň \textbf{suffix} } P[1..q] . x
```

Jinými slovy, $\delta$ vrací delků nejdelšího možného začátku $P$, který se nachází na daném místě (stavu $q$) v řetězci $T$.

Prakticky by příprava přechodové funkce mohla vypadat takto:

```csharp
int[,] CreateAutomaton(string pattern)
{
    int m = pattern.Length;
    // NB: Assumes that the alphabet is ASCII.
    int[,] automaton = new int[m + 1, 256];
    for (int q = 0; q <= m; q++)
    {
        for (int c = 0; c < 256; c++)
        {
            int k = Math.Min(m + 1, q + 2);
            do
            {
                k--;
            }
            while (!pattern.Substring(0, q).Equals(pattern.Substring(0, k) + (char)c));
            automaton[q, c] = k;
        }
    }
    return automaton;
}
```

Vyhledávání v textu pak bude vypadat takto:

```csharp
int FiniteAutomaton(string text, string pattern)
{
    int n = text.Length;
    int m = pattern.Length;
    int[,] automaton = CreateAutomaton(pattern);
    int q = 0;
    for (int i = 0; i < n; i++)
    {
        q = automaton[q, text[i]];
        if (q == m)
        {
            return i - m + 1;
        }
    }
    return -1;
}
```

Tato metoda šetří čas, pokud se pattern v některých místech opakuje. Mějmě například pattern `abcDabcE` a text `abcDabcDabcE`. Tato metoda nemusí začínat porovnávat pattern od začátku po přečtení druhého `D`, ale začne od $P \lbrack 5 \rbrack$ (včetně), protože _ví_, že předchozí část patternu se již vyskytla v textu.

Jinými slovy na indexu druhého `D` je `abcD` nejdelší prefix $P$, který je zároveň suffixem už načteného řetězce.

- **Složitost**\
  Vytvoření automatu vyžaduje $\Theta(m^3 \cdot |\Sigma|)$ času, dá se však provést efektivněji než v `CreateAutomaton` a to v čase $\Theta(m \cdot |\Sigma|)$.

  Složitost hledání je pak v $\Theta(n)$. [iv003-strings](#iv003-strings)

### Knuth-Morris-Pratt (KMP)

KMP představuje efektivnější využití idei z metody konečného automatu:

- Každý stav $q$ je označen písmenem z patternu. Výjimkou je počáteční stav $S$ a koncový stav $F$.
- Každý stav má hranu `success`, která popisuje sekvenci znaků z patternu, a `failure` hranu, která míří do některého z předchozích stavů -- takového, že už načtené znaky jsou největší možný prefix patternu.

V reálné implementaci nejsou `success` hrany potřeba; potřebujeme jen vědět, kam skočit v případě neúspěchu.

```csharp
/// <summary>
/// Computes the longest proper prefix of P[0..i]
/// that is also a suffix of P[0..i].
/// </summary>
int[] ComputeFailure(string pattern)
{
    int m = pattern.Length;
    int[] fail = new int[m];
    int j = 0;
    for (int i = 1; i < m; i++)
    {
        while (j >= 0 && pattern[j] != pattern[i])
        {
            j = fail[j];
        }

        // If comparison at i fails,
        // return to j as the new starting point.
        fail[i] = j;

        j++;
    }
    return fail;
}

int KnuthMorrisPratt(string text, string pattern)
{
    int[] fail = ComputeFailure(pattern);
    int n = text.Length;
    int m = pattern.Length;
    // NB: I index from 0 here. Although I use 1..n in the text.
    int i = 0;
    int j = 0;
    for (int i = 0; i < n; i++)
    {
        while (j >= 0 && text[i] != pattern[j])
        {
            /*
                There can be at most n-1 failed comparisons
                since the number of times we decrease j cannot
                exceed the number of times we increment i.
            */
            j = fail[j];
        }

        j++;
        if (j == m)
        {
            return i - m;
        }
    }
    return -1;
}
```

> [!WARNING]
> Nejsem si jistý, že ty indexy v kódu výše mám dobře.

> [!NOTE]
> "In other words we can amortize character mismatches against earlier character matches." [iv003-strings](#iv003-strings)

- **Složitost**\
  Amortizací neúspěšných porovnání vůči úspěšným získáme $\mathcal{O}(m)$ pro `ComputeFailure` a $\mathcal{O}(n)$ pro `KnuthMorrisPratt`.

## Zdroje

- [[[iv003, 1]]] [IV003 Algoritmy a datové struktury II (jaro 2021)](https://is.muni.cz/auth/el/fi/jaro2021/IV003/)
- [[[iv003-strings,2]]] https://is.muni.cz/auth/el/fi/jaro2021/IV003/um/slides/stringmatching.pdf
- [[[rabin-karp-wiki,3]]] https://en.wikipedia.org/wiki/Rabin%E2%80%93Karp_algorithm
- [[[horner,4]]] https://en.wikipedia.org/wiki/Horner%27s_method
- [[[backtracking,5]]] https://betterprogramming.pub/the-technical-interview-guide-to-backtracking-e1a03ca4abad
