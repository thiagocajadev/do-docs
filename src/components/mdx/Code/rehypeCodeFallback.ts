import type { Root } from 'hast'
import { visit } from 'unist-util-visit'

const FALLBACK_LANG = 'javascript'

export function rehypeCodeFallback() {
  return (tree: Root) => {
    visit(tree, 'element', function (node) {
      if (node.tagName !== 'pre') return

      const code = node.children.find((c) => c.type === 'element' && c.tagName === 'code')
      if (!code || code.type !== 'element') return

      const codeClass = String(code.properties?.className ?? '')
      if (codeClass.includes('language-')) return

      const codeClasses = Array.isArray(code.properties?.className)
        ? code.properties!.className
        : codeClass
          ? [codeClass]
          : []
      code.properties = { ...code.properties, className: [...codeClasses, `language-${FALLBACK_LANG}`] }

      const preClass = String(node.properties?.className ?? '')
      const preClasses = Array.isArray(node.properties?.className)
        ? node.properties!.className
        : preClass
          ? [preClass]
          : []
      node.properties = { ...node.properties, className: [...preClasses, `language-${FALLBACK_LANG}`] }
    })
  }
}
