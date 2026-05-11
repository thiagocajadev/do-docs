import { Doc } from '@/app/[...slug]/DocsContext'

export const INDEX_PAGE = 'introduction'

export type NavTreeNode = {
  name: string
  doc?: Doc
  indexDoc?: Doc
  children: NavTreeNode[]
}

export function buildNavTree(docs: Doc[]): NavTreeNode[] {
  const root: NavTreeNode = { name: '', children: [] }

  for (const doc of docs) {
    const segments = doc.slug
    let parent = root

    for (let i = 0; i < segments.length - 1; i++) {
      const name = segments[i]
      let folder = parent.children.find((c) => c.name === name && !c.doc)
      if (!folder) {
        folder = { name, children: [] }
        parent.children.push(folder)
      }
      parent = folder
    }

    const last = segments[segments.length - 1]
    if (last === INDEX_PAGE) {
      parent.indexDoc = doc
    } else {
      parent.children.push({ name: last, doc, children: [] })
    }
  }

  sortTree(root)
  return root.children
}

function isFolder(node: NavTreeNode): boolean {
  return node.children.length > 0 || !!node.indexDoc
}

function sortTree(node: NavTreeNode): void {
  node.children.sort((a, b) => {
    const af = isFolder(a) ? 1 : 0
    const bf = isFolder(b) ? 1 : 0
    return af - bf
  })
  for (const child of node.children) sortTree(child)
}

export function flattenNavTree(tree: NavTreeNode[]): Doc[] {
  const out: Doc[] = []
  const visit = (node: NavTreeNode) => {
    if (node.indexDoc) out.push(node.indexDoc)
    if (node.doc) out.push(node.doc)
    for (const child of node.children) visit(child)
  }
  for (const node of tree) visit(node)
  return out
}

export function nodeContainsUrl(node: NavTreeNode, url: string): boolean {
  if (node.doc?.url === url) return true
  if (node.indexDoc?.url === url) return true
  return node.children.some((c) => nodeContainsUrl(c, url))
}

export function nodeFirstHref(node: NavTreeNode): string | undefined {
  if (node.indexDoc) return node.indexDoc.url
  if (node.doc) return node.doc.url
  for (const child of node.children) {
    const href = nodeFirstHref(child)
    if (href) return href
  }
  return undefined
}
