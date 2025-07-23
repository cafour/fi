---
title: Zpracování obrazu - intro
description: "TODO"
---

> [!TIP]
> Doporučuju kouknout na shrnutí v [zápiscích z předmětu PA166 od xrosecky](https://xrosecky.notion.site/PA166-Image-analysis-II-b2875a07366c404dabbf20a8b75a6e2e?pvs=74)


* **Gradient $\nabla$**\
Vektorové pole ve směru největšího nárůstu.

  Standardně ho spočítáme jako derivaci obrazu podle x a y. V praxi ale používáme aproximaci derivace podle Taylorova rozvoje.
* **Aproximace derivace**\
Taylorův polynom vypadá takto: $f(x + h) = f(x) + hf'(x) + \frac{h^2}{2!}f''(x) + \dots + \frac{h^n}{n!}f^{(n)}(x) + O(h^{n+1})$.

  Z něho můžeme odvodit rovnici pro první derivaci (v našem případě ji nazýváme dopředná diference):

  ```math
  \begin{aligned}
  f(x + h) \approx &\ f(x) + hf'(x)\\
  f'(x) \approx &\ \frac{f(x + h) - f(x)}{h}
  \end{aligned}
  ```

  Tu můžeme dále zpřesnit, pokud si vypíšeme taylorův rozvoj až do druhé derivace včetně (tím získáme centrální diferenci):

  ```math
  h_1 = 1, h_2 = -1\\
  f(x + h_1) - f(x + h_2) \\
  \begin{aligned}
  f(x + 1) - f(x - 1) \approx &\ f(x) + hf'(x) + \frac{h^2}{2!}f''(x) - f(x) + hf'(x) - \frac{h^2}{2!}f''(x)\\
  f(x + 1) - f(x - 1) \approx &\ 2hf'(x) \\
  f'(x) \approx &\ \frac{f(x + 1) - f(x - 1)}{2h}
  \end{aligned}
  ```

  Podobným stylem získáme i druhou derivaci
