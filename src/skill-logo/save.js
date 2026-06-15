/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

import { getSelectedLogos, LogoIcon } from './logos';

export default function save( { attributes } ) {
	const selectedIds =
		attributes.logos ??
		( attributes.language ? [ attributes.language ] : [] );
	const selectedLogos = getSelectedLogos( selectedIds );
	const logoSize = attributes.size;
	const logoGap = attributes.gap;
	const blockProps = useBlockProps.save( {
		'data-skill-logo-logos': selectedIds.join( ',' ),
		style:
			{
				...( typeof logoSize === 'number'
					? {
						'--skill-logo-size': `${ logoSize }rem`,
					}
					: {} ),
				...( typeof logoGap === 'number'
					? {
						'--skill-logo-gap': `${ logoGap }rem`,
					}
					: {} ),
			},
	} );

	return (
		<div { ...blockProps }>
			{ selectedLogos.map( ( logo ) => (
				<LogoIcon logo={ logo } key={ logo.symbolId } />
			) ) }
		</div>
	);
}
