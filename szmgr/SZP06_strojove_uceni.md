= Strojové učení
:url: ./strojove-uceni/
:page-group: szp
:page-order: SZP06

[NOTE]
====
Strojové učení a rozpoznávání vzorů: problém klasifikace a regrese, shluková analýza, učení s učitelem a bez učitele. Vícevrstvé neuronové sítě, vícevrstvé perceptrony, ztrátové funkce, zpětná propagace. pass:[<s>Hopfieldova síť, </s>]konvoluční sítě, rekurentní sítěpass:[<s>, samo-organizující mapy</s>].

_PV021_
====

TIP: Velkou část zpracování téhle otázky jsem ukradl link:/fi/pv021/[sám sobě].

== Strojové učení a rozpoznávání vzorů

Machine learning / strojové učení::
+
--
Oblast informatiky zabývající se konstrukcí systémů, které nemají svoji funkcionalitu explicitně naprogramovanou, ale naučí se ji až na základě vstupních dat. <<ml>> <<pv021>>

Používá se např. pro:

* filtrování spamu v emailech,
* rozpoznávání řeči, rukopisu, tváří, zvuků, atd.,
* klasifikaci textů,
* herní strategie,
* analýzu trhu,
* autonomní řízení vozidel.
--

Rozpoznávání vzorů / pattern recognition::
Problém automatizovaného rozpoznávání vzorů v datech (např. číslic v obrázku). Příklady jsou _klasifikace_, _regrese_ a _shluková analýza_. <<pattern-recognition>>

Klasifikace::
Problém identifikace kategorie, do které patří vstupní data. Výstupem klasifikace je buď jedna konkrétní kategorie nebo vektor popisující s jakou pravděpodobností vstup do každé kategorie patří. <<classification>>

Regrese::
Problém odhadu hodnoty nějaké proměnné na základě znalosti jiných proměnných. Výstupem regrese je obvykle reálné číslo. <<regression>>
+
Například při _lineární regresi_ se snažíme data napasovat na přímku -- najít její offset a směrnici. Při _logistické regresi_ chceme to samé ale místo přímky máme logistic sigmoid. A tak dále. <<pv021>>

Shluková analýza / cluster analysis::
Vicedimenzionální problém rozdělení vstupních dat do skupin (shluků) tak, aby data v jednom shluku byla _podobnější_ sobě než datům v jiných shlucích. <<clustering>>
+
Souvisejícím problémem je vyjádření toho, že jsou si data v nějakém smyslu _podobná_.

Supervised learning / učení s učitelem::
Síť se učí na základě množiny trénovacích vstupů ve formátu (vstup, výstup). Supervised learning algoritmy se snaží síť modifikovat tak, aby vracela výstupy co možná nejpodobnější těm trénovacím. <<pv021>>

Unsupervised learning / učení bez učitele::
Síť dostává jen vstupy. Cílem je získat o vstupní množině dat nějakou užitečnou informaci, třeba kde jsou shluky. <<pv021>>

== Neuronové sítě

Neural network / neuronová síť::
+
--
Neuronová síť je množina propojených neuronů, jejíž chování je zakódováno do spojení mezi neurony. Je primitivním modelem biologických neuronových sítí.

Typ neuronové sítě je dán její architekturou (způsobem zapojení), aktivitou (transformací vstupů na výstupy) a učením (metodou změny vah při trénování).
--

Architektura::
Neuron může být _input_, _output_ nebo _hidden_. Může být dokonce input i output najednou. Hidden je, právě když není input ani output.
+
Síť být cyklická -- _recurrent_ -- nebo acyklická -- _feed-forward_.

Stav sítě::
Vektor výstupů všech neuronů sítě (nejen output).

Stavový prostor sítě::
Množina všech možných stavů sítě.

Vstup sítě::
Vektor reálných čísel (prvek stem:[\Reals^n]), kde stem:[n] je počet vstupů.

Vstupní prostor sítě::
Množina všech vstupů sítě.

Iniciální stav::
Input neuronům je za výstup (stem:[y]) dán vektor vstupů (stem:[\vec{x}]). Všem ostatním neuronům je výstup (stem:[y]) nastaven na 0.

Výstup sítě::
Vektor výstupů (stem:[y]) output neuronů. Výstup se v průběhu výpočtu může měnit.

Výpočet::
Typicky po diskrétních krocích:
+
1. Zvolí se množina neuronů (vybrané podle pravidla daného architekturou).
2. Zvoleným neuronům je nastaven výstup -- prostě se vyhodnotí aktivační funkce.
3. Vrať se ke kroku 1.
+
Výpočet je _konečný_, pokud se stav sítě dále nemění po konečném množství opakování postupu výše.

Konfigurace::
Vektor hodnot všech vah.

Vahový prostor::
Množina všech konfigurací.

Iniciální konfigurace::
Počáteční hodnoty vah (než začne trénování).


== Multilayer perceptron (MLP) / vícevrstvé neuronové sítě

Perceptron -- jeden neuron::
+
--

* Hrubá matematická aproximace biologického neuronu.
* Binární klasifikátor -- rozlišuje jestli vstup patří nebo nepatří do nějaké jedné kategorie.<<pv021>>
* Linerání klasifikátor -- jeho funkce kombinuje vstupy lineárně.

image::./img/szp06_perceptron.png[width=400]

* stem:[x_i] -- inputy
* stem:[w_i] -- váhy
* stem:[\xi = w_0 + \sum_{i=1}^n w_i x_i] -- vnitřní potenciál
* stem:[y] -- výstup
* stem:[y = \sigma(\xi)] -- aktivační funkce udávající výstup
* bias -- udává "jak těžké" je pro neuron se aktivovat (čím vyšší číslo, tím těžší je pro neuron vydat nenulový výstup)
* stem:[x_0] -- pro snažší implementaci se závádí dodatečný vstup, který má vždy hodnotu 1 a váhu rovnu -bias

NOTE: Vnitřní potenciál funguje jako nadrovina (čára při 2D, rovina při 3D, nepředstavitelný mostrum ve vyšších dimenzí), která rozděluje prostor vstupů na část, kde je stem:[\xi < 0] a kde stem:[\xi > 0].

--

Multilayer perceptron (MLP)::
+
--

MLP je feed-forward (neobsahuje cykly) architektura NN, kde platí:

* Neurony rozděleny do vrstev -- jedné vstupní, jedné výstupní a libovolného počtu skrytých vrstev uprostřed.
* Vrstvy jsou _dense_ -- každý neuron v stem:[i]-té vrstvě je napojen na každý neuron v stem:[(i + 1)]-ní vrstvě.

image::./img/szp06_mlp.png[width=400]

Kde:

* stem:[\textcolor{green}{X}] -- množina input neuronů
* stem:[\textcolor{red}{Y}] -- množina output neuronů
* stem:[Z] -- množina všech neuronů
* Neurony mají indexy stem:[i], stem:[j], ...
* stem:[\xi_j] -- vnitřní potenciál neuronu stem:[j] po skončení výpočtu
* stem:[y_j] -- výstup neuronu stem:[j] po skončení výpočtu
* stem:[x_0 = 1] -- hodnota formálního jednotkového vstupu (kvůli biasům)
* stem:[w_{j,i}] -- váha spojení *z* neuronu stem:[i] *do* neuronu stem:[j] (dst <- src)
* stem:[w_{j,0} = -b_j] -- bias -- váha z formální jednotky do neuronu stem:[j]
* stem:[j_{\leftarrow}] -- množina neuronů stem:[i], jenž mají spojení *do* stem:[j] (j <- i)
* stem:[j^{\rightarrow}] -- množina neuronů stem:[i], do nichž vede spojení *z* stem:[j] (j -> i)

--

=== Aktivita

Pravidlo pro výběr neuronů při výpočtu::
V i-tému kroku vezmi i-tou vrstvu.

Vnitřní potenciál neuronu stem:[j]::
stem:[\xi_j = \sum_{i \in j_{\leftarrow}} w_{ji}y_i]

Aktivační funkce neuronu stem:[j]::
stem:[\sigma_j : \Reals \to \Reals] (třeba logistic sigmoid)

Stav nevstupního neuronu stem:[j]::
stem:[y_j = \sigma_j(\xi_j)] resp. stem:[y_j(\vec{w}, \vec{x})]

Logistic sigmoid::
Většina aktivačních funkcí vychází s funkce _sigmoid_. (Jsou _sigmoidní_, vypadají trochu jako písmeno `S`). Přidávají do výpočtu nelinearitu, která je potřeba, aby NN mohla modelovat libovolné funkce. Zároveň je podobná klasickému thresholdu, ale je "vyhlazená".
+
[stem]
++++
\sigma(\xi) = \frac{1}{1 + e^{-\lambda \cdot \xi}}
++++
+
kde stem:[\lambda] je _steepness_ parametr, který určuje, jak rychle sigmoid roste.
+
image::./img/szp06_sigmoid.png[width=400]

=== Trénink

IMPORTANT: Pro likelihood viz otázka link:../statistika/[Statistika].

Neuronka je model, kde váhy neuronů jsou parametry. Při učení neuronek je naším cílem maximalizovat likelihood, jakožto míru toho, že naše síť sedí na "naměřená data", training set stem:[\cal T]. Tomuhle přístupu se říká _maximum likelihood principle_.

Training set stem:[\cal T]::
je množina stem:[p] samplů, kde stem:[\vec{x} \in \Reals^{|X|}] jsou vstupní vektory a stem:[\vec{d} \in \Reals^{|Y|}] jejich očekáváné výstupy.
+
[stem]
++++
\mathcal{T} = \{(\vec{x}_1, \vec{d}_1), (\vec{x}_2, \vec{d}_2), ..., (\vec{x}_p, \vec{d}_p)\}
++++

Ztrátové funkce / loss function / error function::
Popisuje způsob, jakým je při tréninku výstup z NN porovnán s očekáváným výstupem.
+
Její volba závisí na tom, co NN modeluje. Např. volíme:
+
--
* _mean squared error_ (MSE) -- pro regresi,
+
[stem]
++++
\begin{aligned}

E_k(\vec{w}) &= \frac{1}{2} \sum_{j \in Y}
    \left(
        y_j(\vec{w}, \vec{x_k}) - d_{kj}
    \right)^2 \\

E(\vec{w}) &= \textcolor{red}{\frac{1}{p}} \sum_{k=1}^p E_k(\vec{w})

\end{aligned}
++++

* _(categorical) cross-entropy_ -- pro (multi-class) klasifikaci.
+
[stem]
++++
\begin{aligned}

E(\vec{w}) = -\frac{1}{p} \sum_{k=1}^p \sum_{j \in Y} d_{kj} \ln(y_j)

\end{aligned}
++++
--

Gradient descent::
Algoritmus počítající, jak se mají vahy neuronů upravit, aby se zmenšila ztráta. Vychází z gradientu ztrátové funkce.
+
[stem]
++++
\Delta \vec{w}^{(t)} = - \varepsilon(t) \cdot \nabla E (\vec{w}^{(t)})
++++

Stochastic Gradient Descent (SGD)::
Sample nebereš po jednom ale po malých randomizovaných várkách -- minibatchích stem:[T], a váhy upravuješ až po zpracování minibatche.
+
[stem]
++++
\Delta \vec{w}^{(t)} = - \varepsilon(t) \cdot \sum_{k \in T} \nabla E_k(\vec{w}^{(t)})
++++

Backpropagation / zpětná propagace::
Technika, kdy se v průběhu _gradient descent_ ztráta způsobená konkrétním neuronem dedukuje na zákládě jeho příspěvku k výsledku. Algoritmus tak postupuje od output vrstvy směrem k input vrstvě.

Learning rate stem:[\varepsilon]::
Hyperparametr stem:[0 < \varepsilon \le 1] ovlivňující rychlost učení. Může záviset na iteraci stem:[t], pak je to funkce stem:[\varepsilon(t)].

.Gradient descent v MLP
====

[stem]
++++
\begin{aligned}

w_{ji}^{(t+1)}
&= w_{ji}^{(t)} + \Delta w_{ji}^{(t)} \\

\Delta w_{ji}^{(t)}
&= -\varepsilon(t) \cdot \textcolor{green}{\frac{\partial E}{\partial w_{ji}}(\vec{w}^{(t)})} \\

\textcolor{green}{\frac{\partial E}{\partial w_{ji}}}
&= \sum_{k=1}^{p} \textcolor{blue}{\frac{\partial E_k}{\partial w_{ji}}} \\

\textcolor{blue}{\frac{\partial E_k}{\partial w_{ji}}}
&= \textcolor{red}{\frac{\partial E_k}{\partial y_j}}
    \cdot \textcolor{purple}{\frac{\partial y_j}{\partial \xi_j}}
    \cdot \textcolor{teal}{\frac{\partial \xi_j}{\partial w_{ji}}} \\
&= \textcolor{red}{\frac{\partial E_k}{\partial y_j}}
    \cdot \textcolor{purple}{\sigma'_j(\xi_j)}
    \cdot \textcolor{teal}{y_i}
\end{aligned}
++++

Za předpokladu, že stem:[E] je squared error, pak:

WARNING: V případě, že stem:[E] není squared error, následující výpočet neplatí.

[stem]
++++
\large
\textcolor{red}{\frac{\partial E_k}{\partial y_j}} =
\begin{cases}
    y_j - d_{kj} & \text{ pokud } j \in Y ; \\
    \sum_{r \in j^{\rightarrow}} \textcolor{brown}{\frac{\partial E_k}{\partial y_r}}
        \cdot \textcolor{dodgerblue}{\frac{\partial y_r}{\partial \xi_r}}
        \cdot \textcolor{forestgreen}{\frac{\partial \xi_r}{\partial y_j}}
    = \sum_{r \in j^{\rightarrow}} \textcolor{brown}{\frac{\partial E_k}{\partial y_r}}
        \cdot \textcolor{dodgerblue}{\sigma'_r(\xi_r)}
        \cdot \textcolor{forestgreen}{w_{rj}}
    & \text{ jinak}.
\end{cases}
++++

.Algoritmus pro výpočet stem:[\frac{\partial E}{\partial w_{ji}}]
1. Inicializuj stem:[\varepsilon_{ji} := 0].
2. forward pass -- vyhodnoť NN pro sample stem:[k] (t.j. stem:[y_j(\vec{w}, \vec{x_k})] pro všechny stem:[j \in Z])
3. backward pass -- od konce pro každou vrstvu spočítej stem:[\frac{\partial E_k}{\partial y_j}]
  a. pokud stem:[j \in Y], pak stem:[\frac{\partial E_k}{\partial y_j} = y_j - d_{kj}]
  b. pokud stem:[j \in Z \setminus Y \cup X ], a stem:[j] je v stem:[l]-té vrstvě, pak
     stem:[\frac{\partial E_k}{\partial y_j} = \sum_{r \in j^{\rightarrow}} \frac{\partial E_k}{\partial y_r} \cdot \sigma'_r(\xi_r) \cdot w_{rj}]
4. weight update -- pro všechna stem:[w_{ji}] spočítej
   stem:[\frac{\partial E_k}{\partial w_{ji}} := \frac{\partial E_k}{\partial y_j} \cdot \sigma'_j(\xi_j) \cdot y_i]
5. stem:[\varepsilon_{ji} := \varepsilon_{ji} + \frac{\partial E_k}{\partial w_{ji}}]
6. stem:[\varepsilon_{ji}] obsahuje výslednou hodnotu stem:[\frac{\partial E}{\partial w_{ji}}]

====

////

== Hopfieldova síť

Rekurentní neuronová síť s modelem "asociativní" paměti, která modeluje tu lidskou. Je to forma strojového učení bez učitele. <<hopfield>> "Asociativní" znamená, že proces vybavení si informace probíhá na základě její částečné znalosti spíš než hledání v paměti podle adresy.

.A Hopfield net with four units by link:https://commons.wikimedia.org/w/index.php?curid=37811881[Zawersh]
image::./img/szp06_hopfield.svg[width=300]

--
* Neurony jsou spojeny symetricky každý s každým.
* Neurony mají binární hodnoty (typicky -1 a 1) podle toho jestli je jejich input vyšší než threshold.
* V základním modelu nejsou biasy a neurony nejsou spojeny samy se sebou.
* Na rozdíl od vícevrstvých sítí, Hopfieldova síť neodpovídá okamžitě. Potřebuje čas k ústalení do stabilního stavu.
* Existují rozšíření, která mají reálné místo binárních hodnot, nebo si místo jednotlivých stavů pamatují celé sekvence stavů.
--

Vyhodnocení / evaluation::
+
--

1. Nastav stav neuronů na hodnoty podle vstupního vzoru.
2. Aktualizuj hodnoty neuronů tak dlouho, dokud se neustálí (neustanou změny).
+
[stem]
++++
s_i \gets \begin{cases}
    +1 & \text{ pokud } \sum_j w_{ij} s_j > \theta_i \\
    -1 & \text{ jinak }
\end{cases}
++++
+
kde:
+
* stem:[s_i] je stav neuronu stem:[i],
* stem:[w_{ij}] je váha spojení mezi neurony stem:[i] a stem:[j],
* stem:[\theta_i] je theshold neuronu stem:[j].

3. Výstup je stav neuronů.

TIP: Aktualizace mohou probíhat buď asynchronně -- jen jeden neuron je aktualizován najednou -- nebo synchronně -- všechny neurony jsou aktualizovány najednou.

--

Energie::
+
--
Skalární hodnota popisující *globální* stav sítě.

[stem]
++++
E = -\frac{1}{2} \sum_{i,j} w_{ij} s_i s_j + \sum_i \theta_i s_i
++++

Opakovanou aktualizací síť dokonverguje do lokálního minima -- stabilního stavu -- který reprezentuje naučenou informaci.

.Energy Landscape of a Hopfield Network by link:https://commons.wikimedia.org/w/index.php?curid=23796681[Mrazvan22]
image::./img/szp06_hopfield_energy.png[width=100%]

--

Učení / training::
+
--
Je založeno na Hebbově zákoně asociace, který zjednodušeně říká, že _"Cells that fire together, wire together."_ Nicméně, nestačí, že jsou aktivovány společně, aktivace jedné buňky musí mít přímý vliv na aktivaci druhé buňky.

Učení spočívá ve snižování energie síťe na základě vstupu, na kterém se síť učí.

Předpokládejme, že se síť učí stem:[n] binárních vzorů. Nechť stem:[\mu] je jeden z nich a stem:[\epsilon_i^\mu] je jeho stem:[i]-tý bit (dosadí se do neuronu stem:[i]). Pak váhy jsou po zpracování všech stem:[n] vzorů nastaveny na: <<hopfield>>

[stem]
++++
w_{ij} = \frac{1}{n} \sum_{\mu=1}^n \epsilon_i^\mu \epsilon_j^\mu
++++
--

////

== Konvoluční sítě

Neuronové sítě uzpůsobené ke zpracování obrazu. Místo násobení matic používají alespoň v jedné vrstvě konvoluci. Konvoluční sítě mají dva nové typy vrstev: _konvoluční_ a _pooling_, ale jinak se od klasických MLP moc neliší. Aktivace a trénink zůstavají v podstatě stejné. <<cnn>>

IMPORTANT: Pro konvoluci viz otázka link:../zpracovani-rastroveho-obrazu/[Zpracování rastrového obrazu].

.Typical CNN by link:https://commons.wikimedia.org/w/index.php?curid=45679374[Aphex34]
image::./img/szp06_cnn.png[width=100%]

Konvoluční vrstva::
* Každý neuron je napojen jen na malý _receptive field_ neuronů o vrstvu níže, který se posouvá o daný stride.
* Výstup z neuronu v konvoluční vrstvě je dán konvolucí jeho receptive field s váhami a přičtením biasu.
* Všechny neurony v konvoluční vrstvě sdílí stejné váhy a biasy dané velikostí receptive field, což jim umožňuje naučit se nějaký vzor o velikosti receptive field -- říkáme, že taková vrstva je feature mapa.
* Vzorů se chceme zpravidla naučit více, máme vícero vzájemně nezávislých feature map napojených na stejnou vstupní vrstvu.

Pooling vrstva::
Nemají váhy. Slouží ke snížení počtu parametrů. Každý neuron počítá nějakou jednoduchou funkci na svém _receptive field_:
* _max-pooling_: maximum,
* _L2-pooling_: square root of sum of squares,
* _average-pooling_: mean.

Backpropagation::
+
--
Algoritmus je potřeba trochu poupravit, aby podporovat konvoluční a pooling vrstvy.

U konvolučních vrstev nestačí pro každou váhu stem:[w_{ji}] spočítat stem:[\frac{\partial E_k}{\partial w_{ji}}], protože pro každou váhu existuje víc než jeden výstup stem:[y_j]. Tedy:

[stem]
++++
\frac{\partial E_k}{\partial w_{ji}} = \sum_{rl \in \textcolor{red}{\bf \lbrack ji \rbrack}} \frac{\partial E_k}{\partial y_r}
    \cdot \sigma'_r(\xi_r)
    \cdot y_l
++++

kde stem:[\color{red}\bf \lbrack ji \rbrack] je množina spojení (dvojic neuronů) sdílících váhu stem:[w_{ji}].

Pokud stem:[j \in Z \setminus Y] a stem:[j^{\rightarrow}] je max-pooling, pak stem:[j^{\rightarrow} = \{ i \}] a platí:

[stem]
++++
\frac{\partial E_k}{\partial y_j}
= \begin{cases}
    \frac{\partial E_k}{\partial y_i} & \text{pokud } j = \argmax_{r \in i_{\leftarrow}} y_r \\
    0 & \text{jinak}
\end{cases}
++++
--


== Rekurentní sítě

Neuronové sítě, jejichž architektura obsahuje cykly. Tedy výstup v jednom bodě v čase sítě přispívá k výstup v budoucnosti. Jinými slovy, je to neuronka s pamětí. _Recurrent neural networks_ (RNN) konkrétně jsou MLP _minimálně_ rozšířené tak, aby měly paměť. <<rnn>>

[IMPORTANT]
--
Výhody::
* Umí zpracovat vstupy s variabilní, předem neznámou délkou.
* Velikost modelu (množiny vah) je fixní nezávisle na velikosti vstupu.
* Váhy se sdílí mezi vstupy (např. slova ve větě), což umožňuje naučit se nějaký kontext.
--

[WARNING]
--
Nevýhody::
* Trénování je složitější, protože se vyskytuje zpětná vazba.
* Výpočetně náročnější.
* Gradient může explodovat (exploding) nebo zaniknout (diminishing).
--

image::./img/szp06_rnn.png[width=100%]

Notace::
V čase stem:[t]:
+
* stem:[\vec{x_t} = (x_{t, 1}, x_{t, 2}, ..., x_{t, M})] je vstupní vektor předávaný stem:[M] vstupním neuronům,
* stem:[\vec{h_t} = (h_{t, 1}, h_{t, 2}, ..., h_{t, H})] je vektor hodnot stem:[H] skrytých neuronů,
* stem:[\vec{y_t} = (y_{t, 1}, y_{t, 2}, ..., y_{y, N})] je výstupní vektor stem:[N] neuronů,
* stem:[U_{j, i}] je váha mezi inputem stem:[i] a hiddenem stem:[j],
* stem:[W_{j', i'}] je váha mezi hiddenem stem:[i'] a hiddenem stem:[j'],
* stem:[V_{j'', i''}] je váha mezi hiddenem stem:[i''] a outputem stem:[j''].

Aktivita::
* Na počátku je výstup neuronky vynulován. Paměť je tedy prázdná.
* RNN zpracovává sekvenci vstupů stem:[\mathbb{x} = \vec{x_1}, \vec{x_2}, ..., \vec{x_T}] délky stem:[T].
* Pro každý prvek stem:[\vec{x_t} \in \mathbb{x}], síť vyprodukuje výstup z hidden neuronů:
+
[stem]
++++
\vec{h_t} = \sigma(U \cdot \vec{x}_t + W \cdot \vec{h}_{t-1})
++++
* Pro výstup pak:
+
[stem]
++++
\vec{y_t} = \sigma(V \cdot \vec{h}_t)
++++

Trénink::
+
--
Trénovací set je množina dvojic -- (vstupní *sekvence*, výstupní *sekvence*).

[stem]
++++
\mathcal{T} = \{ (\bold{x}_1, \bold{d}_1), ..., (\bold{x}_p, \bold{d}_p) \}
++++

NOTE: Ano, to znamená, že stem:[x_{lt1}] je první prvek stem:[t]-ho prvku v stem:[l]-té vstupní sekvenci.

Squared error samplu stem:[(\bold{x}, \bold{d})]:

[stem]
++++
E_{(\bold{x}, \bold{d})} = \sum_{t=1}^T \sum_{k=1}^N \frac{1}{2} (y_{tk} - d_{tk})^2
++++

Gradient descent je podobný. Na začátku jsou všechny váhy inicalizovány poblíž 0 a pak iterativně přepočítávány:

[stem]
++++
\begin{aligned}

U_{kk'}^{(l+1)} &= U_{kk'}^{(l)} - \varepsilon(l) \cdot \frac{\partial E_{(x, d)}}{\partial U_{kk'}} \\
V_{kk'}^{(l+1)} &= V_{kk'}^{(l)} - \varepsilon(l) \cdot \frac{\partial E_{(x, d)}}{\partial V_{kk'}} \\
W_{kk'}^{(l+1)} &= W_{kk'}^{(l)} - \varepsilon(l) \cdot \frac{\partial E_{(x, d)}}{\partial W_{kk'}} \\

\frac{\partial E_{(x, d)}}{\partial U_{kk'}} &= \sum_{t=1}^T
    \textcolor{brown}{\frac{\partial E_{(x, d)}}{\partial h_{tk}}}
    \cdot \sigma'
    \cdot x_{tk'} \\
\frac{\partial E_{(x, d)}}{\partial V_{kk'}} &= \sum_{t=1}^T
    \textcolor{darkgreen}{\frac{\partial E_{(x, d)}}{\partial y_{tk}}}
    \cdot \sigma'
    \cdot h_{tk'} \\
\frac{\partial E_{(x, d)}}{\partial W_{kk'}} &= \sum_{t=1}^T
    \textcolor{brown}{\frac{\partial E_{(x, d)}}{\partial h_{tk}}}
    \cdot \sigma'
    \cdot h_{(t-1)k'} \\

\end{aligned}
++++

Za předpokladu squared error je backpropagation:

[stem]
++++
\begin{aligned}
\textcolor{darkgreen}{\frac{\partial E_{(x, d)}}{\partial y_{tk}}}
&= y_{tk} - d_{tk} \\

\textcolor{brown}{\frac{\partial E_{(x, d)}}{\partial h_{tk}}}
&= \sum_{k'=1}^N
    \textcolor{darkgreen}{\frac{\partial E_{(x, d)}}{\partial y_{tk'}}}
    \cdot \sigma'
    \cdot V_{k'k}
+
    \sum_{k'=1}^H 
    \textcolor{brown}{\frac{\partial E_{(x, d)}}{\partial h_{(t+1)k'}}}
    \cdot \textcolor{red}{\sigma'
    \cdot W_{k'k}}
\end{aligned}
++++

TIP: Pokud stem:[\textcolor{red}{\sigma' \cdot W_{k'k}} \not\approx 1], pak gradient buď vybouchne nebo se ztratí.

Long Short-Term Memory (LSTM)::
LSTM řeší problém s vanishing a exploding gradientem, kterým RNN. V RNN je stem:[\sigma] typicky stem:[\tanh]. V LSTM obsahuje jeden hidden neuron vlastně čtyři "podvrstvy", které mimo jiné umožňují část paměti zapomenout:
+
image::./img/szp06_lstm.png[width=100%]

--

////

== Samo-organizující mapy / self-organizing maps (SOM) / Kohonenova síť

Metoda unsupervised learningu určená primárně k vizualizaci vysoce dimenzionálních dat. Využívá se například pro shlukovou analýzu.

.Kohonen Network - Background Information <<som-sdl>>
image::./img/szp06_som.gif[width=400]

--
* Má dvě vrstvy: jednu vrstvu vstupních neuronů a jednu vrstvu Kohenenových neuronů, kterou jsou výstupem sítě.
* Kohenenovy neurony nejsou spojeny densely, ale v 2D (čtvercové nebo hexagonální) mřížce.
* Každý vstupní neuron je spojen s každým Kohenenovým neuronem.
* Každý Kohenenův neuron má kladnou vazbu sám na sebe (posiluje se) a zápornou na okolní neurony (oslabuje je).
* Tak, pokud více neuronů reaguje na stejný podnět, je poznat, který z nich byl nejsilnější.
* Nemá fázi učení, ale pouze fázi vyhodnocení. Učí se za chodu. Snaží se charakterizovat shluky dat ve vstupu.
--

Algoritmus::
Běh SOM vypadá takto: <<som-tutorial>>
+
--
1. Inicializuj váhy náhodně.
2. Vyber jeden vstupní vzor.
3. Najdi Kohenenův neuron jehož vektor vah je nejvíce podobný (např. Euklidovsky) vstupnímu vzoru -- _Best Matching Unit_ (BMU).
4. Spočítej okolí BMU. Počet sousedů se snižuje s časem.
5. Uprav váhy BMU a jeho okolí aby líp seděly k vstupnímu vzoru.
6. Opakuj 2. až 5. pro další vzor.
--
+
Po skončení learningu obsahují vahy Kohenenových neuronů informaci o shlucích dat ve vstupu.

////


[bibliography]
== Zdroje

* [[[pv021, 1]]] T. Brázdil: PV021 Neural Networks
* [[[ml, 2]]] https://en.wikipedia.org/wiki/Machine_learning[Wikipedia: Machine learning]
* [[[classification, 3]]] link:https://en.wikipedia.org/wiki/Statistical_classification[Wikipedia: Statistical classification]
* [[[regression, 4]]] link:https://en.wikipedia.org/wiki/Regression_analysis[Wikipedia: Regression analysis]
* [[[clustering, 5]]] link:https://en.wikipedia.org/wiki/Cluster_analysis[Wikipedia: Cluster analysis]
* [[[pattern-recognition, 6]]] link:https://en.wikipedia.org/wiki/Pattern_recognition[Wikipedia: Pattern recognition]
* [[[hopfield, 7]]] https://en.wikipedia.org/wiki/Hopfield_network[Wikipedia: Hopfield network]
* [[[hebb, 8]]] https://en.wikipedia.org/wiki/Hebbian_theory[Wikipedia: Hebbian theory]
* [[[cnn, 9]]] https://en.wikipedia.org/wiki/Convolutional_neural_network[Wikipedia: Convolutional neural network]
* [[[rnn, 10]]] https://en.wikipedia.org/wiki/Recurrent_neural_network[Wikipedia: Recurrent neural network]
* [[[som, 11]]] https://en.wikipedia.org/wiki/Self-organizing_map[Wikipedia: Self-organizing map]
* [[[som-tutorial, 12]]] https://sites.pitt.edu/~is2470pb/Spring05/FinalProjects/Group1a/tutorial/som.html[Self-Organizing Maps: Tutorial]
* [[[som-sdl, 13]]] http://www.lohninger.com/helpcsuite/kohonen_network_-_background_information.htm[SDL Component Suite: Kohonen Network]
