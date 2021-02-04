<div align="center">
  <p>
    <a>
        <img src="onetap_clear.png" alt="logo" width="200">
    </a>
  <p>
    <a href="https://discord.gg/9YMVect"><img src="https://img.shields.io/discord/696116103033651270?color=7289da&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/onetap-api"><img src="https://img.shields.io/npm/v/onetap-api.svg" alt="NPM version" /></a>
    <a href="https://github.com/aprxl/OnetapJS"><img src="https://img.shields.io/github/forks/aprxl/OnetapJS" alt="github forks" /></a>
  <p>
    <a href="https://nodei.co/npm/onetap-api/"><img src="https://nodei.co/npm/onetap-api.png?downloads=true&stars=true" alt="npm installnfo" /></a>
  </p>
</div>

# About

**OnetapJS** is a *complete*, *open-source* module made in [Node](https://nodejs.org/en/) that allows you to smoothly use Onetap's Cloud API.

# Installation

[Node.js](https://nodejs.org/en/) is required.

```npm
npm install onetap-api
```

# Setting up

Setting things up is extremely easy. First, you'll need to generate your API keys [here](https://www.onetap.com/account/cloud/) and then do the following:

```js
const Onetap = require("onetap-api");

const API = new Onetap(
    "Your-X-Api-Id-Here",
    "Your-X-Api-Secret-Here",
    "Your-X-Api-Key-Here"
);
```

# Documentation

All the documentation can be found in our [wiki](https://github.com/aprxl/OnetapJS/wiki).

# Help

If you need any further assistance, tips or guidance on how to use this library or the Cloud API, feel free to join our [Discord server](https://discord.gg/9YMVect).
