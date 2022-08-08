const fs = require('fs')

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

function readDir(dirPath) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true })
  } catch (err) {
    console.error(`[At readDir()]`, err.message)
    return []
  }
}

function getFileSize(path) {
  try {
    return fs.statSync(path, { throwIfNoEntry: true }).size
  } catch (err) {
    console.error(`[At getFileSize()]`, err.message)
    return -1
  }
}

module.exports = {
  sizeStr,
  readDir,
  getFileSize,
}
