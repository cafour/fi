---
title: "Statistika"
description: "TODO"
---

> [!NOTE]
> Diskrétní a spojité náhodné veličiny (NV), základní rozložení. Číselné charakteristiky NV. Centrální limitní věta. Bodové odhady, intervaly spolehlivosti, testování statistických hypotéz, hladina významnosti. Základní parametrické a neparametrické testy, ANOVA, testy nezávislosti NV. Lineární regrese, celkový F-test, dílčí t-testy.
> <br>
> _MV013_


**Opakování**

> [!TIP]
> Viz bakalářské otázky [Kombinatorika a pravděpodobnost](../../szb/kombinatorika-a-pravdepodobnost/) a [Statistika](../../szb/statistika/).

- **Statistika**\
  Zabývá se sbíráním, organizací, analýzou, interpretací a prezentací dat. [statistics](#statistics)

  - _Popisná / decriptive_: shrnuje data, která máme,
  - _Inferenční / inferential_: předpokládá, že data která máme jsou jen součástí celku; pracuje s modely celé populace a hypotézami o ní.

- **Základní prostor $\Omega$**\
  Konečná množina možných jevů. Např $\{1, 2, 3, 4, 5, 6\}$ pro možné hody šestistěnkou.
- **Možný výsledek (elementární náhodný jev) $\omega_k$**\
  Prvek základního prostoru $\Omega$.
- **Náhodný jev (event) $A$**\
  Podmnožina $A \sube \Omega$, která nás zajímá. Např. _"Na šestistěnce padne sudé číslo."_

## Náhodné veličiny

- **Náhodná veličina (NV) / random variable**\
  Něco, co se dá u každého možného výsledku změřit. Zobrazení z prostoru elementárních jevů do měřitelného prostoru $E$ (třeba $\mathbb{R}$).

  $X : \Omega \to \mathbb{E}$

### Diskrétní

Diskrétní NV je náhodná veličina, která nabývá konečně nebo spočetně mnoha hodnot. $\mathbb{E}$ je konečná nebo spočetná, např. $\N$.

Příklad: hodnota na šestistěnce.

Jinými slovy, NV $X : \Omega \to \R$ je _diskrétní_, pokud se prvky $\Omega$ zobrazí do $\R$ jako izolované body $\{x_1, x_2, \ldots\}$.

- **Rozdělení pravděpodobnosti**\
  Funkce $P(X) : \mathbb{E} \to \R$, která každé hodnotě popsané veličinou $X$ přiřazuje pravděpodobnost jejího výskytu.

- Každá $x_i$ má nenulovou pravděpodobnost:

  ```math
  P(x_i) > 0
  ```

- Součet pravděpodobností všech možných hodnot $x_i$ je $1$:

  ```math
  \sum_{x} P(x_i) = 1
  ```

### Spojité

Spojitá NV je náhodná veličina, která nabývá až nespočetně nekonečně mnoha hodnot. Tedy $\mathbb{E}$ je nespočetná, např. $\R$.

Příklad: doba čekání na šalinu, analogový signál, výška člověka (pokud máme fakt dobrej metr).

Jinými slovy, NV $X : \Omega \to \R$ je _spojitá_, pokud se prvky $\Omega$ zobrazí do $\R$ jako interval $\lbrack a, b \rbrack$.

- **Hustota pravděpodobnosti / probability density function (PDF)**\
  Funkce $f(x) : \mathbb{E} \to \R$, která každé hodnotě popsané veličinou $X$ přiřazuje pravděpodobnost jejího výskytu.

- Každý bod tohoto intervalu má **nulovou** pravděpodobnost:

  ```math
  f(x) = 0
  ```

- Nicméně integrál pravděpodobnostní funkce $f(x)$ je $1$:

  ```math
  \int_{-\infty}^{\infty} f(x) dx = 1
  ```

- Pravděpodobnost, že NV nabývá hodnoty z intervalu $\lbrack a, b \rbrack$ je pak:

  ```math
  P(a \leq X \leq b) = \int_{a}^{b} f(x) dx
  ```

### Základní rozložení

- **Distribuční funkce / cumulative distribution function (CDF)**

  Funkce $F(X) : \mathbb{E} \to \R$ udává pravděpodobnost, že NV $X$ nabývá hodnoty menší než $x$.

  ```math
  \begin{align*}

  F(x) &= P(X \leq x) & \text{pro diskrétní NV} \\
  F(x) &= \int_{-\infty}^{x} f(x) dx & \text{pro spojité NV}

  \end{align*}
  ```

  Charakterizuje rozdělení, kterému náhodná veličina $X$ podléhá.

  Pro spojité NV je to plocha pod křivkou pravděpodobnostní funkce. A taky se dá použít k vyjádření pravdepodobnosti:

  ```math
  P(a \leq X \leq b) = F(b) - F(a)
  ```

**Diskrétní rozložení**

| Název                                                                                    |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Definice                                                                                 | Popis                                                                                                                                                                                                                                                      | Příklad                                                                                                     | Bernoulliho / alternativní         |
| $ P(x) = \begin{cases} 1 - p & x \ne 1 \\ p & x = 1 \\ \end{cases} $                     | Náhodný pokus, kde jsou jen dva možné výsledky.                                                                                                                                                                                                            | Hod mincí.                                                                                                  | Binomické                          |
| $ P(x, n, p) = \binom{n}{x} p^x (1-p)^{n-k} $                                            | Sekvence $n$ pokusů. Popisuje pravděpodobnost, že $x$ bude úspěšných.                                                                                                                                                                                      | Hod mincí $n$ krát.                                                                                         | Poissonovo                         |
| $ P(k, \lambda) = \frac{\lambda^k e^{-\lambda}}{k!} $                                    | Pokud se něco děje průměrně $\lambda$-krát za jednotku času, jaká je pravděpodobnost, že se to stane $k$-krát za stejnou jednotku času? Výskyt jednoho jevu nesmí ovlivnit pravděpodobnost následujícího výskytu a také se nemohou stát dva jevy najednou. | Kolik lidí přijde do obchodu za hodinu. _(Za předpokladu, že je pandemie a dovnitř může jen jeden člověk.)_ | Geometrické                        |
| $ P(k, p) = \begin{cases} p (1-p)^k & k = 0, 1, ... \\ 0 & \text{jinak} \\ \end{cases} $ | Když tě zajímá, jaká je šance, že se něco pokazí $k$ krát, než to konečně uspěje.                                                                                                                                                                          | Kolikrát musíš hodit mincí, než padne poprvé hlava.                                                         | (Diskrétní) rovnoměrné / uniformní |

**Spojité rozložení**

| Název                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------- |
| Definice                                                                                                                                                                          | Popis                                                                                                                                                                                                             | Příklad                                   | (Spojité) rovnoměrné / uniformní |
| $ f(x) = \begin{cases} \frac{1}{b-a} & a \le x \le b \\ 0 & x &lt; a \lor x > b \\ \end{cases} $                                                                                  | Všechny jevy v daném intervalu $(a, b)$ (může být otevřený nebo uzavřený) jsou stejně pravděpodobné.                                                                                                              | Bod na kružnici.                          | Exponenciální                    |
| $ f(x, \lambda) = \begin{cases} \lambda e^{-\lambda x} & x \ge 0 \\ 0 & x &lt; 0 \\ \end{cases} $                                                                                 | Čas mezi jevy v Poissonově procesu.                                                                                                                                                                               | Jak dlouho budeš čekat na šalinu.         | Normální / Gaussovo              |
| $ f\_\mathcal{N}(x, \mu, \sigma^2) = \frac{1}{\sigma \sqrt{2 \pi}} e^{ -\frac {\left(x - \mu \right)^2} {2\sigma^2} } $                                                           | Používá se jako default, když nevíš, jakou má proměnná distribuci, kvůli centrální limitní větě. ($\mu$ je mean, $\sigma^2$ je rozptyl).                                                                          | Výška lidí.                               | Standardní normální              |
| $ f(x) = f\_\mathcal{N}(x, 0, 1) = \frac{1}{\sqrt{2 \pi}} e^{-\frac{x^2}{2}} $                                                                                                    | Je fajn, protože má standardní odchylku rovnu jedné, takže člověku stačí si pamatovat, že: _ 68 % je v intervalu $(-1, 1)$, _ 95 % je v intervalu $(-2, 2)$, \* 99,7 % je v intervalu $(-3, 3)$.                  | Výška lidí (ale přeškálovaná).            | Cauchy                           |
| $ f(x) = \frac{1}{ \pi \sigma \left\lbrack 1 + \left( \frac{x - \mu}{\sigma} \right)^2 \right\rbrack } $                                                                          | Poměr dvou spojitých náhodných proměnných s normálním rozdělením. Expected value ani rozptyl na ní nejsou definované.                                                                                             | Poměr výšky k šířce obličeje.             | Gamma                            |
| $ f(x, \alpha, \beta) = \begin{cases} \frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha - 1} e^{-\beta x} & x > 0 \\ 0 & \text{jinak} \\ \end{cases} $                                | Když máš sekvenci jevů, kde čekací doba na každý má exponenciální rozdělení s rate $\beta$, pak čekací doba na $n$-tý jev má Gamma rozdělení s $\alpha = n$.                                                      | Jak dlouho budeš čekat na $n$-tou šalinu. | $\chi^2$ (Chi-square)            |
| $ f(x, n) = \begin{cases} { \Large \frac{ x^{\frac{n}{2} - 1} e^{-\frac{x}{2}} }{ 2^\frac{n}{2} \Gamma\left( \frac{k}{2} \right) } } & x > 0 \\ 0 & \text{jinak} \\ \end{cases} $ | Používá se při testování hypotéz. Nechť $Z_1, Z_2, ..., Z_n$ jsou nezávislé náhodné proměnné se standardním normálním rozdělením a $X = \sum_{i=1}^n Z_i^2$, pak $X$ má $\chi^2$ rozdělení s $n$ stupni volnosti. | Testování, jestli je mince férová.        | Studentovo $t$                   |

### Číselné charakteristiky

Stejně jako náhodné veličiny popisují jevy, číselné charakteristiky popisují chování náhodných veličin... pomocí čísel.

#### Míry polohy

- **Střední hodnota / mean / expected value**\
  Průměr hodnot veličiny vážený jejich pravděpodobností. Značí se $\overline{X}$ nebo $E(X)$.

  > [!NOTE]
  > Taky někdy označovaný jako _obecný moment prvního řádu / první obecný moment_. [moment](#moment)

- **$\alpha$-kvantil $Q_\alpha$**\
  Dělí statický soubor na stejně velké části.
- **Medián**\
  Prostřední prvek uspořádaného statistického souboru. Kvantil $Q_{0.5}$.

  ```math
  \tilde{x} = \begin{cases}
      x_{\frac{n+1}{2}} & \text{pro liché }n\\
      \frac{1}{2} (x_\frac{n}{2} + x_{\frac{n}{2} + 1}) & \text{pro sudé }n
  \end{cases}
  ```

- **Percentil**\
  Výběrový kvantil ($p$-tý kvantil, kde $0 &lt; p &lt; 1$) $Q_p$.
- **Modus**\
  Hodnota s největší četností.

#### Míry variability

Jak moc se od sebe prvky liší (nezávisle na konstantním posunutí)?

- **Rozpyl / variance**\
  Vyjadřuje, jak moc se NV odchyluje od své střední hodnoty. Značí se $\sigma^2$, $\text{var}(X)$ nebo $D(X)$.

  ```math
  \text{var}(X) = E\left((x_i - E(X))^2\right)
  ```

  > [!NOTE]
  > Taky někdy označovaný jako _centrální moment druhého řádu / druhý centrální moment_. [moment](#moment)

- **Směrodatná odchylka / standard deviation**\
  Míra variability NV. Značí se $\sigma$ nebo $\text{SD}(X)$. Je definovaná jako $\sqrt{\sigma^2}$.
- **ovariance veličin $X$ a $Y$**\
  Měří určitou podobnost mezi $X$ a $Y$.

  ```math
  \text{cov}(X, Y) = E((X - E(X)) \cdot (Y - E(Y)))
  ```

  Ze vzorce výše plyne

  ```math
  \begin{aligned}
      \text{cov}(X, X) &= \text{var}(X) \\
      \text{cov}(X, Y) &= \text{cov}(Y, X) \\
      \text{cov}(X, Y) &= E(X \cdot Y) - E(X) \cdot E(Y)
  \end{aligned}
  ```

- **Korelace**\
  Míra podobnosti $\rho_{X, Y}$ náhodných veličin $X$ a $Y$. Pokud $X = X$, pak $\rho_{X, X} = 1$. Pokud jsou $X$ a $Y$ nezávislé, pak $\rho_{X, Y} = 0$.

  ```math
  \rho_{X, Y} = \frac{\text{cov}(X, Y)}{\sqrt{\text{var}(X)} \cdot \sqrt{\text{var}(Y)}}
  = \frac{E((X - E(X)) \cdot (Y - E(Y)))}{\sqrt{\text{var}(X)} \cdot \sqrt{\text{var}(Y)}}
  ```

#### Míry tvaru

- **Koeficient šikmosti / skewness**\
  Vztah polohy meanu vůči mediánu. Vyjadřuje symetrii dat.
- **Koeficient špičatosti / kurtosis**\
  Jak vysoký je peak? Jak moc je to rozpláclé.

## Centrální limitní věta (CLV) / Central limit theorem (CLT)

S rostoucím počtem sample výsledků $X_i$ se jejich distribuce blíží normálnímu rozdělení bez ohledu na jejich původní rozdělení.

Popisuje chování _výběrového průměru_ pro velké soubory vzorků a umožňuje tak sestrojení intervalových odhadů.

- **Moivreova-Laplacova věta**

  Mějme NV $X$. Pokud je $X$ součtem $n$ vzájemně nezávislých NV $X_1, X_2, ..., X_n$ s Bernoulliho rozdělením s parametrem $\pi$, má $X$ binomické rozdělení s parametry $n$ a $\pi$, pak s $n \to \infty$:

  ```math
  \frac{X - n \pi}{\sqrt{n \pi (1 - \pi)}} \approx N(0, 1)
  ```

- **Lévyho-Lindenbergova věta**

  > [!TIP]
  > Zobecnění Moivreovy-Laplacovy věty.

  Mějme NV $X$. Pokud je $X$ součtem $n$ vzájemně nezávislých NV $X_1, X_2, ..., X_n$ se shodným rozdělením libovolného typu, s konečnou střední hodnotou $E(X_i) = \mu$ a konečným rozptylem $D(X_i) = \sigma^2$, pak pro normovanou NV $U$ asymptoticky s $n \to \infty$ platí:

  ```math
  \begin{aligned}

  \overline{X} = \frac{1}{n} \sum_{i=1}^n X_i &\approx N \left( \mu, \frac{\sigma^2}{n} \right) \\

  \sqrt{n} \frac{\overline{X} - \mu}{\sqrt{\sigma^2}} &\approx N(0, 1) \\

  \frac{\sum_{i=1}^n X_i - n \mu}{\sqrt{n \sigma^2}} &\approx N(0, 1)

  \end{aligned}
  ```

  **Výpočet s CLV**

  Nechť $X$ je náhodná proměnná popisují jak padá 6, když hodíme kostkou 100krát. Tedy:

  ```math
  X \approx \text{Binomial} \left( 100, \frac{1}{6} \right)
  ```

  Podle CLV má $X$ asymptoticky $X \approx N(\frac{100}{6},\frac{500}{36})$.

  Pak například pravděpodobnost, že šestka padne méně než 16krát je:

  ```math
  \begin{aligned}

  P(X < 16) &\doteq P(X \leq 16) = 0.429 \\
  P(X < 16) = P(X \leq 15) &\doteq F(X \leq 15) = 0.327 \\

  \end{aligned}
  ```

  S _continuity correction_ (opravou v důsledku změny z diskrétní na spojitou NV) je to:

  ```math
  P(X < 16) = P(X \leq 15.5) \doteq F(15.5) = 0.377
  ```

## Odhady

- **Odhad parametru / parameter estimation**\
  Když se snažíš vymyslet, jaké asi hodnoty mají parametery té které distribuce mít, aby co nejlíp pasovala na tvoje samply.

  Cílem odhadu je určit parametry rozdělení NV $X$ na základě informace z výběrového souboru (realizaci NV, datasetu). Chceme hodnotu a přesnost odhadu.

- **Metoda odhadu / estimator**\
  Popisuje, jak odhad získat.
- **Nestranný odhad / unbiased estimator**\
  Metoda odhadu parametru $\theta$ taková, že střední hodnota odhadu je rovna $\theta$. Nestrannost je celkem rozumné omezení, protože nechceme, aby byl odhad odchýlený.
- **Nejlepší nestranný odhad / best unbiased estimator**\
  Nestranný odhad, který má nejmenší rozptyl ze všech nestranných odhadů.
- **Konzistentní odhad / consistent estimator**\
  Metoda odhadu parametru $\theta$ taková, že s počtem vzorků $n$ konverguje k $\theta$ pro $n \to \infty$. [consistent-estimator](#consistent-estimator)
- **(Výběrová) statistika / (sample) statistic**\
  Náhodná veličina dána funkcí, která bere výběrový soubor a vrací číslo. Máme například:

  - _Výběrový průměr / sample mean_,
  - _Výběrový rozptyl / sample variance_,
  - _Výběrovou směrodatnou odchylku / sample standard deviation_,
  - _Výběrovou (empirickou) distribuční funkci / sample distribution function_.

  > Náhodná veličina $T_n$, která vznikne aplikací funkce $T$ na náhodný výběr o velikosti $n$ $\mathbf{X} = (X_1, X_2, \ldots, X_n)$ se nazývá statistika.
  >
  > ```math
  > T_n = T(X_1, X_2, \ldots, X_n)
  > ```

  > [!TIP]
  > _Estimator_ je funkce počítající statistiku použitá k odhadu parametru. [statistic](#statistic)

- **Bodový odhad / point estimate / pointwise estimate**\
  Odhad parametru daný **jednou hodnotou**, která hodnotu parametru aproximuje.
- **Intervalový odhad / interval estimate**\
  Odhad parametru daný pomocí **intervalu hodnot**, který hodnotu parametru s velkou pravděpodobností obsahuje. Délka intervalu vypovídá o přesnosti odhadu.
- **Interval spolehlivosti / confidence interval**\
  Interval spolehlivosti parametru $\theta$ s hladinou spolehlivosti $1 - \alpha$, kde $\alpha \in \lbrack 0, 1 \rbrack$ je dvojice statistik $\lbrack \theta_L, \theta_U \rbrack$ taková, že:

  ```math
  P(\theta_L < \theta < \theta_U) = 1 - \alpha
  ```

  kde $\theta_L$ je **dolní mez intervalu** a $\theta_U$ je **horní mez intervalu**.

- **Hladina významnosti a spolehlivosti / significance and confidence level**
  - Hladina významnosti $\alpha$ je pravděpodobnost, že parametr **nespadá** do intervalového odhadu.
  - Hladina spolehlivosti $1 - \alpha$ je pravděpodobnost, že parametr **spadá** do intervalového odhadu.
- **Levostranný, pravostranný a oboustranný interval / left-tailed, right-tailed and two-tailed interval**
  - _Levostranný (dolní)_: $P(\theta \le \theta_L) = 1 - \alpha$.
  - _Pravostranný (horní)_: $P(\theta \ge \theta_U) = 1 - \alpha$.
  - _Oboustranný_: $P(\theta \le \theta_L) = P(\theta \ge \theta_U) = \frac{\alpha}{2}$.

**Tvorba intervalového odhadu**

Máme vzorek velikosti $n$ s výběrovým průměrem $\overline{X}$ a výběrovým rozptylem $S^2$. Odhadněte střední hodnotu $\mu$ s hladinou spolehlivosti 0.95, pokud víte, že $X \approx N(\mu, \sigma^2)$, kde rozptyl $\sigma^2$ je neznámý.

1. Zvolíme vhodnou výběrovou statistiku $T(X)$ jejíž rozdělení závislé na $\mu$ známe. V tomhle případě Studentův t-test:

   ```math
   T(X) = \frac{\overline{X} - \mu}{S / \sqrt{n}} \sim t_{n - 1}
   ```

   Tedy víme, že $T(X) \sim t(n-1)$

2. Určíme kvantily $t_\frac{\alpha}{2} = t_{0.025}$ a $t_{1 - \frac{\alpha}{2}} = t_{0.975}$ z $T(X)$:

   ```math
   \begin{aligned}

   P(t_{0.025}(n - 1) < T(X) < t_{0.975}(n-1)) &= 1 - \alpha = 0.95 \\

   t_{0.025}(n - 1) &= -t_{0.975}(n - 1) \\

   P(t_{0.025}(n - 1) < T(X) < -t_{0.025}(n-1)) &= 0.95 \\

   P(\overline{X} - t_{0.025}(n - 1) \frac{S}{\sqrt{n}} < \textcolor{red}{\mu} < \overline{X} + t_{0.025}(n - 1) \frac{S}{\sqrt{n}}) &= 0.95

   \end{aligned}
   ```

3. Vyčíslíme interval z poslední rovnice.

- **Věrohodnost / likelihood**

  Říká, jak dobře náš model (rozdělení pravděpodobnosti náhodné veličiny dané parametry) sedí na naměřená data.

  > [!NOTE]
  > Pravděpodobnost je funkce jevů. Likelihood je funkce parametrů modelu.

  > [!NOTE]
  > Likelihood nemusí nutně vracet čísla z intervalu $\lbrack 0, 1 \rbrack$.

- **Maximum likelihood estimation (MLE)**\
  Metoda odhadu parametru založená na maximalizaci likelihoodu, že model sedí na naměřená data. [mle](#mle)
- **Method of moments (MOM)**\
  Metoda odhadu parametru založená na rovnosti teoretického a výběrového momentu. [mom](#mom)

## Testování statistických hypotéz

- **Hypotéza**\
  Nějaký předpoklad o datech, který chceme ověřit. Často je formulovaná pomocí parametrů modelu. Např. _"střední hodnota je 5."_
- **Testování hypotézy**\
  Cílem testování hypotéz je ověřit, že data **nepopírají** nějakou hypotézu.

  - _Null hypothesis $H_0$_: "výchozí nastavení"; často tvrdí, že nějaká vlastnost neexistuje.
  - _Alternative hypothesis $H_1$_: "to co, chceme dokázat"; opak $H_0$.

  Alternativní hypotézu _potvrzujeme_ tak, že _vyvracíme_ nulovou hypotézu. Pokud se nám nepodaří vyvrátit $H_0$, pak o $H_1$ nevíme nic. [null](#null)

  > Na testování použijeme statistiku $T_n = T(\mathbf{X})$, kterou nazýváme **testovací statistikou**. Množinu hodnot, které může testovací statistika nabýt, rozdělíme na dvě disjunktní oblasti. Jednu označíme $W_\alpha$, a nazveme ji **kritickou oblastí** (nebo také _oblastí zamítnutí hypotézy_ (**region of rejection**, **critical region**)) a druhá je doplňkovou oblastí (oblast _nezamítnutí testované hypotézy_).
  >
  > Na základě realizace náhodného výběru $\mathbf{x} = (x_1, ..., x_n)'$ vypočítáme hodnotu testovací statistiky $t_n = T(\mathbf{x})$.
  >
  > - Pokud hodnota testovací statistiky $t_n$ nabude hodnoty z kritické oblasti, t.j. $t_n = T(\mathbf{x}) \in W_\alpha$, pak **nulovou hypotézu zamítáme**.
  > - Pokud hodnota testovací statistiky $t_n$ nabude hodnoty z oblasti nezamítnutí, t.j. $t_n = T(\mathbf{x}) \not\in W_\alpha$, pak **nulovou hypotézu nezamítáme**.
  >
  > — MV013

**Metafora se soudem**

Platí presumpce nevinny. Předpokládáme, že člověk zločin nespáchal, dokud tuhle hypotézu nevyvrátíme.

- _$H_0$_: "Obžalovaný **neukradl** papamobil."
- _$H_1$_: "Obžalovaný **ukradl** papamobil."

- **Chyby v testování hypotéz**

  - _Typ I_: zamítnutí $H_0$, i když je pravdivá -- _false positive_.
  - _Typ II_: nezamítnutí $H_0$, i když je nepravdivá -- _false negative_.

    > [!NOTE]
    > _Positive_ = zamítnutí $H_0$, tedy potvrzení $H_1$.
    > <br>
    > _Negative_ = nezamítnutí $H_0$, tedy o $H_1$ nevíme nic.
    

- **$p$-hodnota (hladina významnosti)**\
  Nejmenší hladina významnosti $\alpha$, při které ještě zamítáme $H_0$. [p-value](#p-value)

  Pravděpodobnost, že došlo k chybě typu I -- zavrhnuli jsme $H_0$, ačkoli platí.

  stem:[
  p = P(\text{type I error}) = P(\text{we reject } H_0 \;|\; H_0)
  ]

  > [!TIP]
  > Pokud $p$-value vyjde menší než požadovaná hladina významnosti $\alpha$, pak pravděpodobnost, že došlo k chybě typu I je dostatečně malá na to, abychom mohli tvrdit, že zavrhujeme $H_0$, protože $H_0$ neplatí, a tedy akceptujeme $H_1$.

### Parametrické testy

Parametrické testy jsou založené na parametrech pravděpodobnostních rozdělení.

- **Studentův T-test**\
  Umožňuje ověřit zda normální rozdělení má danou střední hodnotu. Taky umožňuje ověřit zda dvě normální rozdělení mají stejnou střední hodnotu, za předpokladu, že mají stejný (byť neznámý) rozptyl. [t-test](#t-test)
- **Analysis of variance (ANOVA)**\
  Testuje rozdíly mezi středními hodnotami dvou a více skupin. Používá se k ověření, zda rozptyly dvou nebo více množin dat jsou stejné až na konstantní posun a škálování. [anova](#anova)

### Neparametrické testy

Neparametrické testy nejsou založené (jen) na parametrech pravděpodobnostních rozdělení. Používají se, když neznáme rozdělení dat, nebo je těžké splnit předpoklady parametrických testů.

- **Sign test**\
  Testuje, zda se dvě náhodné veličiny při pozorování liší konzistentně. Jinými slovy, zda stření hodnota jejich rozdílu má nulový medián.
- **One-sample Wilcoxon signed-rank test**\
  Testuje, zda vzorky patří do symetrického rozdělení s daným mediánem.
- **Pearsonův chi-squared ($\chi^2$) test**\
  Umožňuje ověřit, že dvě kategorické NV jsou nezávislé. [chi-squared](#chi-squared)

### Testy (ne)závislosti náhodných veličin

**Opakování**

- **Statistická / stochastická nezávislost**\
  Náhodné jevy $A$ a $B$ jsou stochasticky nezávislé, pokud $P(A \cap B) = P(A) \cdot P(B)$.

  **Výskyt $A$ nemá vliv na výskyt $B$.**

  - "Při při prvním hodu padne 6" a "při druhém hodu padne 6" jsou **nezávislé** jevy.
  - Naproti tomu jev, že padne 6 při prvním hodu kostkou a jev, že součet čísel zaznamenaných v prvním a druhém pokusu je 8, jsou **závislé** jevy. [nezavislost](#nezavislost)

- **Nezávislost diskrétních NV**

  Pokud $X$, $Y$ a $Z$ jsou diskrétní náhodné veličiny, pak definujeme $X$ a $Y$ jako _podmíněně nezávislé_ vzhledem k $Z$, pokud:

  ```math
  P(X \le x, Y \le y | Z = z) = P(X \le x | Z = z) \cdot P(Y \le y | Z = z)
  ```

  pro všechny $x$, $y$ a $z$ takové, že $P(Z = z) > 0$.

- **Nezávislost spojitých NV**

  Pokud $X$, $Y$ a $Z$ jsou spojité náhodné veličiny a mají společnou hustotu pravděpodobnosti $f_{XYZ}(x,y,z)$, pak definujeme $X$ a $Y$ jako _podmíněně nezávislé_ vzhledem k $Z$, pokud:

  ```math
  f_{X,Y|Z}(x,y|z) = f_{X|Z}(x|z) \cdot f_{Y|Z}(y|z)
  ```

  pro všechna $x$, $y$ a $z$ takové, že $f_Z(z) > 0$.

> To neformálně řečeno znamená, že jakmile máme k dispozici informaci obsaženou v Z, není už další informace A užitečná pro přesnější poznání B ani znalost B nepřidá nic pro pochopení A, i kdyby A a B byly vzájemně závislé.
>
> — Wikipedia: Statistická nezávislost

- **Regrese**\
  Analýza vztahu mezi dvěma závislými NV.
- **Lineární regrese**\
  Regrese s předpokladem, že vztah dvě NV jsou závislé lineárně. Rovnici regresní přímky zapisujeme jako:

  ```math
  Y_i = \beta_0 + \beta_1 \cdot X_i + \varepsilon_i
  ```

  Kde:

  - $Y$ je NV závislá na $X$,
  - $\beta_0$ je konstanta,
  - $\beta_1$ je směrnice (slope),
  - $\varepsilon_i$ je $i$-tá pozorovaná hodnota chyby -- náhodná složka / šum.

  Platí:

  - $E(\varepsilon_i) = 0$,
  - $D(\varepsilon_i) = \sigma^2$,
  - $\text{cov}(\varepsilon_i, \varepsilon_j) = 0$ pro $i \neq j$,
  - $\varepsilon_i \sim N(0, \sigma^2)$ -- náhodná složka má normální rozdělení,
  - regresní parametry $\beta_0$ a $\beta_1$ mohou mít libovolnou hodnotu.

- **Celkový F-test**\
  Pracuje s nulovou hypotézou ve tvaru:

  ```math
  H_0: \beta_1 = \beta_2 = \ldots = \beta_k = 0
  ```

  Tedy testujeme, zda hodnota analyzované NV závisí na lineární kombinaci vysvětlujících NV. Pokud je $H_0$ zamítnuta, pak alespoň jedna závislost existuje. Pokud je $H_0$ nezamítnuta, pak je množina vysvětlujících NV úplně blbě.

  Testová statistika má F-rozdělení.

- **Dílčí t-testy**\
  Umožňují otestovat, že dává smysl použít $i$-tou vysvětlující NV. Testujeme nulovou hypotézu:

  ```math
  H_0: \beta_i = 0
  ```

  Pokud nelze zamítnout, pak $i$-tá vysvětlující NV nemá vliv na analyzovanou NV a můžeme ji vynechat.

  Testová statistika má Studentovo t-rozdělení.

## Zdroje

- [[[statistics,1]]] [Wikipedia: Statistics](https://en.wikipedia.org/wiki/Statistics)
- [[[nv,2]]] [Wikipedia: Náhodná veličina](https://cs.wikipedia.org/wiki/N%C3%A1hodn%C3%A1_veli%C4%8Dina)
- [[[cdf,3]]] [Wikipedia: Cumulative distribution function](https://en.wikipedia.org/wiki/Cumulative_distribution_function)
- [[[mean,4]]] [Wikipedia: Mean](https://en.wikipedia.org/wiki/Mean)
- [[[clv,5]]] [Wikipedia: Centrální limitní věta](https://cs.wikipedia.org/wiki/Centr%C3%A1ln%C3%AD_limitn%C3%AD_v%C4%9Bta)
- [[[consistent-estimator,6]]] [Wikipedia: Consistent estimator](https://en.wikipedia.org/wiki/Consistent_estimator)
- [[[statistic, 7]]] [Wikipedia: Statistic](https://en.wikipedia.org/wiki/Statistic)
- [[[mle, 8]]] [Wikipedia: Maximum likelihood estimation](https://en.wikipedia.org/wiki/Maximum_likelihood_estimation)
- [[[mom, 9]]] [Wikipedia: Method of moments](<https://en.wikipedia.org/wiki/Method_of_moments_(statistics)>)
- [[[null, 10]]] [Wikipedia: Null hypothesis](https://en.wikipedia.org/wiki/Null_hypothesis)
- [[[p-value, 11]]] [Wikipedia: P-hodnota](https://cs.wikipedia.org/wiki/P-hodnota)
- [[[mv013,12]]] [MV013 Statistics for Computer Science (jaro 2021)](https://is.muni.cz/auth/el/fi/jaro2021/MV013/)
- [[[anova, 13]]] [Wikipedia: Analysis of variance](https://en.wikipedia.org/wiki/Analysis_of_variance)
- [[[nezavislost,14]]] [Wikipedia: Statistická nezávislost](https://cs.wikipedia.org/wiki/Statistick%C3%A1_nez%C3%A1vislost)
- [[[t-test, 15]]] [Wikipedia: T-test](https://cs.wikipedia.org/wiki/T-test)
- [[[chi-squared,16]]] [Chi-square tests](https://www.scribbr.com/statistics/chi-square-tests/)
- [[[moment, 17]]] [Momenty rozdělení](http://kfe.fjfi.cvut.cz/~limpouch/sigdat/pravdh/node10.html)
