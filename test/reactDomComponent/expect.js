const path = require("path")
const reactTestRenderer = require("react-test-renderer")
const React = require("react")
const readFileString = require("read-file-string").default

exports.default = async ({packageOutDir, env}) => {
  const Component = require(path.join(packageOutDir, "index.js")).default
  const dom = React.createElement(Component, {
    className: "abc",
    text: "content",
  })
  const renderResult = reactTestRenderer.create(dom).toJSON()
  expect(renderResult).toMatchObject({
    type: "span",
    props: {
      className: "myclass abc",
    },
    children: ["con"],
  })
  // TODO: Enable again
  // if (env === "production") {
  //   const typeDefinition = await readFileString(path.join(packageOutDir, "index.d.ts"))
  //   expect(typeDefinition).toMatch(/export type Props/)
  //   expect(typeDefinition).toMatch(/textLength: number/)
  //   expect(typeDefinition).toMatch(/text: string/)
  // }
}