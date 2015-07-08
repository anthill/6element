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
    "Ameublement" : "../pictures/picto_RC/Cartons.jpg",
    "Amiante_Ciment" : "../pictures/picto_RC/Cartons.jpg",
    "Batteries" : "../pictures/picto_RC/Cartons.jpg",
    "Bois" : "../pictures/picto_RC/Bois.jpg",
    "Bois_traite" : "../pictures/picto_RC/Cartons.jpg", 
    "Bouteilles_de_gaz": "../pictures/picto_RC/Cartons.jpg",
    "Bouteilles_Plastiques" : "../pictures/picto_RC/Cartons.jpg",
    "Cartons" : "../pictures/picto_RC/Cartons.jpg",
    "Cartouche_Encre" : "../pictures/picto_RC/Cartons.jpg",
    "Deblais-gravats" : "../pictures/picto_RC/Cartons.jpg",
    "Decheterie_Picto_DDS" : "../pictures/picto_RC/Cartons.jpg",
    "Dechets_d'activites_de_soins_a_risques" : "../pictures/picto_RC/Cartons.jpg",
    "Dechets_verts" : "../pictures/picto_RC/Dechets_verts.jpg",
    "DEEE" : "../pictures/picto_RC/Cartons.jpg",
    "Ecrans" : "../pictures/picto_RC/Cartons.jpg",
    "Encombrants_1" : "../pictures/picto_RC/Cartons.jpg",
    "Encombrants_2" : "../pictures/picto_RC/Cartons.jpg",
    "Extincteurs" : "../pictures/picto_RC/Cartons.jpg",
    "Films_agricoles_usages" : "../pictures/picto_RC/Cartons.jpg",
    "Gros_electromenager_0" : "../pictures/picto_RC/Cartons.jpg",
    "Huiles_de_fritures" : "../pictures/picto_RC/Cartons.jpg",
    "Huiles_de_Vidange" : "../pictures/picto_RC/Cartons.jpg",
    "Journaux_et_Revues" : "../pictures/picto_RC/Cartons.jpg",
    "Lampes" : "../pictures/picto_RC/Cartons.jpg",
    "Liquides_de_freins" : "../pictures/picto_RC/Cartons.jpg",
    "Liquides_de_refroidissement" : "../pictures/picto_RC/Cartons.jpg",
    "LogoDecheterie" : "../pictures/picto_RC/Cartons.jpg",
    "Medicaments" : "../pictures/picto_RC/Cartons.jpg",
    "Metaux" : "../pictures/picto_RC/Cartons.jpg",
    "Mobilier" : "../pictures/picto_RC/Cartons.jpg",
    "Papiers" : "../pictures/picto_RC/Cartons.jpg",
    "Papiers_cartons" : "../pictures/picto_RC/Cartons.jpg",
    "Pelouse" : "../pictures/picto_RC/Cartons.jpg",
    "Petits_appareils_menagers" : "../pictures/picto_RC/Cartons.jpg",
    "Piles_Boutons" : "../pictures/picto_RC/Cartons.jpg",
    "Piles_et_Accumulateurs" : "../pictures/picto_RC/Cartons.jpg",
    "Plastiques" : "../pictures/picto_RC/Cartons.jpg",
    "Platre_et_plaques_de_platre" : "../pictures/picto_RC/Cartons.jpg",
    "Pneumatiques" : "../pictures/picto_RC/Cartons.jpg",
    "Polystyrene" : "../pictures/picto_RC/Cartons.jpg",
    "Radiographies" : "../pictures/picto_RC/Cartons.jpg",
    "Refrigerateurs-Congelateurs" : "../pictures/picto_RC/Cartons.jpg",
    "Reutilisation_reemploi" : "../pictures/picto_RC/Cartons.jpg",
    "Tailles" : "../pictures/picto_RC/Cartons.jpg",
    "Textiles" : "../pictures/picto_RC/Cartons.jpg",
    "Tout_venant_incinerable" : "../pictures/picto_RC/Cartons.jpg",
    "Tout_venant_non_incinerable" : "../pictures/picto_RC/Cartons.jpg",
    "Verres" : "../pictures/picto_RC/Cartons.jpg",
};

    
var rcFake = {
    
    //####################################################################################################
    // NEVER CHANGE
    name: "Verac",
    
    favourite: true,
    
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
        
        "2015-07-08T07:00:00.000Z" : 15,
        
        "2015-07-08T07:15:00.000Z": 10,
        
        "2015-07-08T07:30:00.000Z" : 5,
        
        "2015-07-08T07:45:00.000Z" : 12,
        
        "2015-07-08T08:00:00.000Z" : 20 ,
        
        "2015-07-08T08:15:00.000Z" : 15,
        
        "2015-07-08T08:30:00.000Z" : 18,
        
        "2015-07-08T08:45:00.000Z" : 25,
        
        "2015-07-08T09:00:00.000Z" : 30,
        
        "2015-07-08T09:15:00.000Z" : 20,
        
        "2015-07-08T09:30:00.000Z" : 16,
        
        "2015-07-08T09:45:00.000Z" : 15,
        
        "2015-07-08T10:00:00.000Z" : 15,
        
        "2015-07-08T12:00:00.000Z" : 14,
        
        "2015-07-08T12:15:00.000Z" : 13,
        
        "2015-07-08T12:30:00.000Z" : 10,
        
        "2015-07-08T12:45:00.000Z" : 8,
        
        "2015-07-08T13:00:00.000Z" : 16,
        
        "2015-07-08T11:13:00.000Z" : 18,
        
        "2015-07-08T13:30:00.000Z" : 15,
        
        "2015-07-08T13:45:00.000Z" : 13,
        
        "2015-07-08T14:00:00.000Z" : 10,
        
        "2015-07-08T14:15:00.000Z" : 19,
        
        "2015-07-08T14:30:00.000Z" : 22,
        
        "2015-07-08T14:45:00.000Z" : 18,
        
        "2015-07-08T15:00:00.000Z" : 15,
        
        "2015-07-08T15:15:00.000Z" : 20,
        
        "2015-07-08T15:30:00.000Z" : 25,
        
        "2015-07-08T15:45:00.000Z" : 15,
        
        "2015-07-08T16:00:00.000Z" : 15,
        
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
            type: "Carton",
            status: "avaiable"
        }
    ],
};


// Initial rendering
React.render(new Application({
    rcFake: rcFake,
    wastesFile :  wastesFile,
}), document.body);