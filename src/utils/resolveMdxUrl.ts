import path from 'node:path'

export default function resolveMdxUrl(
  src: string,
  mdFile: string,
  baseUrl?: string,
  basePath?: string,
) {
  if (src.includes('://')) return src

  const dirname = path.dirname(mdFile)
  const directoryPath = mdFile.startsWith('/') ? dirname : '/' + dirname
  const resolvedPath = path.resolve(directoryPath, src)

  if (!baseUrl) {
    return (basePath ?? '') + resolvedPath
  }

  const newUrlPath = resolvedPath.startsWith('/') ? resolvedPath.substring(1) : resolvedPath

  const isAbsoluteUrl = /^[a-z][a-z0-9+.-]*:\/\//i.test(baseUrl)
  if (!isAbsoluteUrl) {
    return baseUrl.replace(/\/+$/, '') + '/' + newUrlPath
  }
  return new URL(newUrlPath, baseUrl.replace(/\/+$/, '') + '/').href
}
