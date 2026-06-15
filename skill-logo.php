<?php
/**
 * Plugin Name:       Skills SVG Logo Block
 * Description:       Displays configurable tech-stack logos and certification badges.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       skill-logo
 *
 * @package TechStack
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'TECH_STACK_SKILL_LOGO_VERSION', '0.1.0' );
define( 'TECH_STACK_SKILL_LOGO_OPTION', 'tech_stack_skill_logo_logos' );

/**
 * Registers the block metadata and all assets.
 */
function tech_stack_skill_logo_block_init() {
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
}
add_action( 'init', 'tech_stack_skill_logo_block_init' );

/**
 * Allowed SVG tags and attributes for stored logos.
 *
 * @return array<string, array<int, string>>
 */
function tech_stack_skill_logo_get_allowed_svg_tags() {
	return array(
		'svg' => array(
			'class' => true,
			'xmlns' => true,
			'xmlns:xlink' => true,
			'viewBox' => true,
			'viewbox' => true,
			'width' => true,
			'height' => true,
			'role' => true,
			'aria-hidden' => true,
			'focusable' => true,
			'preserveAspectRatio' => true,
			'preserveaspectratio' => true,
			'version' => true,
		),
		'g' => array(
			'class' => true,
			'transform' => true,
			'clip-path' => true,
			'fill' => true,
			'stroke' => true,
			'opacity' => true,
		),
		'path' => array(
			'class' => true,
			'd' => true,
			'fill' => true,
			'fill-rule' => true,
			'clip-rule' => true,
			'stroke' => true,
			'stroke-width' => true,
			'stroke-linecap' => true,
			'stroke-linejoin' => true,
			'stroke-miterlimit' => true,
			'transform' => true,
			'opacity' => true,
			'style' => true,
		),
		'rect' => array(
			'class' => true,
			'x' => true,
			'y' => true,
			'width' => true,
			'height' => true,
			'rx' => true,
			'ry' => true,
			'fill' => true,
			'stroke' => true,
			'stroke-width' => true,
			'transform' => true,
			'opacity' => true,
			'style' => true,
		),
		'circle' => array(
			'class' => true,
			'cx' => true,
			'cy' => true,
			'r' => true,
			'fill' => true,
			'stroke' => true,
			'stroke-width' => true,
			'transform' => true,
			'opacity' => true,
			'style' => true,
		),
		'ellipse' => array(
			'class' => true,
			'cx' => true,
			'cy' => true,
			'rx' => true,
			'ry' => true,
			'fill' => true,
			'stroke' => true,
			'stroke-width' => true,
			'transform' => true,
			'opacity' => true,
			'style' => true,
		),
		'line' => array(
			'class' => true,
			'x1' => true,
			'y1' => true,
			'x2' => true,
			'y2' => true,
			'fill' => true,
			'stroke' => true,
			'stroke-width' => true,
			'transform' => true,
			'opacity' => true,
			'style' => true,
		),
		'polyline' => array(
			'class' => true,
			'points' => true,
			'fill' => true,
			'stroke' => true,
			'stroke-width' => true,
			'stroke-linecap' => true,
			'stroke-linejoin' => true,
			'transform' => true,
			'opacity' => true,
			'style' => true,
		),
		'polygon' => array(
			'class' => true,
			'points' => true,
			'fill' => true,
			'stroke' => true,
			'stroke-width' => true,
			'stroke-linecap' => true,
			'stroke-linejoin' => true,
			'transform' => true,
			'opacity' => true,
			'style' => true,
		),
		'text' => array(
			'class' => true,
			'x' => true,
			'y' => true,
			'fill' => true,
			'font-size' => true,
			'font-weight' => true,
			'text-anchor' => true,
			'font-family' => true,
			'transform' => true,
			'opacity' => true,
			'style' => true,
		),
		'tspan' => array(
			'class' => true,
			'x' => true,
			'y' => true,
			'fill' => true,
			'font-size' => true,
			'font-weight' => true,
			'text-anchor' => true,
			'font-family' => true,
			'transform' => true,
			'opacity' => true,
			'style' => true,
		),
		'defs' => array(
			'class' => true,
		),
		'symbol' => array(
			'id' => true,
			'class' => true,
			'viewBox' => true,
			'viewbox' => true,
		),
		'use' => array(
			'href' => true,
			'xlink:href' => true,
			'class' => true,
		),
		'linearGradient' => array(
			'id' => true,
			'x1' => true,
			'y1' => true,
			'x2' => true,
			'y2' => true,
			'gradientUnits' => true,
			'gradientTransform' => true,
		),
		'radialGradient' => array(
			'id' => true,
			'cx' => true,
			'cy' => true,
			'r' => true,
			'fx' => true,
			'fy' => true,
			'gradientUnits' => true,
			'gradientTransform' => true,
		),
		'stop' => array(
			'offset' => true,
			'stop-color' => true,
			'stop-opacity' => true,
		),
		'mask' => array(
			'id' => true,
			'x' => true,
			'y' => true,
			'width' => true,
			'height' => true,
			'fill' => true,
		),
		'clippath' => array(
			'id' => true,
			'transform' => true,
		),
		'pattern' => array(
			'id' => true,
			'patternUnits' => true,
			'width' => true,
			'height' => true,
			'viewBox' => true,
			'viewbox' => true,
		),
		'title' => array(),
		'desc' => array(),
		'style' => array(
			'type' => true,
		),
	);
}

/**
 * Reads an XML attribute case-insensitively.
 *
 * @param DOMElement $element Element to read from.
 * @param string     $name    Attribute name.
 * @return string
 */
function tech_stack_skill_logo_get_xml_attribute( DOMElement $element, $name ) {
	$needle = strtolower( $name );

	if ( $element->hasAttribute( $name ) ) {
		return trim( (string) $element->getAttribute( $name ) );
	}

	foreach ( $element->attributes as $attribute ) {
		if ( $needle === strtolower( $attribute->name ) ) {
			return trim( (string) $attribute->value );
		}
	}

	return '';
}

/**
 * Extracts a numeric SVG dimension (supports plain numbers and px units).
 *
 * @param string $dimension SVG width/height value.
 * @return string
 */
function tech_stack_skill_logo_parse_svg_dimension( $dimension ) {
	$dimension = trim( (string) $dimension );

	if ( preg_match( '/^(\d+(?:\.\d+)?)(?:px)?$/i', $dimension, $matches ) ) {
		return $matches[1];
	}

	return '';
}

/**
 * Parse stored SVG markup into runtime-ready symbol data.
 *
 * @param string $svg_markup Raw SVG markup.
 * @return array<string, string>
 */
function tech_stack_skill_logo_parse_svg_markup( $svg_markup ) {
	$svg_markup = trim( (string) $svg_markup );

	if ( '' === $svg_markup ) {
		return array();
	}

	$sanitized_svg = wp_kses( $svg_markup, tech_stack_skill_logo_get_allowed_svg_tags() );

	if ( '' === $sanitized_svg ) {
		return array();
	}

	$previous_use_internal_errors = libxml_use_internal_errors( true );
	$document = new DOMDocument();
	$loaded = $document->loadXML( $sanitized_svg, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING );
	libxml_clear_errors();
	libxml_use_internal_errors( $previous_use_internal_errors );

	if ( ! $loaded || ! $document->documentElement || 'svg' !== strtolower( $document->documentElement->nodeName ) ) {
		return array();
	}

	$svg = $document->documentElement;
	$view_box = tech_stack_skill_logo_get_xml_attribute( $svg, 'viewBox' );

	if ( '' === $view_box ) {
		$width = tech_stack_skill_logo_parse_svg_dimension(
			tech_stack_skill_logo_get_xml_attribute( $svg, 'width' )
		);
		$height = tech_stack_skill_logo_parse_svg_dimension(
			tech_stack_skill_logo_get_xml_attribute( $svg, 'height' )
		);

		if ( '' !== $width && '' !== $height ) {
			$view_box = sprintf( '0 0 %s %s', $width, $height );
		} else {
			$view_box = '0 0 96 96';
		}
	}

	$content = '';

	foreach ( $svg->childNodes as $child_node ) {
		$content .= $document->saveXML( $child_node );
	}

	return array(
		'viewBox' => $view_box,
		'content' => trim( $content ),
	);
}

/**
 * Sanitizes a single logo row from the settings page.
 *
 * @param array<string, mixed> $entry Logo row.
 * @param int                  $index Row index.
 * @param array<int, string>   $used_keys Already used keys.
 * @return array<string, string>|null
 */
function tech_stack_skill_logo_sanitize_logo_entry( $entry, $index, array &$used_keys ) {
	if ( ! is_array( $entry ) ) {
		return null;
	}

	$label = sanitize_text_field( $entry['label'] ?? '' );
	$key = sanitize_title( $entry['key'] ?? '' );
	$svg_markup = trim( (string) ( $entry['svg'] ?? '' ) );

	if ( '' === $key ) {
		$key = sanitize_title( $label );
	}

	if ( '' === $key ) {
		$key = 'logo-' . ( $index + 1 );
	}

	$base_key = $key;
	$suffix = 2;

	while ( in_array( $key, $used_keys, true ) ) {
		$key = $base_key . '-' . $suffix;
		++$suffix;
	}

	$used_keys[] = $key;

	$sanitized_svg = wp_kses( $svg_markup, tech_stack_skill_logo_get_allowed_svg_tags() );

	if ( '' === $sanitized_svg ) {
		return null;
	}

	if ( '' === $label ) {
		$label = ucwords( str_replace( array( '-', '_' ), ' ', $key ) );
	}

	return array(
		'key' => $key,
		'label' => $label,
		'svg' => $sanitized_svg,
	);
}

/**
 * Sanitizes the full logo list from the settings page.
 *
 * @param mixed $value Raw option value.
 * @return array<int, array<string, string>>
 */
function tech_stack_skill_logo_sanitize_logo_list( $value ) {
	if ( ! is_array( $value ) ) {
		return array();
	}

	$logos = array();
	$used_keys = array();
	$rows = wp_unslash( $value );

	foreach ( array_values( $rows ) as $index => $entry ) {
		$sanitized_entry = tech_stack_skill_logo_sanitize_logo_entry( $entry, $index, $used_keys );

		if ( null === $sanitized_entry ) {
			continue;
		}

		$logos[] = $sanitized_entry;
	}

	return $logos;
}

/**
 * Returns the stored logo list.
 *
 * @return array<int, array<string, string>>
 */
function tech_stack_skill_logo_get_saved_logos() {
	$logos = get_option( TECH_STACK_SKILL_LOGO_OPTION, array() );

	return is_array( $logos ) ? $logos : array();
}

/**
 * Builds the runtime logo payload used by the editor and frontend.
 *
 * @return array<string, array<int, array<string, string>>>
 */
function tech_stack_skill_logo_get_runtime_data() {
	$logos = array();

	foreach ( tech_stack_skill_logo_get_saved_logos() as $logo ) {
		$parsed_logo = tech_stack_skill_logo_parse_svg_markup( $logo['svg'] ?? '' );

		if ( empty( $parsed_logo['content'] ) ) {
			continue;
		}

		$logos[] = array(
			'key' => $logo['key'] ?? '',
			'label' => $logo['label'] ?? '',
			'symbolId' => 'skill-logo-' . ( $logo['key'] ?? '' ),
			'viewBox' => $parsed_logo['viewBox'],
			'content' => $parsed_logo['content'],
		);
	}

	return array(
		'logos' => $logos,
	);
}

/**
 * REST callback for loading saved logos in the block editor.
 *
 * @return WP_REST_Response
 */
function tech_stack_skill_logo_rest_get_logos() {
	return rest_ensure_response( tech_stack_skill_logo_get_runtime_data() );
}

/**
 * Registers the REST route used by the editor.
 */
function tech_stack_skill_logo_register_rest_routes() {
	register_rest_route(
		'skill-logo/v1',
		'/logos',
		array(
			'methods' => WP_REST_Server::READABLE,
			'callback' => 'tech_stack_skill_logo_rest_get_logos',
			'permission_callback' => '__return_true',
		)
	);
}
add_action( 'rest_api_init', 'tech_stack_skill_logo_register_rest_routes' );

/**
 * Prints the runtime logo payload as an inline script.
 */
function tech_stack_skill_logo_print_runtime_data() {
	$data = tech_stack_skill_logo_get_runtime_data();
	$script = 'window.techStackSkillLogoData = ' . wp_json_encode(
		$data,
		JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
	) . ';';

	echo wp_get_inline_script_tag( $script );
}
add_action( 'wp_head', 'tech_stack_skill_logo_print_runtime_data' );

/**
 * Registers the plugin option used by the Media page.
 */
function tech_stack_skill_logo_register_settings() {
	register_setting(
		'tech_stack_skill_logo',
		TECH_STACK_SKILL_LOGO_OPTION,
		array(
			'type' => 'array',
			'default' => array(),
			'sanitize_callback' => 'tech_stack_skill_logo_sanitize_logo_list',
		)
	);
}
add_action( 'admin_init', 'tech_stack_skill_logo_register_settings' );

/**
 * Adds the Skill Logo settings page to the Media menu.
 */
function tech_stack_skill_logo_add_media_page() {
	add_media_page(
		__( 'Manage Logos', 'skill-logo' ),
		__( 'Manage Logos', 'skill-logo' ),
		'manage_options',
		'tech-stack-skill-logo',
		'tech_stack_skill_logo_render_admin_page'
	);
}
add_action( 'admin_menu', 'tech_stack_skill_logo_add_media_page' );

/**
 * Renders a single logo row.
 *
 * @param int|string            $index Row index.
 * @param array<string, string> $logo  Logo data.
 */
function tech_stack_skill_logo_render_logo_row( $index, array $logo = array() ) {
	$label = $logo['label'] ?? '';
	$key = $logo['key'] ?? '';
	$svg = $logo['svg'] ?? '';

	?>
	<div class="skill-logo-row">
		<div class="skill-logo-row__fields">
			<div>
				<label for="skill-logo-label-<?php echo esc_attr( $index ); ?>"><?php esc_html_e( 'Label', 'skill-logo' ); ?></label>
				<input
					type="text"
					class="regular-text"
					id="skill-logo-label-<?php echo esc_attr( $index ); ?>"
					name="<?php echo esc_attr( TECH_STACK_SKILL_LOGO_OPTION . '[' . $index . '][label]' ); ?>"
					placeholder="TypeScript"
					value="<?php echo esc_attr( $label ); ?>"
					data-skill-logo-label
				/>
			</div>
			<div>
				<label for="skill-logo-key-<?php echo esc_attr( $index ); ?>"><?php esc_html_e( 'Logo key', 'skill-logo' ); ?></label>
				<input
					type="text"
					class="regular-text"
					id="skill-logo-key-<?php echo esc_attr( $index ); ?>"
					name="<?php echo esc_attr( TECH_STACK_SKILL_LOGO_OPTION . '[' . $index . '][key]' ); ?>"
					value="<?php echo esc_attr( $key ); ?>"
					placeholder="typescript"
					data-skill-logo-key
				/>
			</div>
			<div>
				<label for="skill-logo-svg-<?php echo esc_attr( $index ); ?>"><?php esc_html_e( 'Raw SVG', 'skill-logo' ); ?></label>
				<textarea
					class="code"
					rows="10"
					id="skill-logo-svg-<?php echo esc_attr( $index ); ?>"
					name="<?php echo esc_attr( TECH_STACK_SKILL_LOGO_OPTION . '[' . $index . '][svg]' ); ?>"
					placeholder="<?php echo esc_attr( '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>' ); ?>"
					required
				><?php echo esc_textarea( $svg ); ?></textarea>
			</div>
			<div>
				<div></div>
				<button type="button" class="button button-secondary delete" data-skill-logo-remove><?php esc_html_e( 'Remove logo', 'skill-logo' ); ?></button>
			</div>
		</div>
	</div>
	<?php
}

/**
 * Renders the Media page settings form.
 */
function tech_stack_skill_logo_render_admin_page() {
	$logos = tech_stack_skill_logo_get_saved_logos();
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Manage logos', 'skill-logo' ); ?></h1>
		<p><?php esc_html_e( 'Add SVG logos here and they will appear in the block editor selector.', 'skill-logo' ); ?></p>
		<style>
			.wrap form {
				margin-top: 2em;
			}
			.skill-logo-row {
				padding: 2em 0;
			}
			.skill-logo-row:not(:last-child) {
				border-bottom: 1px solid #ddd;
			}
			.skill-logo-row__fields {
				display: flex;
				flex-direction: column;
				gap: 2em;
				flex-wrap: wrap;
			}
			.skill-logo-row__fields > div {
				flex: 1 1;
				display: flex;
				flex-direction: row;
			}
			.skill-logo-row__fields > div > label,
			.skill-logo-row__fields > div > div {
				width: 150px;
				font-weight: 600;
			}
			.skill-logo-row__fields > div > label:not(:has(+ textarea)) {
				align-content: center;
			}
			.skill-logo-row__fields > div > textarea {
			    width: 500px;
			}
			.skill-logo-row__fields > div > .delete,
			.skill-logo-row__fields > div > .delete:hover {
			    border-color: #b32d2e;
				color: #b32d2e;
			}
			.skill-logo-row__fields > div > .delete:hover {
			    background-color: rgba(179, 45, 46, 0.04);
			}
		</style>
		<form method="post" action="options.php">
			<?php settings_fields( 'tech_stack_skill_logo' ); ?>
			<?php settings_errors(); ?>
			<div id="skill-logo-rows" data-next-index="<?php echo esc_attr( count( $logos ) ); ?>">
				<?php foreach ( $logos as $index => $logo ) : ?>
					<?php tech_stack_skill_logo_render_logo_row( $index, $logo ); ?>
				<?php endforeach; 
					if ( empty( $logos ) ) :
						tech_stack_skill_logo_render_logo_row( 0, array() );
					endif;
				?>
			</div>
			<p>
				<button type="button" class="button button-secondary" id="skill-logo-add-row"><?php esc_html_e( 'Add another logo', 'skill-logo' ); ?></button>
			</p>
			<?php submit_button(); ?>
		</form>
		<template id="skill-logo-row-template">
			<?php tech_stack_skill_logo_render_logo_row( '__INDEX__', array() ); ?>
		</template>
	</div>
	<script>
	(function() {
		const container = document.getElementById( 'skill-logo-rows' );
		const template = document.getElementById( 'skill-logo-row-template' );
		const addButton = document.getElementById( 'skill-logo-add-row' );

		if ( ! container || ! template || ! addButton ) {
			return;
		}

		const slugify = ( value ) => value
			.toLowerCase()
			.replace( /[^a-z0-9]+/g, '-' )
			.replace( /^-+|-+$/g, '' );

		const getNextIndex = () => {
			const nextIndex = Number( container.dataset.nextIndex || container.children.length );
			container.dataset.nextIndex = String( nextIndex + 1 );
			return nextIndex;
		};

		const createRow = ( index ) => {
			const wrapper = document.createElement( 'div' );
			wrapper.innerHTML = template.innerHTML.replace( /__INDEX__/g, String( index ) );
			return wrapper.firstElementChild;
		};

		addButton.addEventListener( 'click', () => {
			const row = createRow( getNextIndex() );
			if ( row ) {
				container.appendChild( row );
			}
		} );

		container.addEventListener( 'click', ( event ) => {
			const removeButton = event.target.closest( '[data-skill-logo-remove]' );

			if ( ! removeButton ) {
				return;
			}

			const row = removeButton.closest( '.skill-logo-row' );

			if ( row ) {
				row.remove();
			}
		} );

		container.addEventListener( 'input', ( event ) => {
			const labelInput = event.target.closest( '[data-skill-logo-label]' );

			if ( ! labelInput ) {
				return;
			}

			const row = labelInput.closest( '.skill-logo-row' );
			const keyInput = row ? row.querySelector( '[data-skill-logo-key]' ) : null;

			if ( keyInput && ! keyInput.value.trim() ) {
				keyInput.value = slugify( labelInput.value );
			}
		} );
	} )();
	</script>
<?php
}
