export const booleanToJaNein = (val: boolean | string): string =>
  val.toString().replace('true', 'ja').replace('false', 'nein')
