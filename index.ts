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
        let { x, y } = elmnt.getBoundingClientRect()
        let {
          width: bodyWidth,
          height: bodyHeight,
        } = document.body.getBoundingClientRect()

        const body = document.body.innerHTML
        const head = document.head.innerHTML

        const wrapper = document.createElement('div')
        elmnt.appendChild(wrapper)

        wrapper.style.position = 'relative'
        wrapper.style.top = `${8 - y}px`
        wrapper.style.left = `${8 - x}px`

        const shadow = wrapper.attachShadow({ mode: 'open' })

        shadow.innerHTML = `
          ${head}
          ${body}
        `

        wrapper.style.width = `${bodyWidth}px`
        wrapper.style.height = `${bodyHeight}px`

        // @ts-ignore
        wrapper.style.willChange = 'transform'

        wrapper.style.transform = `translateY(-${document.body.scrollTop}px)`

        elmnt.style.backgroundColor = 'white'
        elmnt.style.overflow = 'hidden'
        wrapper.style.filter = filters

        window.addEventListener('scroll', e => {
          requestAnimationFrame(() => {
            wrapper.style.transform = `translateY(-${
              document.body.scrollTop
            }px)`
          })
        })

        window.addEventListener('resize', () => {
          requestAnimationFrame(() => {
            ;({ x, y } = elmnt.getBoundingClientRect())
            ;({
              width: bodyWidth,
              height: bodyHeight,
            } = document.body.getBoundingClientRect())

            wrapper.style.width = `${bodyWidth}px`
            wrapper.style.height = `${bodyHeight}px`

            wrapper.style.top = `${8 - y}px`
            wrapper.style.left = `${8 - x}px`
          })
        })
      })
    }
  })
}
