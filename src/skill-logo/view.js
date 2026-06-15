/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const SPRITE_SELECTOR = '.skill-logo__sprite-sheet';

function createElement( tagName, attributes = {} ) {
	const element = document.createElementNS( SVG_NS, tagName );

	Object.entries( attributes ).forEach( ( [ name, value ] ) => {
		element.setAttribute( name, value );
	} );

	return element;
}

function createSpriteSheet() {
	const sprite = document.createElementNS( SVG_NS, 'svg' );
	sprite.classList.add( 'skill-logo__sprite-sheet' );
	sprite.setAttribute( 'aria-hidden', 'true' );
	sprite.setAttribute( 'focusable', 'false' );
	sprite.setAttribute( 'width', '0' );
	sprite.setAttribute( 'height', '0' );
	sprite.setAttribute(
		'style',
		'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;'
	);

	return sprite;
}

function getOrCreateSpriteSheet() {
	let sprite = document.querySelector( SPRITE_SELECTOR );

	if ( sprite ) {
		return sprite;
	}

	sprite = createSpriteSheet();
	document.body.prepend( sprite );

	return sprite;
}

function createSymbolForLogo( logo ) {
	const symbol = createElement( 'symbol', {
		id: logo.symbolId,
		viewBox: logo.viewBox,
	} );

	const content = logo.content || '';

	if ( ! content ) {
		return symbol;
	}

	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString( `<svg xmlns="${ SVG_NS }">${ content }</svg>`, 'image/svg+xml' );

		if ( doc.querySelector( 'parsererror' ) ) {
			return symbol;
		}

		const svg = doc.documentElement;

		Array.from( svg.childNodes ).forEach( ( node ) => {
			symbol.appendChild( document.importNode( node, true ) );
		} );
	} catch ( _ ) {
		// Parsing failed - return empty symbol to avoid injecting unsafe content
		return symbol;
	}

	return symbol;
}

function appendSymbolIfMissing( sprite, logo ) {
	if ( sprite.querySelector( `symbol[id="${ logo.symbolId }"]` ) ) {
		return;
	}

	sprite.appendChild( createSymbolForLogo( logo ) );
}

function syncBlockSymbols( block, sprite ) {
	const selectedLogos = ( block.dataset.skillLogoLogos || '' )
		.split( ',' )
		.map( ( item ) => item.trim() )
		.filter( Boolean );

	selectedLogos.forEach( ( logoKey ) => {
		const logo =
			window.techStackSkillLogoData?.logos?.find(
				( entry ) => entry && entry.key === logoKey
			) || null;

		if ( ! logo ) {
			return;
		}

		appendSymbolIfMissing( sprite, logo );
	} );

	block
		.querySelectorAll( '.skill-logo__sprite symbol' )
		.forEach( ( symbol ) => {
			const symbolId = symbol.getAttribute( 'id' );

			if (
				! symbolId ||
				sprite.querySelector( `symbol[id="${ symbolId }"]` )
			) {
				return;
			}

			sprite.appendChild( symbol.cloneNode( true ) );
		} );

	block
		.querySelectorAll( '.skill-logo__sprite' )
		.forEach( ( localSprite ) => {
			localSprite.remove();
		} );
}

function initSkillLogoSprites() {
	const blocks = document.querySelectorAll(
		'.wp-block-tech-stack-skill-logo'
	);

	if ( ! blocks.length ) {
		return;
	}

	const sprite = getOrCreateSpriteSheet();

	blocks.forEach( ( block ) => syncBlockSymbols( block, sprite ) );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initSkillLogoSprites, {
		once: true,
	} );
} else {
	initSkillLogoSprites();
}
