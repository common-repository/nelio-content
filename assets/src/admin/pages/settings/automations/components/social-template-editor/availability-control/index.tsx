/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { SocialTemplateAvailability } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';
import { DateSelector } from './date-selector';
import { TimeSelector } from './time-selector';

export const AvailabilityControl = (): JSX.Element | null => {
	const templateType = useTemplateType();
	const [ attributes, setAttributes ] = useAttributes();
	const templateErrors = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getEditingTemplateErrors()
	);

	if ( ! attributes ) {
		return null;
	} //end if

	const { availability } = attributes;

	return (
		<div className="nelio-content-availability-control">
			{ ! availability && (
				<Button
					variant="link"
					onClick={ () =>
						setAttributes( {
							availability:
								getDefaultAvailabilityValue( templateType ),
						} )
					}
				>
					{ _x(
						'Customize template availability',
						'command',
						'nelio-content'
					) }
				</Button>
			) }
			{ !! availability && (
				<>
					<div
						className={ classnames(
							'nelio-content-availability-control__options',
							{
								'nelio-content-availability-control__options--reshare':
									templateType === 'reshare',
							}
						) }
					>
						<DateSelector
							templateType={ templateType }
							availability={ availability }
							setAvailability={ (
								value: SocialTemplateAvailability
							) => setAttributes( { availability: value } ) }
						/>
						<TimeSelector
							templateType={ templateType }
							availability={ availability }
							setAvailability={ (
								value: SocialTemplateAvailability
							) => setAttributes( { availability: value } ) }
						/>
					</div>
					<div className="nelio-content-availability-control__error">
						{ templateErrors.availability ?? '' }
					</div>
					<div>
						<Button
							variant="link"
							onClick={ () =>
								setAttributes( { availability: undefined } )
							}
						>
							{ _x(
								'Make template always available',
								'command',
								'nelio-content'
							) }
						</Button>
					</div>
				</>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useAttributes = () => {
	const attributes = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getEditingTemplate()
	);
	const { setEditingTemplateAttributes: setAttributes } = useDispatch(
		NC_AUTOMATION_SETTINGS
	);
	return [ attributes, setAttributes ] as const;
};

const useTemplateType = () =>
	useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getEditingTemplateType()
	);

// =======
// HELPERS
// =======

const getDefaultAvailabilityValue = (
	templateType: 'publication' | 'reshare'
): SocialTemplateAvailability =>
	templateType === 'publication'
		? { type: 'publication-day-offset', hoursAfterPublication: 0 }
		: {
				type: 'reshare',
				weekday: {
					mon: true,
					tue: true,
					wed: true,
					thu: true,
					fri: true,
					sat: true,
					sun: true,
				},
				time: 'morning',
		  };
