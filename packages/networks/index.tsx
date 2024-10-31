/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { keyBy, find, map, without } from 'lodash';
import twitter from 'twitter-text';
import type {
	AndArray,
	Maybe,
	MediaItem,
	NonEmptyArray,
	OrArray,
	SocialKind,
	SocialMessage,
	SocialNetwork,
	SocialNetworkName,
	SocialNetworkSupport,
} from '@nelio-content/types';

const BASIC_AUTOMATION_FREQS: SocialNetwork[ 'automationFreqs' ] = {
	reshare: 0,
	publication: 1,
};

const GENERIC_ERRORS = {
	/* translators: social network name */
	missingImage: _x( 'Image required by %s', 'text', 'nelio-content' ),
	/* translators: social network name */
	missingMedia: _x(
		'Image or video required by %s',
		'text',
		'nelio-content'
	),
	/* translators: social network name */
	missingRelatedPost: _x(
		'Add a related post on %s',
		'user',
		'nelio-content'
	),
	/* translators: social network name */
	missingText: _x(
		'Please write status update on %s',
		'user',
		'nelio-content'
	),
	/* translators: social network name */
	missingVideo: _x( 'Video required by %s', 'text', 'nelio-content' ),
	textTooLong: _x(
		'Please write a shorter social message',
		'user',
		'nelio-content'
	),
};

const DEFAULT_SUPPORTS: NonEmptyArray< SocialNetworkSupport > = [
	'automations',
	'image',
	'network-template',
	'preview',
	'profile-template',
	'recurrence',
	'related-post',
	'reusability',
	'text',
];

const DEFAULT_REQUIRES: OrArray< AndArray< SocialNetworkSupport > > = [
	[ 'text' ],
];

const NETWORKS: NonEmptyArray< SocialNetwork > = [
	{
		id: 'twitter' as const,
		automationFreqs: {
			reshare: 8,
			publication: 2,
		},
		labels: {
			add: _x( 'Add X Profile', 'command', 'nelio-content' ),
			name: _x( 'X', 'text', 'nelio-content' ),
			settings: _x( 'X Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="m 31.039495,14.25 h 3.308 l -7.227,8.26 8.502,11.24 h -6.657 l -5.214,-6.817 -5.966,6.817 h -3.31 l 7.73,-8.835 -8.156,-10.665 h 6.826 l 4.713,6.231 z m -1.161,17.52 h 1.833 l -11.832,-15.644 h -1.967 z" />
			</svg>
		),
		limit: 280,
		supports: [
			...DEFAULT_SUPPORTS,
			'buffer-connection',
			'hootsuite-connection',
		],
		requires: DEFAULT_REQUIRES,
	},

	{
		id: 'facebook' as const,
		automationFreqs: {
			reshare: 1,
			publication: 1,
		},
		labels: {
			add: _x( 'Add Facebook Profile', 'command', 'nelio-content' ),
			name: _x( 'Facebook', 'text', 'nelio-content' ),
			settings: _x( 'Facebook Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="m 27.025,13.95 h 4.95 v -6 h -4.95 c -3.9,0 -7.05,3.15 -7.05,7.05 v 3 h -4.05 v 6 h 4.05 v 16.05 h 6 V 24 h 4.95 l 1.05,-6 h -6 v -3 c 0,-0.6 0.45,-1.05 1.05,-1.05" />
			</svg>
		),
		limit: 10000,
		supports: [
			...DEFAULT_SUPPORTS,
			'buffer-connection',
			'hootsuite-connection',
		],
		requires: DEFAULT_REQUIRES,
		kinds: [
			{
				id: 'page',
				label: _x( 'Page', 'facebook profile', 'nelio-content' ),
			},
		],
	},

	{
		id: 'linkedin' as const,
		automationFreqs: BASIC_AUTOMATION_FREQS,
		labels: {
			add: _x( 'Add LinkedIn Profile', 'command', 'nelio-content' ),
			name: _x( 'LinkedIn', 'text', 'nelio-content' ),
			settings: _x( 'LinkedIn Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="m 13.05,10.975 c -1.65,0 -3,1.35 -3,3 0,1.65 1.35,3 3,3 1.65,0 3,-1.35 3,-3 0,-1.65 -1.35,-3 -3,-3 m -3,7.95 v 18 h 6 v -18 h -6 m 10.05,0 v 18 h 5.7 v -8.7 c 0,-2.25 0.45,-4.5 3.45,-4.5 3,0 3,2.55 3,4.65 v 8.55 h 5.7 v -9.6 c 0,-4.8 -1.05,-8.4 -6.9,-8.4 -2.85,0 -4.65,1.5 -5.4,2.85 H 25.5 v -2.85 h -5.55" />
			</svg>
		),
		limit: 3000,
		supports: [
			...DEFAULT_SUPPORTS,
			'buffer-connection',
			'hootsuite-connection',
		],
		requires: DEFAULT_REQUIRES,
		kinds: [
			{
				id: 'single',
				label: _x( 'Personal', 'linkedin profile', 'nelio-content' ),
			},
			{
				id: 'company',
				label: _x( 'Company', 'linkedin profile', 'nelio-content' ),
			},
		],
	},

	{
		id: 'gmb' as const,
		automationFreqs: BASIC_AUTOMATION_FREQS,
		labels: {
			add: _x(
				'Add Google My Business Location',
				'command',
				'nelio-content'
			),
			name: _x( 'Google My Business', 'text', 'nelio-content' ),
			settings: _x(
				'Google My Business Settings',
				'text',
				'nelio-content'
			),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="m 24.27499,11.7 c -6.75,0 -12.3,5.55 -12.3,12.3 0,6.75 5.55,12.3 12.3,12.3 7.05006,0 11.85006,-4.95 11.85006,-12 0,-0.75 -0.1501,-1.5 -0.1501,-2.1 H 24.27499 v 4.2 h 6.90006 c -0.3,1.8 -2.1,5.25 -6.90006,5.25 -4.2,0 -7.65,-3.45 -7.65,-7.8 0,-4.35 3.45,-7.8 7.65,-7.8 2.4,0 3.89996,1.05 4.94996,1.95 l 3.3001,-3.15 c -2.1,-1.95 -4.9501,-3.15 -8.25006,-3.15" />
			</svg>
		),
		limit: 500,
		supports: [ ...DEFAULT_SUPPORTS, 'buffer-connection' ],
		requires: DEFAULT_REQUIRES,
		kinds: [
			{
				id: 'location',
				label: _x(
					'Location',
					'Google My Business profile',
					'nelio-content'
				),
			},
		],
	},

	{
		id: 'pinterest' as const,
		automationFreqs: BASIC_AUTOMATION_FREQS,
		labels: {
			add: _x( 'Add Pinterest Profile', 'command', 'nelio-content' ),
			name: _x( 'Pinterest', 'text', 'nelio-content' ),
			settings: _x( 'Pinterest Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="m 12.15,19.975 c 0,-1.35 0.3,-2.55 0.75,-3.75 0.45,-1.2 1.05,-2.1 1.8,-3 0.75,-0.9 1.65,-1.65 2.7,-2.25 1.05,-0.6 2.1,-1.05 3.3,-1.35 1.2,-0.3 2.4,-0.45 3.6,-0.45 1.95,0 3.75,0.45 5.4,1.2 1.65,0.75 3,1.95 4.05,3.45 1.05,1.5 1.5,3.3 1.5,5.25 0,1.2 -0.15,2.25 -0.3,3.45 -0.3,1.05 -0.6,2.25 -1.05,3.15 -0.45,1.05 -1.05,1.95 -1.8,2.7 -0.75,0.75 -1.65,1.35 -2.7,1.8 -1.05,0.45 -2.25,0.75 -3.45,0.75 -0.75,0 -1.65,-0.15 -2.4,-0.6 -0.75,-0.45 -1.35,-0.9 -1.8,-1.65 -0.15,0.45 -0.3,1.2 -0.45,2.1 -0.15,0.9 -0.3,1.5 -0.45,1.65 0,0.3 -0.15,0.75 -0.3,1.35 -0.15,0.6 -0.3,1.05 -0.45,1.35 l -0.6,1.2 -0.9,1.35 c -0.3,0.45 -0.75,0.9 -1.05,1.5 l -0.3,0.15 -0.15,-0.15 c -0.15,-1.95 -0.3,-3 -0.3,-3.45 0,-1.05 0.15,-2.4 0.45,-3.75 0.3,-1.35 0.6,-3.15 1.2,-5.25 0.6,-2.1 0.9,-3.3 0.9,-3.75 -0.45,-0.75 -0.6,-1.8 -0.6,-3 0,-1.05 0.3,-1.95 0.9,-2.85 0.6,-0.9 1.5,-1.35 2.4,-1.35 0.75,0 1.35,0.3 1.65,0.75 0.45,0.45 0.6,1.05 0.6,1.8 0,0.75 -0.3,1.95 -0.75,3.45 -0.6,1.5 -0.75,2.7 -0.75,3.45 0,0.75 0.3,1.35 0.75,1.95 0.6,0.45 1.2,0.75 1.95,0.75 0.6,0 1.35,-0.15 1.8,-0.45 0.6,-0.3 1.05,-0.75 1.35,-1.2 0.45,-0.45 0.75,-1.05 1.05,-1.65 0.3,-0.6 0.6,-1.35 0.75,-1.95 0.15,-0.75 0.3,-1.35 0.3,-1.95 0.15,-0.6 0.15,-1.2 0.15,-1.8 0,-2.1 -0.6,-3.75 -1.95,-4.95 -1.35,-1.2 -3,-1.8 -5.1,-1.8 -2.4,0 -4.5,0.75 -6,2.4 -1.65,1.5 -2.4,3.6 -2.4,6 0,0.6 0.15,1.05 0.3,1.5 0.15,0.45 0.3,0.9 0.45,1.2 0.15,0.3 0.3,0.6 0.45,0.75 0.15,0.3 0.3,0.45 0.3,0.6 0,0.3 -0.15,0.75 -0.3,1.35 -0.15,0.6 -0.45,0.75 -0.6,0.75 h -0.3 c -0.6,-0.15 -1.2,-0.45 -1.65,-1.05 -0.45,-0.45 -0.9,-1.05 -1.05,-1.65 -0.3,-0.6 -0.45,-1.35 -0.6,-1.95 -0.15,-0.6 -0.15,-1.35 -0.15,-1.95" />
			</svg>
		),
		limit: 500,
		supports: [
			...without( DEFAULT_SUPPORTS, 'network-template' ),
			'multi-target',
			'buffer-connection',
		],
		requires: [ [ 'multi-target', 'text', 'image' ] ],
	},

	{
		id: 'reddit' as const,
		automationFreqs: BASIC_AUTOMATION_FREQS,
		labels: {
			add: _x( 'Add Subreddit', 'command', 'nelio-content' ),
			name: _x( 'Reddit', 'text', 'nelio-content' ),
			settings: _x( 'Reddit Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="m 34.8133,8.60832 c -0.3054,-0.001 -0.6126,0.0486 -0.9129,0.15272 -0.5974,0.2073 -1.1094,0.62592 -1.4242,1.16445 -0.043,0.0748 -0.086,0.1449 -0.091,0.15544 -0.015,0.015 -0.3845,-0.0598 -1.7294,-0.34492 -5.0433,-1.06905 -4.5751,-0.97337 -4.7326,-0.96729 -0.1245,0.005 -0.1541,0.012 -0.242,0.0548 -0.123,0.0603 -0.2389,0.17388 -0.2935,0.28587 -0.031,0.0663 -0.236,1.00464 -1.0032,4.61985 -0.5295,2.49525 -0.9659,4.5504 -0.9698,4.56705 0,0.029 -0.024,0.031 -0.3925,0.0486 -2.8154,0.1344 -5.5287,0.81712 -7.8311,1.97025 -0.6039,0.30246 -1.1124,0.59826 -1.6728,0.973 -0.1999,0.1338 -0.3664,0.24321 -0.3699,0.24321 0,0 -0.078,-0.0606 -0.1645,-0.13485 -0.5259,-0.4477 -1.1961,-0.75444 -1.8911,-0.86545 -0.2031,-0.0324 -0.7128,-0.0447 -0.9343,-0.0226 -1.0103,0.1011 -1.9554,0.61365 -2.5824,1.40047 -0.225,0.28244 -0.4785,0.73029 -0.5909,1.04403 -0.2641,0.73724 -0.306,1.5018 -0.1215,2.2296 0.2679,1.06035 0.9525,1.929 1.9224,2.43915 l 0.1757,0.0926 -0.018,0.12585 c -0.085,0.58338 -0.09,1.34156 -0.015,1.9548 0.093,0.72237 0.3039,1.47101 0.6129,2.1696 1.2492,2.8245 4.191,5.1807 8.0422,6.4413 1.7778,0.5819 3.6788,0.91089 5.694,0.98541 0.3981,0.015 1.3346,0.008 1.7697,-0.015 4.0667,-0.20247 7.7847,-1.5021 10.4256,-3.64425 1.073,-0.87034 1.9553,-1.87995 2.5614,-2.931 0.2595,-0.45013 0.5396,-1.06833 0.695,-1.5345 0.3565,-1.06959 0.4783,-2.23995 0.3421,-3.2859 -0.017,-0.1221 -0.029,-0.23352 -0.029,-0.24744 -1e-4,-0.0174 0.051,-0.0516 0.1644,-0.1095 0.188,-0.0961 0.4724,-0.282 0.644,-0.42078 0.1501,-0.1215 0.432,-0.40335 0.5535,-0.55347 0.4275,-0.52848 0.7117,-1.17679 0.8166,-1.86225 0.043,-0.28059 0.046,-0.78865 0.015,-1.0567 -0.2151,-1.48095 -1.2101,-2.66385 -2.6142,-3.10815 -1.0358,-0.32769 -2.1933,-0.18375 -3.1173,0.38763 -0.15,0.0927 -0.4293,0.30205 -0.5616,0.4207 -0.063,0.0561 -0.091,0.0734 -0.1065,0.063 -0.1544,-0.11055 -0.7271,-0.48358 -0.9263,-0.60336 -0.7329,-0.44083 -1.5366,-0.84036 -2.362,-1.17424 -1.9941,-0.80661 -4.317,-1.30416 -6.5715,-1.40759 -0.12,-0.006 -0.2184,-0.0135 -0.2184,-0.0192 0,-0.005 0.3865,-1.8174 0.8589,-4.02735 0.4725,-2.20995 0.8589,-4.02405 0.8589,-4.0314 0,-0.008 0.015,-0.0135 0.025,-0.0135 0.015,9e-5 1.2786,0.26868 2.8096,0.59685 l 2.7837,0.59664 0.019,0.17696 c 0.1335,1.22904 1.0703,2.2017 2.2973,2.38395 0.2001,0.0297 0.583,0.0299 0.7755,3e-4 0.7893,-0.1212 1.4814,-0.57411 1.8951,-1.2401 0.3138,-0.50526 0.4585,-1.1253 0.3961,-1.6971 C 37.374,10.0916 36.8069,9.28041 35.9679,8.87811 35.5989,8.70119 35.2092,8.6108 34.8167,8.60795 Z m -16.8105,15.6465 c 0.1667,-7.6e-4 0.3395,0.0105 0.4643,0.0312 0.5662,0.0969 1.0416,0.34062 1.4454,0.74087 0.334,0.33109 0.5541,0.69388 0.6861,1.13095 0.071,0.23633 0.099,0.41298 0.108,0.68495 0.015,0.44938 -0.066,0.84906 -0.2531,1.24158 -0.2358,0.49696 -0.6546,0.93786 -1.1506,1.21143 -0.23,0.1269 -0.5582,0.23785 -0.8433,0.28516 -0.1706,0.0283 -0.5585,0.04 -0.7109,0.0214 -0.3237,-0.0394 -0.5916,-0.1167 -0.8706,-0.25126 -0.6933,-0.33429 -1.1956,-0.91884 -1.4157,-1.6473 -0.07,-0.23321 -0.099,-0.41135 -0.108,-0.67838 -0.016,-0.46395 0.064,-0.84439 0.2679,-1.2655 0.39,-0.8048 1.1328,-1.34774 2.0282,-1.4825 0.098,-0.015 0.223,-0.0221 0.3526,-0.0226 z m 11.897,0.0396 c 0.4044,-6e-4 0.5325,0.0181 0.8551,0.1257 0.8549,0.28454 1.5161,0.98825 1.7424,1.85415 0.072,0.27602 0.082,0.36627 0.082,0.69267 -6e-4,0.34244 -0.021,0.48749 -0.105,0.76658 -0.129,0.42846 -0.3319,0.77059 -0.6493,1.09723 -0.4472,0.46005 -1.0035,0.73184 -1.6401,0.80102 -0.135,0.015 -0.4077,0.0178 -0.5079,0.006 -0.5604,-0.0666 -0.9825,-0.22875 -1.3829,-0.53121 -0.5917,-0.44709 -0.9667,-1.10478 -1.0545,-1.84965 -0.023,-0.18549 -0.015,-0.57791 0.024,-0.76377 0.1734,-0.96498 0.8637,-1.7628 1.7934,-2.07225 0.3272,-0.1089 0.4395,-0.12585 0.8426,-0.1263 z m -11.774,8.5971 c 0.064,5.3e-4 0.1065,0.007 0.1664,0.0265 0.1185,0.0365 0.1894,0.0838 0.3804,0.25604 0.2808,0.25344 0.5287,0.41854 0.9274,0.61758 1.6211,0.80922 4.2038,1.08934 6.4938,0.70426 1.4712,-0.24738 2.5685,-0.69828 3.2541,-1.33732 0.1673,-0.15587 0.2271,-0.19628 0.3545,-0.23931 0.077,-0.0258 0.12,-0.0306 0.2344,-0.0259 0.12,0.005 0.1551,0.012 0.2421,0.0532 0.1365,0.0639 0.2103,0.1254 0.279,0.23161 0.09,0.1392 0.1215,0.26154 0.1125,0.44694 0,0.144 -0.015,0.162 -0.068,0.2772 -0.05,0.10035 -0.085,0.1464 -0.1912,0.24878 -0.5387,0.51915 -1.3194,0.96475 -2.2431,1.28017 -0.9609,0.3281 -2.1078,0.53298 -3.3516,0.5987 -0.2501,0.0135 -1.1229,0.0168 -1.3181,0.006 -0.8583,-0.0501 -1.4652,-0.12345 -2.125,-0.25682 -1.5095,-0.30501 -2.6273,-0.79269 -3.4533,-1.5066 -0.2825,-0.24405 -0.3762,-0.37638 -0.4131,-0.58285 -0.053,-0.29208 0.1095,-0.59255 0.3939,-0.73322 0.102,-0.0507 0.129,-0.0571 0.2524,-0.0625 0.027,-10e-4 0.051,-10e-4 0.072,-10e-4 z" />
			</svg>
		),
		limit: 500,
		supports: DEFAULT_SUPPORTS,
		requires: DEFAULT_REQUIRES,
		kinds: [
			{
				id: 'subreddit',
				label: _x( 'Subreddit', 'Reddit profile', 'nelio-content' ),
			},
		],
	},

	{
		id: 'instagram' as const,
		automationFreqs: BASIC_AUTOMATION_FREQS,
		labels: {
			add: _x( 'Add Instagram Profile', 'command', 'nelio-content' ),
			name: _x( 'Instagram', 'text', 'nelio-content' ),
			settings: _x( 'Instagram Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="m 18.9501,24.05 c 0,-2.85 2.25,-5.1 5.0998,-5.1 2.8502,0 5.1002,2.25 5.1002,5.1 0,2.85 -2.25,5.1 -5.1002,5.1 -2.8498,0 -5.0998,-2.25 -5.0998,-5.1 m -2.85,0 c 0,4.35 3.6,7.95 7.9498,7.95 4.3502,0 7.9502,-3.6 7.9502,-7.95 0,-4.35 -3.6,-7.95 -7.9502,-7.95 -4.3498,0 -7.9498,3.6 -7.9498,7.95 m 14.25,-8.25 c 0,1.05 0.9,1.8 1.8,1.8 1.05,0 1.8,-0.9 1.8,-1.8 0,-1.05 -0.9,-1.8 -1.8,-1.8 -1.05,0 -1.8,0.9 -1.8,1.8 m -12.6,20.7 c -1.5,0 -2.25,-0.3 -2.85,-0.6 -0.75,-0.3 -1.2,-0.6 -1.8,-1.2 -0.6,-0.6 -0.9,-1.05 -1.2,-1.8 -0.15,-0.6 -0.45,-1.35 -0.6,-2.85 0,-1.65 -0.15,-2.1 -0.15,-6.3 0,-4.05 0,-4.65 0.15,-6.3 0,-1.5 0.3,-2.25 0.6,-2.85 0.3,-0.75 0.6,-1.2 1.2,-1.8 0.6,-0.6 1.05,-0.9 1.8,-1.2 0.6,-0.15 1.35,-0.45 2.85,-0.6 1.65,0 2.1,-0.15 6.3,-0.15 4.05,0 4.65,0 6.3,0.15 1.5,0 2.25,0.3 2.85,0.6 0.75,0.3 1.2,0.6 1.8,1.2 0.6,0.6 0.9,1.05 1.2,1.8 0.15,0.6 0.45,1.35 0.6,2.85 0.15,1.65 0.15,2.1 0.15,6.3 0,4.05 0,4.65 -0.15,6.3 0,1.5 -0.3,2.25 -0.6,2.85 -0.3,0.75 -0.6,1.2 -1.2,1.8 -0.6,0.6 -1.05,0.9 -1.8,1.2 -0.6,0.15 -1.35,0.45 -2.85,0.6 -1.65,0 -2.1,0.15 -6.3,0.15 -4.05,0 -4.65,0 -6.3,-0.15 m -0.15,-27.9 c -1.65,0 -2.7,0.3 -3.75,0.75 -1.0502,0.45 -1.8002,0.9 -2.7,1.8 -0.9,0.9 -1.35,1.65 -1.8,2.7 -0.45,1.05 -0.6,2.1 -0.75,3.75 -0.15,1.65 -0.15,2.1 -0.15,6.3 0,4.2 0,4.65 0.15,6.3 0.15,1.65 0.3,2.7 0.75,3.75 0.4498,1.05 0.9,1.8 1.8,2.7 0.9,0.9 1.65,1.35 2.7,1.8 1.05,0.45 2.1,0.6 3.75,0.75 1.65,0 2.1,0.15 6.3,0.15 4.2,0 4.65,0 6.3,-0.15 1.65,0 2.7,-0.3 3.75,-0.75 1.05,-0.45 1.8,-0.9 2.7,-1.8 0.9,-0.9 1.35,-1.65 1.8,-2.7 0.45,-1.05 0.6,-2.1 0.75,-3.75 0.15,-1.65 0.15,-2.1 0.15,-6.3 0,-4.2 0,-4.65 -0.15,-6.3 0,-1.65 -0.3,-2.7 -0.75,-3.75 -0.45,-1.05 -0.9,-1.8 -1.8,-2.7 -0.9,-0.9 -1.65,-1.35 -2.7,-1.8 -1.05,-0.45 -2.1,-0.6 -3.75,-0.75 -1.65,0 -2.1,-0.15 -6.3,-0.15 -4.2,0 -4.65,0 -6.3,0.15" />
			</svg>
		),
		limit: 2000,
		supports: [
			...DEFAULT_SUPPORTS,
			'buffer-connection',
			'hootsuite-connection',
		],
		requires: [ [ 'text', 'image' ] ],
	},

	{
		id: 'telegram' as const,
		automationFreqs: BASIC_AUTOMATION_FREQS,
		labels: {
			add: _x( 'Add Telegram Connection', 'command', 'nelio-content' ),
			name: _x( 'Telegram', 'text', 'nelio-content' ),
			settings: _x( 'Telegram Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="m 9.1562,23.47507 c 8.4443,-3.66723 14.0658,-6.10401 16.8885,-7.2862 8.0342,-3.35358 9.723,-3.93261 10.8087,-3.95675 0.2412,0 0.7719,0.0483 1.134,0.33777 0.2894,0.24128 0.3618,0.55491 0.4101,0.79619 0.048,0.24126 0.097,0.7479 0.048,1.13394 -0.4344,4.58403 -2.3161,15.70633 -3.2812,20.82114 -0.4103,2.17138 -1.2063,2.89519 -1.9784,2.96757 -1.6888,0.14475 -2.9676,-1.10982 -4.584,-2.17139 -2.5575,-1.66473 -3.9808,-2.70216 -6.4659,-4.34277 -2.8711,-1.88185 -1.0134,-2.9193 0.6273,-4.60816 0.434,-0.43427 7.841,-7.1897 7.9859,-7.79285 0.024,-0.0725 0.024,-0.36189 -0.1455,-0.50665 -0.1686,-0.14475 -0.4101,-0.0965 -0.603,-0.0483 -0.2654,0.0483 -4.3187,2.75041 -12.2081,8.08237 -1.158,0.79617 -2.1954,1.1822 -3.1363,1.15806 -1.0376,-0.0241 -3.0158,-0.57903 -4.5117,-1.06155 C 8.3351,26.41845 6.8876,26.1048 7.0081,25.0915 7.0801,24.56071 7.8043,24.02994 9.1555,23.47503 Z" />
			</svg>
		),
		limit: 4096,
		supports: DEFAULT_SUPPORTS,
		requires: DEFAULT_REQUIRES,
	},

	{
		id: 'medium' as const,
		automationFreqs: BASIC_AUTOMATION_FREQS,
		labels: {
			add: _x( 'Add Medium Connection', 'command', 'nelio-content' ),
			name: _x( 'Medium', 'text', 'nelio-content' ),
			settings: _x( 'Medium Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="M73.585-6.318c0 5.368-4.322 9.72-9.653 9.72-5.332 0-9.654-4.352-9.654-9.72s4.322-9.72 9.654-9.72c5.331 0 9.653 4.352 9.653 9.72M84.176-6.318c0 5.053-2.161 9.151-4.827 9.151s-4.827-4.098-4.827-9.15c0-5.054 2.16-9.152 4.826-9.152 2.666 0 4.827 4.097 4.827 9.151M88.507-6.318c0 4.526-.76 8.198-1.697 8.198-.938 0-1.698-3.67-1.698-8.198 0-4.527.76-8.198 1.698-8.198.937 0 1.697 3.67 1.697 8.198" />
			</svg>
		),
		limit: 4096,
		supports: [ 'related-post' ],
		requires: [ [ 'preview', 'related-post' ] ],
	},

	{
		id: 'tiktok' as const,
		automationFreqs: {
			reshare: 0,
			publication: 0,
		},
		labels: {
			add: _x( 'Add TikTok Profile', 'command', 'nelio-content' ),
			name: _x( 'TikTok', 'text', 'nelio-content' ),
			settings: _x( 'TikTok Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="M 37.525,21.21877 V 15.99544 C 33.3235,15.61359 30.3877,12.8152 30.151,8.49843 h -5.3259 v 21.50782 c 0.072,0.43079 -0.2088,4.06956 -4.7982,4.18668 -2.3523,0.0602 -4.2642,-1.91922 -4.2859,-4.58934 -0.021,-2.55037 2.4891,-5.0956 5.8888,-4.26762 v -5.32573 c -5.0398,-0.94718 -11.088,3.32887 -11.154,8.98603 -0.057,4.89774 2.808,10.5053 9.6164,10.5053 7.0797,0 10.0588,-5.88327 10.0588,-9.24953 V 18.90412 c 1.3508,1.30703 5.4431,2.34515 7.374,2.31465 z" />
			</svg>
		),
		limit: 2000,
		supports: [ 'recurrence', 'reusability', 'video' ],
		requires: [ [ 'video' ] ],
		validators: {
			video: ( media ) => {
				if ( ! media ) {
					return undefined;
				} //end if

				if ( ! [ 'video/mp4', 'video/webm' ].includes( media.mime ) ) {
					return _x(
						'Unsupported video type in TikTok',
						'text',
						'nelio-content'
					);
				} //end if

				if ( media.height < 540 ) {
					return _x(
						'TikTok video resolution must be at least 540p',
						'text',
						'nelio-content'
					);
				} //end if

				if ( media.duration < 3 ) {
					return _x(
						'TikTok video must be at least 3 seconds long',
						'text',
						'nelio-content'
					);
				} //end if

				if ( media.duration > 60 ) {
					return _x(
						'TikTok video must be shorter than 1 minute',
						'text',
						'nelio-content'
					);
				} //end if

				if ( megas( media.filesizeInBytes ) > 50 ) {
					return _x(
						'TikTok video should be smaller than 50MB',
						'text',
						'nelio-content'
					);
				} //end if

				return undefined;
			},
		},
	},

	{
		id: 'tumblr' as const,
		automationFreqs: BASIC_AUTOMATION_FREQS,
		labels: {
			add: _x( 'Add Tumblr Profile', 'command', 'nelio-content' ),
			name: _x( 'Tumblr', 'text', 'nelio-content' ),
			settings: _x( 'Tumblr Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="m 21.175,8.58184 c 0,6.45 -5.25,8.7 -5.25,8.7 v 4.05 h 3.3 v 12.9 c 0,6 7.05,6 12.75,4.05 v -4.95 c -4.95,2.85 -7.5,1.05 -7.5,-2.55 v -9.45 h 6.75 v -4.8 h -6.75 v -8.1 h -3.3" />
			</svg>
		),
		limit: 500,
		supports: DEFAULT_SUPPORTS,
		requires: DEFAULT_REQUIRES,
	},

	{
		id: 'mastodon' as const,
		automationFreqs: {
			reshare: 8,
			publication: 2,
		},
		labels: {
			add: _x( 'Add Mastodon Profile', 'command', 'nelio-content' ),
			name: _x( 'Mastodon', 'text', 'nelio-content' ),
			settings: _x( 'Mastodon Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="m 23.952,7.43706 c -4.2348,0.0346 -8.3107,0.49252 -10.6846,1.5828 0,0 -4.7073,2.10789 -4.7073,9.29386 0,1.6455 -0.033,3.61106 0.02,5.69757 0.1711,7.0275 1.2903,13.95473 7.788,15.67448 2.9957,0.79296 5.5654,0.95875 7.6371,0.84489 3.7566,-0.20826 5.8676,-1.34141 5.8676,-1.34141 l -0.123,-2.72397 c 0,0 -2.6855,0.84656 -5.7005,0.7434 -2.9868,-0.10245 -6.1416,-0.32389 -6.6248,-3.9913 -0.045,-0.32216 -0.066,-0.66693 -0.066,-1.02869 0,0 2.9306,0.71852 6.6468,0.88878 2.2723,0.10425 4.4058,-0.13395 6.5699,-0.39228 4.1504,-0.4956 7.7644,-3.05359 8.2186,-5.39032 0.7157,-3.68099 0.6555,-8.98115 0.6555,-8.98115 0,-7.18597 -4.7073,-9.29386 -4.7073,-9.29386 C 32.3683,7.92958 28.2926,7.47168 24.0575,7.43706 Z m -4.795,5.61528 c 1.7641,0 3.0998,0.67647 3.9831,2.03268 l 0.8586,1.44016 0.8586,-1.44016 c 0.8831,-1.35621 2.2215,-2.03268 3.9858,-2.03268 1.5245,0 2.7516,0.53455 3.6896,1.58005 0.9093,1.04549 1.3606,2.45991 1.3606,4.23819 v 8.70135 H 30.4478 V 19.1257 c 0,-1.78026 -0.7485,-2.68281 -2.2467,-2.68281 -1.6566,0 -2.488,1.07078 -2.488,3.19029 v 4.62225 h -3.4263 v -4.62225 c 0,-2.11951 -0.8313,-3.19029 -2.4879,-3.19029 -1.4982,0 -2.2469,0.90255 -2.2469,2.68281 v 8.44623 h -3.4482 v -8.70135 c 0,-1.77828 0.4542,-3.1927 1.3634,-4.23819 0.9379,-1.0455 2.1651,-1.58005 3.6898,-1.58005 z" />
			</svg>
		),
		limit: 500,
		supports: [ ...DEFAULT_SUPPORTS, 'buffer-connection' ],
		requires: DEFAULT_REQUIRES,
	},

	{
		id: 'bluesky' as const,
		automationFreqs: {
			reshare: 8,
			publication: 2,
		},
		labels: {
			add: _x( 'Add Bluesky Profile', 'command', 'nelio-content' ),
			name: _x( 'Bluesky', 'text', 'nelio-content' ),
			settings: _x( 'Bluesky Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="M24 21.6c-2.16 -4.2 -8.1 -12.12 -13.59 -15.99C5.1 1.89 3.12 2.52 1.8 3.12 0.3 3.81 0 6.15 0 7.53s0.75 11.31 1.26 12.96c1.62 5.46 7.41 7.35 12.75 6.75 -7.8 1.14 -14.76 3.99 -5.64 14.13 9.99 10.38 13.71 -2.22 15.63 -8.61 1.92 6.39 4.11 18.54 15.48 8.61 8.52 -8.61 2.34 -12.99 -5.49 -14.13 5.34 0.6 11.13 -1.29 12.75 -6.75 0.51 -1.65 1.26 -11.58 1.26 -12.96s-0.27 -3.72 -1.8 -4.41c-1.32 -0.6 -3.33 -1.26 -8.61 2.49A53.7 53.7 0 0 0 24 21.6" />
			</svg>
		),
		limit: 230,
		supports: DEFAULT_SUPPORTS,
		requires: DEFAULT_REQUIRES,
	},

	{
		id: 'threads' as const,
		automationFreqs: {
			reshare: 8,
			publication: 2,
		},
		labels: {
			add: _x( 'Add Threads Profile', 'command', 'nelio-content' ),
			name: _x( 'Threads', 'text', 'nelio-content' ),
			settings: _x( 'Threads Settings', 'text', 'nelio-content' ),
		},
		icon: (
			<svg viewBox="0 0 48 48">
				<path d="M35.486 22.247a16.667 16.667 0 0 0-.63-.286c-.37-6.827-4.1-10.735-10.364-10.775h-.085c-3.746 0-6.862 1.6-8.78 4.51l3.445 2.362c1.433-2.174 3.681-2.637 5.337-2.637h.058c2.062.014 3.618.613 4.625 1.782.733.852 1.224 2.028 1.466 3.513-1.828-.31-3.806-.407-5.92-.285-5.955.343-9.783 3.816-9.526 8.642.13 2.448 1.35 4.554 3.434 5.93 1.762 1.163 4.03 1.732 6.39 1.603 3.114-.171 5.557-1.36 7.261-3.532 1.295-1.65 2.114-3.788 2.475-6.483 1.484.896 2.584 2.075 3.192 3.492 1.033 2.409 1.093 6.367-2.137 9.594-2.83 2.827-6.23 4.05-11.372 4.088-5.702-.043-10.015-1.871-12.819-5.436C8.911 34.991 7.554 30.17 7.503 24c.051-6.17 1.408-10.992 4.033-14.329 2.804-3.564 7.117-5.393 12.82-5.436 5.743.043 10.131 1.88 13.042 5.462 1.428 1.757 2.504 3.965 3.214 6.54l4.036-1.076c-.86-3.17-2.213-5.902-4.054-8.167C36.86 2.402 31.403.049 24.37 0h-.029C17.323.049 11.925 2.41 8.3 7.02c-3.226 4.1-4.89 9.808-4.946 16.963v.033c.055 7.154 1.72 12.862 4.946 16.964 3.626 4.61 9.024 6.971 16.042 7.02h.029c6.24-.043 10.638-1.677 14.262-5.297 4.74-4.736 4.598-10.673 3.035-14.318-1.12-2.614-3.258-4.736-6.18-6.138zm-10.774 10.13c-2.61.147-5.322-1.024-5.455-3.534-.1-1.86 1.324-3.936 5.615-4.184.492-.028.974-.042 1.448-.042 1.559 0 3.017.152 4.343.441-.495 6.176-3.395 7.179-5.951 7.319z" />
			</svg>
		),
		limit: 300,
		supports: [ ...DEFAULT_SUPPORTS, 'hootsuite-connection' ],
		requires: DEFAULT_REQUIRES,
	},
];

const MAX_CHAR_LIMIT: number = Math.max( ...map( NETWORKS, 'limit' ) );
const MIN_CHAR_LIMIT: number = Math.min( ...map( NETWORKS, 'limit' ) );

type TargetLabel = {
	readonly explanation: string;
	readonly loading: string;
	readonly noTargetsExplanation: string;
	readonly selectTarget: string;
	readonly selectTargetError: string;
	readonly selectTargets: string;
	readonly targetLabel: string;
	readonly title: string;
};

const TARGET_LABELS: Record< string, TargetLabel > = {
	default: {
		explanation: _x(
			'Please select where your message will be shared on:',
			'user',
			'nelio-content'
		),
		loading: _x( 'Loading…', 'text', 'nelio-content' ),
		noTargetsExplanation: _x(
			'Your profile does not have any locations yet. Please configure one first.',
			'user',
			'nelio-content'
		),
		selectTarget: _x( 'Select a location…', 'user', 'nelio-content' ),
		selectTargets: _x( 'Select locations…', 'user', 'nelio-content' ),
		selectTargetError: _x(
			'Please select a location',
			'user',
			'nelio-content'
		),
		targetLabel: _x( 'Location', 'text', 'nelio-content' ),
		title: _x( 'Select Location', 'text', 'nelio-content' ),
	},

	pinterest: {
		explanation: _x(
			'Please select the boards your message will be shared on:',
			'user (pinterest boards)',
			'nelio-content'
		),
		loading: _x(
			'Loading boards…',
			'text (pinterest boards)',
			'nelio-content'
		),
		noTargetsExplanation: _x(
			'Your Pinterest profile does not have any boards yet. Go to Pinterest and create one first.',
			'user (no pinterest boards)',
			'nelio-content'
		),
		selectTarget: _x( 'Select a board…', 'user', 'nelio-content' ),
		selectTargets: _x( 'Select boards…', 'user', 'nelio-content' ),
		selectTargetError: _x(
			'Please select a board',
			'user',
			'nelio-content'
		),
		targetLabel: _x(
			'Board',
			'text (pinterest target name)',
			'nelio-content'
		),
		title: _x(
			'Select Boards',
			'text (pinterest boards)',
			'nelio-content'
		),
	},

	reddit: {
		explanation: _x(
			'Please select where your message will be shared on:',
			'user',
			'nelio-content'
		),
		loading: _x( 'Loading…', 'text', 'nelio-content' ),
		noTargetsExplanation: _x(
			'Your profile does not have any subreddits yet. Please configure one first.',
			'user',
			'nelio-content'
		),
		selectTarget: _x( 'Select a subreddit…', 'user', 'nelio-content' ),
		selectTargets: _x( 'Select subreddits…', 'user', 'nelio-content' ),
		selectTargetError: _x(
			'Please select a subreddit',
			'user',
			'nelio-content'
		),
		targetLabel: _x( 'Subreddit', 'text', 'nelio-content' ),
		title: _x( 'Select Subreddit', 'text', 'nelio-content' ),
	},
};

const _supportedNetworks = map( NETWORKS, 'id' );
export const getSupportedNetworks = (): NonEmptyArray< SocialNetworkName > =>
	_supportedNetworks;

const _networksById = keyBy( NETWORKS, 'id' );
export const getCharLimitInNetwork = (
	networkName: SocialNetworkName
): number => {
	const network = _networksById[ networkName ] || { limit: MAX_CHAR_LIMIT };
	return network.limit;
};

export const getMinCharLimit = (): number => MIN_CHAR_LIMIT;

export const getMaxCharLimit = (): number => MAX_CHAR_LIMIT;

const LINK_25CH = 'aaaabaaaabaaaabaaaabaaaab';
export function getMessageLength( text: string ): number {
	text = ` ${ text } `;
	text = text.replaceAll( /(\s)https?:\/\/[^\s]+/g, `$1${ LINK_25CH }` );
	text = text.trim();
	return twitter.parseTweet( text ).weightedLength;
} //end getMessageLength()

export const getDefaultPublicationValue = (
	network: SocialNetworkName
): number => _networksById[ network ]?.automationFreqs?.publication || 0;

export const getDefaultReshareValue = ( network: SocialNetworkName ): number =>
	_networksById[ network ]?.automationFreqs?.reshare || 0;

export const doesNetworkSupport = (
	support: SocialNetworkSupport,
	networkName: Maybe< SocialNetworkName >
): boolean =>
	!! networkName &&
	!! _networksById[ networkName ]?.supports.includes( support );

export const doesNetworkRequire = (
	support: SocialNetworkSupport,
	networkName: Maybe< SocialNetworkName >
): boolean =>
	!! networkName &&
	!! _networksById[ networkName ]?.requires.some( ( r ) =>
		r.includes( support )
	);

export const getNetworkLabel = (
	label: keyof SocialNetwork[ 'labels' ],
	networkName: SocialNetworkName
): string => {
	const network = _networksById[ networkName ];
	return network?.labels[ label ] || '';
};

export const getTargetLabel = (
	label: keyof TargetLabel,
	networkName: SocialNetworkName
): string => {
	const labels = TARGET_LABELS[ networkName ] || TARGET_LABELS.default;
	return labels?.[ label ] || '';
};

export const getNetworkKinds = (
	networkName: SocialNetworkName
): ReadonlyArray< SocialKind > => {
	const network = _networksById[ networkName ];
	return network?.kinds || [];
};

export const getNetworkIcon = ( networkName: SocialNetworkName ): JSX.Element =>
	_networksById[ networkName ]?.icon || (
		<svg viewBox="0 0 48 84">
			<circle cx="24" cy="24" r="12" />
		</svg>
	);

export function getRequirementsError(
	attrs: Pick<
		SocialMessage,
		'network' | 'postId' | 'targetName' | 'textComputed' | 'type'
	> & {
		readonly image: Maybe< MediaItem >;
		readonly video: Maybe< MediaItem >;
	}
): Maybe< string > {
	const network = _networksById[ attrs.network ];
	if ( ! network ) {
		return _x( 'Unknown error', 'text', 'nelio-content' );
	} //end if

	const getReqErr = ( req: SocialNetworkSupport ): string => {
		switch ( req ) {
			case 'image':
				if ( 'image' === attrs.type || 'auto-image' === attrs.type ) {
					return '';
				} //end if

				return network.supports.includes( 'video' )
					? GENERIC_ERRORS.missingMedia
					: GENERIC_ERRORS.missingImage;

			case 'multi-target':
				return ! attrs.targetName
					? getTargetLabel( 'selectTargetError', attrs.network )
					: '';

			case 'text':
				if ( attrs.textComputed === '' ) {
					return GENERIC_ERRORS.missingText;
				} //end if

				return getMessageLength( attrs.textComputed ) > network.limit
					? GENERIC_ERRORS.textTooLong
					: '';

			case 'video':
				if ( 'video' === attrs.type ) {
					return '';
				} //end if

				return network.supports.includes( 'image' )
					? GENERIC_ERRORS.missingMedia
					: GENERIC_ERRORS.missingVideo;

			case 'related-post':
				if ( attrs.postId ) {
					return '';
				} //end if

				return GENERIC_ERRORS.missingRelatedPost;

			case 'automations':
			case 'buffer-connection':
			case 'hootsuite-connection':
			case 'network-template':
			case 'preview':
			case 'profile-template':
			case 'recurrence':
			case 'reusability':
				return '';
		} //end switch
	};

	const getMediaErr = () => {
		if ( network.supports.includes( 'image' ) && 'image' === attrs.type ) {
			return network.validators?.image?.( attrs.image ) ?? '';
		} //end if

		if ( network.supports.includes( 'video' ) && 'video' === attrs.type ) {
			return network.validators?.video?.( attrs.video ) ?? '';
		} //end if

		return '';
	};

	const errors = network.requires.map( ( reqs ) =>
		reqs.reduce( ( e, r ) => e || getReqErr( r ), '' )
	);

	/* eslint-disable @wordpress/valid-sprintf */
	const err = sprintf(
		find( errors, ( e ) => e !== '' ) ?? '',
		network.labels.name
	);
	/* eslint-enable @wordpress/valid-sprintf */
	return err || getMediaErr() || undefined;
} //end getRequirementsError()

// =======
// HELPERS
// =======

const kilos = ( bytes: number ) => Math.round( bytes / 1024 );

const megas = ( bytes: number ) => Math.round( kilos( bytes ) / 1024 );
