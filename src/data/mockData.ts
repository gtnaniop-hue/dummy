import { Species } from '../types/species';

export const mockSpecies: Species[] = [
  {
    id: '1',
    name: 'African Elephant',
    scientificName: 'Loxodonta africana',
    description: 'The African elephant is the largest land animal on Earth. These magnificent creatures are known for their intelligence, strong family bonds, and impressive memory.',
    habitat: 'Savanna',
    region: 'Africa',
    imageUrl: 'https://picsum.photos/seed/elephant/400/300.jpg',
    conservationStatus: 'VU',
    population: 415000,
    lifespan: '60-70 years',
    diet: 'Herbivore - grasses, leaves, bark, fruit',
    size: {
      length: '6-7 meters',
      weight: '6,000-7,000 kg'
    },
    threats: ['Poaching for ivory', 'Habitat loss', 'Human-wildlife conflict'],
    facts: [
      'Can communicate using infrasound',
      'Highly intelligent with excellent memory',
      'Live in matriarchal family groups'
    ]
  },
  {
    id: '2',
    name: 'Bengal Tiger',
    scientificName: 'Panthera tigris tigris',
    description: 'The Bengal tiger is a powerful predator and the most numerous tiger subspecies. Known for their distinctive orange coat with black stripes.',
    habitat: 'Tropical Forest',
    region: 'Asia',
    imageUrl: 'https://picsum.photos/seed/tiger/400/300.jpg',
    conservationStatus: 'EN',
    population: 2500,
    lifespan: '10-15 years',
    diet: 'Carnivore - deer, wild boar, water buffalo',
    size: {
      length: '2.5-3 meters',
      weight: '180-260 kg'
    },
    threats: ['Poaching', 'Habitat fragmentation', 'Prey depletion'],
    facts: [
      'Each tiger has unique stripe patterns',
      'Excellent swimmers',
      'Can leap over 30 feet'
    ]
  },
  {
    id: '3',
    name: 'Blue Whale',
    scientificName: 'Balaenoptera musculus',
    description: 'The blue whale is the largest animal ever known to have lived on Earth. These magnificent marine mammals rule the oceans.',
    habitat: 'Ocean',
    region: 'Global',
    imageUrl: 'https://picsum.photos/seed/whale/400/300.jpg',
    conservationStatus: 'EN',
    population: 10000,
    lifespan: '80-90 years',
    diet: 'Carnivore - primarily krill',
    size: {
      length: '25-30 meters',
      weight: '200,000 kg'
    },
    threats: ['Ship strikes', 'Ocean noise pollution', 'Climate change'],
    facts: [
      'Heart weighs as much as a car',
      'Can produce sounds audible 1000 miles away',
      'Tongue alone can weigh as much as an elephant'
    ]
  },
  {
    id: '4',
    name: 'Giant Panda',
    scientificName: 'Ailuropoda melanoleuca',
    description: 'The giant panda is a beloved bear species known for its distinctive black and white coloring. Native to China, these bears are conservation icons.',
    habitat: 'Bamboo Forest',
    region: 'Asia',
    imageUrl: 'https://picsum.photos/seed/panda/400/300.jpg',
    conservationStatus: 'VU',
    population: 1864,
    lifespan: '20 years',
    diet: 'Herbivore - primarily bamboo',
    size: {
      length: '1.2-1.9 meters',
      weight: '70-125 kg'
    },
    threats: ['Habitat loss', 'Low birth rate', 'Bamboo die-offs'],
    facts: [
      'Spend 12-16 hours eating daily',
      'Have a pseudo thumb to grip bamboo',
      'Cubs are born pink and hairless'
    ]
  },
  {
    id: '5',
    name: 'Polar Bear',
    scientificName: 'Ursus maritimus',
    description: 'The polar bear is a hypercarnivorous bear whose native range lies largely within the Arctic Circle. Perfectly adapted to life in the Arctic.',
    habitat: 'Arctic',
    region: 'Arctic',
    imageUrl: 'https://picsum.photos/seed/polarbear/400/300.jpg',
    conservationStatus: 'VU',
    population: 26000,
    lifespan: '25-30 years',
    diet: 'Carnivore - primarily seals',
    size: {
      length: '2-2.5 meters',
      weight: '350-700 kg'
    },
    threats: ['Climate change', 'Sea ice loss', 'Pollution'],
    facts: [
      'Have black skin under white fur',
      'Excellent swimmers',
      'Can detect prey nearly a mile away'
    ]
  },
  {
    id: '6',
    name: 'Mountain Gorilla',
    scientificName: 'Gorilla beringei beringei',
    description: 'Mountain gorillas are a subspecies of eastern gorilla. They are listed as critically endangered and live in the high mountains of Africa.',
    habitat: 'Mountain Forest',
    region: 'Africa',
    imageUrl: 'https://picsum.photos/seed/gorilla/400/300.jpg',
    conservationStatus: 'CR',
    population: 1000,
    lifespan: '35-40 years',
    diet: 'Herbivore - leaves, shoots, stems',
    size: {
      length: '1.4-1.8 meters',
      weight: '135-220 kg'
    },
    threats: ['Habitat loss', 'Disease', 'Poaching'],
    facts: [
      'Live in family groups led by a silverback',
      'Share 98% of DNA with humans',
      'Build new nests every night'
    ]
  },
  {
    id: '7',
    name: 'Sea Turtle',
    scientificName: 'Chelonia mydas',
    description: 'Sea turtles are large, air-breathing reptiles that inhabit tropical and subtropical seas throughout the world.',
    habitat: 'Ocean',
    region: 'Global',
    imageUrl: 'https://picsum.photos/seed/turtle/400/300.jpg',
    conservationStatus: 'EN',
    population: 85000,
    lifespan: '50-100 years',
    diet: 'Omnivore - seagrass, algae, jellyfish',
    size: {
      length: '1-1.5 meters',
      weight: '68-190 kg'
    },
    threats: ['Plastic pollution', 'Habitat loss', 'Fishing bycatch'],
    facts: [
      'Can hold breath for 5 hours',
      'Return to same beach to nest',
      'Temperature determines sex of hatchlings'
    ]
  },
  {
    id: '8',
    name: 'Red Wolf',
    scientificName: 'Canis rufus',
    description: 'The red wolf is a canine native to the southeastern United States. It is one of the most endangered canids in the world.',
    habitat: 'Forest',
    region: 'North America',
    imageUrl: 'https://picsum.photos/seed/redwolf/400/300.jpg',
    conservationStatus: 'CR',
    population: 20,
    lifespan: '6-7 years',
    diet: 'Carnivore - deer, raccoons, rodents',
    size: {
      length: '1.3-1.6 meters',
      weight: '20-35 kg'
    },
    threats: ['Hybridization', 'Habitat loss', 'Human persecution'],
    facts: [
      'Once declared extinct in the wild',
      'Successfully reintroduced in 1987',
      'Form monogamous pairs'
    ]
  },
  {
    id: '9',
    name: 'Emperor Penguin',
    scientificName: 'Aptenodytes forsteri',
    description: 'The emperor penguin is the tallest and heaviest of all living penguin species and is endemic to Antarctica.',
    habitat: 'Antarctic',
    region: 'Antarctica',
    imageUrl: 'https://picsum.photos/seed/penguin/400/300.jpg',
    conservationStatus: 'NT',
    population: 595000,
    lifespan: '15-20 years',
    diet: 'Carnivore - fish, krill, squid',
    size: {
      length: '1.1-1.3 meters',
      weight: '22-45 kg'
    },
    threats: ['Climate change', 'Sea ice changes', 'Food availability'],
    facts: [
      'Can dive to depths of 500 meters',
      'Males incubate eggs on their feet',
      'Huddle together for warmth'
    ]
  },
  {
    id: '10',
    name: 'Orangutan',
    scientificName: 'Pongo pygmaeus',
    description: 'Orangutans are great apes native to the rainforests of Indonesia and Malaysia. They are among the most intelligent primates.',
    habitat: 'Rainforest',
    region: 'Asia',
    imageUrl: 'https://picsum.photos/seed/orangutan/400/300.jpg',
    conservationStatus: 'CR',
    population: 104000,
    lifespan: '30-40 years',
    diet: 'Omnivore - fruit, leaves, insects',
    size: {
      length: '1.2-1.5 meters',
      weight: '30-90 kg'
    },
    threats: ['Deforestation', 'Pet trade', 'Hunting'],
    facts: [
      'Largest tree-dwelling animals',
      'Use tools in the wild',
      'Share 97% of DNA with humans'
    ]
  }
];

export const mockHabitats = [
  'Savanna',
  'Tropical Forest',
  'Ocean',
  'Bamboo Forest',
  'Arctic',
  'Mountain Forest',
  'Forest',
  'Antarctic',
  'Rainforest',
  'Desert',
  'Grassland',
  'Wetland'
];

export const mockRegions = [
  'Africa',
  'Asia',
  'Global',
  'Arctic',
  'North America',
  'Antarctica',
  'South America',
  'Europe',
  'Australia',
  'Central America'
];