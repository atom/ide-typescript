const path = require('path')
const {AutoLanguageClient} = require('atom-languageclient')

class TypeScriptLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return [ 'source.ts', 'source.js', 'source.js.jsx' ] }
  getLanguageName () { return 'TypeScript' }
  getServerName () { return 'SourceGraph' }

  startServerProcess () {
    const args = [ 'node_modules/javascript-typescript-langserver/lib/language-server-stdio' ]
    return super.spawnChildNode(args, { cwd: path.join(__dirname, '..') })
  }

  preInitialization(connection) {
    connection.onCustom('$/partialResult', () => {}) // Stop partialResult until the language server honors detection
  }
}

module.exports = new TypeScriptLanguageClient()
