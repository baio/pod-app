import { filter, isString, keys, map, pipe } from 'lodash/fp';

export const getEnumValues = (x: any) =>
    pipe(
        keys,
        map(key => x[key]),
        filter(isString),
    )(x);
