const typeTranslator: Record<string, string> = {
  String: 'Text',
  Integer: 'Ganzzahl',
  Number: 'Zahl',
  Boolean: 'ja/nein',
  Array: 'Liste von Werten',
}

export const readableType = (type: string): string =>
  typeTranslator[type] ? typeTranslator[type] : type
