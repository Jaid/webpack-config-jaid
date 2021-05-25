const puppeteer = require("puppeteer")
const path = require("path")
const {pathExists} = require("fs-extra")

exports.default = async ({packageOutDir}) => {
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
    expect(boundingBox.width).toBeGreaterThan(100)
  } catch (error) {
    forwardedError = error
  }
  await browser?.close()
  if (forwardedError) {
    throw forwardedError
  }
}