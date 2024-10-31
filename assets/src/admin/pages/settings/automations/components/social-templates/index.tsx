/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	ButtonGroup,
	VisuallyHidden,
} from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { chunk, map } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import {
	createSocialTemplate,
	isUniversalGroup,
	makeExportedTemplate,
} from '@nelio-content/utils';
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
import { useAutomationGroup } from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

export type SocialTemplatesProps = {
	readonly groupId: AutomationGroupId;
	readonly profileId: Uuid;
	readonly mode: 'publication' | 'reshare';
};

import { SocialTemplate } from '../social-template';

const MAX_NON_PAGINATED_TEMPLATES = 20;
const TEMPLATES_PER_PAGE = 10;

export const SocialTemplates = (
	props: SocialTemplatesProps
): JSX.Element | null => {
	const [ page, setPage ] = useState( 0 );

	useEffect( () => setPage( 0 ), [ props.profileId ] );

	const { openTemplateEditor, openTemplateExporter, openTemplateImporter } =
		useDispatch( NC_AUTOMATION_SETTINGS );
	const group = useAutomationGroup( props.groupId );
	const templates = useTemplates( props );
	const network = useSocialNetwork( props.profileId );
	const isSingleTemplate = 1 === templates?.length;

	if ( ! templates || ! network ) {
		return null;
	} //end if

	const paginatedTemplates =
		templates.length <= MAX_NON_PAGINATED_TEMPLATES
			? [ templates ]
			: chunk( templates, TEMPLATES_PER_PAGE );

	const totalPages = paginatedTemplates.length;
	const isPaginationEnabled = totalPages > 1;

	const openImporter = () =>
		openTemplateImporter( props.groupId, props.profileId, props.mode );

	const addTemplate = () => {
		if ( ! group ) {
			return;
		} //end if

		const template: SocialTemplateType = createSocialTemplate( {
			groupId: group.id,
			text: '',
			network,
			profileId: props.profileId,
			postType: ! isUniversalGroup( group ) ? group.postType : undefined,
		} );
		void openTemplateEditor( props.mode, template, 'new' );
	};

	return (
		<div className="nelio-content-automation-templates">
			<div className="nelio-content-automation-templates__header">
				<h3 className="nelio-content-automation-templates__title">
					{ _x( 'Social Templates', 'text', 'nelio-content' ) }
					{ isPaginationEnabled ? ` (${ templates.length })` : '' }
				</h3>
				<Button
					size="small"
					variant="secondary"
					onClick={ addTemplate }
				>
					{ _x( 'Add Template', 'command', 'nelio-content' ) }
				</Button>
				<Button
					size="small"
					variant="secondary"
					onClick={ openImporter }
				>
					{ _x( 'Import', 'command', 'nelio-content' ) }
				</Button>
				{ !! templates.length && (
					<Button
						size="small"
						variant="secondary"
						onClick={ () =>
							openTemplateExporter(
								templates.map( makeExportedTemplate )
							)
						}
					>
						{ _x( 'Export', 'command', 'nelio-content' ) }
					</Button>
				) }
				{ isPaginationEnabled && (
					<Pagination
						mode="title"
						current={ page }
						total={ totalPages }
						onChange={ setPage }
					/>
				) }
			</div>
			<div className="nelio-content-automation-templates__content">
				{ map( paginatedTemplates[ page ], ( template ) =>
					template.profileId ? (
						<SocialTemplate
							key={ template.id }
							type="profile"
							groupId={ props.groupId }
							profileId={ template.profileId }
							templateId={ template.id }
							templateType={ props.mode }
							canBeDeleted={ ! isSingleTemplate }
						/>
					) : (
						<SocialTemplate
							key={ template.id }
							type="network"
							groupId={ props.groupId }
							networkName={ template.network }
							templateId={ template.id }
							templateType={ props.mode }
							canBeDeleted={ ! isSingleTemplate }
						/>
					)
				) }
			</div>
			{ isPaginationEnabled && (
				<Pagination
					mode="footer"
					current={ page }
					total={ totalPages }
					onChange={ setPage }
				/>
			) }
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const Pagination = ( {
	mode,
	current,
	total,
	onChange,
}: {
	readonly mode: 'title' | 'footer';
	readonly current: number;
	readonly total: number;
	readonly onChange: ( page: number ) => void;
} ) => (
	<div
		className={ `nelio-content-automation-templates__pagination nelio-content-automation-templates__pagination--${ mode }` }
	>
		<ButtonGroup>
			<Button
				disabled={ current === 0 }
				onClick={ () => onChange( current - 1 ) }
				variant={ mode === 'title' ? 'secondary' : undefined }
				size={ mode === 'title' ? 'small' : undefined }
			>
				{ '< ' }
				<VisuallyHidden>
					{ _x( 'Previous page', 'command', 'nelio-content' ) }
				</VisuallyHidden>
			</Button>
			{ 'footer' === mode && (
				<div className="nelio-content-automation-templates__current-page">
					{ `${ current + 1 } / ${ total }` }
				</div>
			) }
			<Button
				disabled={ current >= total - 1 }
				onClick={ () => onChange( current + 1 ) }
				variant={ mode === 'title' ? 'secondary' : undefined }
				size={ mode === 'title' ? 'small' : undefined }
			>
				{ '> ' }
				<VisuallyHidden>
					{ _x( 'Next page', 'command', 'nelio-content' ) }
				</VisuallyHidden>
			</Button>
		</ButtonGroup>
	</div>
);

// =====
// HOOKS
// =====

const useSocialNetwork = ( profileId: Uuid ) =>
	useSelect(
		( select ): Maybe< SocialNetworkName > =>
			select( NC_DATA ).getSocialProfile( profileId )?.network
	);

const useTemplates = ( { groupId, profileId, mode }: SocialTemplatesProps ) => {
	const network = useSocialNetwork( profileId );
	return useSelect(
		( select ): Maybe< ReadonlyArray< SocialTemplateType > > => {
			const group = select( NC_AUTOMATION_SETTINGS ).getAutomationGroup(
				groupId
			);
			if ( ! group ) {
				return undefined;
			} //end if

			const ps = group.profileSettings[ profileId ];
			const ns = network ? group.networkSettings[ network ] : undefined;
			return [
				...( ps?.[ mode ].templates ?? [] ),
				...( ns?.[ mode ].templates ?? [] ),
			];
		}
	);
};
