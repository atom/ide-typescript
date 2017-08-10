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

  preInitialization (connection) {
    connection.onCustom('$/partialResult', () => {}) // Suppress partialResult until the language server honours 'streaming' detection
  }

  async getSuggestions(request) {
    if (request.activatedManually === true || request.prefix.startsWith('.')) {
      return super.getSuggestions(request)
    } else {
      const startColumn = request.bufferPosition.column - request.prefix.length
      const fullPrefix = request.editor.getTextInBufferRange([[request.bufferPosition.row, startColumn - 1], [request.bufferPosition.row, startColumn]])
      return fullPrefix === '.' ? super.getSuggestions(request) : []
    }
  }
}

module.exports = new TypeScriptLanguageClient()
