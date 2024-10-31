/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import {
	Button,
	SelectControl,
	Spinner,
	TextControl,
} from '@safe-wordpress/components';
import { _nx, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { values } from 'lodash';
import { usePostTypes } from '@nelio-content/data';
import { ItemSelectControl } from '@nelio-content/components';
import type {
	RegularAutomationGroupId,
	TaxonomySlug,
	TermId,
} from '@nelio-content/types';
/**
 * Internal dependencies
 */
import { PublicationControl } from './publication-control';
import { ProfileSelector } from './profile-selector';
import './style.scss';

import {
	useEntityRecordLoader,
	useRegularGroupProperty,
	useSupportsAuthor,
	useTaxonomies,
} from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

export type RegularSettingsProps = {
	readonly groupId: RegularAutomationGroupId;
};

export const RegularSettings = ( {
	groupId,
}: RegularSettingsProps ): JSX.Element => {
	const postTypes = usePostTypes( 'social' ).map( ( t ) => ( {
		value: t.name,
		label: t.labels.plural,
	} ) );
	const [ name, setName ] = useRegularGroupProperty( groupId, 'name' );
	const [ postType, setPostType ] = useRegularGroupProperty(
		groupId,
		'postType'
	);

	const isPostTypeValid = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).isPostTypeValid( groupId )
	);

	return (
		<div className="nelio-content-automation-group-settings">
			<TextControl
				className="nelio-content-automation-group-settings__group-name"
				label={ _x( 'Group name', 'text', 'nelio-content' ) }
				value={ name ?? '' }
				onChange={ setName }
			/>

			<p className="nelio-content-automation-group-settings__section-title">
				{ _x(
					'Which content should be shared?',
					'user',
					'nelio-content'
				) }
			</p>
			<div className="nelio-content-automation-group-settings__section-content">
				<SelectControl
					label={ _x( 'Post Type', 'text', 'nelio-content' ) }
					help={
						! isPostTypeValid && (
							<span className="nelio-content-error-help">
								{ _x(
									'The selected post type is not valid.',
									'text',
									'nelio-content'
								) }
							</span>
						)
					}
					options={ postTypes }
					value={ postType }
					onChange={ setPostType }
				/>

				<Details groupId={ groupId } />
			</div>

			<ProfileSelector groupId={ groupId } />
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const Details = ( { groupId }: RegularSettingsProps ): JSX.Element => {
	const [ postType ] = useRegularGroupProperty( groupId, 'postType' );
	const areAuthorsSupported = useSupportsAuthor( postType );
	const [ groupTaxonomies = {}, setTaxonomies ] = useRegularGroupProperty(
		groupId,
		'taxonomies'
	);
	const [ authors = [], setAuthors ] = useRegularGroupProperty(
		groupId,
		'authors'
	);
	const [ publication = { type: 'always' }, setPublication ] =
		useRegularGroupProperty( groupId, 'publication' );
	const [ areDetailsVisible, showDetails ] = useState(
		// Some taxonomy term or author or publication filter selected.
		values( groupTaxonomies ).some( ( terms ) => terms.length ) ||
			authors.length ||
			( publication && publication.type !== 'always' )
	);

	const taxonomies = useTaxonomies( postType );

	const isReady = useEntityRecordLoader( postType );

	const { areAuthorsValid, areTermsValid } = useSelect( ( select ) => {
		const s = select( NC_AUTOMATION_SETTINGS );
		return {
			areAuthorsValid: s.areAuthorsValid( groupId ),
			areTermsValid: s.getGroupTermsValidation( groupId ),
		};
	} );

	if ( ! areDetailsVisible ) {
		return (
			<div className="nelio-content-automation-group-settings__extra">
				<Button
					className="nelio-content-automation-group-settings__extra-action"
					variant="link"
					onClick={ () => showDetails( true ) }
				>
					{ _x(
						'Show additional filters',
						'command',
						'nelio-content'
					) }
				</Button>
			</div>
		);
	} //end if

	if ( ! isReady ) {
		return (
			<div className="nelio-content-automation-group-settings__extra">
				<Spinner />
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-automation-group-settings__extra">
			{ taxonomies.map( ( t ) => (
				<ItemSelectControl
					id="nelio-content-automation-group-settings-taxonomies"
					error={
						! areTermsValid[ t.slug as TaxonomySlug ] &&
						_x(
							'Some terms are not valid.',
							'text',
							'nelio-content'
						)
					}
					key={ t.slug }
					kind="taxonomy"
					label={ t.labels.name }
					name={ t.slug }
					placeholder={ t.labels.filter_by_item }
					value={ groupTaxonomies[ t.slug as TaxonomySlug ] ?? [] }
					onChange={ ( terms: ReadonlyArray< TermId > ) =>
						setTaxonomies( {
							...groupTaxonomies,
							[ t.slug ]: terms,
						} )
					}
				/>
			) ) }
			{ areAuthorsSupported && (
				<ItemSelectControl
					id="nelio-content-automation-group-settings-authors"
					error={
						! areAuthorsValid &&
						_nx(
							'The selected author is not valid.',
							'Some of the selected authors are not valid.',
							authors.length,
							'text',
							'nelio-content'
						)
					}
					kind="author"
					label={ _x( 'Authors', 'text', 'nelio-content' ) }
					placeholder={ _x(
						'Filter by author',
						'text',
						'nelio-content'
					) }
					value={ authors }
					onChange={ setAuthors }
				/>
			) }
			<PublicationControl
				value={ publication }
				onChange={ setPublication }
			/>
		</div>
	);
};
