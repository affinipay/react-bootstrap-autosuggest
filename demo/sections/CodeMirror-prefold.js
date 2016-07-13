// @flow

import CodeMirror from 'codemirror'

CodeMirror.registerGlobalHelper('fold', 'comment', function(mode) {
  return (mode.blockCommentStart && mode.blockCommentEnd) || mode.lineComment
}, foldRangeFinder)

export function prefold(codeMirror: CodeMirror) {
  const lastLine = codeMirror.lastLine()
  for (let line = 0; line <= lastLine; ++line) {
    const lineText = codeMirror.getLine(line)
    let pos = lineText.indexOf('$fold-line$')
    if (pos >= 0) {
      const mode = codeMirror.getModeAt(CodeMirror.Pos(line, pos))
      pos = findCommentStart(mode, lineText, pos)
      if (pos >= 0) {
        codeMirror.foldCode(CodeMirror.Pos(line, pos))
        continue
      }
    }
    pos = lineText.indexOf('$fold-start$')
    if (pos >= 0) {
      const mode = codeMirror.getModeAt(CodeMirror.Pos(line, pos))
      pos = findCommentStart(mode, lineText, pos)
      if (pos >= 0) {
        codeMirror.foldCode(CodeMirror.Pos(line, pos), foldRangeFinder)
      }
    }
  }
}

export function foldRangeFinder(codeMirror: CodeMirror, start: { line: number, ch: number }) {
  const mode = codeMirror.getModeAt(start)
  const lastLine = codeMirror.lastLine()
  let { line, ch } = start
  for (; line <= lastLine; ++line, ch = 0) {
    const lineText = codeMirror.getLine(line)
    let pos = lineText.indexOf('$fold-end$', ch)
    if (pos >= 0) {
      pos = findCommentEnd(mode, lineText, pos)
      return { from: start, to: { line, pos } }
    }
  }
}

function findCommentStart(mode: Object, str: string, fromIndex: number): number {
  let pos = -1
  if (fromIndex >= 0) {
    if (mode.lineComment) {
      pos = str.lastIndexOf(mode.lineComment, fromIndex)
    }
    if (pos < 0 && mode.blockCommentStart) {
      pos = str.lastIndexOf(mode.blockCommentStart, fromIndex)
    }
  }
  return pos
}

function findCommentEnd(mode: Object, str: string, fromIndex: number): number {
  let pos = -1
  if (mode.lineComment) {
    pos = str.lastIndexOf(mode.lineComment, fromIndex)
  }
  if (pos < 0 && mode.blockCommentEnd) {
    pos = str.indexOf(mode.blockCommentEnd, fromIndex)
    if (pos < 0) {
      pos = str.length
    } else {
      pos += 2
    }
  } else {
    pos = str.length
  }
  return pos
}
