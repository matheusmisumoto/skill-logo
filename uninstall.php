<?php
/**
 * Uninstall cleanup for Skill Logo.
 *
 * @package TechStack
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

if ( ! defined( 'TECH_STACK_SKILL_LOGO_OPTION' ) ) {
	define( 'TECH_STACK_SKILL_LOGO_OPTION', 'tech_stack_skill_logo_logos' );
}

if ( is_multisite() ) {
	$site_ids = get_sites(
		array(
			'fields' => 'ids',
		)
	);

	foreach ( $site_ids as $site_id ) {
		switch_to_blog( (int) $site_id );
		delete_option( TECH_STACK_SKILL_LOGO_OPTION );
		restore_current_blog();
	}
} else {
	delete_option( TECH_STACK_SKILL_LOGO_OPTION );
}
