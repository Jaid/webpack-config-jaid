import formatThousands from "format-thousands"

const narrowNonBreakingSpace = String.fromCharCode(8239)

export default number => {
  return formatThousands(number, {
    seperator: narrowNonBreakingSpace,
    formatFourDigits: false,
  })
}