# webpack-config-jaid


<a href="https://raw.githubusercontent.com/jaid/webpack-config-jaid/master/license.txt"><img src="https://img.shields.io/github/license/jaid/webpack-config-jaid?style=flat-square" alt="License"/></a> <a href="https://github.com/sponsors/jaid"><img src="https://img.shields.io/badge/<3-Sponsor-FF45F1?style=flat-square" alt="Sponsor webpack-config-jaid"/></a>  
<a href="https://actions-badge.atrox.dev/jaid/webpack-config-jaid/goto"><img src="https://img.shields.io/endpoint.svg?style=flat-square&url=https%3A%2F%2Factions-badge.atrox.dev%2Fjaid%2Fwebpack-config-jaid%2Fbadge" alt="Build status"/></a> <a href="https://github.com/jaid/webpack-config-jaid/commits"><img src="https://img.shields.io/github/commits-since/jaid/webpack-config-jaid/v14.1.1?style=flat-square&logo=github" alt="Commits since v14.1.1"/></a> <a href="https://github.com/jaid/webpack-config-jaid/commits"><img src="https://img.shields.io/github/last-commit/jaid/webpack-config-jaid?style=flat-square&logo=github" alt="Last commit"/></a> <a href="https://github.com/jaid/webpack-config-jaid/issues"><img src="https://img.shields.io/github/issues/jaid/webpack-config-jaid?style=flat-square&logo=github" alt="Issues"/></a>  
<a href="https://npmjs.com/package/webpack-config-jaid"><img src="https://img.shields.io/npm/v/webpack-config-jaid?style=flat-square&logo=npm&label=latest%20version" alt="Latest version on npm"/></a> <a href="https://github.com/jaid/webpack-config-jaid/network/dependents"><img src="https://img.shields.io/librariesio/dependents/npm/webpack-config-jaid?style=flat-square&logo=npm" alt="Dependents"/></a> <a href="https://npmjs.com/package/webpack-config-jaid"><img src="https://img.shields.io/npm/dm/webpack-config-jaid?style=flat-square&logo=npm" alt="Downloads"/></a>

**Takes tiny input and returns a Webpack config in the way I personally like.**

#### Opinionated

This project is tailored to my personal needs and workflows and therefore highly opinionated. Feel free to use it or get inspired by it, but please do not get frustrated if you come across weird features or difficulties integrating it in your own ecosystem.




## Installation

<a href="https://npmjs.com/package/webpack-config-jaid"><img src="https://img.shields.io/badge/npm-webpack--config--jaid-C23039?style=flat-square&logo=npm" alt="webpack-config-jaid on npm"/></a>

```bash
npm install --save-dev webpack-config-jaid@^14.1.1
```

<a href="https://yarnpkg.com/package/webpack-config-jaid"><img src="https://img.shields.io/badge/Yarn-webpack--config--jaid-2F8CB7?style=flat-square&logo=yarn&logoColor=white" alt="webpack-config-jaid on Yarn"/></a>

```bash
yarn add --dev webpack-config-jaid@^14.1.1
```






## Usage

Main types:

Type|Example Project
---|---
adobeCep|[emote-workflow](https://github.com/Jaid/emote-workflow)
cli|[package-field-cli](https://github.com/Jaid/package-field-cli)
githubAction|[action-npm-install](https://github.com/Jaid/action-npm-install)
nodeClass|[socket-enhance](https://github.com/Jaid/socket-enhance)
nodeLib|[buffer-to-data-url](https://github.com/Jaid/buffer-to-data-url)
nodeScript|[emote-workflow/client](https://github.com/Jaid/emote-workflow/tree/master/client)
reactDomComponent|[react-modern-picture](https://github.com/jaid/react-modern-picture)
universalClass|[key-counter](https://github.com/Jaid/key-counter)
universalLib|[epoch-seconds](https://github.com/Jaid/epoch-seconds)
webapp|[letter.bar](https://github.com/Jaid/letter.bar)

Unused types:

Type|Example Project
---|---
generatorCorePlugin|
executable|
html|
node|







## Environment Variables

Following environment variables are read by webpack-config-jaid:

Name|Description
---|---
browserSync|Can be a number that will be used as port for Browser Sync.
debugWebpack|If defined, debugging files will be written to `dist` folder.
GITHUB_WORKFLOW|If defined, CI mode will be active which increases script compression rate.
NODE_ENV|Used to determine if `webpackConfig.mode` should be `"development"` or not.
TRAVIS_TAG|If defined, CI mode will be active which increases script compression rate.
webpackDevtool|Overwrites `webpackConfig.devtool` with given value.
webpackPort|Port that `webpack-dev-server` hosts the HMR app on. Same as option devPort.









## Development

<details>
<summary><b>Development hints for maintaining and improving webpack-config-jaid</b></summary>



Setting up:
```bash
git clone git@github.com:jaid/webpack-config-jaid.git
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

</details>

## License
[MIT License](https://raw.githubusercontent.com/jaid/webpack-config-jaid/master/license.txt)  
Copyright © 2021, Jaid \<jaid.jsx@gmail.com> (https://github.com/jaid)

<!---
Readme generated with tldw v7.1.0
https://github.com/Jaid/tldw
-->