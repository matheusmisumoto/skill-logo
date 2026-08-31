/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	InspectorControls,
	LinkControl,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	Placeholder,
	RangeControl,
	SelectControl,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { close, code } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import {
	getLogo,
	getLogoOptionsFromList,
	getSelectedLogos,
	LogoIcon,
	LogoSprite,
	normalizeSelectedLogo,
} from './logos';

export default function Edit( { attributes, setAttributes } ) {
	const [ loading, setLoading ] = useState( true );
	const [ runtimeLogos, setRuntimeLogos ] = useState( [] );
	const [ activeLinkKey, setActiveLinkKey ] = useState( null );
	const selectedLogoItems = ( attributes.logos ?? [] )
		.map( normalizeSelectedLogo )
		.filter( Boolean );
	const selectedLogos = getSelectedLogos( selectedLogoItems, runtimeLogos );
	const logoSize = attributes.size;
	const logoGap = attributes.gap;
	const logoOptions = [
		{
			label: __( 'Choose a logo', 'skill-logo' ),
			value: '',
		},
		...getLogoOptionsFromList( runtimeLogos ),
	];
	const blockProps = useBlockProps( {
		style: {
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

	const updateLogos = ( nextLogos ) => {
		setAttributes( { logos: nextLogos } );
	};

	const updateLogoItem = ( logoKey, updates ) => {
		updateLogos(
			selectedLogoItems.map( ( item ) =>
				item.key === logoKey ? { ...item, ...updates } : item
			)
		);
	};

	const updateSize = ( nextSize ) => {
		setAttributes( {
			size:
				typeof nextSize === 'number' && Number.isFinite( nextSize )
					? nextSize
					: undefined,
		} );
	};

	const updateGap = ( nextGap ) => {
		setAttributes( {
			gap:
				typeof nextGap === 'number' && Number.isFinite( nextGap )
					? nextGap
					: undefined,
		} );
	};

	const moveLogo = ( fromIndex, toIndex ) => {
		if (
			toIndex < 0 ||
			toIndex >= selectedLogoItems.length ||
			fromIndex === toIndex
		) {
			return;
		}

		const nextLogos = [ ...selectedLogoItems ];
		const [ movedLogo ] = nextLogos.splice( fromIndex, 1 );
		nextLogos.splice( toIndex, 0, movedLogo );
		updateLogos( nextLogos );
	};

	const removeLogo = ( logoKey ) => {
		if ( activeLinkKey === logoKey ) {
			setActiveLinkKey( null );
		}

		updateLogos(
			selectedLogoItems.filter( ( item ) => item.key !== logoKey )
		);
	};

	useEffect( () => {
		let isActive = true;

		const fetchLogos = async () => {
			try {
				// apiFetch handles the REST root, nonce headers, and JSON parsing automatically
				const data = await apiFetch( { path: '/skill-logo/v1/logos' } );

				if ( isActive && Array.isArray( data?.logos ) ) {
					setRuntimeLogos( data.logos );
					setLoading( false );
				}
			} catch {
				if ( isActive ) {
					setLoading( false );
				}
			}
		};

		fetchLogos();

		return () => {
			isActive = false;
		};
	}, [] );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'skill-logo' ) }
					initialOpen={ true }
				>
					<RangeControl
						label={ __( 'Logo size', 'skill-logo' ) }
						help={ __(
							'Uses rem. Leave empty to use the default CSS.',
							'skill-logo'
						) }
						min={ 1 }
						max={ 20 }
						step={ 0.25 }
						value={ logoSize }
						onChange={ updateSize }
						allowReset
					/>
					<RangeControl
						label={ __( 'Logo gap', 'skill-logo' ) }
						help={ __(
							'Uses rem. Leave empty to use the default CSS.',
							'skill-logo'
						) }
						min={ 0 }
						max={ 4 }
						step={ 0.125 }
						value={ logoGap }
						onChange={ updateGap }
						allowReset
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Logos', 'skill-logo' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Add a logo', 'skill-logo' ) }
						value=""
						options={ logoOptions }
						onChange={ ( logoKey ) => {
							if (
								! logoKey ||
								selectedLogoItems.some(
									( item ) => item.key === logoKey
								)
							) {
								return;
							}

							updateLogos( [
								...selectedLogoItems,
								{ key: logoKey, url: '', opensInNewTab: false },
							] );
						} }
					/>
					<div
						className="skill-logo__reorder"
						aria-label={ __( 'Reorder logos', 'skill-logo' ) }
					>
						{ selectedLogoItems.length > 0 ? (
							selectedLogoItems.map( ( selectedLogo, index ) => {
								const logo = getLogo( selectedLogo.key, runtimeLogos );
								const label = logo?.label || selectedLogo.key;
								const isLinkEditorOpen = activeLinkKey === selectedLogo.key;

								return (
									<div
										className="skill-logo__reorder-row"
										key={ `${ selectedLogo.key }-${ index }` }
										draggable={ true }
										onDragStart={ ( event ) => {
											event.dataTransfer.effectAllowed =
												'move';
											event.dataTransfer.setData(
												'text/plain',
												String( index )
											);
										} }
										onDragOver={ ( event ) =>
											event.preventDefault()
										}
										onDrop={ ( event ) => {
											event.preventDefault();
											const fromIndex = Number.parseInt(
												event.dataTransfer.getData(
													'text/plain'
												),
												10
											);

											if (
												Number.isNaN( fromIndex ) ||
												fromIndex === index
											) {
												return;
											}

											moveLogo( fromIndex, index );
										} }
									>
										<div className="skill-logo__reorder-row-main">
											<div
												className="skill-logo__drag-handle"
												aria-hidden="true"
											>
												<span />
												<span />
												<span />
											</div>
											<div className="skill-logo__reorder-content">
												<span>{ label }</span>
												<Button
													variant="tertiary"
													onClick={ () =>
														setActiveLinkKey(
															isLinkEditorOpen ? null : selectedLogo.key
														)
													}
												>
													{ selectedLogo.url
														? __( 'Edit link', 'skill-logo' )
														: __( 'Link', 'skill-logo' ) }
												</Button>
												<Button
													variant="tertiary"
													isDestructive
													onClick={ () =>
														removeLogo( selectedLogo.key )
													}
												>
													{ close }
												</Button>
											</div>
										</div>
										{ isLinkEditorOpen && (
											<div className="skill-logo__link-editor">
												<LinkControl
													value={ {
														url: selectedLogo.url || '',
														title: label,
													} }
													onChange={ ( nextLink ) =>
														updateLogoItem( selectedLogo.key, {
															url: nextLink?.url || '',
														} )
													}
													onRemove={ () =>
														updateLogoItem( selectedLogo.key, {
															url: '',
															opensInNewTab: false,
														} )
													}
												/>
												<ToggleControl
													label={ __(
														'Open in new tab',
														'skill-logo'
													) }
													checked={ Boolean( selectedLogo.opensInNewTab ) }
													onChange={ ( nextValue ) =>
														updateLogoItem( selectedLogo.key, {
															opensInNewTab: nextValue,
														} )
													}
												/>
											</div>
										) }
									</div>
								);
							} )
						) : (
							<p>
								{ __(
									'No logos selected yet. Add one to get started.',
									'skill-logo'
								) }
							</p>
						) }
					</div>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<LogoSprite logos={ selectedLogos } />
				{ loading && selectedLogoItems.length > 0 && (
					<div className="skill-logo__loading">
						<Spinner />
					</div>
				) }
				{ ! loading &&
					selectedLogos.length > 0 &&
					selectedLogos.map( ( logo ) => (
						<LogoIcon logo={ logo } key={ logo.symbolId } />
					) ) }
				{ ( selectedLogos === undefined ||
					selectedLogos.length === 0 ) && (
					<Placeholder
						icon={ code }
						label={ __( 'Skill Logo', 'skill-logo' ) }
						className="skill-logo__placeholder"
					>
						<p>
							{ __(
								'No logos selected yet. Add one to get started.',
								'skill-logo'
							) }
						</p>
					</Placeholder>
				) }
			</div>
		</>
	);
}
