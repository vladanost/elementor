import * as Commands from './commands';

export default class Component extends elementorModules.common.Component {
	__construct( args = {} ) {
		super.__construct( args );

		this.isSaving = false;
		this.isChangedDuringSave = false;

		this.autoSaveTimer = null;
		this.autoSaveInterval = elementor.config.autosave_interval * 1000;

		elementorCommon.elements.$window.on( 'beforeunload', () => {
			if ( this.isEditorChanged() ) {
				return elementor.translate( 'before_unload_alert' );
			}
		} );
	}

	getNamespace() {
		return 'document/save';
	}

	startTimer( hasChanges ) {
		clearTimeout( this.autoSaveTimer );

		if ( hasChanges ) {
			this.autoSaveTimer = setTimeout( () => {
				$e.run( 'document/save/auto' );
			}, this.autoSaveInterval );
		}
	}

	isEditorChanged() {
		return ( true === elementor.channels.editor.request( 'status' ) );
	}

	defaultCommands() {
		return {
			auto: ( args ) => ( new Commands.Auto( args ).run() ),
			default: ( args ) => ( new Commands.Default( args ).run() ),
			discard: ( args ) => ( new Commands.Discard( args ).run() ),
			draft: ( args ) => ( new Commands.Draft( args ).run() ),
			pending: ( args ) => ( new Commands.Pending( args ).run() ),
			publish: ( args ) => ( new Commands.Publish( args ).run() ),
			save: ( args ) => ( new Commands.Save( args ).run() ),
			'set-is-modified': ( args ) => ( new Commands.SetIsModified( args ).run() ),
			update: ( args ) => ( new Commands.Update( args ).run() ),
		};
	}
}
