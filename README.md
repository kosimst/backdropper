# Backdropper

## A Polyfill for backdrop-filter

### Overview

Dropper lets allows you to use the until-now unsupported CSS-Property `backdrop-filter`. It works with scrolling. It is implemented using custom elements.

### Used technologies

- Typescript
- CustomElements
- ShadowDOM for encapsulation
- LitElement as base class for CustomElement

### Install

npm install backdropper

**OR**

`import backdropper from 'https://unpkg.com/backdropper@0.1.0/dist/index.js?module'`

### Usage

Simply use the `backdrop-filter` CSS-Property with the same values as in the normal `filter`-property. Then, import the polyfill as seen in `index.html` and execute the function.

### Features

#### Currently done

- `backdrop-filter` for `<style>`-Tags
- CustomElement
- Scroll support
- Resize Support

#### Coming

- Support for external stylesheets

- Support for WebComponents (ShadowDom + Style encapsulation)

### Try

Currenty, this package is in early development. It will be published to npm. At the moment you have to clone this repository and compile the `.ts`-files. You have to serve it through polymer-cli with `npm run dev`. You can try this polyfill out in the `index.html`.

If you want to try it out without installing it, import it from unpkg:

`import backdropper from 'https://unpkg.com/backdropper@0.1.0/dist/index.js?module'`

### TODOs

- Adding 'Coming'-Features
- Demo site
- CI-Setup
