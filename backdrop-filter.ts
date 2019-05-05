import {
  LitElement,
  html,
  css,
  CSSResult,
  property,
  customElement,
} from 'lit-element'

@customElement('backdrop-filter')
class BackdropFilter extends LitElement {
  @property({ type: String })
  public filters: string = 'none'

  static styles = [
    css`
      :host {
        display: block;

        width: 100%;
        height: 100%;

        overflow: hidden;

        background-color: white;
      }

      #inner {
        position: relative;

        width: var(--body-width);
        height: var(--body-height);

        top: calc(8px - var(--y));
        left: calc(8px - var(--x));

        will-change: transform;

        filter: var(--filters);
      }
    `,
  ]

  render() {
    return html`
      <div id="inner">
        ${this.cloneOutside()}
      </div>
    `
  }

  connectedCallback() {
    super.connectedCallback()

    const {
      width: bodyWidth,
      height: bodyHeight,
    } = document.body.getBoundingClientRect()
    this.style.setProperty('--body-width', `${bodyWidth}px`)
    this.style.setProperty('--body-height', `${bodyHeight}px`)

    const { left: x, top: y } = this.parentElement.getBoundingClientRect()
    this.style.setProperty('--x', `${x}px`)
    this.style.setProperty('--y', `${y}px`)

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        ;(this.shadowRoot
          .children[0] as HTMLElement).style.transform = `translateY(-${
          document.body.scrollTop
        }px)`
      })
    })

    window.addEventListener('resize', () => {
      requestAnimationFrame(() => {
        const { left, top } = this.parentElement.getBoundingClientRect()
        const { width, height } = document.body.getBoundingClientRect()

        this.style.setProperty('--body-width', `${width}px`)
        this.style.setProperty('--body-height', `${height}px`)

        this.style.setProperty('--x', `${left}px`)
        this.style.setProperty('--y', `${top}px`)
      })
    })
  }

  attributeChangedCallback(name, old, value) {
    super.attributeChangedCallback(name, old, value)

    this.style.setProperty('--filters', this.filters)
  }

  private cloneOutside() {
    let parent: HTMLElement | undefined
    if (this.isConnected) {
      parent = this.parentElement
      parent.removeChild(this)
    }

    const clones = [...document.body.children, ...document.head.children].map(
      child => child.cloneNode(true),
    )

    if (parent) {
      parent.appendChild(this)
    }

    return clones
  }
}
