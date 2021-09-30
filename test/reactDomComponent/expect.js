import path from "node:path"

import React from "react"
import reactTestRenderer from "react-test-renderer"
import readFileStringModule from "read-file-string"

const readFileString = readFileStringModule.default

export default async ({packageOutDir, development}) => {
  const {default: Component} = await import(path.join(packageOutDir, "index.js"))
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
  if (!development) {
    const typeDefinition = await readFileString(path.join(packageOutDir, "index.d.ts"))
    expect(typeDefinition).toMatch(/export type Props/)
    expect(typeDefinition).toMatch(/textLength: number/)
    expect(typeDefinition).toMatch(/text: string/)
  }
}