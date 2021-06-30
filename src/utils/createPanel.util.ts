import * as vscode from 'vscode'
import { createContentEntry } from './global.util'

export const createPanel = () => {
  const newPanel = vscode.window.createWebviewPanel(
    'vscode.previewHtml',
    'vue-view',
    {
      viewColumn: vscode.ViewColumn.Beside,
    },
    {
      enableScripts: true,
    }
  )

  newPanel.webview.html = createContentEntry(1337)

  return newPanel
}
