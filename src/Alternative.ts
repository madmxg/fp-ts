/**
 * @file The `Alternative` type class has no members of its own; it just specifies that the type constructor has both
 * `Applicative` and `Plus` instances.
 *
 * Types which have `Alternative` instances should also satisfy the following laws:
 *
 * 1. Distributivity: `A.ap(A.alt(fab, gab), fa) = A.alt(A.ap(fab, fa), A.ap(gab, fa))`
 * 2. Annihilation: `A.ap(zero, fa) = zero`
 */
import { Applicative, Applicative1, Applicative2, Applicative2C, Applicative3 } from './Applicative'
import { URIS, URIS2, URIS3 } from './HKT'
import { Plus, Plus1, Plus2, Plus2C, Plus3 } from './Plus'

/**
 * @since 2.0.0
 */
export interface Alternative<F> extends Applicative<F>, Plus<F> {}

/**
 * @since 2.0.0
 */
export interface Alternative1<F extends URIS> extends Applicative1<F>, Plus1<F> {}

/**
 * @since 2.0.0
 */
export interface Alternative2<F extends URIS2> extends Applicative2<F>, Plus2<F> {}

/**
 * @since 2.0.0
 */
export interface Alternative3<F extends URIS3> extends Applicative3<F>, Plus3<F> {}

/**
 * @since 2.0.0
 */
export interface Alternative2C<F extends URIS2, E> extends Applicative2C<F, E>, Plus2C<F, E> {}
