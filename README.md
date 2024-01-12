<p align="center">
<img src="https://github.com/wangyewei/nprogress-esm/assets/49926816/515442e2-d0fd-4733-a5ab-e903d0066d0e" height="150">
</p>

<h1 align="center">
  nprogress-esm
</h1>
<p align="center">
Esm-friendly <a href="https://github.com/rstacruz/nprogress">nprogress</a> rewrite with typescript
<p>

<p align="center">
 <a href="https://codecov.io/gh/wangyewei/nprogress-esm"><img src="https://codecov.io/gh/wangyewei/nprogress-esm/graph/badge.svg?token=IMS77BM6N2"/></a>
  <a href="https://www.npmjs.com/package/nprogress-esm"><img src="https://img.shields.io/npm/v/nprogress-esm?color=729B1B&label=npm"></a>
  <a href="https://www.npmjs.com/package/nprogress-esm"><img src="https://img.shields.io/npm/dt/nprogress-esm.svg"></a>
 
</p>

<p align="center">
 <a href="nprogress-esm">Get Started!</a>
<p>


<br />
<br />

## Installation

Use `npm` to install.

```sh
$ npm install --save nprogress-esm
```

## Basic usage

Simply use `.start()` and `.done()` to control the start and end.

```typescript
import Progress from 'nprogress-esm'
import 'nprogress-esm/dist/style.css'

Progress.start()
Progress.done()
```

You can also use `.set()`.

```typescript
Progress.set(0) // same as Progress.start()
Progress.set(100) // same as Progress.end()
```

## Thanks

> [nprogress](https://github.com/rstacruz/nprogress)

## License

[MIT](./LICENSE) License © 2024-Present [Yev Wang](https://github.com/wangyewei)
