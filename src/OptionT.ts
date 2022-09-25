/**
 * @since 3.0.0
 */
import * as apply from './Apply'
import type { Flattenable } from './Flattenable'
import type { Either } from './Either'
import type { LazyArg } from './function'
import { constant, flow, pipe } from './function'
import * as functor from './Functor'
import type { TypeLambda, Kind } from './HKT'
import * as _ from './internal'
import type { Monad } from './Monad'
import * as option from './Option'
import type { Pointed } from './Pointed'
import type { Option } from './Option'
import type { Functor } from './Functor'

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 3.0.0
 */
export const some =
  <F extends TypeLambda>(F: Pointed<F>) =>
  <A, S, R, W, E>(a: A): Kind<F, S, R, W, E, Option<A>> =>
    F.of(_.some(a))

// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------

/**
 * @category natural transformations
 * @since 3.0.0
 */
export function fromF<F extends TypeLambda>(
  F: Functor<F>
): <S, R, W, E, A>(self: Kind<F, S, R, W, E, A>) => Kind<F, S, R, W, E, Option<A>> {
  return F.map(_.some)
}

/**
 * @category natural transformations
 * @since 3.0.0
 */
export const fromEither =
  <F extends TypeLambda>(F: Pointed<F>) =>
  <A, S, R, W, E>(e: Either<unknown, A>): Kind<F, S, R, W, E, Option<A>> =>
    F.of(option.fromEither(e))

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function match<F extends TypeLambda>(
  F: Functor<F>
): <B, A, C = B>(
  onNone: LazyArg<B>,
  onSome: (a: A) => C
) => <S, R, W, E>(self: Kind<F, S, R, W, E, Option<A>>) => Kind<F, S, R, W, E, B | C> {
  return flow(option.match, F.map)
}

/**
 * @since 3.0.0
 */
export const matchWithEffect =
  <M extends TypeLambda>(M: Flattenable<M>) =>
  <S, R2, W2, E2, B, A, R3, W3, E3, C = B>(
    onNone: LazyArg<Kind<M, S, R2, W2, E2, B>>,
    onSome: (a: A) => Kind<M, S, R3, W3, E3, C>
  ): (<R1, W1, E1>(
    self: Kind<M, S, R1, W1, E1, Option<A>>
  ) => Kind<M, S, R1 & R2 & R3, W1 | W2 | W3, E1 | E2 | E3, B | C>) => {
    return M.flatMap(option.match<Kind<M, S, R2 & R3, W2 | W3, E2 | E3, B | C>, A>(onNone, onSome))
  }

/**
 * @since 3.0.0
 */
export const getOrElse =
  <F extends TypeLambda>(F: Functor<F>) =>
  <B>(onNone: LazyArg<B>): (<S, R, W, E, A>(self: Kind<F, S, R, W, E, Option<A>>) => Kind<F, S, R, W, E, A | B>) => {
    return F.map(option.getOrElse(onNone))
  }

/**
 * @since 3.0.0
 */
export const getOrElseE =
  <M extends TypeLambda>(M: Monad<M>) =>
  <S, R2, W2, E2, B>(onNone: LazyArg<Kind<M, S, R2, W2, E2, B>>) =>
  <R1, W1, E1, A>(self: Kind<M, S, R1, W1, E1, Option<A>>): Kind<M, S, R1 & R2, W1 | W2, E1 | E2, A | B> => {
    return pipe(self, M.flatMap(option.match<Kind<M, S, R2, W2, E2, A | B>, A>(onNone, M.of)))
  }

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Returns an effect that effectfully "peeks" at the failure of this effect.
 *
 * @category combinatorsError
 * @since 3.0.0
 */
export const tapNone = <M extends TypeLambda>(M: Monad<M>) => {
  const someM = some(M)
  return <S, R2, W2, E2, _>(onNone: LazyArg<Kind<M, S, R2, W2, E2, Option<_>>>) =>
    <R1, W1, E1, A>(self: Kind<M, S, R1, W1, E1, Option<A>>): Kind<M, S, R1 & R2, W1 | W2, E1 | E2, Option<A>> => {
      return pipe(
        self,
        M.flatMap(
          option.match<Kind<M, S, R2, W2, E2, option.Option<A>>, A>(
            flow(
              onNone,
              M.map(() => _.none)
            ),
            someM
          )
        )
      )
    }
}

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export function map<F extends TypeLambda>(
  F: Functor<F>
): <A, B>(f: (a: A) => B) => <S, R, W, E>(self: Kind<F, S, R, W, E, Option<A>>) => Kind<F, S, R, W, E, Option<B>> {
  return functor.getMapComposition(F, option.Functor)
}

/**
 * @since 3.0.0
 */
export const ap = <F extends TypeLambda>(
  F: apply.Apply<F>
): (<S, R2, W2, E2, A>(
  fa: Kind<F, S, R2, W2, E2, Option<A>>
) => <R1, W1, E1, B>(
  self: Kind<F, S, R1, W1, E1, Option<(a: A) => B>>
) => Kind<F, S, R1 & R2, W1 | W2, E1 | E2, Option<B>>) => {
  return apply.getApComposition(F, option.Apply)
}

/**
 * @since 3.0.0
 */
export const flatMap =
  <M extends TypeLambda>(M: Monad<M>) =>
  <A, S, R, W, E, B>(f: (a: A) => Kind<M, S, R, W, E, Option<B>>) =>
  (self: Kind<M, S, R, W, E, Option<A>>): Kind<M, S, R, W, E, Option<B>> => {
    return pipe(self, M.flatMap<option.Option<A>, S, R, W, E, option.Option<B>>(option.match(() => emptyK(M)(), f)))
  }

/**
 * @since 3.0.0
 */
export const combineK = <M extends TypeLambda>(M: Monad<M>) => {
  const someM = some(M)
  return <S, R2, W2, E2, B>(second: LazyArg<Kind<M, S, R2, W2, E2, Option<B>>>) =>
    <R1, W1, E1, A>(self: Kind<M, S, R1, W1, E1, Option<A>>): Kind<M, S, R1 & R2, W1 | W2, E1 | E2, Option<A | B>> => {
      return pipe(self, M.flatMap(option.match<Kind<M, S, R2, W2, E2, option.Option<A | B>>, A | B>(second, someM)))
    }
}

/**
 * @since 3.0.0
 */
export function emptyK<F extends TypeLambda>(F: Pointed<F>): <S, R, W, E, A>() => Kind<F, S, R, W, E, Option<A>> {
  return constant(F.of(_.none))
}
