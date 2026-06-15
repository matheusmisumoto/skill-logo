# Skill Logo

Skill Logo is a WordPress block plugin for displaying configurable SVG tech-stack logos and certification badges. It includes a custom admin screen for managing the available logos, a block editor interface for selecting and reordering them, and front-end rendering that keeps the SVG symbols reusable and lightweight.

## What It Does

- Adds a custom block named Skill Logo.
- Lets site admins register SVG logos in the WordPress admin area.
- Lets editors choose one or more logos from that saved library.
- Supports reordering, sizing, and spacing controls in the block inspector.
- Renders accessible SVG icons on the front end.

## Requirements

- WordPress 6.8 or later
- PHP 7.4 or later
- Node.js and npm for building the block assets

## Installation

1. Upload the plugin folder to your WordPress plugins directory.
2. Activate the plugin in the WordPress admin.
3. Run the build step if you are working from source and need fresh assets.

## Using The Plugin

### 1. Add logos

Go to Media > Manage Logos in the WordPress admin. Each logo entry includes:

- A label for display in the editor
- A unique logo key used by the block
- Raw SVG markup for the icon

The stored logos are sanitized before being used on the front end.

### 2. Insert the block

Add the Skill Logo block in the block editor. The block will load the available logos from the site runtime data and let you:

- Add logos from the saved list
- Remove selected logos
- Reorder selected logos by drag and drop
- Adjust logo size and spacing with the inspector controls

### 3. Publish the page

On the front end, the block outputs SVG icons and reuses a shared sprite sheet so multiple blocks can share the same symbol definitions efficiently.

## Development

The project uses WordPress scripts for building and packaging.

### Available commands

```bash
npm install
npm run build
npm run start
npm run lint:js
npm run lint:css
npm run format
npm run plugin-zip
```

### Source layout

- `skill-logo.php` registers the plugin, settings page, REST route, and runtime data.
- `src/skill-logo/` contains the block source code.
- `build/` contains the compiled assets used by WordPress.

### Build output

The compiled block is registered from the `build/` directory using the generated block manifest. If you change files in `src/`, run the build command again so WordPress picks up the updated assets.

## Uninstall

When the plugin is removed, the stored logo option is cleaned up by `uninstall.php`.

## License

GPL-2.0-or-later
