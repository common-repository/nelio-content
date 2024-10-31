/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	useCanCreateMessages,
	useCanCreatePosts,
	useCanCreateTasks,
	useMessageCreator,
	useNewPostLabel,
	usePostCreator,
	useTaskCreator,
} from '@nelio-content/calendar';

export type ActionsProps = {
	readonly day: string;
	readonly hour: string;
};

export const Actions = ( { day, hour }: ActionsProps ): JSX.Element => {
	const newPostLabel = useNewPostLabel();
	const canCreatePosts = useCanCreatePosts();
	const canCreateMessages = useCanCreateMessages();
	const canCreateTasks = useCanCreateTasks();
	const openNewPostEditor = usePostCreator( day, hour );
	const openNewSocialMessageEditor = useMessageCreator( day, hour );
	const openNewTaskEditor = useTaskCreator( day );

	return (
		<div className="nelio-content-calendar-agenda-hour-segment__actions">
			<Button
				className="nelio-content-calendar-agenda-hour-segment__header-button nelio-content-calendar-agenda-hour-segment__add-item-icon"
				icon="insert"
			/>

			<Button
				className="nelio-content-calendar-agenda-hour-segment__header-button nelio-content-calendar-agenda-hour-segment__add-post"
				icon="admin-post"
				disabled={ ! canCreatePosts }
				label={ newPostLabel }
				tooltipPosition="bottom center"
				onClick={ openNewPostEditor }
			/>

			<Button
				className="nelio-content-calendar-agenda-hour-segment__header-button nelio-content-calendar-agenda-hour-segment__add-social-message"
				icon="share"
				disabled={ ! canCreateMessages }
				label={ _x(
					'Add New Social Message',
					'command',
					'nelio-content'
				) }
				tooltipPosition="bottom center"
				onClick={ openNewSocialMessageEditor }
			/>

			<Button
				className="nelio-content-calendar-agenda-hour-segment__header-button nelio-content-calendar-agenda-hour-segment__add-task"
				icon="flag"
				disabled={ ! canCreateTasks }
				label={ _x( 'Add New Task', 'command', 'nelio-content' ) }
				tooltipPosition="bottom center"
				onClick={ openNewTaskEditor }
			/>
		</div>
	);
};
