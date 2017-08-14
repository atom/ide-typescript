const path = require('path')
const {AutoLanguageClient} = require('atom-languageclient')
const {filter} = require('fuzzaldrin-plus')

class TypeScriptLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return [ 'source.ts', 'source.js', 'source.js.jsx' ] }
  getLanguageName () { return 'TypeScript' }
  getServerName () { return 'SourceGraph' }

  constructor () {
    super()
    this.currentSuggestions = []
  }

  startServerProcess () {
    const args = [ 'node_modules/javascript-typescript-langserver/lib/language-server-stdio' ]
    return super.spawnChildNode(args, { cwd: path.join(__dirname, '..') })
  }

  preInitialization (connection) {
    connection.onCustom('$/partialResult', () => {}) // Suppress partialResult until the language server honours 'streaming' detection
  }

  async getSuggestions (request) {
    const prefix = request.prefix.trim()

    if (prefix === '' && !request.activatedManually) {
      this.currentSuggestions = []
      return Promise.resolve([])
    }

    if (prefix.length > 0 && this.currentSuggestions.length) {
      // fuzzy filter on this.currentSuggestions
      return new Promise((resolve) => {
        const filtered = filter(this.currentSuggestions, prefix, {key: 'text'})
          .map(s => Object.assign({}, s, {replacementPrefix: prefix}))
        resolve(filtered)
      })
    }

    if (request.activatedManually === true || request.prefix.startsWith('.')) {
      return this.requestAndCleanSuggestions(request)
        .then(suggestions => this.currentSuggestions = suggestions)
    } else {
      this.currentSuggestions = []
      return Promise.resolve([])
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
