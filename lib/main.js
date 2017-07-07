const cp = require('child_process')
const net = require('net')
const path = require('path')
const {AutoLanguageClient} = require('atom-languageclient')

class TypeScriptLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return [ 'source.ts', 'source.js', 'source.js.jsx' ] }
  getLanguageName () { return 'TypeScript' }
  getServerName () { return 'SourceGraph' }

  startServerProcess () {
    const serverHome = path.join(__dirname, '..')
    const command = 'node'
    const args = [path.join('node_modules', 'javascript-typescript-langserver', 'lib', 'language-server-stdio')]
    this.logger.debug(`starting "${command} ${args.join(' ')}"`)
    return cp.spawn(command, args, { cwd: serverHome })
  }

  preInitialization(connection) {
    connection.onCustom('$/partialResult', () => {}) // Silence
  }
}

module.exports = new TypeScriptLanguageClient()
