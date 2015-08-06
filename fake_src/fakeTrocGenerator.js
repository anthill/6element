'use strict';

var ad1 = {
    id: 10,
    owner: 0,
    content: {
        title: 'VESTE ROUGE DECHIREE',
        categories: ['Vetements', 'Veste'],
        location: 'Bordeaux',
        pics: undefined,
        status: 'Déchiré',
        text: 'Je donne une veste un peu déchirée sur les côtés'
    },
    direction: 'give',
    status: 'ongoing'
};

var ad2 = {
    id: 11,
    owner: 0,
    content: {
        title: 'VESTE BLEUE',
        categories: ['Vetements', 'Veste'],
        location: 'Bordeaux',
        pics: undefined,
        status: 'Neuf',
        text: 'Je donne ma veste bleue'
    },
    direction: 'give',
    status: 'ongoing'
};

var ad3 = {
    id: 1,
    owner: 11,
    content: {
        title: 'VELO PEUGEOT',
        categories: ['Transport', 'Vélo'],
        location: 'Bordeaux',
        pics: '../data/Tattoo_Zelda.png',
        status: 'Bon état',
        text: 'Je donne mon super vélo même si l\'image n\'a rien à voir'
    },
    direction: 'give',
    status: 'ongoing'
};

var ad4 = {
    id: 2,
    owner: 0,
    content: {
        title: 'VELO BON ETAT',
        categories: ['Transport', 'Vélo'],
        location: 'Bordeaux',
        pics: '../data/Tattoo_Zelda.png',
        status: 'Tous',
        text: 'Je cherche un vélo'
    },
    direction: 'GIVE',
    status: 'ongoing'
};

var ad5 = {
    id: 3,
    owner: 12,
    content: {
        title: 'VELO DE VILLE',
        categories: ['Transport', 'Vélo'],
        location: 'Bordeaux',
        pics: undefined,
        status: 'Usagé',
        text: 'Je donne mon super vélo de ville'
    },
    direction: 'GIVE',
    status: 'ongoing'
};

var troc1 = {
    id: 0,
    myAd: 2,
    proposalMap: [ // not a map, but easier to call it that way for now
        {
            adId: 1,
            status: 'potential'
        },
        {
            adId: 3,
            status: 'interested'
        }
    ],
    direction: 'NEED',
    status: 'ongoing'
};

var troc2 = {
    id: 1,
    myAd: 10,
    proposalMap: [], // not a map, but easier to call it that way for now
    direction: 'GIVE',
    status: 'ongoing'
};

var troc3 = {
    id: 2,
    myAd: 11,
    proposalMap: [], // not a map, but easier to call it that way for now
    direction: 'GIVE',
    status: 'ongoing'
};

var user1 = {
    id: 0,
    name: 'Romain'
};
var user2 = {
    id: 10,
    name: 'David'
};
var user3 = {
    id: 11,
    name: 'Roxane'
};
var user4 = {
    id: 12,
    name: 'Maxime'
};
var user5 = {
    id: 13,
    name: 'Armand'
};

module.exports = {
    ads: [ad1, ad2, ad3, ad4, ad5],
    users: [user1, user2, user3, user4, user5],
    trocs: [troc1, troc2, troc3]
};
