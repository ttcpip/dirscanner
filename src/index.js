const { createWriteStream } = require('fs')
const { resolve } = require('path')
const { checkNodesBackend, checkNodesFrontend } = require('./main')

function main() {
  console.log(`Starting...`)
  console.time(`All done`)

  console.time('Backend')
  const result = checkNodesBackend(process.argv[2] || process.cwd(), 0)
  console.timeEnd('Backend')

  console.time('Frontend')
  const outputFilePath = process.argv[3] || './file.output.txt'
  /** Could be any writeStream, e.g process.stdout */
  const writeStream = createWriteStream(outputFilePath, { encoding: 'utf8' })
  checkNodesFrontend(result, 0, writeStream)
  console.log(`Output saved to: ${resolve(outputFilePath)}`)
  console.timeEnd('Frontend')

  console.timeEnd(`All done`)
}
main()
