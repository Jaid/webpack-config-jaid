interface ClassNames {
  [className: string]: string
}

declare module "*.txt" {
  const type: string;
  export default type;
}

declare module "*.hbs" {
  const type: (templateContext?: Object) => string;
  export default type;
}

declare module "*.css" {
  const type: ClassNames
  export default type
}

declare module "*.sass" {
  const type: ClassNames
  export default type
}

declare module "*.scss" {
  const type: ClassNames
  export default type
}