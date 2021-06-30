export default function myPlugin() {
  const fileRegex = /\.(vue)$/
  return {
    name: 'ViewVue', // required, will show up in warnings and errors
    transform(src: string, id: any) {
      if (fileRegex.test(id)) {
        const update = src
          .split('from "vue"')
          .join('from "./.vue-playground/vue"')

        return {
          code: update,
          map: null, // provide source map if available
        }
      }
    },
  }
}
