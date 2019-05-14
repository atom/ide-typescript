## v0.9.0

- Delay package activation until needed to improve Atom startup time (@laughedelic)
- Prevent error after package deactivation

## v0.8.0

The underlying language server has been changed to the [Theia IDE typescript-language-server](https://github.com/theia-ide/typescript-language-server).  This resolves a number of important issues around module resolution, performance, version of TypeScript, tsconfig feature support etc.

Thanks to the Theia IDE team for their language server and @mattlyons0 for helping figure out how to use it and push the necessary required changes upstream!

- Changed language server to Theia IDE
- Code Format now supported
- No longer prints "Server failed to shutdown" on package deactivation
- Many issues are likely resolved

## v0.7.9

- Prevent initialization failure caused by spread operator on some versions of Atom

## v0.7.8

- Prevent error when opening a file without first opening a directory/folder (project)

Note: It is recommended that you always open the root of your project as a folder in order for the language server to correctly identify your projects tsconfig etc.

## v0.7.7

- Update atom-languageclient to 0.9.7 to fix prompts, log messages, improve AutoComplete etc.
- Setting to ignore flow projects
- Setting to configure autocomplete suggestion priority

## v0.7.6

- Compatibility with Atom's experimental tree-sitter parsing
- Log messages from the language server are now shown in the Atom IDE UI Console window
- Removed redundant fuzzaldrin-plus dependency

## v0.7.5

- Update atom-languageclient to 0.9.1 to address missing trigger characters on some completions

## v0.7.4

- Update atom-languageclient for much improved autocomplete

## v0.7.3

- Update language server to make use of TypeScript 2.7.2
- Update atom-languageclient for better language server stability

## v0.7.2

- Update atom-language-client
  - Resolved autocomplete suggestions retain while filtering
  - Return type processing works again

## v0.7.1

- Update language server
- Update atom-language-client
  - Now resolves autocomplete suggestions
- Force server shutdown after 2 seconds during quit
- Add configuration switch to turn off diagnostics

## v0.7.0

- Update language server
- Update atom language client
- Enable signature help

## v0.6.2

- Update language server
- Support document format if available
- Dependency updates
- README updates

## v0.6.1

- Various README changes

## v0.6.0

- Fix currentsuggestions errors #18
- Add support for tsx/typescript react, fixes #15
- Various README updates
- Dependency updates

## v0.1.6

- Do not throw when editing non-JS/TS files
- Switch off streaming by upgrading to language server 2.2.1
- Simplify English setting descriptions
- Remove `=>` as a split condition for method sigs

## v0.1.5

- Choice of left or right for return types in autocomplete

## v0.1.4

- Ensure functions not messed up by skipping `(`

## v0.1.3

- Split return and param signatures into left/right, fixes #7

## v0.1.2

- Multi-project autocomplete filtering
- Allow disabling of JavaScript support, fixes #5

## v0.1.1

- Fix fuzzy-find autocomplete

## v0.1.0

- First published release
