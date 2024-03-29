import path from "node:path"

import createDebug from "debug"
import delay from "delay"
import {pathExists} from "fs-extra"
import pify from "pify"
import puppeteer from "puppeteer"
import webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"

const debug = createDebug("webpack-config-jaid")

async function testHmr(webpackConfig) {
  const compiler = webpack(webpackConfig)
  debug("HMR webpack config: %o", webpackConfig)
  const devServer = new WebpackDevServer(compiler, webpackConfig.devServer)
  debug("WebpackDevServer: %o", devServer)
  devServer.listen(webpackConfig.devServer.port, "localhost", error => {
    if (error) {
      throw error
    }
    debug("WebpackDevServer listening at localhost:", webpackConfig.devServer.port)
  })
  // If this is not given, there will be random “is not a constructor” errors, very weird
  await delay(3000)
  let browser
  let forwardedError
  try {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`http://localhost:${webpackConfig.devServer.port}`, {
      waitUntil: "networkidle2",
    })
    const text = await page.evaluate(() => {
      // eslint-disable-next-line
      return document.querySelector("#info").innerText
    })
    debug("Text on page: %s", text)
    expect(text.startsWith("This is a browser environment with user-agent Mozilla")).toBeTruthy()
  } catch (error) {
    forwardedError = error
  }
  await browser?.close()
  const finalDelay = process.env.devServerLifetime ? Number(process.env.devServerLifetime) : 3000
  await delay(finalDelay)
  const close = pify(devServer.close.bind(devServer))
  await close()
  if (forwardedError) {
    throw forwardedError
  }
}

export default async ({packageOutDir, webpackConfig, meta}) => {
  if (meta.hmr) {
    debug("%o", webpackConfig)
    await testHmr(webpackConfig)
    return
  }
  const indexHtml = path.join(packageOutDir, "index.html")
  const indexHtmlExists = await pathExists(indexHtml)
  expect(indexHtmlExists).toBeTruthy()
  let browser
  let forwardedError
  try {
    browser = await puppeteer.launch({
      defaultViewport: {
        width: 300,
        height: 300,
      },
    })
    const page = await browser.newPage()
    await page.goto(`file:${indexHtml}`, {
      waitUntil: "networkidle2",
    })
    const text = await page.evaluate(() => {
      // eslint-disable-next-line
      return document.querySelector("#info").innerText
    })
    expect(text.startsWith("This is a browser environment with user-agent Mozilla")).toBeTruthy()
    const boundingBox = await page.evaluate(() => {
      // eslint-disable-next-line
      const rect = document.querySelector("img").getBoundingClientRect()
      return {
        width: rect.width,
        height: rect.height,
      }
    })
    // If the icon loaded properly, the DOM element is at least as large as the image file
    expect(boundingBox.width).toBeGreaterThan(100)
    expect(boundingBox.height).toBeGreaterThan(100)
  } catch (error) {
    forwardedError = error
  }
  await browser?.close()
  if (forwardedError) {
    throw forwardedError
  }
}