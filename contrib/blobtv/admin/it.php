<?php
/**
 * BLOBtv Producer 1.0
 * (C) TVBLOB S.r.l. 2009
 * Author: Francesco Facconi <francesco.facconi@tvblob.com>
 */

// Errors
define("ERR_ACTIVATING", "Errore nell'attivazione del video, si prega di riprovare.");
define("ERR_COPYING_THUMB", "Errore nella copia del file dell'anteprima.");
define("ERR_COPYING_VIDEO", "Errore nella copia del file del video.");
define("ERR_DB_CREATION", "Errore nella creazione del database");
define("ERR_DB_OPEN", "Errore nell'apertura del database");
define("ERR_DEACTIVATING", "Errore nella disattivazione del video, si prega di riprovare.");
define("ERR_DELETING", "Errore nella rimozione del video, si prega di riprovare.");
define("ERR_EDIT", "C'è stato qualche errore nell'aggiornare il video %%TITLE%%.");
define("ERR_EMPTY_DATE", "Attenzione: non è possibile indicare una data vuota.");
define("ERR_EMPTY_DESCRIPTION", "Attenzione: non è possibile indicare una descrizione vuota.");
define("ERR_EMPTY_FIELDS", "Attenzione: si prega di completare tutti i campi.");
define("ERR_EMPTY_PREVIEW", "Attenzione: è obbligatorio inserire un'anteprima per il filmato.");
define("ERR_EMPTY_SUBTITLE", "Attenzione: non è possibile indicare un sottotitolo vuoto.");
define("ERR_EMPTY_TITLE", "Attenzione: non è possibile indicare un titolo vuoto.");
define("ERR_EMPTY_VIDEO", "Attenzione: è obbligatorio inserire il file del video.");
define("ERR_EXCEPTION", "Eccezione riportata dal server: %%EXCEPTION%%");
define("ERR_NOT_FOUND", "Errore, filmato non trovato.");
define("ERR_SERVER_COMM", "I dati non sono pervenuti al server in maniera corretta.");
define("ERR_UNABLE_TO_DEL", "Impossibile cancellare il file %%FILE%%, si prega di rimuoverlo manualmente.");
define("ERR_VIDEO_INSERT", "Errore nell'inserimento del video, si prega di riprovare.");
define("ERR_VIDEO_SIZE", "Il video indicato supera la dimensione massima consentita (1Gbyte).");

// Interface
define("ACTIONS", "Azioni");
define("ACTIVE_NO", "Non attivo");
define("ACTIVE_NO_CONFIRM", "Sei sicuro di voler pubblicare questo filmato?");
define("ACTIVE_NO_HINT", "Il filmato NON è attivo. Clicca qui per attivarlo e renderlo subito disponibile.");
define("ACTIVE_YES", "Attivo");
define("ACTIVE_YES_CONFIRM", "Sei sicuro di voler disattivare questo filmato?");
define("ACTIVE_YES_HINT", "Il filmato è attivo. Clicca qui per disattivarlo.");
define("ADD", "Aggiungi");
define("ADMIN_TITLE", "Area Amministrazione");
define("DATE", "Data");
define("DEETE", "Cancella");
define("DELETE_CONFIRM", "Sei sicuro di voler cancellare questo filmato?");
define("DESCRIPTION", "Descrizione");
define("EDIT", "Modifica");
define("EDIT_VIDEO", "Modifica video");
define("EDIT_DONE", "Il video %%TITLE%% è stato aggiornato correttamente.");
define("LOADING", "Caricamento in corso...");
define("LOGIN", "Accedi");
define("LOGOUT", "Chiudi");
define("NEW_VIDEO", "Nuovo video");
define("NO_DATA", "Nessun video è disponibile attualmente");
define("NO_VIDEOS", "Non è ancora presente alcun video in questa Web TV.");
define("PAGE_X_OF_Y", "Pagina %%X%% di %%Y%%");
define("PASSWORD", "Password:");
define("PREVIEW", "Guarda in anteprima");
define("PUBDATE", "Data di pubblicazione (AAAA-MM-GG)");
define("SHOW_ALL", "Elenca tutti");
define("SHOW_PUBLISHED", "Elenca solo pubblicati");
define("SUBTITLE", "Sottotitolo");
define("THUMB", "Anteprima");
define("THUMBNAIL", "Immagine di anteprima (120x90 pixel)");
define("TITLE", "Titolo");
define("UPDATE", "Aggiorna");
define("UPLOAD", "Carica");
define("USERNAME", "Nome utente:");
define("VIDEO", "Video");
define("VIDEO_ACTIVATE", "Al momento <strong>non è pubblicato</strong>, ma se si desidera pubblicarlo subito è possibile farlo <a href='?a=y&id=%%ID%%'>cliccando qui</a>.");
define("VIDEO_UPLOADED", "Il video <strong>%%TITLE%%</strong> è stato inserito correttamente.");

?>