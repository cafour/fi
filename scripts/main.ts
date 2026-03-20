const ThemeItem = "theme";
const ThemeAttribute = "data-theme";
const LightTheme = "light";
const DarkTheme = "dark";

type Theme = typeof LightTheme | typeof DarkTheme;

function getLocalStorageTheme(): Theme | null {
    return localStorage.getItem(ThemeItem) as Theme;
}

function getTheme(): Theme {
    const dataTheme = document.documentElement.getAttribute(ThemeAttribute) as Theme;
    if (dataTheme) {
        return dataTheme;
    }

    const localStorageTheme = getLocalStorageTheme();
    if (localStorageTheme) {
        return localStorageTheme;
    }

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? DarkTheme : LightTheme;
}

function setTheme(theme: Theme): void {
    localStorage.setItem(ThemeItem, theme);
    document.documentElement.setAttribute(ThemeAttribute, theme);
}

export function toggleTheme(): void {
    const currentTheme = getTheme();
    setTheme(currentTheme === LightTheme ? DarkTheme : LightTheme);
}

const localStorageTheme = getLocalStorageTheme();
if (localStorageTheme) {
    setTheme(localStorageTheme);
}

// self.addEventListener("load", () => {
    
// });
