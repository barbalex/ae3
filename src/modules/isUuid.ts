import isUuidLib from 'is-uuid'

import { invalidUuids } from './invalidUuids'

/**
 * There exist two invalid uuids in arteigenschaften.ch!
 * stemming from manually added species...
 * reason for invalidity is explained here: https://github.com/afram/is-uuid/issues/4#issuecomment-521610801
 */

export const isUuid = (val: unknown): boolean =>
  isUuidLib.anyNonNil(val as string) || invalidUuids.includes(val as string)
