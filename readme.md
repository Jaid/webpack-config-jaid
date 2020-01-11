# webpack-config-jaid


<a href="https://raw.githubusercontent.com/Jaid/webpack-config-jaid/master/license.txt"><img src="https://img.shields.io/github/license/Jaid/webpack-config-jaid?style=flat-square" alt="License"/></a>  
<a href="https://actions-badge.atrox.dev/Jaid/webpack-config-jaid/goto"><img src="https://img.shields.io/endpoint.svg?style=flat-square&url=https%3A%2F%2Factions-badge.atrox.dev%2FJaid%2Fwebpack-config-jaid%2Fbadge" alt="Build status"/></a> <a href="https://github.com/Jaid/webpack-config-jaid/commits"><img src="https://img.shields.io/github/commits-since/Jaid/webpack-config-jaid/v10.0.0?style=flat-square&logo=github" alt="Commits since v10.0.0"/></a> <a href="https://github.com/Jaid/webpack-config-jaid/commits"><img src="https://img.shields.io/github/last-commit/Jaid/webpack-config-jaid?style=flat-square&logo=github" alt="Last commit"/></a> <a href="https://github.com/Jaid/webpack-config-jaid/issues"><img src="https://img.shields.io/github/issues/Jaid/webpack-config-jaid?style=flat-square&logo=github" alt="Issues"/></a>  
<a href="https://npmjs.com/package/webpack-config-jaid"><img src="https://img.shields.io/npm/v/webpack-config-jaid?style=flat-square&logo=npm&label=latest%20version" alt="Latest version on npm"/></a> <a href="https://github.com/Jaid/webpack-config-jaid/network/dependents"><img src="https://img.shields.io/librariesio/dependents/npm/webpack-config-jaid?style=flat-square&logo=npm" alt="Dependents"/></a> <a href="https://npmjs.com/package/webpack-config-jaid"><img src="https://img.shields.io/npm/dm/webpack-config-jaid?style=flat-square&logo=npm" alt="Downloads"/></a>

**Takes tiny input and returns a Webpack config in the way I personally like.**














## Installation
<a href="https://npmjs.com/package/webpack-config-jaid"><img src="https://img.shields.io/badge/npm-webpack--config--jaid-C23039?style=flat-square&logo=npm" alt="webpack-config-jaid on npm"/></a>
```bash
npm install --save-dev webpack-config-jaid@^10.0.0
```
<a href="https://yarnpkg.com/package/webpack-config-jaid"><img src="https://img.shields.io/badge/Yarn-webpack--config--jaid-2F8CB7?style=flat-square&logo=yarn&logoColor=white" alt="webpack-config-jaid on Yarn"/></a>
```bash
yarn add --dev webpack-config-jaid@^10.0.0
```





Following environment variables are read by webpack-config-jaid:

Name|Description
---|---
NODE_ENV|Used to determine if `webpackConfig.mode` should be `"development"` or not.
debugWebpack|If defined, debugging files will be written to `dist` folder.
browserSync|Can be a number that will be used as port for Browser Sync.
TRAVIS_TAG|If defined, CI mode will be active which increases script compression rate.
GITHUB_WORKFLOW|If defined, CI mode will be active which increases script compression rate.
webpackPort|Port that `webpack-dev-server` hosts the HMR app on.
webpackDevtool|Overwrites `webpackConfig.devtool` with given value.



## Development



Setting up:
```bash
git clone git@github.com:Jaid/webpack-config-jaid.git
cd webpack-config-jaid
npm install
```
Testing:
```bash
npm run test:dev
```
Testing in production environment:
```bash
npm run test
```


## License
```text
MIT License

Copyright © 2020, Jaid <jaid.jsx@gmail.com> (github.com/jaid)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
