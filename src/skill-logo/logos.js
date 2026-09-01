/* global DOMParser */

const DEFAULT_VIEW_BOX = '0 0 96 96';
const SVG_NS = 'http://www.w3.org/2000/svg';

function normalizeSelectedLogo( selectedLogo ) {
	if ( typeof selectedLogo === 'string' ) {
		const key = selectedLogo.trim();

		if ( ! key ) {
			return null;
		}

		return {
			key,
			url: '',
			opensInNewTab: false,
		};
	}

	if ( ! selectedLogo || typeof selectedLogo !== 'object' ) {
		return null;
	}

	const key =
		typeof selectedLogo.key === 'string' ? selectedLogo.key.trim() : '';

	if ( ! key ) {
		return null;
	}

	return {
		key,
		url:
			typeof selectedLogo.url === 'string' ? selectedLogo.url.trim() : '',
		opensInNewTab: Boolean( selectedLogo.opensInNewTab ),
	};
}

function getRuntimeLogoData() {
	if ( typeof window === 'undefined' ) {
		return [];
	}

	let techStackSkillLogoData = null;

	try {
		techStackSkillLogoData = window.techStackSkillLogoData || null;
	} catch {}

	if ( ! techStackSkillLogoData ) {
		try {
			techStackSkillLogoData =
				window.parent?.techStackSkillLogoData || null;
		} catch {}
	}

	if ( ! techStackSkillLogoData ) {
		try {
			techStackSkillLogoData = window.top?.techStackSkillLogoData || null;
		} catch {}
	}

	const logos = techStackSkillLogoData?.logos;

	if ( ! Array.isArray( logos ) ) {
		return [];
	}

	return logos.map( ( logo ) => normalizeLogo( logo ) ).filter( Boolean );
}

function createSelectedLogoSnapshot( selectedLogo ) {
	const normalizedLogo = normalizeSelectedLogo( selectedLogo );

	if ( ! normalizedLogo ) {
		return null;
	}

	const { key, url, opensInNewTab } = normalizedLogo;

	return {
		key,
		label: key,
		symbolId: `skill-logo-${ key }`,
		viewBox: DEFAULT_VIEW_BOX,
		content: '',
		url,
		opensInNewTab,
	};
}

function normalizeLogo( logo ) {
	if ( ! logo || typeof logo !== 'object' ) {
		return null;
	}

	const key = typeof logo.key === 'string' ? logo.key.trim() : '';

	if ( ! key ) {
		return null;
	}

	const label = typeof logo.label === 'string' ? logo.label.trim() : '';
	const symbolId =
		typeof logo.symbolId === 'string' && logo.symbolId.trim()
			? logo.symbolId.trim()
			: `skill-logo-${ key }`;
	const viewBox =
		typeof logo.viewBox === 'string' && logo.viewBox.trim()
			? logo.viewBox.trim()
			: DEFAULT_VIEW_BOX;
	const content = typeof logo.content === 'string' ? logo.content : '';

	return {
		key,
		label: label || key,
		symbolId,
		viewBox,
		content,
	};
}

export function getLogoOptions() {
	return getLogoOptionsFromList( getRuntimeLogoData() );
}

export function getLogoOptionsFromList( logos ) {
	return ( Array.isArray( logos ) ? logos : [] ).map( ( logo ) => ( {
		label: logo.label,
		value: logo.key,
	} ) );
}

export function getLogo( logoKey, logos = getRuntimeLogoData() ) {
	if ( typeof logoKey !== 'string' || ! logoKey.trim() ) {
		return null;
	}

	return (
		( Array.isArray( logos ) ? logos : [] ).find(
			( logo ) => logo.key === logoKey
		) || null
	);
}

export function getSelectedLogos(
	selectedLogos,
	logos = getRuntimeLogoData()
) {
	const values = Array.isArray( selectedLogos ) ? selectedLogos : [];

	return values
		.map( ( selectedLogo ) => {
			const normalizedLogo = normalizeSelectedLogo( selectedLogo );

			if ( ! normalizedLogo ) {
				return null;
			}

			const runtimeLogo = getLogo( normalizedLogo.key, logos );

			if ( ! runtimeLogo ) {
				return createSelectedLogoSnapshot( normalizedLogo );
			}

			return {
				...runtimeLogo,
				url: normalizedLogo.url,
				opensInNewTab: normalizedLogo.opensInNewTab,
			};
		} )
		.filter( Boolean );
}

import { useRef, useEffect } from '@wordpress/element';

export function LogoSprite( { logos: selectedLogos } ) {
	const containerRef = useRef( null );

	useEffect( () => {
		const container = containerRef.current;
		if ( ! container ) {
			return;
		}

		// Clear previous symbols
		while ( container.firstChild ) {
			container.removeChild( container.firstChild );
		}

		( Array.isArray( selectedLogos ) ? selectedLogos : [] ).forEach(
			( logo ) => {
				try {
					const content = logo?.content || '';
					if ( ! content ) {
						return;
					}

					const parser = new DOMParser();
					const doc = parser.parseFromString(
						`<svg xmlns="${ SVG_NS }">${ content }</svg>`,
						'image/svg+xml'
					);

					// Abort if parsing failed
					if ( doc.querySelector( 'parsererror' ) ) {
						return;
					}

					const svg = doc.documentElement;
					const symbol = document.createElementNS( SVG_NS, 'symbol' );
					symbol.setAttribute( 'id', logo.symbolId );
					symbol.setAttribute(
						'viewBox',
						logo.viewBox || DEFAULT_VIEW_BOX
					);

					Array.from( svg.childNodes ).forEach( ( node ) => {
						symbol.appendChild( document.importNode( node, true ) );
					} );

					container.appendChild( symbol );
				} catch {}
			}
		);
	}, [ selectedLogos ] );

	return (
		<svg
			aria-hidden="true"
			focusable="false"
			className="skill-logo__sprite"
			viewBox={ DEFAULT_VIEW_BOX }
			ref={ containerRef }
		></svg>
	);
}

export function LogoIcon( { logo, renderLink = true } ) {
	if ( ! logo ) {
		return null;
	}

	const icon = (
		<svg
			className="skill-logo__icon"
			role={ logo.url ? undefined : 'img' }
			aria-label={ logo.url ? undefined : logo.label }
			aria-hidden={ logo.url ? 'true' : undefined }
			focusable="false"
			viewBox={ logo.viewBox || DEFAULT_VIEW_BOX }
		>
			<use
				href={ `#${ logo.symbolId }` }
				xlinkHref={ `#${ logo.symbolId }` }
			/>
		</svg>
	);

	if ( renderLink && logo.url ) {
		return (
			<a
				className="skill-logo__link"
				href={ logo.url }
				target={ logo.opensInNewTab ? '_blank' : undefined }
				rel={
					logo.opensInNewTab
						? 'noopener noreferrer'
						: undefined
				}
				aria-label={ logo.label }
			>
				{ icon }
			</a>
		);
	}

	return (
		icon
	);
}

export { normalizeSelectedLogo };
