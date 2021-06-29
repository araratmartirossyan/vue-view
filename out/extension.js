"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const vite_1 = require("vite");
const plugin_vue_1 = require("@vitejs/plugin-vue");
const utils_1 = require("./utils");
let devServer = null;
function activate(context) {
    const { rootPath: workspacePath = '' } = vscode.workspace; //users work dir
    const contentBase = path.join(path.normalize(workspacePath), '.vue-playground');
    //create folder
    if (!fs.existsSync(contentBase)) {
        fs.mkdirSync(contentBase);
    }
    let disposable = vscode.commands.registerCommand('tt.helloWorld', () => {
        try {
            const editor = vscode.window.activeTextEditor;
            let filePath = editor === null || editor === void 0 ? void 0 : editor.document.uri.path;
            const isWin = /^win/.test(process.platform);
            if (isWin) {
                filePath = filePath === null || filePath === void 0 ? void 0 : filePath.substr(1);
            }
            if (!devServer) {
                fs.writeFileSync(path.join(contentBase, 'playground.html'), utils_1.createContentEntry());
                fs.writeFileSync(path.join(contentBase, 'index.js'), utils_1.createEntry(filePath));
                fs.writeFileSync(path.join(contentBase, 'index.html'), utils_1.createEntryHtml());
                const panel = vscode.window.createWebviewPanel('vscode.previewHtml', 'vue-view', {
                    viewColumn: vscode.ViewColumn.Beside,
                }, {
                    enableScripts: true,
                });
                const init = () => __awaiter(this, void 0, void 0, function* () {
                    const server = yield vite_1.createServer({
                        configFile: false,
                        root: `${contentBase}`,
                        server: {
                            port: 1337,
                        },
                        plugins: [plugin_vue_1.default()],
                    });
                    yield server.listen();
                    panel.webview.html = utils_1.createContentEntry(1337);
                    devServer = server;
                });
                init();
            }
            else {
                const panel = vscode.window.createWebviewPanel('vscode.previewHtml', 'vue-view', {
                    viewColumn: vscode.ViewColumn.Beside,
                }, {
                    enableScripts: true,
                });
                panel.webview.html = utils_1.createContentEntry(1337);
            }
        }
        catch (err) {
            console.log(err);
            vscode.window.showInformationMessage('ERROR', err);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map