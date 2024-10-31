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

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../../store';
import {
	useDoesActiveNetworkSupport,
	useRelatedPost,
	useRelatedPostId,
	useIsRelatedPostHidden,
	useRelatedPostStatus,
} from '../../hooks';
import { usePostTypes } from '@nelio-content/data';

export type MaybeRelatedPostProps = {
	readonly disabled?: boolean;
};

export const MaybeRelatedPost = ( {
	disabled,
}: MaybeRelatedPostProps ): JSX.Element => {
	const className =
		'nelio-content-social-message-editor__related-post-controls';
	const [ post, setPost ] = useRelatedPost();
	const postId = useRelatedPostId();
	const isHidden = useIsRelatedPostHidden();
	const relatedPostStatus = useRelatedPostStatus();
	const { setRelatedPostStatus } = useDispatch( NC_SOCIAL_EDITOR );
	const supportsRelatedPost = useDoesActiveNetworkSupport( 'related-post' );
	const postTypes = map( usePostTypes( 'social' ), 'name' );

	if ( isHidden ) {
		return <div className={ className }></div>;
	} //end if

	if ( 'ready' === relatedPostStatus.type && post ) {
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
	} //end if

	if ( ! supportsRelatedPost ) {
		return <div className={ className }></div>;
	} //end if

	if ( 'none' === relatedPostStatus.type ) {
		return (
			<div className={ className }>
				<Button
					variant="link"
					disabled={ disabled }
					onClick={ () =>
						setRelatedPostStatus( { type: 'searcher' } )
					}
				>
					{ _x( 'Share old post…', 'command', 'nelio-content' ) }
				</Button>
			</div>
		);
	} //end if

	if ( 'searcher' === relatedPostStatus.type ) {
		return (
			<div className={ className }>
				<PostSearcher
					postTypes={ postTypes }
					disabled={ disabled }
					value={ postId }
					onChange={ ( p ) => void ( p && setPost( p ) ) }
				/>
			</div>
		);
	} //end if

	return <div className={ className }></div>;
};
