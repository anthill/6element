'use strict';


//console.log('test');

var React = require('react');
var Application = React.createFactory(require('./Components/Application.js'));


/*var now= new Date();
var day = now.getDay();
var beginingHour = parseInt(schedule[day][1]["start"])/100;
var beginingMin = parseInt(schedule[day][1]["start"])%100;
var endingHour = parseInt(schedule[day][2]["end"])/100;
var endingMin = parseInt(schedule[day][1]["end"])%100;

var date = moment(year : now.getFullYear(), month : now.getMonth() , day : now.getDate(),
                hour : beginingHour, minute : beginingMin);
    */
var wastesFile = {
    "Ameublement" : "../pictures/picto_RC/Cartons.svg",
    "Amiante_Ciment" : "../pictures/picto_RC/Cartons.svg",
    "Batteries" : "../pictures/picto_RC/Cartons.svg",
    "Bois" : "../pictures/picto_RC/Bois.svg",
    "Bois_traite" : "../pictures/picto_RC/Cartons.svg", 
    "Bouteilles_de_gaz": "../pictures/picto_RC/Cartons.svg",
    "Bouteilles_Plastiques" : "../pictures/picto_RC/Cartons.svg",
    "Cartons" : "../pictures/picto_RC/Cartons.svg",
    "Cartouche_Encre" : "../pictures/picto_RC/Cartons.svg",
    "Deblais-gravats" : "../pictures/picto_RC/Cartons.svg",
    "Decheterie_Picto_DDS" : "../pictures/picto_RC/Cartons.svg",
    "Dechets_d'activites_de_soins_a_risques" : "../pictures/picto_RC/Cartons.svg",
    "Dechets_verts" : "../pictures/picto_RC/Dechets_verts.svg",
    "DEEE" : "../pictures/picto_RC/Cartons.svg",
    "Ecrans" : "../pictures/picto_RC/Cartons.svg",
    "Encombrants_1" : "../pictures/picto_RC/Cartons.svg",
    "Encombrants_2" : "../pictures/picto_RC/Cartons.svg",
    "Extincteurs" : "../pictures/picto_RC/Cartons.svg",
    "Films_agricoles_usages" : "../pictures/picto_RC/Cartons.svg",
    "Gros_electromenager_0" : "../pictures/picto_RC/Cartons.svg",
    "Huiles_de_fritures" : "../pictures/picto_RC/Cartons.svg",
    "Huiles_de_Vidange" : "../pictures/picto_RC/Cartons.svg",
    "Journaux_et_Revues" : "../pictures/picto_RC/Cartons.svg",
    "Lampes" : "../pictures/picto_RC/Cartons.svg",
    "Liquides_de_freins" : "../pictures/picto_RC/Cartons.svg",
    "Liquides_de_refroidissement" : "../pictures/picto_RC/Cartons.svg",
    "LogoDecheterie" : "../pictures/picto_RC/Cartons.svg",
    "Medicaments" : "../pictures/picto_RC/Cartons.svg",
    "Metaux" : "../pictures/picto_RC/Cartons.svg",
    "Mobilier" : "../pictures/picto_RC/Cartons.svg",
    "Papiers" : "../pictures/picto_RC/Cartons.svg",
    "Papiers_cartons" : "../pictures/picto_RC/Cartons.svg",
    "Pelouse" : "../pictures/picto_RC/Cartons.svg",
    "Petits_appareils_menagers" : "../pictures/picto_RC/Cartons.svg",
    "Piles_Boutons" : "../pictures/picto_RC/Cartons.svg",
    "Piles_et_Accumulateurs" : "../pictures/picto_RC/Cartons.svg",
    "Plastiques" : "../pictures/picto_RC/Cartons.svg",
    "Platre_et_plaques_de_platre" : "../pictures/picto_RC/Cartons.svg",
    "Pneumatiques" : "../pictures/picto_RC/Cartons.svg",
    "Polystyrene" : "../pictures/picto_RC/Cartons.svg",
    "Radiographies" : "../pictures/picto_RC/Cartons.svg",
    "Refrigerateurs-Congelateurs" : "../pictures/picto_RC/Cartons.svg",
    "Reutilisation_reemploi" : "../pictures/picto_RC/Cartons.svg",
    "Tailles" : "../pictures/picto_RC/Cartons.svg",
    "Textiles" : "../pictures/picto_RC/Cartons.svg",
    "Tout_venant_incinerable" : "../pictures/picto_RC/Cartons.svg",
    "Tout_venant_non_incinerable" : "../pictures/picto_RC/Cartons.svg",
    "Verres" : "../pictures/picto_RC/Cartons.svg",
};

    
var rcFake = {
    
    //####################################################################################################
    // NEVER CHANGE
    name: "Verac",
    
    favourite: false,
    
    // opened intervall in UTC
    schedule: {
        //UTC
        //monday
        0:  [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ],
        // tuesday
        1:  [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ],
        2 : [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ],
        3: [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ],
        4 : [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ],
        5 : [
            {start: "0700", end: "1000"},
            {start: "1200", end: "1600"}
        ]
    },  
    
    maxSize : 23,   
    
    address: {
        number: 5,
        typeRoad: 'ld',
        nameRoad: 'Teycheres',
        PC: 33240,
        town: 'Verac'
    },
    
    coords: {
        lat: -0.4586,
        long: 4.4586
    },
    
    owner: "SMICVAL",
    
    phone: "0505050505",
     
    //#################################################################################################"
    // CHANGE EACH 5mn
    crowd: {
        //local + GMT (-2 in France)
        
        "2015-07-09T07:00:00.000Z" : 15,
        
        "2015-07-09T07:15:00.000Z": 10,
        
        "2015-07-09T07:30:00.000Z" : 5,
        
        "2015-07-09T07:45:00.000Z" : 12,
        
        "2015-07-09T08:00:00.000Z" : 20 ,
        
        "2015-07-09T08:15:00.000Z" : 15,
        
        "2015-07-09T08:30:00.000Z" : 18,
        
        "2015-07-09T08:45:00.000Z" : 25,
        
        "2015-07-09T09:00:00.000Z" : 30,
        
        "2015-07-09T09:15:00.000Z" : 20,
        
        "2015-07-09T09:30:00.000Z" : 16,
        
        "2015-07-09T09:45:00.000Z" : 15,
        
        "2015-07-09T10:00:00.000Z" : 15,
        
        "2015-07-09T12:00:00.000Z" : 14,
        
        "2015-07-09T12:15:00.000Z" : 13,
        
        "2015-07-09T12:30:00.000Z" : 10,
        
        "2015-07-09T12:45:00.000Z" : 8,
        
        "2015-07-09T13:00:00.000Z" : 16,
        
        "2015-07-09T11:13:00.000Z" : 18,
        
        "2015-07-09T13:30:00.000Z" : 15,
        
        "2015-07-09T13:45:00.000Z" : 13,
        
        "2015-07-09T14:00:00.000Z" : 10,
        
        "2015-07-09T14:15:00.000Z" : 19,
        
        "2015-07-09T14:30:00.000Z" : 22,
        
        "2015-07-09T14:45:00.000Z" : 18,
        
        "2015-07-09T15:00:00.000Z" : 15,
        
        "2015-07-09T15:15:00.000Z" : 20,
        
        "2015-07-09T15:30:00.000Z" : 25,
        
        "2015-07-09T15:45:00.000Z" : 15,
        
        "2015-07-09T16:00:00.000Z" : 15,
        
},
     
    wastes: 
    //type never change
    //status does
    
    [
        {
            type: "Dechets_verts",
            status: "unavaiable"
        },
        {
            type: "Bois",
            status: "avaiable"
        },
        {
            type: "Cartons",
            status: "avaiable"
        }
    ],
};


// Initial rendering
React.render(new Application({
    rcFake: rcFake,
    wastesFile :  wastesFile,
}), document.body);