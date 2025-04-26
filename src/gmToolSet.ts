export function getMainContextMenu(){
    return[
        {label: 'Add new character', action: handleAddingNewCharacter},
        {label: 'Apply script', action: handleOpeningScriptMenu}
    ]
}

function handleAddingNewCharacter(){
    const newCharacterDialog = document.getElementById('new-character-dialog') as HTMLDialogElement | null;
    if (!newCharacterDialog) return;
    if (!newCharacterDialog.open) newCharacterDialog.showModal();
}

function handleOpeningScriptMenu(){console.log('scripts')}
