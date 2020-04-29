declare module "\*.hbs" {
  const content: (templateContext?: object) => string;
  export default content;
}
