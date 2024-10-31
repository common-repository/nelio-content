/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { isUrl } from '@nelio-content/utils';
import type { Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { Creator } from './creator';
import { Editor } from './editor';
import { Viewer } from './viewer';

export const ExternalCalendarManager = (): JSX.Element | null => {
	const mode = useMode();
	const calendar = useSelect( ( select ) => ( {
		url: select( NC_CALENDAR ).getEditingExternalCalendarUrl(),
		name: select( NC_CALENDAR ).getEditingExternalCalendarName(),
	} ) );
	const {
		closeExternalCalendarEditor,
		manageExternalCalendars,
		openExternalCalendarEditor,
		saveExternalCalendar,
		addExternalCalendar,
	} = useDispatch( NC_CALENDAR );

	const openCreator: Action = {
		label: _x( 'Add Calendar', 'command', 'nelio-content' ),
		onClick: openExternalCalendarEditor,
	};

	const newUrl = calendar.url;
	const addCalendar: Action = {
		label: _x( 'Add Calendar', 'command', 'nelio-content' ),
		onClick: isUrl( newUrl )
			? () => addExternalCalendar( newUrl )
			: undefined,
	};

	const updateCalendar: Action = {
		label: _x( 'Update Calendar', 'command', 'nelio-content' ),
		onClick: () =>
			saveExternalCalendar( {
				url: calendar.url as Url,
				name: calendar.name,
			} ),
	};

	const close: Action = {
		label: _x( 'Close', 'command', 'nelio-content' ),
		onClick: () => manageExternalCalendars( false ),
	};

	const back: Action = {
		label: _x( 'Back', 'command', 'nelio-content' ),
		onClick: closeExternalCalendarEditor,
	};

	switch ( mode ) {
		case 'hidden':
			return null;

		case 'view':
			return (
				<ExternalCalendarModal
					title={ _x(
						'External Calendar Management',
						'text',
						'nelio-content'
					) }
					content={ Viewer }
					actions={ [ close, openCreator ] }
				/>
			);

		case 'create':
			return (
				<ExternalCalendarModal
					title={ _x(
						'Add External Calendar',
						'text',
						'nelio-content'
					) }
					content={ Creator }
					actions={ [ back, addCalendar ] }
				/>
			);

		case 'edit':
			return (
				<ExternalCalendarModal
					title={ _x(
						'Edit External Calendar',
						'text',
						'nelio-content'
					) }
					content={ Editor }
					actions={ [ back, updateCalendar ] }
				/>
			);
	} //end if
};

const useMode = () =>
	useSelect( ( select ): 'hidden' | 'view' | 'create' | 'edit' => {
		if ( ! select( NC_CALENDAR ).isManagingExternalCalendars() ) {
			return 'hidden';
		} //end if

		const mode = select( NC_CALENDAR ).getExternalCalendarEditorMode();
		return 'none' === mode ? 'view' : mode;
	} );

// ============
// HELPER VIEWS
// ============

type Action = {
	readonly label: string;
	readonly onClick: ( () => void ) | undefined;
};

type ExternalCalendarModalProps = {
	readonly title: string;
	readonly content: () => JSX.Element;
	readonly actions: [ Action, Action ];
};

const ExternalCalendarModal = ( {
	title,
	content: Content,
	actions: [ secondary, primary ],
}: ExternalCalendarModalProps ) => {
	const [ isSaving, isRemoving ] = useSelect( ( select ) => [
		select( NC_CALENDAR ).isSavingAnExternalCalendar() ||
			select( NC_CALENDAR ).isAddingAnExternalCalendar(),
		select( NC_CALENDAR ).isDeletingAnExternalCalendar(),
	] );
	const isBusy = isSaving || isRemoving;
	return (
		<Modal
			title={ title }
			isDismissible={ false }
			onRequestClose={ () => void null }
			className="nelio-content-external-calendar-manager"
		>
			<div className="nelio-content-external-calendar-manager__content">
				<Content />
			</div>
			<div className="nelio-content-external-calendar-manager__actions">
				<Button
					variant="secondary"
					onClick={ secondary.onClick ?? ( () => void null ) }
					disabled={ isBusy || ! secondary.onClick }
				>
					{ secondary.label }
				</Button>
				<Button
					variant="primary"
					onClick={ primary.onClick ?? ( () => void null ) }
					disabled={ isBusy || ! primary.onClick }
					isBusy={ isSaving }
				>
					{ primary.label }
				</Button>
			</div>
		</Modal>
	);
};
