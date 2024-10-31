/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, _nx, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { sum, uniq } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { isDefined } from '@nelio-content/utils';
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';
import { Actions } from './actions';

export const MessageCountEstimation = (): JSX.Element => {
	const { publication, reshare } = useCountEstimation();
	const isPaused = useSelect( ( select ) =>
		select( NC_DATA ).isSocialPublicationPaused()
	);

	if ( ! publication && ! reshare ) {
		return (
			<div className="nelio-content-message-count-estimation">
				<div>
					{ _x(
						'Enable social automations on one or more profiles to allow Nelio Content to generate messages automatically.',
						'user',
						'nelio-content'
					) }
				</div>
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-message-count-estimation">
			<div>
				{ !! isPaused && getPausedLabel() }
				{ !! publication && getPublicationLabel( publication ) }
				{ !! reshare && getReshareLabel( reshare ) }
			</div>
			<Actions />
		</div>
	);
};

// =====
// HOOKS
// =====

const useCountEstimation = () =>
	useSelect( ( select ) => {
		const {
			getAutomationGroup,
			getAutomationGroups,
			getProfileFrequencies,
		} = select( NC_AUTOMATION_SETTINGS );

		const groups = getAutomationGroups()
			.map( getAutomationGroup )
			.filter( isDefined );

		const getFrequencySum = ( type: 'publication' | 'reshare' ) =>
			sum(
				uniq(
					groups.flatMap( ( g ) =>
						Object.keys( g.profileSettings )
							.map( ( id ) => id as Uuid )
							.filter(
								( id ) =>
									!! g.priority &&
									!! g.profileSettings[ id ]?.enabled &&
									!! g.profileSettings[ id ]?.[ type ].enabled
							)
					)
				)
					.map( getProfileFrequencies )
					.filter( isDefined )
					.map( ( f ) => f[ type ] )
			);

		return {
			publication: getFrequencySum( 'publication' ),
			reshare: getFrequencySum( 'reshare' ),
		};
	} );

// =======
// HELPERS
// =======

const getPausedLabel = () =>
	tagify(
		_x(
			'<strong>Notice!</strong> Social publication is currently paused. This means Nelio Content will not share any scheduled social messages when their time comes.',
			'usr',
			'nelio-content'
		) + '<br/>'
	);

const getReshareLabel = ( count: number ) =>
	tagify(
		30 < count
			? _x(
					'Your calendar will contain <strong>as many messages per day as possible</strong>.',
					'text',
					'nelio-content'
			  )
			: sprintf(
					/* translators: number of social messages */
					_nx(
						'Your calendar will contain <strong>%d social message per day</strong>.',
						'Your calendar will contain <strong>%d social messages per day</strong>.',
						count,
						'text',
						'nelio-content'
					),
					count
			  )
	);

const getPublicationLabel = ( count: number ) =>
	tagify(
		30 < count
			? _x(
					'When publishing new content, Nelio will automatically generate <strong>as many messages as possible</strong>.',
					'text',
					'nelio-content'
			  )
			: sprintf(
					/* translators: number of social messages */
					_nx(
						'When publishing new content, Nelio will automatically generate up to <strong>%d social message</strong>.',
						'When publishing new content, Nelio will automatically generate up to <strong>%d social messages</strong>.',
						count,
						'text',
						'nelio-content'
					),
					count
			  )
	);

const tagify = ( text: string ) =>
	createInterpolateElement( text + ' ', {
		strong: <strong></strong>,
		br: <br />,
	} );
