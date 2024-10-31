/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	CheckboxControl,
	ExternalLink,
	SelectControl,
	TextareaControl,
} from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import momentLib from 'moment';
import { useAdminUrl, store as NC_DATA } from '@nelio-content/data';
import { dateI18n, getSettings } from '@nelio-content/date';
import type { AutomationSources } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useCanUseAutomations,
	useHasUsableAutomationGroups,
} from '../../hooks';
import { store as NC_EDIT_POST } from '../../../../store';

export const AutomationSettings = (): JSX.Element => {
	const canUseAutomations = useCanUseAutomations();
	const [ isAutoShareEnabled, enableAutoShare ] = useAutoShare();
	const [ autoShareEndMode, setAutoShareEndMode ] = useAutoShareEndMode();
	const autoShareEndModes = useAutoShareEndModes();

	return (
		<div className="nelio-content-automation-settings">
			<CheckboxControl
				label={ _x(
					'Auto share on social media',
					'command',
					'nelio-content'
				) }
				disabled={ ! canUseAutomations }
				checked={ isAutoShareEnabled }
				onChange={ enableAutoShare }
			/>

			{ isAutoShareEnabled && (
				<>
					<SelectControl
						disabled={ ! canUseAutomations }
						value={ autoShareEndMode }
						onChange={ setAutoShareEndMode }
						options={ autoShareEndModes }
					/>
					<WarningMessage />
					<AutomationSources />
				</>
			) }
		</div>
	);
};

// =====
// VIEWS
// =====

const AutomationSources = () => {
	const canUseAutomations = useCanUseAutomations();
	const [ areCustomSentencesEnabled, enableCustomSentences ] =
		useCustomSentences();
	const [ sentences, setSentences ] = useCustomSentenceList();

	return (
		<div className="nelio-content-automation-settings__automation-sources">
			<CheckboxControl
				label={ _x( 'Custom highlights', 'text', 'nelio-content' ) }
				disabled={ ! canUseAutomations }
				checked={ areCustomSentencesEnabled }
				onChange={ ( val ) => enableCustomSentences( val ) }
			/>

			{ areCustomSentencesEnabled && (
				<TextareaControl
					help={ _x(
						'Please write one highlight per line.',
						'user',
						'nelio-content'
					) }
					disabled={ ! canUseAutomations }
					value={ sentences.join( '\n' ) }
					onChange={ setSentences }
				/>
			) }
		</div>
	);
};

const WarningMessage = () => {
	const hasUsableAutomationGroups = useHasUsableAutomationGroups();
	const autoShareEndDate = useAutoShareEndDate();
	const settingsUrl = useAdminUrl( 'admin.php', {
		page: 'nelio-content-settings',
		subpage: 'social--automations',
	} );

	if ( !! autoShareEndDate ) {
		return (
			<div className="nelio-content-automation-settings__warning">
				{ sprintf(
					/* translators: date */
					_x(
						'Warning! Nelio Content will not share any more social messages automatically, because auto sharing was set to end on %s.',
						'text',
						'nelio-content'
					),
					autoShareEndDate
				) }
			</div>
		);
	} //end if

	if ( ! hasUsableAutomationGroups ) {
		return (
			<div className="nelio-content-automation-settings__warning">
				{ createInterpolateElement(
					_x(
						'Warning! None of your automation groups can share this content. Nelio Content will not be able to automatically create any social messages until you <a>update your settings</a> and refresh.',
						'user',
						'nelio-content'
					),
					{
						// @ts-expect-error children prop is set by createInterpolateComponent.
						a: <ExternalLink href={ settingsUrl } />,
					}
				) }
			</div>
		);
	} //end if

	return null;
};

// =====
// HOOKS
// =====

const useAutoShare = () => {
	const enabled = useSelect( ( select ) =>
		select( NC_EDIT_POST ).isAutoShareEnabled()
	);
	const { enableAutoShare } = useDispatch( NC_EDIT_POST );
	return [ enabled, enableAutoShare ] as const;
};

const useCustomSentences = () =>
	useAutomationSourceToggle( 'useCustomSentences' );

const useCustomSentenceList = () => {
	const sentences = useSelect(
		( select ) =>
			select( NC_EDIT_POST ).getAutomationSources().customSentences
	);
	const { setAutomationSources } = useDispatch( NC_EDIT_POST );
	return [
		sentences,
		( val: string ) =>
			setAutomationSources( { customSentences: val.split( '\n' ) } ),
	] as const;
};

const useAutomationSourceToggle = (
	name: Exclude< keyof AutomationSources, 'customSentences' >
) => {
	const enabled: boolean = useSelect(
		( select ) => select( NC_EDIT_POST ).getAutomationSources()[ name ]
	);
	const { setAutomationSources } = useDispatch( NC_EDIT_POST );
	return [
		enabled,
		( val: boolean ) => setAutomationSources( { [ name ]: val } ),
	] as const;
};

const useAutoShareEndMode = () => {
	const autoShareEndMode = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getAutoShareEndMode()
	);
	const { setAutoShareEndMode } = useDispatch( NC_EDIT_POST );
	return [ autoShareEndMode, setAutoShareEndMode ] as const;
};

const useAutoShareEndDate = () => {
	const [ isAutoShareEnabled ] = useAutoShare();
	const [ endMode ] = useAutoShareEndMode();
	const today = useSelect( ( select ) => select( NC_DATA ).getToday() );
	const months = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getAutoShareEndModeDuration( endMode )
	);
	const post = useSelect( ( select ) => select( NC_EDIT_POST ).getPost() );

	if ( ! isAutoShareEnabled ) {
		return false;
	} //end if

	if ( ! months ) {
		return false;
	} //end if

	const isPostPublished = 'publish' === post.status;
	if ( ! isPostPublished ) {
		return false;
	} //end if

	const endDate = momentLib( post?.date || undefined ).add(
		months,
		'months'
	);
	return (
		dateI18n( 'Y-m-d', endDate ) < today &&
		dateI18n( getSettings().formats?.date || 'Y-m-d', endDate )
	);
};

const useAutoShareEndModes = () =>
	useSelect( ( select ) => select( NC_EDIT_POST ).getAutoShareEndModes() );
