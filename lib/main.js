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

  async getSuggestions (request) {
    if (request.activatedManually === true || request.prefix.startsWith('.')) {
      return this.requestAndCleanSuggestions(request)
    } else {
      const startColumn = request.bufferPosition.column - request.prefix.length
      const fullPrefix = request.editor.getTextInBufferRange([[request.bufferPosition.row, startColumn - 1], [request.bufferPosition.row, startColumn]])
      return fullPrefix === '.' ? this.requestAndCleanSuggestions(request) : []
    }
  }

  // TypeScript server returns long signature - we just want return type
  requestAndCleanSuggestions (request) {
    return super.getSuggestions(request).then(results => {
      if (results != null) {
        for(const result of results) {
          if (result.leftLabel) {
            const index = result.leftLabel.lastIndexOf(':')
            if (index > 0) {
              result.leftLabel = result.leftLabel.substr(index + 1).trim()
            }
          }
        }
      }
      return results
    })
  }
}

module.exports = new TypeScriptLanguageClient()
