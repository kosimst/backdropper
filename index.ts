import './backdrop-filter.js'

export default function backdropper() {
  const styleSheets = document.styleSheets

  const affectedRules = new Map()

  for (const { ownerNode } of styleSheets) {
    if (ownerNode instanceof HTMLStyleElement) {
      const css = ownerNode.innerHTML

      const selectors = css
        .match(/(?<selector>.*){/g)
        .map(selector => selector.replace('{', '').trim())
      const rules = css.match(/\{(.*?)\}/gs)

      rules.forEach((rule, i) => {
        let filters = ''

        const rawFilterString = /backdrop-filter\:\w*?(?<filters>.*);/.exec(
          rule,
        )

        if (rawFilterString) {
          // @ts-ignore
          filters = rawFilterString.groups.filters.trim()
        }

        if (filters.length) {
          affectedRules.set(selectors[i], filters)
        }
      })
    }
  }

  affectedRules.forEach((filters, selector) => {
    const elements = document.querySelectorAll(selector)

    if (elements) {
      ;[...elements].forEach(elmnt => {
        const filter = document.createElement('backdrop-filter')

        filter.setAttribute('filters', filters)

        elmnt.appendChild(filter)
      })
    }
  })
}

