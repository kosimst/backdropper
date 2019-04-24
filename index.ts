export default function dropper() {
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
        const { x, y } = elmnt.getBoundingClientRect()
        const {
          width: bodyWidth,
          height: bodyHeight,
        } = document.body.getBoundingClientRect()

        const html = document.body.innerHTML
        const styles = [...document.head.querySelectorAll('style:not([type])')]
          .map(el => el.outerHTML)
          .join('\n')

        const data = `
        <svg xmlns='http://www.w3.org/2000/svg'
          width="${bodyWidth}px"
          height="${bodyHeight}px"
        >
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${styles}
              ${html}
            </div>
          </foreignObject>
        </svg>
        `
        const img = new Image()
        const svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svg)
        img.src = url
        elmnt.appendChild(img)

        img.style.position = 'relative'
        img.style.top = `${8 - y}px`
        img.style.left = `${8 - x}px`

        // @ts-ignore
        img.style.willChange = 'transform'

        img.style.transform = `translateY(-${document.body.scrollTop}px)`

        elmnt.style.backgroundColor = 'white'
        elmnt.style.overflow = 'hidden'
        img.style.filter = filters

        window.addEventListener('scroll', e => {
          requestAnimationFrame(() => {
            img.style.transform = `translateY(-${document.body.scrollTop}px)`
          })
        })
      })
    }
  })
}
