/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { map } from 'lodash';
import { PostSearcher } from '@nelio-content/components';
import { usePostStatuses, usePostTypes } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_TASK_EDITOR } from '../../store';
import {
	useRelatedPost,
	useRelatedPostId,
	useIsRelatedPostHidden,
	useIsRelatedPostReadOnly,
	useRelatedPostStatus,
} from '../../hooks';

export type MaybeRelatedPostProps = {
	readonly disabled?: boolean;
};

export const MaybeRelatedPost = ( {
	disabled,
}: MaybeRelatedPostProps ): JSX.Element | null => {
	const className = 'nelio-content-task-editor__related-post-controls';
	const [ _, setPost ] = useRelatedPost();
	const postId = useRelatedPostId();
	const isHidden = useIsRelatedPostHidden();
	const isReadOnly = useIsRelatedPostReadOnly();
	const relatedPostStatus = useRelatedPostStatus();
	const { setRelatedPostStatus } = useDispatch( NC_TASK_EDITOR );
	const postTypes = map( usePostTypes( 'tasks' ), 'name' );
	const postStatuses = usePostStatuses();

	if ( isReadOnly ) {
		return <ReadOnlyRelatedPost className={ className } />;
	} //end if

	if ( isHidden || ! postTypes.length ) {
		return <div className={ className }></div>;
	} //end if

	if ( 'none' === relatedPostStatus ) {
		return (
			<div className={ className }>
				<Button
					variant="link"
					disabled={ disabled }
					onClick={ () => setRelatedPostStatus( 'searcher' ) }
				>
					{ _x( 'Select related post…', 'command', 'nelio-content' ) }
				</Button>
			</div>
		);
	} //end if

	if ( 'searcher' === relatedPostStatus ) {
		return (
			<div className={ className }>
				<PostSearcher
					disabled={ disabled }
					value={ postId }
					onChange={ ( p ) => void ( p && setPost( p ) ) }
					postTypes={ postTypes }
					postStatuses={ postStatuses }
				/>
			</div>
		);
	} //end if

	return <div className={ className }></div>;
};

const ReadOnlyRelatedPost = ( { className }: { className: string } ) => {
	const [ post ] = useRelatedPost();
	const relatedPostStatus = useRelatedPostStatus();

	if ( 'none' === relatedPostStatus ) {
		return <div className={ className }></div>;
	} //end if

	if ( 'loading' === relatedPostStatus ) {
		return <div className={ className }>Loading...</div>;
	} //end if

	if ( 'error' === relatedPostStatus || ! post ) {
		return (
			<div
				className={ `${ className } ${ className }--has-related-post-link` }
			>
				<strong>
					{ _x( 'Related Post:', 'text', 'nelio-content' ) + ' ' }
				</strong>
				<span>
					{ _x( 'Not Found', 'text (post)', 'nelio-content' ) }
				</span>
			</div>
		);
	} //end if

	return (
		<div
			className={ `${ className } ${ className }--has-related-post-link` }
		>
			<strong>
				{ _x( 'Related Post:', 'text', 'nelio-content' ) + ' ' }
			</strong>
			<ExternalLink href={ post.viewLink }>
				<span className="nelio-content-related-post-link">
					{ post.title }
				</span>
			</ExternalLink>
		</div>
	);
};
