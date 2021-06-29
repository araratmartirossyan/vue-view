import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { createServer } from 'vite'
import VueVitePlugin from '@vitejs/plugin-vue'

import { createContentEntry, createEntryHtml, createEntry } from './utils'

let devServer: any = null

export function activate(context: vscode.ExtensionContext) {
  const { rootPath: workspacePath = '' } = vscode.workspace //users work dir
  const contentBase = path.join(
    path.normalize(workspacePath),
    '.vue-playground'
  )

  //create folder
  if (!fs.existsSync(contentBase)) {
    fs.mkdirSync(contentBase)
  }

  let disposable = vscode.commands.registerCommand('tt.helloWorld', () => {
    try {
      const editor = vscode.window.activeTextEditor
      let filePath = editor?.document.uri.path
      const isWin = /^win/.test(process.platform)

      if (isWin) {
        filePath = filePath?.substr(1)
      }
      if (!devServer) {
        fs.writeFileSync(
          path.join(contentBase, 'playground.html'),
          createContentEntry()
        )
        fs.writeFileSync(
          path.join(contentBase, 'index.js'),
          createEntry(filePath)
        )
        fs.writeFileSync(
          path.join(contentBase, 'index.html'),
          createEntryHtml()
        )

        const panel = vscode.window.createWebviewPanel(
          'vscode.previewHtml',
          'vue-view',
          {
            viewColumn: vscode.ViewColumn.Beside,
          },
          {
            enableScripts: true,
          }
        )

        const init = async () => {
          const server = await createServer({
            configFile: false,
            root: `${contentBase}`,
            server: {
              port: 1337,
            },
            plugins: [VueVitePlugin()],
          })
          await server.listen()

          panel.webview.html = createContentEntry(1337)

          devServer = server
        }
        init()
      } else {
        const panel = vscode.window.createWebviewPanel(
          'vscode.previewHtml',
          'vue-view',
          {
            viewColumn: vscode.ViewColumn.Beside,
          },
          {
            enableScripts: true,
          }
        )

        panel.webview.html = createContentEntry(1337)
      }
    } catch (err) {
      console.log(err)
      vscode.window.showInformationMessage('ERROR', err)
    }
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
