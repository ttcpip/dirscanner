const fs = require('fs')
const path = require('path')

const MAX_DEPTH = 100
const PADDING_SYMBOL = '\t'
const excludeRegExps = [
  /node_modules/,
  /\.git/,
]

const writeStream = fs.createWriteStream('./file.output.txt', { encoding: 'utf8' })
console.log(`Started...`)
checkNodesRecursive(process.argv[2] || process.cwd(), 0, writeStream)
console.log(`Done!`)

function checkNodesRecursive(nodePath, depth, writeStream) {
  const write = (line, paddingLen = depth) => writeStream.write(PADDING_SYMBOL.repeat(paddingLen) + line + '\n')

  if (depth === 0) {
    write(`${nodePath}:`)
    return checkNodesRecursive(nodePath, depth + 1, writeStream)
  }

  if (depth >= MAX_DEPTH) return

  const nodes = fs.readdirSync(nodePath, { withFileTypes: true })

  let thisNodeSize = 0
  for (const subNode of nodes) {
    const subNodePath = path.join(nodePath, subNode.name)
    if (subNode.isDirectory()) {
      if (excludeRegExps.some((r) => r.test(subNode.name)))
        continue
      write(`${subNode.name}:`)
      const nodeSize = checkNodesRecursive(subNodePath, depth + 1, writeStream)
      thisNodeSize += nodeSize
      write(`Size: ${sizeStr(nodeSize)}`, depth + 1)
    } else if (subNode.isFile()) { // file
      const fileInfo = fs.statSync(subNodePath, { throwIfNoEntry: true })
      thisNodeSize += fileInfo.size
      write(`${subNode.name} ${sizeStr(fileInfo.size)}`)
    } else {
      throw new Error(`Unknown sub-node type at ${subNodePath}`)
    }
  }

  return thisNodeSize
}

function sizeStr(bytes) {
  const MAX_DECIMALS = 2
  const prefixes = {
    B: 1,
    KB: 2 ** 10,
    MB: 2 ** 20,
    GB: 2 ** 30,
    TB: 2 ** 40,
  }

  for (const prefix of Object.keys(prefixes).reverse()) {
    const bytesPerThePrefix = prefixes[prefix]
    const amountWithThePrefix = bytes / bytesPerThePrefix
    if (amountWithThePrefix >= 1 || bytesPerThePrefix <= 1)
      return `${parseFloat(amountWithThePrefix.toFixed(MAX_DECIMALS))}${prefix}`
  }
  return `${bytes}${prefixes.B}`
}
