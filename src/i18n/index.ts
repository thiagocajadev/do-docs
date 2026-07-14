//
// UI strings. The docs content itself is never translated -- only DoDocs' own chrome
// (search, ToC, prev/next, theme toggle, footer).
//
// The locale is read from NEXT_PUBLIC_LOCALE, so it must be inlined at build time: it is
// consumed by client components (Toc, Search, ToggleTheme) as well as server ones.
//

export const locales = ['en', 'pt-BR'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

const en = {
  'meta.description': (libname: string) => `Documentation for ${libname}`,
  'meta.ogLocale': 'en_US',

  'toc.title': 'On This Page',

  'search.label': 'Search',
  'search.labelSuffix': ' for anything',
  'search.dialogTitle': 'Search anything',
  'search.placeholder': 'Search the docs',
  'search.pressPrefix': 'Press ',
  'search.pressSuffix': ' to search',
  'search.slashKey': 'Forward slash',

  'nav.previous': 'Previous',
  'nav.next': 'Next',
  'nav.menu': 'Menu',
  'nav.menuDescription': 'Site navigation',

  'theme.system': 'System theme',
  'theme.light': 'Light theme',
  'theme.dark': 'Dark theme',

  'footer.developedBy': 'Developed by',
  'footer.basedOn': 'Based on the work of',
} as const

// `en` is `as const`, so its values are literal types. Widen them back to `string` -- otherwise a
// translation would have to be the *same* literal as its English counterpart. Interpolating entries
// keep their signature, so a missing or mistyped argument is still a build error.
type Dictionary = {
  [K in keyof typeof en]: (typeof en)[K] extends (...args: infer A) => infer R
    ? (...args: A) => R
    : string
}

const ptBR: Dictionary = {
  'meta.description': (libname: string) => `Documentação de ${libname}`,
  'meta.ogLocale': 'pt_BR',

  'toc.title': 'Nesta Página',

  'search.label': 'Buscar',
  'search.labelSuffix': ' na documentação',
  'search.dialogTitle': 'Buscar na documentação',
  'search.placeholder': 'Buscar na documentação',
  'search.pressPrefix': 'Pressione ',
  'search.pressSuffix': ' para buscar',
  'search.slashKey': 'Barra',

  'nav.previous': 'Anterior',
  'nav.next': 'Próximo',
  'nav.menu': 'Menu',
  'nav.menuDescription': 'Navegação do site',

  'theme.system': 'Tema do sistema',
  'theme.light': 'Tema claro',
  'theme.dark': 'Tema escuro',

  'footer.developedBy': 'Desenvolvido por',
  'footer.basedOn': 'Baseado no trabalho de',
}

const dictionaries: Record<Locale, Dictionary> = { en, 'pt-BR': ptBR }

/**
 * Accepts the usual spellings a workflow author may reach for -- `pt-BR`, `pt-br`, `pt_BR`,
 * `pt` -- and falls back to English for anything unknown, so a typo degrades instead of
 * breaking the build.
 */
export function resolveLocale(value = process.env.NEXT_PUBLIC_LOCALE): Locale {
  const normalized = value?.trim().toLowerCase().replace('_', '-')
  if (!normalized) return defaultLocale

  const match = locales.find(
    (locale) =>
      locale.toLowerCase() === normalized || locale.toLowerCase().split('-')[0] === normalized,
  )

  return match ?? defaultLocale
}

export function t<K extends keyof Dictionary>(key: K): Dictionary[K] {
  return dictionaries[resolveLocale()][key]
}
