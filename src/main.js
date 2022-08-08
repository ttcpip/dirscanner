const libPath = require('path')
const { sizeStr, readDir, getFileSize } = require('./helpers')

const MAX_DEPTH = 30
const PADDING_SYMBOL = '\t'
const EXCLUDE_REG_EXPS = [
  /node_modules/,
  /\.git/,
]

function checkNodesBackend(dirPath, depth) {
  const thisDirInfo = {
    size: 0,
    path: dirPath,
    subNodes: new Set(),
  }
  if (depth >= MAX_DEPTH) return thisDirInfo
  const thisDirNodes = readDir(dirPath, { withFileTypes: true })

  for (const subNode of thisDirNodes) {
    const subNodePath = libPath.join(dirPath, subNode.name)
    if (subNode.isDirectory()) {
      if (EXCLUDE_REG_EXPS.some((r) => r.test(subNode.name)))
        continue
      const obj = checkNodesBackend(subNodePath, depth + 1)
      thisDirInfo.subNodes.add(obj)
      thisDirInfo.size += obj.size
    } else {
      const size = getFileSize(subNodePath)
      thisDirInfo.size += size
      thisDirInfo.subNodes.add({ size, path: subNodePath })
    }
  }

  return thisDirInfo
}

function checkNodesFrontend(node, depth, writeStream) {
  const write = (line) => writeStream.write(PADDING_SYMBOL.repeat(depth) + line + '\n')

  const { size, path, subNodes } = node
  if (subNodes) {
    write(`${libPath.basename(path)} ${sizeStr(size)}:`)
    for (const subSubNode of subNodes)
      checkNodesFrontend(subSubNode, depth + 1, writeStream)
  } else {
    write(`${libPath.basename(path)} ${sizeStr(size)}`)
  }
}

module.exports = {
  checkNodesBackend,
  checkNodesFrontend,
}
