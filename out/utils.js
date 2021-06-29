"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEntry = exports.createContentEntry = exports.createEntryHtml = void 0;
const createEntryHtml = () => {
    return `<!DOCTYPE html>
    <html>
        <head>
            <style>
                * {
                    border-sizing: border-box;
                }
                html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                }
            </style>
        </head>
        <body>
        <script type="module" src="./index.js"></script>          
        <div id="app"></div>
        </body>
    </html>`;
};
exports.createEntryHtml = createEntryHtml;
const createContentEntry = (port = 9123) => {
    return `<html>
        <header>
            <style>
                body, html, div {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background-color: #fff;
                }
            </style>
        </header>
        <body>
            <div>
                <iframe src="http://localhost:${port}" width="100%" height="100%" seamless frameborder=0>
                </iframe>
            </div>
        </body>
    </html>`;
};
exports.createContentEntry = createContentEntry;
const createEntry = (entryPath) => `
    import { createApp } from 'vue';\n\n
    import App from '${entryPath}';\n\n  
    createApp(App).mount('#app');
`;
exports.createEntry = createEntry;
//# sourceMappingURL=utils.js.map