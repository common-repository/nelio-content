/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { find, flow, trim, values } from 'lodash';
import { DeleteButton } from '@nelio-content/components';
import { makeExportedTemplate } from '@nelio-content/utils';
import type {
	AutomationGroupId,
	Maybe,
	SocialNetworkName,
	SocialTemplate as SocialTemplateType,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import {
	useAutomationGroup,
	useTemplateSelectionLabel,
} from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

const VALID_PLACEHOLDERS =
	/({title}|{permalink}|{phrase}|{highlight}|{tags}|{author}|{categories}|{excerpt}|{field:[^}]*}|{custom:[^}]*}|{taxonomy:[^}]*})/g;

export type SocialTemplateProps = ProfileTemplate | NetworkTemplate;

type ProfileTemplate = {
	readonly type: 'profile';
	readonly groupId: AutomationGroupId;
	readonly profileId: Uuid;
	readonly templateId: Uuid;
	readonly templateType: 'publication' | 'reshare';
	readonly canBeDeleted: boolean;
};

type NetworkTemplate = {
	readonly type: 'network';
	readonly groupId: AutomationGroupId;
	readonly networkName: SocialNetworkName;
	readonly templateId: Uuid;
	readonly templateType: 'publication' | 'reshare';
	readonly canBeDeleted: boolean;
};

export const SocialTemplate = (
	props: SocialTemplateProps
): JSX.Element | null => {
	const template = useSocialTemplate( props );
	const filterSummary = useTemplateSummary( template );
	const isValid = useIsValid( props );
	const {
		deleteAutomationGroupTemplate,
		openTemplateEditor,
		openTemplateExporter,
	} = useDispatch( NC_AUTOMATION_SETTINGS );

	if ( ! template ) {
		return null;
	} //end if

	const editTemplate = () =>
		openTemplateEditor( props.templateType, template );
	const deleteTemplate = () => deleteAutomationGroupTemplate( template );
	const exportTemplate = () =>
		openTemplateExporter( makeExportedTemplate( template ) );

	return (
		<div
			data-template-type={
				'network' === props.type
					? _x(
							'Network',
							'text (network template)',
							'nelio-content'
					  )
					: ''
			}
			className={ classnames( {
				'nelio-content-social-template': true,
				'nelio-content-social-template--is-network':
					'network' === props.type,
			} ) }
		>
			<div className="nelio-content-social-template__text">
				{ formatTemplate( template.text ) }
			</div>

			<div
				className={ classnames( {
					'nelio-content-social-template__extra': true,
					'nelio-content-social-template__extra--is-invalid':
						! isValid,
				} ) }
			>
				<span
					className={ classnames( {
						'nelio-content-social-template__filters': true,
						'nelio-content-social-template__filters--is-invalid':
							! isValid,
					} ) }
				>
					{ filterSummary }
				</span>
				<div className="nelio-content-social-template__actions">
					<span>•</span>
					<Button variant="link" onClick={ editTemplate }>
						{ _x( 'Edit', 'command', 'nelio-content' ) }
					</Button>
					|
					<Button variant="link" onClick={ exportTemplate }>
						{ _x( 'Export', 'command', 'nelio-content' ) }
					</Button>
					{ props.canBeDeleted && (
						<>
							<span>|</span>
							<DeleteButton
								confirmationLabels={ {
									title: _x(
										'Delete Template',
										'text',
										'nelio-content'
									),
									text: _x(
										'Are you sure you want to delete this social template? If you then save your social automations, you won’t be able to recover it.',
										'user',
										'nelio-content'
									),
								} }
								onClick={ deleteTemplate }
							/>
						</>
					) }
				</div>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useSocialTemplate = (
	props: SocialTemplateProps
): Maybe< SocialTemplateType > => {
	const group = useAutomationGroup( props.groupId );
	if ( ! group ) {
		return undefined;
	} //end if

	const { profileSettings, networkSettings } = group;
	switch ( props.type ) {
		case 'network':
			return (
				find(
					networkSettings[ props.networkName ]?.publication.templates,
					{ id: props.templateId }
				) ??
				find( networkSettings[ props.networkName ]?.reshare.templates, {
					id: props.templateId,
				} )
			);

		case 'profile':
			return (
				find(
					profileSettings[ props.profileId ]?.publication.templates,
					{ id: props.templateId }
				) ??
				find( profileSettings[ props.profileId ]?.reshare.templates, {
					id: props.templateId,
				} )
			);
	} //end switch
};

const useTemplateSummary = ( template: Maybe< SocialTemplateType > ) => {
	const summary = useTemplateSelectionLabel( {
		attachment: template?.attachment,
		postType: template?.postType,
		author: template?.author,
		taxonomies: template?.taxonomies,
		availability: template?.availability,
	} );

	const error = useSummaryError( template );

	return error || summary;
};

const useIsValid = ( props: SocialTemplateProps ) => {
	return useSelect( ( select ) => {
		const { groupId, templateId } = props;
		return select( NC_AUTOMATION_SETTINGS ).isTemplateValid(
			groupId,
			templateId
		);
	} );
};

const useSummaryError = ( template: Maybe< SocialTemplateType > ): string => {
	const errors = useSelect( ( select ) => {
		const { getTemplateErrors } = select( NC_AUTOMATION_SETTINGS );
		return template && getTemplateErrors( template.groupId, template.id );
	} );

	if ( ! errors ) {
		return '';
	} //end if

	const generic = errors.target || errors.content;
	if ( generic ) {
		return generic;
	} //end if

	if ( errors.author ) {
		return errors.author;
	} //end if

	if ( values( errors.taxonomies ).some( Boolean ) ) {
		return _x( 'Please review selected terms', 'user', 'nelio-content' );
	} //end if

	if ( errors.availability ) {
		return _x(
			'Please review availability settings',
			'user',
			'nelio-content'
		);
	} //end if

	return '';
};

// =======
// HELPERS
// =======

const formatTemplate = ( text: string ) =>
	createInterpolateElement( prepareForInterpolation( text ), {
		code: <span className="nelio-content-social-template__code-tag"></span>,
		newline: (
			<span className="nelio-content-social-template__newline-tag"></span>
		),
	} );

const prepareForInterpolation = ( text: string ) =>
	flow(
		fixNewLines,
		escapeInterpolationLookingStuff,
		wrapPlaceholders,
		replaceNewLines,
		trim
	)( ` ${ text } ` );

const fixNewLines = ( text: string ) => text.replace( /\r?\n/g, '\u00b6' );

const escapeInterpolationLookingStuff = ( text: string ) =>
	text
		.replace( new RegExp( '<', 'g' ), '<\u2060' )
		.replace( new RegExp( '>', 'g' ), '\u2060>' );

const wrapPlaceholders = ( text: string ) =>
	text.replace( VALID_PLACEHOLDERS, `<code>$1</code>` );

const replaceNewLines = ( text: string ) =>
	text.replace( / *\\u00b6 */g, `<newline>\u00b6</newline>` );
