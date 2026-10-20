import expand, { extract } from 'emmet'

/** Find and expand the abbreviation immediately before the editor cursor. */
export function getEmmetExpansion(source, cursor) {
  const before = source.slice(0, cursor)
  if (before.lastIndexOf('<!--') > before.lastIndexOf('-->')) return null
  if (before.lastIndexOf('<') > before.lastIndexOf('>')) return null

  const lineStart = source.lastIndexOf('\n', cursor - 1) + 1
  const nextBreak = source.indexOf('\n', cursor)
  const line = source.slice(lineStart, nextBreak < 0 ? source.length : nextBreak)
  const match = extract(line, cursor - lineStart)
  if (!match?.abbreviation || !/^[a-zA-Z.!#]/.test(match.abbreviation)) return null

  try {
    const indentation = line.match(/^\s*/)[0]
    const markup = expand(match.abbreviation, {
      syntax: 'html',
      options: { 'output.indent': '  ' },
    })
    if (!markup || markup === match.abbreviation) return null
    const insert = markup.replace(/\n/g, '\n' + indentation)
    const emptyPair = /<([a-z][\w:-]*)(?:\s[^>]*?)?><\/\1>/i.exec(insert)
    const caret = emptyPair ? emptyPair.index + emptyPair[0].indexOf('>') + 1 : insert.length
    const from = lineStart + match.start
    return { from, to: lineStart + match.end, insert, anchor: from + caret }
  } catch {
    return null
  }
}
