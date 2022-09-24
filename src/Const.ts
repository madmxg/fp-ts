/**
 * The `Const` type constructor, which wraps its first type argument and ignores its second.
 * That is, `Const<E, A>` is isomorphic to `E` for any `A`.
 *
 * `Const` has some useful instances. For example, the `Applicative` instance allows us to collect results using a `Monoid`
 * while ignoring return values.
 *
 * @since 3.0.0
 */
import type { Applicative } from './Applicative'
import type { Apply } from './Apply'
import * as bifunctor from './Bifunctor'
import type { BooleanAlgebra } from './BooleanAlgebra'
import type { Bounded } from './Bounded'
import type * as contravariant from './Contravariant'
import type { Eq } from './Eq'
import { identity, unsafeCoerce } from './function'
import * as functor from './Functor'
import type { HeytingAlgebra } from './HeytingAlgebra'
import type { HKT } from './HKT'
import type { Monoid } from './Monoid'
import type { Ord } from './Ord'
import type { Ring } from './Ring'
import type { Semigroup } from './Semigroup'
import type { Semiring } from './Semiring'
import type { Show } from './Show'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export declare const phantom: unique symbol

/**
 * @category model
 * @since 3.0.0
 */
export type Const<W, A> = W & { readonly [phantom]: A }

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 3.0.0
 */
export const make: <W, A>(w: W) => Const<W, A> = unsafeCoerce

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * @category Contravariant
 * @since 3.0.0
 */
export const contramap: <B, A>(f: (b: B) => A) => <W>(fa: Const<W, A>) => Const<W, B> = () => unsafeCoerce

/**
 * @category Bifunctor
 * @since 3.0.0
 */
export const mapBoth: <W, X, A, B>(f: (w: W) => X, g: (a: A) => B) => (self: Const<W, A>) => Const<X, B> =
  (f) => (fea) => {
    return make(f(fea))
  }

/**
 * @category Bifunctor
 * @since 3.0.0
 */
export const mapLeft: <W, G>(f: (w: W) => G) => <A>(self: Const<W, A>) => Const<G, A> =
  /*#__PURE__*/ bifunctor.getDefaultMapLeft<ConstFCovariantA>(mapBoth)

// -------------------------------------------------------------------------------------
// type lambdas
// -------------------------------------------------------------------------------------

/**
 * @category HKT
 * @since 3.0.0
 */
export interface ConstF extends HKT {
  readonly type: Const<this['Covariant1'], this['Invariant1']>
}

/**
 * @category HKT
 * @since 3.0.0
 */
export interface ConstFCovariantA extends HKT {
  readonly type: Const<this['Covariant2'], this['Covariant1']>
}

/**
 * @category HKT
 * @since 3.0.0
 */
export interface ConstFContravariantA extends HKT {
  readonly type: Const<this['Covariant1'], this['Contravariant1']>
}

/**
 * @category HKT
 * @since 3.0.0
 */
export interface ConstFCovariantAFixedW<W> extends HKT {
  readonly type: Const<W, this['Covariant1']>
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 3.0.0
 */
export const getShow = <W, A>(S: Show<W>): Show<Const<W, A>> => ({
  show: (c) => `make(${S.show(c)})`
})

/**
 * @category instances
 * @since 3.0.0
 */
export const getEq: <W, A>(E: Eq<W>) => Eq<Const<W, A>> = identity

/**
 * @category instances
 * @since 3.0.0
 */
export const getOrd: <W, A>(O: Ord<W>) => Ord<Const<W, A>> = identity

/**
 * @category instances
 * @since 3.0.0
 */
export const getBounded: <W, A>(B: Bounded<W>) => Bounded<Const<W, A>> = identity as any

/**
 * @category instances
 * @since 3.0.0
 */
export const getSemigroup: <W, A>(S: Semigroup<W>) => Semigroup<Const<W, A>> = identity as any

/**
 * @category instances
 * @since 3.0.0
 */
export const getMonoid: <W, A>(M: Monoid<W>) => Monoid<Const<W, A>> = identity as any

/**
 * @category instances
 * @since 3.0.0
 */
export const getSemiring: <W, A>(S: Semiring<W>) => Semiring<Const<W, A>> = identity as any

/**
 * @category instances
 * @since 3.0.0
 */
export const getRing: <W, A>(S: Ring<W>) => Ring<Const<W, A>> = identity as any

/**
 * @category instances
 * @since 3.0.0
 */
export const getHeytingAlgebra: <W, A>(H: HeytingAlgebra<W>) => HeytingAlgebra<Const<W, A>> = identity as any

/**
 * @category instances
 * @since 3.0.0
 */
export const getBooleanAlgebra: <W, A>(H: BooleanAlgebra<W>) => BooleanAlgebra<Const<W, A>> = identity as any

/**
 * @category instances
 * @since 3.0.0
 */
export const Contravariant: contravariant.Contravariant<ConstFContravariantA> = {
  contramap
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Bifunctor: bifunctor.Bifunctor<ConstFCovariantA> = {
  mapBoth,
  mapLeft
}

/**
 * @category Functor
 * @since 3.0.0
 */
export const map: <A, B>(f: (a: A) => B) => <W>(fa: Const<W, A>) => Const<W, B> =
  /*#__PURE__*/ bifunctor.getDefaultMap<ConstFCovariantA>(mapBoth)

/**
 * @category instances
 * @since 3.0.0
 */
export const Functor: functor.Functor<ConstFCovariantA> = {
  map
}

/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 3.0.0
 */
export const flap: <A>(a: A) => <W, B>(fab: Const<W, (a: A) => B>) => Const<W, B> = /*#__PURE__*/ functor.flap(Functor)

/**
 * @category instances
 * @since 3.0.0
 */
export const getApply = <W>(S: Semigroup<W>): Apply<ConstFCovariantAFixedW<W>> => ({
  map,
  ap: (fa) => (fab) => make(S.combine(fa)(fab))
})

/**
 * @category instances
 * @since 3.0.0
 */
export const getApplicative = <W>(M: Monoid<W>): Applicative<ConstFCovariantAFixedW<W>> => {
  const A = getApply(M)
  return {
    map: A.map,
    ap: A.ap,
    of: () => make(M.empty)
  }
}
