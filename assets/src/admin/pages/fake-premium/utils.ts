/**
 * External dependencies
 */
import z from 'zod';

export const settingsSchema = z.object( {
	page: z.literal( 'content-board' ),
} );

export type Page = z.infer< typeof settingsSchema >[ 'page' ];
