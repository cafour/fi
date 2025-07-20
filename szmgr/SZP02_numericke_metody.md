= Numerické metody
:url: ./numericke-metody/
:page-group: szp
:page-order: SZP02

[NOTE]
====
Iterativní metody pro řešení nelineárních rovnic (Newtonova metoda a její modifikace). Přímé metody pro řešení systému lineárních rovnic (Gaussova eliminace, Jacobi, Gauss-Seidel, relaxační metody). Numerická diferenciace, diferenciační schémata.

_MA018_
====

Numerická analýza / numerical analysis::
Oblast matematiky / informatiky zabývající se tvorbou numerických metod a algoritmů, které řeší problémy matematické analýzy (např. derivace, integrály a podobný symbolický balast) pomocí numerické aproximace. <<numerical-analysis>>
+
Je výhodná v situacích, kdy problém nelze řešit analyticky nebo je to příliš složité a není to (výpočetní) čas.

Notace chyb::
+
--
* stem:[x] je přesná hodnota,
* stem:[\tilde{x}] je aproximace stem:[x],
* stem:[x - \tilde{x}] je absolutní chyba stem:[\tilde{x}],
* stem:[\lvert x - \tilde{x} \rvert \leq \alpha] je odhad absolutní chyby,
* stem:[\frac{x - \tilde{x}}{x}] je relativní chyba,
* stem:[\left\lvert \frac{x - \tilde{x}}{x} \right\rvert \leq \alpha] je odhad relativní chyby.
--

Numerická stabilita::
Schopnost numerické metody zpracovat chyby vstupních dat a výpočetních operací.
+
Desetinná čísla jsou v počítačích nevyhnutelně reprezentována nepřesně. Numericky stabilní metody jsou takové, které tyto nepřesnosti *nezhoršují*. <<numerical-stability>>

Řád metody / order of accuracy / order of approximation::
Hodnota reprezentující, jak rychle metoda konverguje k výsledku, resp. jak přesný je její odhad.
+
Numerická metoda obvykle konverguje snižováním nějakého _kroku_ stem:[h]. Pokud ho lze zvolit libovolně malý, a lze-li prohlásit, že pro chybu aproximace stem:[E] platí: <<rate>> <<numericka-metoda>> <<order-question>>
+
[stem]
++++
\begin{aligned}

E(h) &\leq C \cdot h^p \\
E(h) &\in \mathcal{O}(h^p)

\end{aligned}
++++
+
kde stem:[C] je konstanta. Pak stem:[p] je řád metody.

== Iterativní metody pro řešení nelineárních rovnic

Root-finding problem::
Problém nalezení _kořenů_ (root) funkce stem:[f]. T.j. takových parametrů stem:[x, ...], kde funkce vrací 0: <<root-finding>>
+
[stem]
++++
f(x, ...) = 0
++++

Iterative methods for root-finding problem::
Metody pro řešení root-finding problemu, které využívají iterativního přístupu. Tedy opakují nějaký výpočet a zpřesňují svůj odhad, dokud nedosáhnou požadované přesnosti. <<ma018>> <<root-finding>>

Řád metody / rate of convergence::
Hodnota reprezentující, jak rychle metoda konverguje k výsledku. <<rate>>

Prostá iterační metoda / metoda pevného bodu / fixed-point iteration::
Používá se pro rovnice typu stem:[x = g(x)].
+
1. Zvolíme počáteční odhad stem:[x_0].
2. Opakujeme stem:[x_{n+1} = g(x_n)] dokud stem:[\lvert x_{n+1} - x_n \rvert \leq \alpha] (kde stem:[\alpha] je požadovaná přesnost).
+
image::img/szp02_fixed_point_method.png[width=400]

Newtonova metoda / metoda tečen::
Používá k odhadu kořene funkce stem:[f] její tečnu v bodě stem:[x_n]. Iterační funkce je:
+
[stem]
++++
g(x_{k+1}) = x_k - \frac{f(x_k)}{f'(x_k)}
++++
+
1. Zvolíme počáteční odhad stem:[x_0].
2. Další odhad je stem:[x_{n+1} = g(x_n)], tedy průsečík tečny fukce stem:[f] v bodě stem:[x_n] s osou stem:[x].
3. Opakujeme 2. dokud nedosáhneme požadované přesnosti odhadu.
+
image::./img/szp02_newton_method.png[width=400]

Metoda sečen / secant method::
Používá k odhadu kořene funkce stem:[f] sečny, resp. _finite difference_, které aproximují derivaci funkce stem:[f]. Díky tomu není potřeba znát derivaci funkce stem:[f]. Volí se dva počáteční body. Iterační funkce je:
+
[stem]
++++
g(x_{k+1}) = x_k - \frac{f(x_k)(x_k - x_{k-1})}{f(x_k) - f(x_{k-1})}
++++
+
image::./img/szp02_secant_method.png[width=400]

Metoda regula falsi::
Je _bracketing_ metoda, tedy metoda, která využívá intervalu, ve kterém se nachází kořen. Nemusí se použít iterativně, ale v iterativní podobě tento interval postupně zmenšuje. Narozdíl od metody sečen si _vybereš_, který z předchozích bodů se ti hodí víc (stem:[x_s]), nemusí to být striktně ten předchozí. <<regula-falsi>> 
+
[stem]
++++
x_{k+1} = x_k - \frac{x_k - x_s}{f(x_k) - f(x_s)} f(x_k)
++++
+
kde stem:[s] je největší index takový, že stem:[f(x_k)f(x_s) < 0]. (mají různé znaménka)
+
image::./img/szp02_regula_falsi.png[width=400]

Metoda Binary search::
Prvotní interval stem:[(x_0, x_1)] musí obsahovat kořen funkce stem:[f], tj. stem:[x_0] a stem:[x_1] mají různé znaménka. V každém kroku se rozdělí interval na dvě poloviny a dál hledáme v polovině která obsahuje kořen funkce. Metoda _regula falsi_ se pokouší o rychlejší kovergenci sofistikovanějším dělením intervalu.

== Přímé metody pro řešení systému lineárních rovnic

=== Gaussova eliminace

Systém rovnice je přepsán do matice. Gaussova eliminace je posloupnost operací, jejichž cílem je převést matici do horní trojúhelníkové matice (_row echelon form_). <<gauss-elimination>> Povoleny jsou následující operace:

--
* výměna dvou řádků,
* vynásobení řádku nenulovou konstantou,
* přičtení násobku jednoho řádku k jinému.
--

=== Jacobiho iterační metoda

Iterativní algoritmus pro řešení soustavy lineárních rovnic. Rozděluje vstupní matici lineárních rovnic na matici diagonál stem:[D], dolní trojúhelníkovou matici stem:[L] a horní trojúhelníkovou matici stem:[U]. <<jacobi-method>>

Nechť stem:[A\mathbf{x} = \mathbf{b}] je systém stem:[n] lineárních rovnic. Tedy:

[stem]
++++
A = \begin{bmatrix}
    a_{11} & a_{12} & \cdots & a_{1n} \\
    a_{21} & a_{22} & \cdots & a_{2n} \\
    \vdots & \vdots & \ddots & \vdots \\
    a_{n1} & a_{n2} & \cdots & a_{nn}
\end{bmatrix}, \qquad

\mathbf{x} = \begin{bmatrix}
    x_{1} \\ x_2 \\ \vdots \\ x_n
\end{bmatrix} , \qquad

\mathbf{b} = \begin{bmatrix}
    b_{1} \\ b_2 \\ \vdots \\ b_n
\end{bmatrix}.
++++

Algoritmus vypadá takto:

--
1. Zvolíme počáteční odhad stem:[\mathbf{x}^{(0)}], nejčastěji stem:[\vec{0}].
2. Nový odhad získáme ze vztahu:
+
[stem]
++++
\mathbf{x}^{(k+1)} = D^{-1}(\mathbf{b} - (L + U)\mathbf{x}^{(k)})
++++
--

Jelikož stem:[L + U = A - D], dá to zapsat i jako:

[stem]
++++
\mathbf{x}^{(k+1)} = D^{-1}\mathbf{b} + (I - D^{-1} A) \mathbf{x}^{(k)}
++++

Spektrální poloměr::
Spektrální poloměr stem:[\rho] matice stem:[A] je největší absolutní hodnota vlastního čísla matice stem:[A].
+
[stem]
++++
\rho(A) = \max_{i=1,\ldots,n} |\lambda_i|
++++

(Řádková) diagonální dominance::
Matice stem:[A] je diagonálně dominantní, pokud platí:
+
[stem]
++++
|a_{ii}| > \sum_{j=1, j \neq i}^n |a_{ij}|
++++
+
Tedy absolutní hodnota prvku na diagonále je větší než součet absolutních hodnot všech ostatních prvků v řádku.
+
--
* _Striktní_: nerovnost je ostrá (stem:[>]).
* _Slabá_: nerovnost je neostá (stem:[\ge]).
--
+
Analogicky se definuje sloupcová diagonální dominance.

Konvergence Jacobiho metody::
Jacobiho metoda konveguje pokud všechny následující podmínky:
+
--
1. Nechť stem:[T_j = I - D^{-1} A] je matice iterace Jacobiho metody. Pak Jacobiho metoda konverguje, pokud:
+
[stem]
++++
\rho(T_j) < 1
++++
+
2. Jacobiho metoda konverguje pro libovolný počáteční odhad stem:[\mathbf{x}^{(0)}], pokud stem:[A] je diagonálně dominantní (sloupcově nebo řádkově).
--

=== Gaussova-Seidelova iterační metoda

Iterativní metoda pro řešení soustavy lineárních rovnic. Dělí vstupní matici na spodní trojúhelníkovou matici stem:[L_*] (včetně diagonály, tedy stem:[L_* = D + L]) a striktně horní trojúhelníkovou matici stem:[U] (diagonála je nulová). Algoritmus vypadá takto: <<gauss-seidel>>

--
1. Zvolíme počáteční odhad stem:[\mathbf{x}^{(0)}].
2. Nový odhad získáme ze vztahu:
+
[stem]
++++
\mathbf{x}^{(k+1)} = L_*^{-1}(\mathbf{b} - U\mathbf{x}^{(k)}).
++++
--

Alternativně:

[stem]
++++
\begin{aligned}

T_{gs} &= (D + L)^{-1} U = L_*^{-1} U \\
\mathbf{x}^{(k+1)} &= T_{gs} \mathbf{x}^{(k)} + g,\quad g = L_*^{-1} \mathbf{b}

\end{aligned}
++++

Konvergence Gaussovy-Seidelovy metody::
Analogicky jako u Jacobiho metody, ale místo matice stem:[T_j] se použije matice stem:[T_{gs} = (D + L)^{-1} U].

=== Relaxační iterativní metody

Modifikace Gauss-Seidelovy metody. Využívá parametr stem:[\omega], který určuje, jak moc se má nový odhad lišit od předchozího. Vztah pro další iteraci se mění na: <<relaxation-method>>

[stem]
++++
\begin{align*}
    \mathbf{x}^{(k+1)} &= (D - \omega L)^{-1} [(1-\omega)D + \omega U]\mathbf{x}^{(k)} + \omega(D - \omega L)^{-1}\mathbf{b} \\
    T_\omega &= (D - \omega L)^{-1} [(1-\omega)D + \omega U]
\end{align*}
++++

--
* Pro stem:[0 < \omega < 1] se názývá metodou dolní relaxace. Je vhodná v případě, kdy Gauss-Seidel nekonverguje.
* Pro stem:[\omega = 1] je totožná s Gauss-Seidelem.
* Pro stem:[\omega > 1] se názývá metodou horní relaxace / SOR metodou. Zrychluje konvergenci Gauss-Seidela.
--

=== Dekompozice matic

Metody podobné Gaussově eliminaci, ale s vlastnostmi, které mohou být vyhodné.

LU dekompozice::
Rozdělení matice stem:[A] na horní dolní trojúhelníkovou matici stem:[L] a horní trojúhelníkovou matici stem:[U], tak že stem:[A = LU].
+
Je to v podstatě Gaussova eliminace. Matice stem:[P] je permutační matice, která prohazuje řádky:
+
[stem]
++++
P \cdot A = L \cdot U
++++
+
Platí, že:
+
[stem]
++++
\begin{aligned}
A \cdot x &= b \\
A &= LU \\
LU \cdot x &= b
\end{aligned}
++++
+
Původní problém řešení soustavy linárních rovnic se tedy převede na dva problémy:
+
[stem]
++++
\begin{aligned}
y &= U \cdot x \\
L \cdot y &= b \\
\end{aligned}
++++
+
Řešíme tedy dva systémy rovnic s trojúhelníkovými maticemi.
+
Oproti Gaussovi je výhodnější pro:
+
--
* Opakované řešení soustav s maticí stem:[A] a různými pravými stranami stem:[b].
* Inverzi matice stem:[A].
* Výpočet determinantu matice stem:[A].
--


QR dekompozice::
Rozdělení matice stem:[A] na ortogonální matici stem:[Q] a horní trojúhelníkovou matici stem:[R] (už ne stem:[U]), tak že stem:[A = QR].
+
[stem]
++++
\begin{aligned}

A \cdot x &= b \\
A = QR \Rightarrow U \cdot x &= Q^T \cdot b \\

\end{aligned}
++++
+
Protože je ortogonální a tedy stem:[Q^{-1} = Q^T].
+
Má lepší numerickou stabilitu než LU dekompozice.


== Numerická diferenciace

Algoritmy numerické diferenciace (derivace) počítají odhady derivace reálných funkcí -- aproximují stem:[f'(x)]. Využívají při tom známé hodnoty této funkce a jiné znalosti a předpoklady. <<differentiation>>

Numerická diferenciace se využívá pro aproximaci differenciálních rovnic (převodem na _diferenční rovnice_).

Langrangeova interpolace::
Pokud známe hodnoty stem:[f] můžeme mezi nimi interpolovat pomocí Lagrangeova polynomu a derivovat ten, protože derivovat polynomy je jednoduché.
+
IMPORTANT: Lagrangeovu interpolaci řeší část otázky link:../krivky-a-povrchy/[Křivky a povrchy].

Finite difference method::
Rodina metod numerické diferenciace, které využívají _konečné diference_. Tedy approximují limitu v definici derivace malými posuny ve vstupních hodnotách diferenciovaných funkcí. <<finite-difference-method>>
+
Jednotlivým "odstínům" -- konkrétním výpočetním vzorcům -- téhle metody se říká _diferenciační schémata_.
+
TIP: Různá _diferenciační schémata_ (dopředná / zpětná / centrální) dávají mnohem větší smysl na diskrétních případech, jako například na obraze. Viz link:../zpracovani-rastroveho-obrazu/[Zpracování rastrového obrazu]. Je to složitý způsob jak říct, že odečteš vedlejší pixel.

(Konečné) diference prvního řádu / first-order (finite) differences::
Nejjednodušší schéma numerické diferenciace. Vychází z definice derivace. <<finite-difference>>
+
--
* _Dopředná diference / forward (finite) difference_
+
[stem]
++++
\frac{\partial f}{\partial x} \approx \frac{f(x+h) - f(x)}{h}
++++

* _Zpětná diference / backward (finite) difference_
+
[stem]
++++
\frac{\partial f}{\partial x} \approx \frac{f(x) - f(x-h)}{h}
++++

* _Centrální diference / central (finite) difference_
+
[stem]
++++
\frac{\partial f}{\partial x} \approx \frac{f(x+h) - f(x-h)}{2h}
++++
--
+
kde stem:[h] je kladné číslo napodobující nekonečně malou změnu (limitu) v definici derivace. Může to být konstanta, může ale být i zvoleno adaptivně.
+
TIP: Tečna je tak napodobena sečnou.

Richardson extrapolation::
Způsob zlepšení rate of convergence iterativních metod. <<richardson>> 

[bibliography]
== Zdroje
* [[[ma018,1]]] link:https://is.muni.cz/auth/el/fi/podzim2019/MA018/[MA018 Numerical Methods (podzim 2019)]
* [[[numerical-analysis,2]]] link:https://en.wikipedia.org/wiki/Numerical_analysis[Wikipedia: Numerical analysis]
* [[[root-finding,3]]] link:https://en.wikipedia.org/wiki/Root-finding_algorithms[Wikipedia: Root-finding algorithms]
* [[[rate, 4]]] link:https://en.wikipedia.org/wiki/Rate_of_convergence[Wikipedia: Rate of convergence]
* [[[regula-falsi,5]]] link:https://en.wikipedia.org/wiki/Regula_falsi[Wikipedia: Regula falsi]
* [[[gauss-elimination,6]]] link:https://en.wikipedia.org/wiki/Gaussian_elimination[Wikipedia: Gaussian elimination]
* [[[jacobi-method,7]]] link:https://en.wikipedia.org/wiki/Jacobi_method[Wikipedia: Jacobi method]
* [[[gauss-seidel,8]]] link:https://en.wikipedia.org/wiki/Gauss%E2%80%93Seidel_method[Wikipedia: Gauss-Seidel method]
* [[[relaxation-method, 9]]] link:https://en.wikipedia.org/wiki/Relaxation_(iterative_method)[Wikipedia: Relaxation (iterative method)]
* [[[differentiation, 10]]] link:https://en.wikipedia.org/wiki/Numerical_differentiation[Wikipedia: Numerical differentiation]
* [[[finite-difference, 11]]] link:https://en.wikipedia.org/wiki/Finite_difference[Wikipedia: Finite difference]
* [[[finite-difference-method, 12]]] link:https://en.wikipedia.org/wiki/Finite_difference_method[Wikipedia: Finite difference method]
* [[[richardson,13]]] link:https://en.wikipedia.org/wiki/Richardson_extrapolation[Wikipedia: Richardson extrapolation]
* [[[linear-eq, 14]]] link:https://en.wikipedia.org/wiki/System_of_linear_equations[Wikipedia: System of linear equations]
* [[[numerical-stability, 15]]] link:https://en.wikipedia.org/wiki/Numerical_stability[Wikipedia: Numerical stability]
* [[[numericka-metoda,16]]] link:https://cs.wikipedia.org/wiki/Numerick%C3%A1_metoda[Wikipedia: Numerická metoda]
* [[[order-question,17]]] link:https://math.stackexchange.com/questions/2873291/what-is-the-intuitive-meaning-of-order-of-accuracy-and-order-of-approximation[What is the intuitive meaning of order of accuracy and order of approximation?]
