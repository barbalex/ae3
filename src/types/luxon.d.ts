// this install of luxon ships no type declarations and no @types
// package is installed; this covers the surface the app actually uses
declare module 'luxon' {
  export class DateTime {
    static fromSQL(text: string | null | undefined): DateTime
    static fromJSDate(date: Date): DateTime
    readonly isValid: boolean
    toFormat(fmt: string): string
    toJSDate(): Date
    valueOf(): number
  }
}
