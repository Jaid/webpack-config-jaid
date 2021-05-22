import htmlTemplate from "./htmlTemplate.hbs?html"
import rawTemplate from "./rawTemplate.hbs"

export default () => {
  return {
    rawResult: rawTemplate({
      character: "<",
    }),
    htmlResult: htmlTemplate({
      character: "<",
    }),
  }
}