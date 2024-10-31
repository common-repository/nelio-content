/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import './style.scss';

import { DefaultSelector } from './default-selector';
import { ExactDate } from './exact-date';
import { NegativeDays } from './negative-days';
import { PositiveDays } from './positive-days';

import { store as NC_TASK_EDITOR } from '../../store';

export type DateDueProps = {
	readonly disabled?: boolean;
};

export const DateDue = ( { disabled }: DateDueProps ): JSX.Element => {
	const [ dateType, setDateType ] = useDateType();
	const [ dateValue, setDateValue ] = useDateValue();
	const isRelatedToUnpublishedPost = useIsRelatedToUnpublishedPost();

	const className =
		'nelio-content-task-editor-date-due nelio-content-task-editor__date-due';

	if ( 'negative-days' === dateType ) {
		return (
			<div className={ className }>
				<NegativeDays
					disabled={ disabled }
					dateValue={ dateValue }
					setDateValue={ setDateValue }
				/>
			</div>
		);
	} //end if

	if ( 'positive-days' === dateType ) {
		return (
			<div className={ className }>
				<PositiveDays
					disabled={ disabled }
					dateValue={ dateValue }
					setDateValue={ setDateValue }
				/>
			</div>
		);
	} //end if

	if ( 'exact' === dateType || ! isRelatedToUnpublishedPost ) {
		return (
			<div className={ className }>
				<ExactDate
					disabled={ disabled }
					hasBackButton={ isRelatedToUnpublishedPost }
					dateValue={ dateValue }
					setDateValue={ setDateValue }
				/>
			</div>
		);
	} //end if

	return (
		<div className={ className }>
			<DefaultSelector
				disabled={ disabled }
				dateValue={ dateValue }
				setDateValue={ setDateValue }
				setDateType={ setDateType }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useDateType = () => {
	const dateType = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).getDateType()
	);
	const { setDateType } = useDispatch( NC_TASK_EDITOR );
	return [ dateType, setDateType ] as const;
};

const useDateValue = () => {
	const dateValue = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).getDateValue()
	);
	const { setDateValue } = useDispatch( NC_TASK_EDITOR );
	return [ dateValue, setDateValue ] as const;
};

const useIsRelatedToUnpublishedPost = () => {
	const post = useSelect( ( select ) => select( NC_TASK_EDITOR ).getPost() );
	return !! post && 'publish' !== post.status;
};
