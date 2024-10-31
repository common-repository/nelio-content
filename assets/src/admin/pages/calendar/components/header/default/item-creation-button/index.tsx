/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { DropdownMenu, MenuGroup, MenuItem } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	useCanCreateMessages,
	useCanCreatePosts,
	useCanCreateTasks,
	useDefaultTime,
	useMessageCreator,
	useNewPostLabel,
	usePostCreator,
	useTaskCreator,
	useToday,
} from '@nelio-content/calendar';

export type ItemCreationButtonProps = {
	readonly className?: string;
};

export const ItemCreationButton = ( {
	className = '',
}: ItemCreationButtonProps ): JSX.Element => {
	const today = useToday();
	const singularPostTypeLabel = useNewPostLabel();

	const canCreatePosts = useCanCreatePosts();
	const canCreateMessages = useCanCreateMessages();
	const canCreateTasks = useCanCreateTasks();

	const postTime = useDefaultTime( 'post' );
	const openNewPostEditor = usePostCreator( today, postTime );

	const socialTime = useDefaultTime( 'social' );
	const openNewSocialMessageEditor = useMessageCreator( today, socialTime );

	const openNewTaskEditor = useTaskCreator( today );

	return (
		<DropdownMenu
			className={ `nelio-content-item-creation-button ${ className }` }
			icon="plus"
			label={ _x( 'Create Item', 'command', 'nelio-content' ) }
			toggleProps={ {
				variant: 'primary',
				tooltipPosition: 'bottom center',
			} }
		>
			{ ( { onClose }: { onClose: () => void } ) => (
				<MenuGroup>
					<MenuItem
						role="menuitem"
						icon="admin-post"
						disabled={ ! canCreatePosts }
						onClick={ () => {
							onClose();
							openNewPostEditor();
						} }
					>
						{ singularPostTypeLabel }
					</MenuItem>

					<MenuItem
						role="menuitem"
						icon="share"
						disabled={ ! canCreateMessages }
						onClick={ () => {
							onClose();
							openNewSocialMessageEditor();
						} }
					>
						{ _x( 'Social Message', 'text', 'nelio-content' ) }
					</MenuItem>

					<MenuItem
						role="menuitem"
						icon="flag"
						disabled={ ! canCreateTasks }
						onClick={ () => {
							onClose();
							openNewTaskEditor();
						} }
					>
						{ _x( 'Task', 'text', 'nelio-content' ) }
					</MenuItem>
				</MenuGroup>
			) }
		</DropdownMenu>
	);
};
