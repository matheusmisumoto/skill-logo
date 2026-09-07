/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	BlockControls,
	InspectorControls,
	LinkControl,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	Placeholder,
	Popover,
	RangeControl,
	SelectControl,
	Spinner,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { close, code, link, linkOff } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
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
	const [ editingLogoKey, setEditingLogoKey ] = useState( null );
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );
	const logoRefs = useRef( {} );

	const selectedLogoItems = useMemo(
		() =>
			( attributes.logos ?? [] )
				.map( normalizeSelectedLogo )
				.filter( Boolean ),
		[ attributes.logos ]
	);

	const selectedLogos = useMemo(
		() => getSelectedLogos( selectedLogoItems, runtimeLogos ),
		[ selectedLogoItems, runtimeLogos ]
	);

	const logoSize = attributes.size;
	const logoGap = attributes.gap;

	const logoOptions = useMemo(
		() => [
			{
				label: __( 'Choose a logo', 'skill-logo' ),
				value: '',
			},
			...getLogoOptionsFromList( runtimeLogos ),
		],
		[ runtimeLogos ]
	);

	const activeLogoItem = useMemo(
		() =>
			selectedLogoItems.find(
				( item ) => item.key === editingLogoKey
			) || null,
		[ selectedLogoItems, editingLogoKey ]
	);

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

	const openLinkPopover = ( logoKey, anchorElement ) => {
		setEditingLogoKey( logoKey );
		setPopoverAnchor(
			anchorElement || logoRefs.current[ logoKey ] || null
		);
	};

	const closeLinkPopover = () => {
		setEditingLogoKey( null );
		setPopoverAnchor( null );
	};

	const toggleLinkPopover = ( logoKey, anchorElement ) => {
		if ( editingLogoKey === logoKey ) {
			closeLinkPopover();
		} else {
			openLinkPopover(
				logoKey,
				anchorElement || logoRefs.current[ logoKey ] || null
			);
		}
	};

	const removeLogo = ( logoKey ) => {
		if ( editingLogoKey === logoKey ) {
			closeLinkPopover();
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

	useEffect( () => {
		return () => {
			closeLinkPopover();
		};
	}, [] );

	return (
		<>
			{ editingLogoKey && (
				<BlockControls group="inline">
					<ToolbarGroup>
						<ToolbarButton
							icon={ activeLogoItem?.url ? linkOff : link }
							title={
								activeLogoItem?.url
									? __( 'Remove link', 'skill-logo' )
									: __( 'Link', 'skill-logo' )
							}
							onClick={ () => {
								toggleLinkPopover(
									editingLogoKey,
									logoRefs.current[ editingLogoKey ]
								);
							} }
							isActive={ Boolean( activeLogoItem?.url ) }
						/>
					</ToolbarGroup>
				</BlockControls>
			) }
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
								const logo = getLogo(
									selectedLogo.key,
									runtimeLogos
								);
								const label = logo?.label || selectedLogo.key;
								const isEditing =
									editingLogoKey === selectedLogo.key;

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
												<span className="skill-logo__reorder-label">
													{ label }
												</span>
												<div className="skill-logo__reorder-actions">
													<Button
														icon={ link }
														className={
															selectedLogo.url
																? 'skill-logo__link-button has-link'
																: 'skill-logo__link-button is-unlinked'
														}
														label={
															selectedLogo.url
																? __(
																		'Edit/remove link',
																		'skill-logo'
																  )
																: __(
																		'Add link',
																		'skill-logo'
																  )
														}
														variant="tertiary"
														isPressed={ isEditing }
														onClick={ () =>
															toggleLinkPopover(
																selectedLogo.key
															)
														}
													/>
													<Button
														icon={ close }
														label={ sprintf(
															/* translators: %s: logo label */
															__(
																'Remove %s',
																'skill-logo'
															),
															label
														) }
														variant="tertiary"
														isDestructive
														onClick={ () =>
															removeLogo(
																selectedLogo.key
															)
														}
													/>
												</div>
											</div>
										</div>
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
					selectedLogos.map( ( logo ) => {
						const isSelected = editingLogoKey === logo.key;
						const hasLink = Boolean( logo.url );

						return (
							<button
								key={ logo.symbolId }
								ref={ ( el ) => {
									if ( el ) {
										logoRefs.current[ logo.key ] = el;
									} else {
										delete logoRefs.current[ logo.key ];
									}
								} }
								type="button"
								className={ `skill-logo__editor-item ${
									isSelected ? 'is-selected' : ''
								} ${ hasLink ? 'has-link' : '' }` }
								onClick={ ( event ) => {
									event.preventDefault();
									event.stopPropagation();
									toggleLinkPopover(
										logo.key,
										event.currentTarget
									);
								} }
								aria-label={ sprintf(
									/* translators: %s: logo label */
									__(
										'Configure link for %s',
										'skill-logo'
									),
									logo.label
								) }
								aria-expanded={
									isSelected && Boolean( popoverAnchor )
								}
							>
								<LogoIcon logo={ logo } renderLink={ false } />
								{ hasLink && (
									<span
										className="skill-logo__link-badge"
										aria-hidden="true"
									>
										<svg
											viewBox="0 0 24 24"
											width="12"
											height="12"
										>
											<path
												d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</span>
								) }
							</button>
						);
					} ) }
				{ editingLogoKey && popoverAnchor && (
					<Popover
						anchor={ popoverAnchor }
						onClose={ closeLinkPopover }
						placement="bottom"
						animate={ false }
						shift
						className="skill-logo__link-popover"
					>
						<div className="skill-logo__link-popover-content">
							<LinkControl
								value={ {
									url: activeLogoItem?.url || '',
									opensInNewTab: Boolean(
										activeLogoItem?.opensInNewTab
									),
								} }
								onChange={ ( nextValue ) => {
									updateLogoItem( editingLogoKey, {
										url: nextValue?.url ?? '',
										opensInNewTab:
											nextValue?.opensInNewTab !==
											undefined
												? Boolean(
														nextValue.opensInNewTab
												  )
												: Boolean(
														activeLogoItem?.opensInNewTab
												  ),
									} );
								} }
								onRemove={ () => {
									updateLogoItem( editingLogoKey, {
										url: '',
										opensInNewTab: false,
									} );
								} }
								forceIsEditingLink={ ! activeLogoItem?.url }
								searchInputPlaceholder={ __(
									'Search or type URL',
									'skill-logo'
								) }
								hasTextControl={ false }
							/>
						</div>
					</Popover>
				) }
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
