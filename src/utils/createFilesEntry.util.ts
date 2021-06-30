import * as fs from 'fs'
import * as path from 'path'
import * as fsExtra from 'fs-extra'
import { createContentEntry, createEntryHtml, createEntry } from './global.util'
import { resolve } from 'path'

export const createFilesEntries = (
  contentBase: string,
  filePath: string | undefined
) => {
  fs.writeFileSync(
    path.join(contentBase, 'playground.html'),
    createContentEntry()
  )
  fs.writeFileSync(path.join(contentBase, 'index.js'), createEntry(filePath))
  fs.writeFileSync(path.join(contentBase, 'index.html'), createEntryHtml())

  fs.readFile('../../node_modules/vue/dist/vue.cjs.prod.js', (err, res) => {
    if (err) {
      console.log('ERROR', err)
      throw err
    }
    fs.writeFileSync(path.join(contentBase, 'vue.js'), res.toString())
  })

  fs.copyFileSync(
    `${__dirname}/vue.cjs.prod.js`,
    path.join(contentBase, 'vue.js')
  )
}

export const removeFilesEntries = (contentBase: string) => {
  fsExtra.removeSync(contentBase)
}
