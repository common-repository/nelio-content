/**
 * External dependencies
 */
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
const path = require( 'path' );
const { upperFirst } = require( 'lodash' );
const fs = require( 'fs' );
const _ = require( 'lodash' );

const camelCase = ( s ) =>
	`A${ s }`.split( '-' ).map( upperFirst ).join( '' ).substring( 1 );
const kebabCase = ( s ) => s.replace( /([A-Z])/g, '-$1' ).toLowerCase();

/**
 * WordPress dependencies
 */
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

/**
 * Internal dependencies
 */
const premiumConfig = fs.existsSync( './premium/webpack.config.js' )
	? require( './premium/webpack.config.js' )
	: { entry: {} };
const { dependencies } = require( './package' );

const NC_NAMESPACE = /^@nelio-content(-premium)?\//;
const ncPackages = Object.keys( dependencies )
	.filter( ( packageName ) => NC_NAMESPACE.test( packageName ) )
	.filter( ( packageName ) => ! packageName.includes( '-premium/' ) )
	.map( ( packageName ) => packageName.replace( NC_NAMESPACE, '' ) )
	.filter( ( packageName ) => 'types' !== packageName );

// =======
// PLUGINS
// =======

const dewp = new DependencyExtractionWebpackPlugin( {
	requestToExternal: ( request ) =>
		NC_NAMESPACE.test( request )
			? [
					'NelioContent',
					camelCase( request.replace( NC_NAMESPACE, '' ) ),
			  ]
			: undefined,
	requestToHandle: ( request ) =>
		NC_NAMESPACE.test( request )
			? 'nelio-content-' +
			  request.replace(
					NC_NAMESPACE,
					request.includes( '-premium/' ) ? 'premium-' : ''
			  )
			: undefined,
	outputFormat: 'php',
} );

// ========
// SETTINGS
// ========

const __hackFilterOutSVGRulesNOTE = ( rules ) =>
	rules.filter(
		( { use } ) =>
			! ( use && use.includes && use.includes( '@svgr/webpack' ) )
	);

const config = {
	...defaultConfig,
	resolve: {
		alias: {
			'@safe-wordpress': path.resolve(
				__dirname,
				'packages/safe-wordpress'
			),
			'~/nelio-content-images': path.resolve(
				__dirname,
				'assets/src/images'
			),
			'~/nelio-content-pages': path.resolve(
				__dirname,
				'assets/src/admin/pages'
			),
			'~/nelio-content-premium': path.resolve( __dirname, 'premium/src' ),
			'admin-stylesheets': path.resolve(
				'./assets/src/admin/stylesheets'
			),
		},
		extensions: _.uniq( [
			...( defaultConfig.resolve.extensions ?? [] ),
			'.js',
			'.jsx',
			'.ts',
			'.tsx',
		] ),
		// NOTE. react-dnd hack. See https://github.com/react-dnd/react-dnd/issues/3423
		fallback: {
			'react/jsx-runtime': 'react/jsx-runtime.js',
			'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
		},
	},
	plugins: [
		// TODO DAVID. Review this... Ideally, we want premium/dist to be clean when building.
		// new CleanWebpackPlugin( {
		// 	cleanAfterEveryBuildPatterns: [ 'premium/dist' ],
		// } ),
		new ForkTsCheckerWebpackPlugin(),
		...defaultConfig.plugins
			.filter( ( p ) => 'RtlCssPlugin' !== p.constructor.name )
			.map( ( p ) => {
				switch ( p.constructor.name ) {
					case 'DependencyExtractionWebpackPlugin':
						return dewp;

					case 'MiniCssExtractPlugin':
						return new p.constructor( {
							filename: ( { chunk } ) => {
								if ( chunk.name.includes( 'premium/' ) ) {
									return chunk.name
										.replace(
											'premium/',
											'../../premium/dist/'
										)
										.replace( 'style-', '' )
										.replace( /$/, '.css' );
								} //end if
								return `css/${ kebabCase(
									chunk.name.replace( 'style-', '' )
								) }.css`;
							},
						} );

					default:
						return p;
				}
			} ),
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: './assets/src/images',
					to: 'images',
				},
			],
		} ),
	].filter( /* if plugin exists */ ( x ) => !! x ),
	module: {
		...defaultConfig.module,
		rules: [
			...__hackFilterOutSVGRulesNOTE( defaultConfig.module.rules ),
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /.svg$/,
				issuer: /\.tsx?$/,
				loader: '@svgr/webpack',
			},
		],
	},
	watchOptions: {
		ignored: /node_modules|^((?!(packages|assets.src|premium.src)).)*$/,
	},
};

const pagePrefix = './assets/src/admin/pages';
const pages = {
	// PAGES
	'welcome-page': `${ pagePrefix }/welcome`,
	'calendar-page': `${ pagePrefix }/calendar`,
	'analytics-page': `${ pagePrefix }/analytics`,
	'feeds-page': `${ pagePrefix }/feeds`,
	'account-page': `${ pagePrefix }/account`,
	'fake-premium-page': `${ pagePrefix }/fake-premium`,

	// INTEGRATIONS
	'plugin-list-page': `${ pagePrefix }/plugin-list`,
	'post-list-page': `${ pagePrefix }/post-list`,

	// EDITOR
	'classic-editor': `${ pagePrefix }/post/classic`,
	'tinymce-actions': `${ pagePrefix }/post/tinymce-actions`,
	'elementor-editor': `${ pagePrefix }/post/elementor`,
	'gutenberg-editor': `${ pagePrefix }/post/gutenberg`,

	// SETTINGS
	'settings-page': `${ pagePrefix }/settings/generic`,
	'automations-settings': `${ pagePrefix }/settings/automations`,
	'social-profile-settings': `${ pagePrefix }/settings/social-profiles`,
	'task-presets-settings': `${ pagePrefix }/settings/task-presets`,
};

module.exports = {
	...config,
	entry: {
		...ncPackages.reduce(
			( r, p ) => ( {
				...r,
				[ p ]: `./packages/${ p }/export.ts`,
			} ),
			{}
		),
		...pages,
		...premiumConfig.entry,
	},
	output: {
		path: path.resolve( __dirname, './assets/dist/' ),
		filename: ( pathData ) => {
			const { name } = pathData.chunk;
			const cleanName = name.replace( 'premium/', '' );
			return name.startsWith( 'premium/' )
				? `../../premium/dist/${ cleanName }.js`
				: 'js/[name].js';
		},
		library: {
			name: 'NelioContent',
			type: 'assign-properties',
		},
	},
};
