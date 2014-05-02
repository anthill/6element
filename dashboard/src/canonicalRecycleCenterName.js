(function(global){
    'use strict';
    
    var AMBARES_ET_LAGRAVE = "Ambarès-et-Lagrave",
        AMBES = "Ambès",
        BASSENS = "Bassens",
        BLANQUEFORT = "Blanquefort",
        BORDEAUX_BASTIDE = "Bordeaux - Bastide",
        BORDEAUX_DESCHAMP = "Bordeaux - Deschamps",
        BORDEAUX_LATULE = "Bordeaux - Latule",
        BORDEAUX_NORD = "Bordeaux - Nord",
        BORDEAUX_PALUDATE = "Bordeaux - Paludate",
        BORDEAUX_QUEYRIES = "Bordeaux - Queyries",
        BORDEAUX_SAINTE_CROIX = "Bordeaux - Sainte-Croix",
        BORDEAUX_SURCOUF = "Bordeaux - Surcouf",
        BRUGES = "Bruges",
        EYSINES = "Eysines - Mermoz",
        GRADIGNAN = "Gradignan",
        LE_TAILLAN_MEDOC = "Le Taillan-Médoc",
        MERIGNAC = "Mérignac",
        PESSAC = "Pessac", // Beutre ?
        PESSAC_BEUTRE = "Pessac - Beutre",
        PESSAC_GUTENBERG = "Pessac - Gutenberg",
        VILLENAVE_D_ORNON = "Villenave d'Ornon",
        SAINT_AUBIN_DE_BLAYE = "Saint-Aubin-de-Blaye",
        SAINT_GERVAIS = "Saint-Gervais",
        SAINT_MARIENS = "Saint-Mariens",
        SAINT_MEDARD = "Saint-Médard-en-Jalles",
        SAINT_PAUL = "Saint-Paul"
    ;
    
    var mapping = {
        __proto__: null, // part of ES6, I guess...
        
        "Ambares": AMBARES_ET_LAGRAVE,
        "Ambares-et-Lagrave": AMBARES_ET_LAGRAVE,
        
        "Ambes": AMBES,
        "Ambès": AMBES,
        
        "Bassens": BASSENS,
        
        "Blanquefort": BLANQUEFORT,
        
        "Bordeaux Bastide": BORDEAUX_BASTIDE,
        "Bordeaux - Bastide": BORDEAUX_BASTIDE,
        
        "Bordeaux Deschamps": BORDEAUX_DESCHAMP,
        
        "Bordeaux Latule": BORDEAUX_LATULE,
        
        "Bordeaux Nord": BORDEAUX_NORD,
        
        "Bordeaux Paludate": BORDEAUX_PALUDATE,
        "Bordeaux - Paludate": BORDEAUX_PALUDATE,
        
        "Bordeaux Queyries": BORDEAUX_QUEYRIES,
        
        "Bordeaux Sainte croix": BORDEAUX_SAINTE_CROIX,
        
        "Bordeaux Surcouf": BORDEAUX_SURCOUF,
        "Bordeaux - Surcouf": BORDEAUX_SURCOUF,
        
        "Bruges": BRUGES,
        
        "Eysines Mermoz": EYSINES,
        "Eysines": EYSINES,
        
        "Gradignan": GRADIGNAN,
        
        "merignac": MERIGNAC,
        "Mérignac": MERIGNAC,
        
        "Pessac": PESSAC,
        
        "Pessac - Beutre": PESSAC_BEUTRE,
        
        "Pessac Gutenberg": PESSAC_GUTENBERG,
        "Pessac - Gutemberg": PESSAC_GUTENBERG,
        
        "Saint medard": SAINT_MEDARD,
        "Saint-Médard-en-Jalles": SAINT_MEDARD,
        
        "St Aubin": SAINT_AUBIN_DE_BLAYE,
        "Saint-aubin-de-Blaye": SAINT_AUBIN_DE_BLAYE,
        
        "St Gervais": SAINT_GERVAIS,
        "Saint-Gervais": SAINT_GERVAIS,
        
        "St Mariens": SAINT_MARIENS,
        "Saint-Mariens": SAINT_MARIENS,
        
        "St Paul": SAINT_PAUL,
        "Saint-Paul": SAINT_PAUL,
        
        "taillan": LE_TAILLAN_MEDOC,
        "Taillan-Médoc": LE_TAILLAN_MEDOC,
        
        "villenave": VILLENAVE_D_ORNON,
        "Villenave-d'Ornon": VILLENAVE_D_ORNON
    };
    
    global.canonicalRecycleCenterName = function canonicalRecycleCenterName(name){
        if(! (name in mapping)){
            console.warn("couldn't find the canonical name of", name)
            return undefined;
        }
        
        return mapping[name];
    };
    
})(this);