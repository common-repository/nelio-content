/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { NoticeList } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { store as NOTICES } from '@safe-wordpress/notices';

export type ErrorPaneProps = {
	readonly className?: string;
};

export const ErrorPane = ( {
	className = '',
}: ErrorPaneProps ): JSX.Element => {
	const { notices, removeNotice } = useNotices();
	return (
		<div className={ `${ className } nelio-content-calendar-error-pane` }>
			<NoticeList notices={ notices } onRemove={ removeNotice } />
		</div>
	);
};

// =====
// HOOKS
// =====

const useNotices = () => {
	const notices = useSelect( ( select ) => select( NOTICES ).getNotices() );
	const { removeNotice } = useDispatch( NOTICES );
	return { notices, removeNotice };
};
