/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal, TextControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';

export const ExportDialog = (): JSX.Element | null => {
	const [ isExportDialogOpen, openExportDialog ] = useExportDialog();
	const isIcsEnabled = useSelect( ( select ) =>
		select( NC_CALENDAR ).isIcsEnabled()
	);
	const allPostsIcsLink = useIcsLink( 'all' );
	const userIcsLink = useIcsLink( 'user' );

	const downloadCsv = useCsvDownloader();

	if ( ! isExportDialogOpen ) {
		return null;
	} //end if

	return (
		<Modal
			className="nelio-content-calendar-export-dialog"
			isDismissible={ true }
			shouldCloseOnEsc={ true }
			shouldCloseOnClickOutside={ true }
			onRequestClose={ () => openExportDialog( false ) }
			title={ _x( 'Export Calendar', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-calendar-export-dialog__paragraph">
				{ _x(
					'Export your editorial calendar in CSV format:',
					'user',
					'nelio-content'
				) }
			</div>

			<div className="nelio-content-calendar-export-dialog__download-csv">
				<Button
					variant="primary"
					onClick={ () => {
						downloadCsv();
						void openExportDialog( false );
					} }
				>
					{ _x( 'Download CSV', 'command', 'nelio-content' ) }
				</Button>
			</div>

			{ isIcsEnabled && (
				<div className="nelio-content-calendar-export-dialog__ics">
					<div className="nelio-content-calendar-export-dialog__paragraph">
						{ _x(
							'Export your editorial calendar to Google Calendar or any tool that supports iCalendar (.ics) format.',
							'user',
							'nelio-content'
						) }
					</div>

					<div className="nelio-content-calendar-export-dialog__ics-option">
						<TextControl
							label={ _x(
								'URL to export your posts only:',
								'user',
								'nelio-content'
							) }
							value={ userIcsLink ?? '' }
							onChange={ () => void null }
							readOnly
						/>
					</div>

					<div className="nelio-content-calendar-export-dialog__ics-option">
						<TextControl
							label={ _x(
								'URL to export all posts:',
								'user',
								'nelio-content'
							) }
							value={ allPostsIcsLink ?? '' }
							onChange={ () => void null }
							readOnly
						/>
					</div>
				</div>
			) }
		</Modal>
	);
};

// =====
// HOOKS
// =====

const useExportDialog = () => {
	const isOpen = useSelect( ( select ) =>
		select( NC_CALENDAR ).isExportDialogOpen()
	);
	const { openExportDialog } = useDispatch( NC_CALENDAR );
	return [ isOpen, openExportDialog ] as const;
};

const useIcsLink = ( type: 'all' | 'user' ) =>
	useSelect( ( select ) => select( NC_CALENDAR ).getIcsLink( type ) );

const useCsvDownloader = () => {
	const csv = useSelect( ( select ) => {
		const { getCSV, getFirstDayOfWeek } = select( NC_DATA );
		const { getFirstDay, getLastDay } = select( NC_CALENDAR );
		const firstDayOfWeek = getFirstDayOfWeek();
		return getCSV(
			getFirstDay( firstDayOfWeek ),
			getLastDay( firstDayOfWeek )
		);
	} );

	return () => {
		const url = window.URL || window.webkitURL;
		const blob = new window.Blob( [ csv ], {
			type: 'text/csv;charset=UTF-8',
		} );

		const element = document.createElement( 'a' );
		element.setAttribute( 'href', url.createObjectURL( blob ) );
		element.setAttribute( 'download', 'export.csv' );

		document.body.appendChild( element );
		element.click();
		document.body.removeChild( element );
	};
};
