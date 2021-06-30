import * as vscode from 'vscode'
import * as fs from 'fs'

// Vite
import { createServer, ViteDevServer } from 'vite'
import VueVitePlugin from '@vitejs/plugin-vue'
import VueViewPlugin from './plugins/vue-view.plugin'

// Components
import { createPanel } from './utils/createPanel.util'
import {
  createFilesEntries,
  removeFilesEntries,
} from './utils/createFilesEntry.util'
import { getFileExt, getWorkSpacePath } from './utils/global.util'

// Constants
const EXTENSION = 'vue'
const contentBasePath = getWorkSpacePath()

let devServer: ViteDevServer
let panel: vscode.WebviewPanel

export function activate(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor

  // If Editor never opened we can't register command
  if (!editor) {
    return
  }

  // If File ext not VUE we cannot register command
  const ext = getFileExt(editor?.document.fileName)
  if (EXTENSION !== ext) {
    return
  }

  // Else register command and create important files
  let filePath = editor?.document.uri.path

  // create folder
  if (!fs.existsSync(contentBasePath)) {
    fs.mkdirSync(contentBasePath)
  }

  // for windows a bit different
  const isWin = /^win/.test(process.platform)

  if (isWin) {
    filePath = filePath?.substr(1)
  }

  const onTabClose = () => {
    removeFilesEntries(contentBasePath)
    devServer.close()
  }

  const createPlayground = () => {
    try {
      if (!devServer) {
        // Define all base files
        createFilesEntries(contentBasePath, filePath)

        // Init vite server
        const init = async () => {
          const server = await createServer({
            configFile: false,
            root: `${contentBasePath}`,
            server: {
              port: 1337,
            },
            plugins: [VueVitePlugin(), VueViewPlugin()],
          })
          await server.listen()

          panel = createPanel()
          panel.onDidDispose(onTabClose)
          devServer = server
        }
        init()
      } else {
        panel = createPanel()
        panel.onDidDispose(onTabClose)
      }
    } catch (err) {
      console.log(err)
      vscode.window.showInformationMessage('ERROR', err)
    }
  }

  // Register command
  const disposable = vscode.commands.registerCommand(
    'viewVue.previewComponent',
    createPlayground
  )

  context.subscriptions.push(disposable)
}

// Cleanup
export function deactivate() {
  devServer.close()
  panel.dispose()
}
