'use strict';

var ad1 = {
    id: 1,
    owner: 0,
    content: {
        title: 'VESTE ROUGE DECHIREE',
        categories: ['Vetements', 'Veste'],
        location: 'Bordeaux',
        pics: undefined,
        state: 'Déchiré',
        text: 'Je donne une veste un peu déchirée sur les côtés'
    },
    direction: 'give',
    state: 'ongoing'
};

var ad2 = {
    id: 10,
    owner: 10,
    content: {
        title: 'VESTE BLEUE',
        categories: ['Vetements', 'Veste'],
        location: 'Bordeaux',
        pics: undefined,
        state: 'Neuf',
        text: 'Je donne ma veste bleue'
    },
    direction: 'give',
    state: 'ongoing'
};

var ad3 = {
    id: 11,
    owner: 11,
    content: {
        title: 'VELO PEUGEOT',
        categories: ['Transport', 'Vélo'],
        location: 'Bordeaux',
        pics: '../data/Tattoo_Zelda.png',
        state: 'Bon état',
        text: 'Je donne mon super vélo même si l\'image n\'a rien à voir'
    },
    direction: 'give',
    state: 'ongoing'
};

var troc1 = {
    id: 0,
    myAd: undefined,
    links: [
        {
            userId: 10,
            adId: 10,
            state: 'potential'
        },
        {
            userId: 11,
            adId: 11,
            state: 'interested'
        }
    ],
    direction: 'need',
    state: 'ongoing'
};

var troc2 = {
    id: 1,
    myAd: 1,
    links: [
        {
            userId: 12,
            adId: undefined,
            state: 'potential'
        },
        {
            userId: 13,
            adId: undefined,
            state: 'interested'
        }
    ],
    direction: 'give',
    state: 'ongoing'
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
    ads: [ad1, ad2, ad3],
    users: [user1, user2, user3, user4, user5],
    trocs: [troc1, troc2]
};
