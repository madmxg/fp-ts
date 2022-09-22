import * as _ from '../../src/ReadonlyArray'
import { identity, pipe } from '../../src/function'
import * as N from '../../src/number'
import type { Ord } from '../../src/Ord'
import * as E from '../../src/Either'
import * as T from '../../src/Task'

declare const n: number
declare const sn: string | number
declare const isString: (u: unknown) => u is string
declare const predicate: (sn: string | number) => boolean
declare const sns: ReadonlyArray<string | number>
declare const predicateK: (sn: string | number) => T.Task<boolean>
declare const ns: ReadonlyArray<number>

declare const rus: ReadonlyArray<unknown>
declare const rss: ReadonlyArray<string>
declare const rtns: ReadonlyArray<readonly [number, string]>

// -------------------------------------------------------------------------------------
// fromRefinement
// -------------------------------------------------------------------------------------

// $ExpectType ReadonlyArray<string>
pipe(sn, _.fromRefinement(isString))
pipe(
  sn,
  _.fromRefinement(
    (
      n // $ExpectType string | number
    ): n is number => typeof n === 'number'
  )
)
// $ExpectType Either<readonly number[], ReadonlyNonEmptyArray<number>>
pipe(
  ns,
  E.fromRefinement(
    _.some((n: number) => n > 0),
    identity
  )
)

// -------------------------------------------------------------------------------------
// fromPredicate
// -------------------------------------------------------------------------------------

// $ExpectType readonly (string | number)[]
pipe(sn, _.fromPredicate(predicate))

// $ExpectType ReadonlyArray<number>
pipe(n, _.fromPredicate(predicate))

pipe(
  n,
  _.fromPredicate(
    (
      _n // $ExpectType number
    ) => true
  )
)

// -------------------------------------------------------------------------------------
// filterE
// -------------------------------------------------------------------------------------

// $ExpectType Task<readonly (string | number)[]>
pipe(sns, _.filterE(T.ApplicativePar)(predicateK))

// $ExpectType Task<readonly number[]>
pipe(ns, _.filterE(T.ApplicativePar)(predicateK))

pipe(
  sns,
  _.filterE(T.ApplicativePar)(
    (
      _sn // $ExpectType string | number
    ) => T.of(true)
  )
)

//
// -------------------------------------------------------------------------------------
//

//
// zip
//

pipe(ns, _.zip(rss)) // $ExpectType readonly (readonly [number, string])[]

//
// zipWith
//

// $ExpectType readonly (readonly [number, string])[]
pipe(
  ns,
  _.zipWith(rss, (n, s) => [n, s] as const)
)

//
// unzip
//

_.unzip(rtns) // $ExpectType readonly [readonly number[], readonly string[]]
pipe(rtns, _.unzip) // $ExpectType readonly [readonly number[], readonly string[]]

//
// refine
//

// $ExpectType readonly string[]
pipe(prsns, _.refine(isString))

//
// filter
//

// $ExpectType readonly number[]
pipe(prns, _.filter(predicate))
// $ExpectType readonly number[]
pipe(
  prns,
  _.filter(
    (
      _x // $ExpectType number
    ) => true
  )
)

// #1484
const isPositive = E.exists((n: number) => n > 0)
declare const eithers: ReadonlyArray<E.Either<string, number>>
pipe(eithers, _.filter(E.isRight), _.filter(isPositive))

interface Registered {
  readonly type: 'Registered'
  readonly username: string
}
interface Unregistered {
  readonly type: 'Unregistered'
}

type User = Registered | Unregistered

declare const users: ReadonlyArray<User>
declare const isRegistered: (u: User) => u is Registered
declare const p: (u: User) => boolean

// $ExpectType readonly Registered[]
const registereds = _.refine(isRegistered)(users)
// $ExpectType readonly Registered[]
pipe(registereds, _.filter(p))

interface Test {
  test: string
}
declare const arrayOfTest: Array<Test>
const isFoo = <T extends Test>(t: T) => t.test === 'foo'
pipe(arrayOfTest, _.filter(isFoo)) // $ExpectType readonly Test[]

//
// refineWithIndex
//

// $ExpectType readonly number[]
pipe(
  rus,
  _.refineWithIndex((_, u: unknown): u is number => typeof u === 'number')
)

//
// refinement
//

// $ExpectType readonly [readonly unknown[], readonly number[]]
pipe(
  rus,
  _.refinement((u: unknown): u is number => typeof u === 'number')
)

//
// refinementWithIndex
//

// $ExpectType readonly [readonly unknown[], readonly number[]]
pipe(
  rus,
  _.refinementWithIndex((_, u: unknown): u is number => typeof u === 'number')
)

//
// spanLeft
//

// $ExpectType readonly [init: readonly number[], rest: readonly unknown[]]
pipe(
  rus,
  _.spanLeft((u: unknown): u is number => typeof u === 'number')
)

//
// lookup
//

_.lookup(0) // $ExpectType <A>(as: readonly A[]) => Option<A>

//
// elem
//

pipe([1, 2, 3], _.elem(N.Eq)(1)) // $ExpectType boolean

//
// difference
//

pipe([1, 2], _.difference(N.Eq)([3, 4])) // $ExpectType readonly number[]

//
// intersection
//

pipe([1, 2], _.intersection(N.Eq)([3, 4])) // $ExpectType readonly number[]

//
// union
//

pipe([1, 2], _.union(N.Eq)([3, 4])) // $ExpectType readonly number[]

//
// zip
//

pipe([1, 2], _.zip(['a', 'b'])) // $ExpectType readonly (readonly [number, string])[]

//
// sort
//

declare const ord1: Ord<{ readonly a: string }>
interface X1 {
  readonly a: string
  readonly b: number
}
declare const x1s: ReadonlyArray<X1>

_.sort(ord1)(x1s) // $ExpectType ReadonlyArray<X1>
pipe(x1s, _.sort(ord1)) // $ExpectType ReadonlyArray<X1>

//
// sortBy
//

declare const ord2: Ord<X1>
declare const ord3: Ord<X1>
interface X2 {
  readonly a: string
  readonly b: number
  readonly c: boolean
}
declare const x2s: ReadonlyArray<X2>

_.sortBy([ord2, ord3])(x2s) // $ExpectType ReadonlyArray<X2>
pipe(x2s, _.sortBy([ord2, ord3])) // $ExpectType ReadonlyArray<X2>

//
// Do
//

// $ExpectType readonly { readonly a1: number; readonly a2: string; }[]
pipe(
  _.Do,
  _.bind('a1', () => _.of(1)),
  _.bind('a2', () => _.of('b'))
)

//
// scanLeft
//

// $ExpectType ReadonlyNonEmptyArray<number>
pipe(
  [],
  _.scanLeft(1, () => 2)
)

//
// scanRight
//

// $ExpectType ReadonlyNonEmptyArray<number>
pipe(
  [],
  _.scanRight(1, () => 2)
)

//
// prepend
//

_.prepend('a') // $ExpectType <A>(tail: readonly A[]) => ReadonlyNonEmptyArray<string | A>
pipe(ns, _.prepend('a')) // $ExpectType ReadonlyNonEmptyArray<string | number>

//
// append
//

_.append('a') // $ExpectType <A>(init: readonly A[]) => ReadonlyNonEmptyArray<string | A>
pipe(ns, _.append('a')) // $ExpectType ReadonlyNonEmptyArray<string | number>

//
// concat
//

_.concat(rss)(rss) // $ExpectType readonly string[]
pipe(rss, _.concat(rss)) // $ExpectType readonly string[]

//
// concat
//

_.concat(rss)(rss) // $ExpectType readonly string[]
_.concat(rss)(ns) // $ExpectType readonly (string | number)[]
_.concat(ns)(rss) // $ExpectType readonly (string | number)[]
pipe(rss, _.concat(rss)) // $ExpectType readonly string[]
pipe(rss, _.concat(ns)) // $ExpectType readonly (string | number)[]
pipe(ns, _.concat(rss)) // $ExpectType readonly (string | number)[]

//
// refineWithIndex
//

declare const filterTest: ReadonlyArray<string | number>
// $ExpectType readonly number[]
pipe(
  filterTest,
  _.refineWithIndex(
    (
      _i, // $ExpectType number
      a // $ExpectType string | number
    ): a is number => true
  )
)

// -------------------------------------------------------------------------------------
// Predicate-based APIs
// -------------------------------------------------------------------------------------

declare const prns: ReadonlyArray<number>
declare const prsns: ReadonlyArray<string | number>
declare const isNumber: (sn: string | number) => sn is number
declare const isStringWithIndex: (i: number, u: unknown) => u is string
declare const isNumberWithIndex: (i: number, sn: string | number) => sn is number
declare const predicateWithIndex: (i: number, sn: string | number) => boolean

//
// refine
//

// $ExpectType readonly string[]
pipe(prsns, _.refine(isString))

pipe(
  prns,
  _.refine(
    (
      x // $ExpectType number
    ): x is number => true
  )
)

//
// filter
//

// $ExpectType readonly number[]
pipe(prns, _.filter(predicate))

pipe(
  prns,
  _.filter(
    (
      _x // $ExpectType number
    ) => true
  )
)

//
// refineWithIndex
//

// $ExpectType readonly string[]
pipe(prsns, _.refineWithIndex(isStringWithIndex))

//
// filterWithIndex
//

// $ExpectType readonly number[]
pipe(prns, _.filterWithIndex(predicateWithIndex))
// $ExpectType readonly number[]
pipe(
  prns,
  _.filterWithIndex(
    (
      _i, // $ExpectType number
      _x // $ExpectType number
    ) => true
  )
)

//
// refinement
//

// $ExpectType readonly [readonly (string | number)[], readonly string[]]
pipe(prsns, _.refinement(isString))

// $ExpectType readonly [readonly (string | number)[], readonly number[]]
pipe(prsns, _.refinement(isNumber))

//
// partition
//

// $ExpectType readonly [readonly number[], readonly number[]]
pipe(prns, _.partition(predicate))
// $ExpectType readonly [readonly number[], readonly number[]]
pipe(
  ns,
  _.partition(
    (
      _x // $ExpectType number
    ) => true
  )
)

//
// refinementWithIndex
//

// $ExpectType readonly [readonly (string | number)[], readonly string[]]
pipe(prsns, _.refinementWithIndex(isStringWithIndex))

// $ExpectType readonly [readonly (string | number)[], readonly number[]]
pipe(prsns, _.refinementWithIndex(isNumberWithIndex))

//
// partitionWithIndex
//

// $ExpectType readonly [readonly number[], readonly number[]]
pipe(prns, _.partitionWithIndex(predicateWithIndex))
// $ExpectType readonly [readonly number[], readonly number[]]
pipe(
  prns,
  _.partitionWithIndex(
    (
      _i, // $ExpectType number
      _x // $ExpectType number
    ) => true
  )
)

//
// takeLeftWhile
//

// $ExpectType readonly string[]
pipe(prsns, _.takeLeftWhile(isString))
// $ExpectType readonly number[]
pipe(prns, _.takeLeftWhile(predicate))

//
// dropLeftWhile
//

// $ExpectType readonly string[]
pipe(prsns, _.dropLeftWhile(isString))
// $ExpectType readonly number[]
pipe(prns, _.dropLeftWhile(predicate))

//
// spanLeft
//

// $ExpectType readonly [init: readonly string[], rest: readonly unknown[]]
pipe(prsns, _.spanLeft(isString))
// $ExpectType readonly [init: readonly number[], rest: readonly number[]]
pipe(prns, _.spanLeft(predicate))

//
// findFirst
//

// $ExpectType Option<string>
pipe(prsns, _.findFirst(isString))
// $ExpectType Option<number>
pipe(prns, _.findFirst(predicate))

//
// findLast
//

// $ExpectType Option<string>
pipe(prsns, _.findLast(isString))
// $ExpectType Option<number>
pipe(prns, _.findLast(predicate))
