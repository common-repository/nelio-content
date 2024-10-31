/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal, TextareaControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import z from 'zod';
import { v4 as uuid } from 'uuid';
import { castArray } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { isDefined } from '@nelio-content/utils';
import type {
	AuthorId,
	Maybe,
	PostTypeName,
	SocialTargetName,
	SocialTemplate,
	SocialTemplateAvailability,
	TaxonomySlug,
	TermId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

export const ImportExportTemplates = (): JSX.Element | null => {
	const data = useImportExportData();
	const {
		receiveAutomationGroupTemplates: receiveTemplates,
		closeTemplateImportExport: onClose,
	} = useDispatch( NC_AUTOMATION_SETTINGS );
	const [ content, setContent ] = useState( '' );
	const templatesToImport = useParsedTemplates( content );

	useEffect( () => {
		if ( data?.mode === 'export' ) {
			setContent( JSON.stringify( data.templates, null, 2 ) );
		} else {
			setContent( '' );
		} //end if
	}, [ data ] );

	if ( ! data ) {
		return null;
	} //end if

	const { mode } = data;
	const title =
		mode === 'export'
			? _x( 'Export Templates', 'text', 'nelio-content' )
			: _x( 'Import Templates', 'text', 'nelio-content' );

	const action =
		mode === 'export'
			? _x( 'Copy', 'command', 'nelio-content' )
			: _x( 'Import', 'command', 'nelio-content' );

	const onExport = () =>
		void navigator.clipboard.writeText( content ).then( () => onClose() );

	const onImport = () => {
		if ( 'import' !== mode || ! templatesToImport.length ) {
			return;
		} //end if
		void receiveTemplates( data.templateType, templatesToImport );
		void onClose();
	};

	const onAccept = 'import' === mode ? onImport : onExport;
	const isAcceptDisabled = 'import' === mode && ! templatesToImport.length;
	const isAcceptVisible =
		'export' !== mode || 'https:' === document.location.protocol;

	return (
		<Modal
			className="nelio-content-import-export-templates"
			title={ title }
			onRequestClose={ onClose }
			style={ { minWidth: '30%' } }
		>
			<TextareaControl
				placeholder={
					'import' === mode
						? _x(
								'Paste social templates here…',
								'user',
								'nelio-content'
						  )
						: undefined
				}
				value={ content }
				onChange={ setContent }
				readOnly={ 'export' === mode }
			/>
			<div className="nelio-content-import-export-templates__actions">
				<Button variant="secondary" onClick={ onClose }>
					{ _x( 'Close', 'command', 'nelio-content' ) }
				</Button>
				{ isAcceptVisible && (
					<Button
						variant="primary"
						onClick={ onAccept }
						disabled={ isAcceptDisabled }
					>
						{ action }
					</Button>
				) }
			</div>
		</Modal>
	);
};

// =====
// HOOKS
// =====

const useImportExportData = () =>
	useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getImportExportData()
	);

const useParsedTemplates = (
	content: string
): ReadonlyArray< SocialTemplate > => {
	const data = useImportExportData();
	const creatorId = useSelect( ( select ) =>
		select( NC_DATA ).getCurrentUserId()
	);
	const network = useSelect( ( select ) => {
		const { getSocialProfile } = select( NC_DATA );
		return 'import' === data?.mode
			? getSocialProfile( data.profileId )?.network
			: undefined;
	} );

	if ( data?.mode !== 'import' || ! network ) {
		return [];
	} //end if

	try {
		const { groupId, profileId } = data;
		const templates = castArray( JSON.parse( content ) );
		return templates
			.map( ( t ) => exportedTemplateSchema.safeParse( t ) )
			.map( ( t ) => ( t.success ? t.data : undefined ) )
			.filter( isDefined )
			.map(
				( t ): SocialTemplate => ( {
					groupId,
					id: uuid(),
					creatorId,
					network,
					...( ! t.isNetwork && {
						profileId,
						targetName: t.targetName,
					} ),
					taxonomies: t.taxonomies ?? {},
					text: t.text,
					postType: 'universal' === groupId ? t.postType : undefined,
					author: t.author,
					availability: isAvailabilityCompatible(
						data.templateType,
						t.availability
					)
						? t.availability
						: undefined,
				} )
			)
			.filter( ( t ) => !! t.text.length );
	} catch ( _ ) {
		return [];
	} //end catch
};

// =======
// HELPERS
// =======

const isAvailabilityCompatible = (
	type: 'publication' | 'reshare',
	availability?: SocialTemplateAvailability
): boolean => !! availability?.type.includes( type );

const weekdaySchema = z.object( {
	mon: z.boolean(),
	tue: z.boolean(),
	wed: z.boolean(),
	thu: z.boolean(),
	fri: z.boolean(),
	sat: z.boolean(),
	sun: z.boolean(),
} );

const timeSchema = z.union( [
	z.literal( 'morning' ),
	z.literal( 'noon' ),
	z.literal( 'afternoon' ),
	z.literal( 'night' ),
	z.custom< `${ string }:${ string }` >(
		( v ) => typeof v === 'string' && /^[0-2][0-9]:[0-5][0-9]$/.test( v )
	),
] );

const recurrencySchema = z.object( {
	instanceCount: z.number().nonnegative(),
	intervalInDays: z.number().positive(),
} );

const availabilitySchema = z.discriminatedUnion( 'type', [
	z.object( {
		type: z.literal( 'publication-day-offset' ),
		hoursAfterPublication: z.number().nonnegative(),
		randomize: z.optional( z.number().nonnegative() ),
		recurrency: z.optional( recurrencySchema ),
	} ),
	z.object( {
		type: z.literal( 'publication-day-period' ),
		time: timeSchema,
		randomize: z.optional( z.number().nonnegative() ),
		recurrency: z.optional( recurrencySchema ),
	} ),
	z.object( {
		type: z.literal( 'after-publication' ),
		daysAfterPublication: z.number().nonnegative(),
		time: timeSchema,
		randomize: z.optional( z.number().nonnegative() ),
		recurrency: z.optional( recurrencySchema ),
	} ),
	z.object( {
		type: z.literal( 'reshare' ),
		weekday: weekdaySchema,
		time: timeSchema,
		randomize: z.optional( z.number().nonnegative() ),
	} ),
] );

const exportedTemplateSchema = z.object( {
	text: z.string().min( 1 ),
	isNetwork: z.boolean(),
	targetName: z
		.optional( z.string() )
		.transform( ( v ) => v as Maybe< SocialTargetName > ),
	author: z
		.optional( z.number().positive() )
		.transform( ( v ) => v as AuthorId ),
	postType: z
		.optional( z.string() )
		.transform( ( v ) => v as Maybe< PostTypeName > ),
	taxonomies: z
		.optional( z.record( z.number().positive() ) )
		.transform( ( v ) => v as Maybe< Record< TaxonomySlug, TermId > > ),
	availability: z.optional( availabilitySchema ),
} );
