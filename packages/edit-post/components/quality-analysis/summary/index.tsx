/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { PostQualityStatus } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

export type QualityAnalysisSummaryProps = {
	readonly label?: string;
	readonly onClick?: () => void;
};

export const QualityAnalysisSummary = ( {
	onClick,
	label: proposedLabel,
}: QualityAnalysisSummaryProps ): JSX.Element => {
	const status = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getOverallPostQualityStatus()
	);
	const label = proposedLabel || getDefaultLabel( status );

	return (
		<div className="nelio-content-quality-analysis-summary">
			<div className="nelio-content-quality-analysis-summary__icon-wrapper">
				<div
					className={ `nelio-content-quality-analysis-summary__icon nelio-content-quality-analysis-summary__icon--is-${ status }` }
				>
					{ 'perfect' === status && <Dashicon icon="awards" /> }
					{ 'good' === status && <Dashicon icon="thumbs-up" /> }
					{ 'improvable' === status && (
						<Dashicon icon="admin-tools" />
					) }
					{ 'bad' === status && <Dashicon icon="thumbs-down" /> }
				</div>
			</div>

			<div className="nelio-content-quality-analysis-summary__explanation">
				{ onClick ? (
					<Button variant="link" onClick={ onClick }>
						<span>{ label }</span>
					</Button>
				) : (
					<span>{ label }</span>
				) }
			</div>
		</div>
	);
};

// =======
// HELPERS
// =======

function getDefaultLabel( status: PostQualityStatus ) {
	switch ( status ) {
		case 'perfect':
			return createInterpolateElement(
				_x(
					'The post looks <strong>awesome</strong>!',
					'text',
					'nelio-content'
				),
				{
					strong: <strong />,
				}
			);

		case 'good':
			return createInterpolateElement(
				_x(
					'The post looks <strong>good</strong>!',
					'text',
					'nelio-content'
				),
				{
					strong: <strong />,
				}
			);

		case 'improvable':
			return createInterpolateElement(
				_x(
					'The post is <strong>improvable</strong>',
					'text',
					'nelio-content'
				),
				{
					strong: <strong />,
				}
			);

		case 'bad':
			return createInterpolateElement(
				_x(
					'The post is <strong>poor</strong>',
					'text',
					'nelio-content'
				),
				{
					strong: <strong />,
				}
			);

		default:
			return _x( 'Post can’t be evaluated', 'text', 'nelio-content' );
	} //end switch
} //end getDefaultLabel()
