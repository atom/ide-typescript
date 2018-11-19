const fs = require('fs')
const path = require('path')
const {AutoLanguageClient} = require('atom-languageclient')

const jsScopes = [ 'source.js', 'source.js.jsx', 'javascript' ]
const tsScopes = [ 'source.ts', 'source.tsx', 'typescript' ]
const allScopes = tsScopes.concat(jsScopes)
const tsExtensions = [ '*.json', '.ts', '.tsx' ]
const jsExtensions = [ '.js', '.jsx' ]
const allExtensions = tsExtensions.concat(jsExtensions)

class TypeScriptLanguageClient extends AutoLanguageClient {
  getGrammarScopes () {
    return atom.config.get('ide-typescript.javascriptSupport') ? allScopes : tsScopes
  }
  getLanguageName () { return 'TypeScript' }
  getServerName () { return 'Theia' }

  startServerProcess () {
    this.supportedExtensions = atom.config.get('ide-typescript.javascriptSupport') ? allExtensions : tsExtensions
    return super.spawnChildNode([
      'node_modules/typescript-language-server/lib/cli',
      '--stdio',
      '--tsserver-path', this.getTypescriptServerPath()
    ] , { cwd: path.join(__dirname, '..') })
  }

  getTypescriptServerPath() {
    const tsServerPath = atom.config.get('ide-typescript.typescriptServerPath')
    if (tsServerPath) return tsServerPath
    return 'node_modules/typescript/lib/tsserver.js'
  }

  consumeLinterV2() {
    if (atom.config.get('ide-typescript.diagnosticsEnabled') === true) {
      super.consumeLinterV2.apply(this, arguments)
    }
  }

  deactivate() {
    return Promise.race([super.deactivate(), this.createTimeoutPromise(2000)])
  }

  shouldStartForEditor(editor) {
    if (atom.config.get('ide-typescript.ignoreFlow') === true) {
      const flowConfigPath = path.join(this.getProjectPath(editor.getURI() || ''), '.flowconfig')
      if (fs.existsSync(flowConfigPath)) return false
    }
    return super.shouldStartForEditor(editor);
  }

  getProjectPath(filePath) {
    const projectPath = atom.project.getDirectories().find(d => filePath.startsWith(d.path))
    return projectPath != null ? projectPath.path : ''
  }

  createTimeoutPromise(milliseconds) {
    return new Promise((resolve, reject) => {
      let timeout = setTimeout(() => {
        clearTimeout(timeout)
        this.logger.error(`Server failed to shutdown in ${milliseconds}ms, forcing termination`)
        resolve()
      }, milliseconds)
    })
  }

  provideAutocomplete() {
    const autocompleteResultsFirst = atom.config.get('ide-typescript.autocompleteResultsFirst')
    const provided = super.provideAutocomplete()
    provided.suggestionPriority = autocompleteResultsFirst ? 2 : 1
    return provided
  }

  onDidConvertAutocomplete(completionItem, suggestion, request) {
    TypeScriptLanguageClient.setLeftAndRightLabels(suggestion)

    // Theia language server sets snippets to '' leading to ambiguity between using that and text
    if (suggestion.snippet === '' && suggestion.text != null && suggestion.text !== '') {
      suggestion.snippet = undefined
    }
  }

  static setLeftAndRightLabels(suggestion) {
    if (suggestion.rightLabel == null || suggestion.displayText == null) return
    const nameIndex = suggestion.rightLabel.indexOf(suggestion.displayText)
    if (nameIndex >= 0) {
      const signature = suggestion.rightLabel.substr(nameIndex + suggestion.displayText.length).trim()
      let paramsStart = -1
      let paramsEnd = -1
      let returnStart = -1
      let bracesDepth = 0
      for (let i = 0; i < signature.length; i++) {
        switch (signature[i]) {
          case '(': {
            if (bracesDepth++ === 0 && paramsStart === -1) {
              paramsStart = i;
            }
            break;
          }
          case ')': {
            if (--bracesDepth === 0 && paramsEnd === -1) {
              paramsEnd = i;
            }
            break;
          }
          case ':': {
            if (returnStart === -1 && bracesDepth === 0) {
              returnStart = i;
            }
            break;
          }
        }
      }

      if (atom.config.get('ide-typescript.returnTypeInAutocomplete') === 'left') {
        if (paramsStart > -1) {
          suggestion.rightLabel = signature.substring(paramsStart, paramsEnd + 1).trim()
        }
        if (returnStart > -1) {
          suggestion.leftLabel = signature.substring(returnStart + 1).trim()
        }
        // We have a 'property' icon, we don't need to pollute the signature with '(property) '
        const propertyPrefix = '(property) '
        if (suggestion.rightLabel.startsWith(propertyPrefix)) {
          suggestion.rightLabel = suggestion.rightLabel.substring(propertyPrefix.length)
        }
      } else {
        suggestion.rightLabel = signature.substring(paramsStart).trim()
        suggestion.leftLabel = ''
      }
    }
  }

  filterChangeWatchedFiles(filePath) {
    return this.supportedExtensions.indexOf(path.extname(filePath).toLowerCase()) > -1;
  }
}

module.exports = new TypeScriptLanguageClient()
