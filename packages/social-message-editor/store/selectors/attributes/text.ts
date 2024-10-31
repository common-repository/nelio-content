/**
 * Internal dependencies
 */
import type { State } from '../../types';

export function getText( state: State ): string {
	return state.attributes.message.text || '';
} //end getText()
