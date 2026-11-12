-- PHYLUM
INSERT INTO PHYLUM
(Phylum, Kingdom)
VALUES
('Chordata', 'Animalia');

-- CLASS
INSERT INTO CLASS
(Class, Phylum)
VALUES
('Mammalia', 'Chordata');

-- TAXON_ORDER
INSERT INTO TAXON_ORDER
(Taxon_Order, Class)
VALUES
('Carnivora', 'Mammalia'),
('Primates', 'Mammalia');

-- FAMILY
INSERT INTO FAMILY
(Family, Taxon_Order, Common_Name)
VALUES
('Procyonidae', 'Carnivora', 'Procyonids'),
('Ursidae', 'Carnivora', 'Bears'),
('Canidae', 'Carnivora', 'Dogs'),
('Hominidae', 'Primates', 'Great Apes');

-- GENUS
INSERT INTO GENUS
(Genus_Name, Family, Common_Name)
VALUES
('Procyon', 'Procyonidae', 'Raccoons'),
('Ursus', 'Ursidae', 'Bears'),
('Vulpes', 'Canidae', 'True/Typical Foxes'),
('Gorilla', 'Hominidae', 'Gorillas'),
('Nyctereutes', 'Canidae', 'Raccoon Dogs');

-- SPECIES
INSERT INTO SPECIES
(Species_Name, Genus_Name, Common_Name, Photo_URL, Size, Population, Conservation_Status, Description)
VALUES
-- Nyctereutes
('procyonoides', 'Nyctereutes', 'Common Raccoon Dog', 'https://upload.wikimedia.org/wikipedia/commons/7/7f/%D0%84%D0%BD%D0%BE%D1%82%D0%BE%D0%B2%D0%B8%D0%B4%D0%BD%D0%B8%D0%B9_%D1%81%D0%BE%D0%B1%D0%B0%D0%BA%D0%B0_%28Nyctereutes_procyonoides%29.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Medium', NULL, 'LC', 'The common raccoon dog (Nyctereutes procyonoides), also known as the Asian or Chinese raccoon dog, is a stocky, fox-like canid native to East Asia. Despite sharing the dark facial mask and fluffy, brownish-gray coat of a North American raccoon, it belongs to the dog family and is more closely related to true foxes. These opportunistic omnivores are highly adaptable, living primarily in forested and lowland areas near water where they forage for everything from small animals to fruits. They are unique among wild canids for their ability to regularly climb trees using curved claws and for entering a state of hibernation or torpor during cold winters.'),
('viverrinus', 'Nyctereutes', 'Japanese Raccoon Dog/Tanuki', 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Tanuki_in_Higashiyama_Zoo_-_2.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Medium', NULL, 'LC', 'The tanuki, also known as the Japanese raccoon dog, is a distinct canid species native to East Asia that looks remarkably like a raccoon but is actually closely related to foxes and wolves. In Japanese folklore, these animals are legendary, mischievous shapeshifters capable of using illusions to trick humans, often depicted holding a flask of sake and wearing a straw hat. Despite their historical reputation as tricksters, modern depictions view them as symbols of good luck, prosperity, and commercial success. Today, statues of these chubby, cheerful creatures are a common sight guarding the entrances of shops and restaurants throughout Japan.'),
-- Procyon
('lotor', 'Procyon', 'Common Raccoon', 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Raccoon_in_Central_Park_%2835264%29.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Medium', NULL, 'LC', 'The most widespread member of the genus Procyon. It inhabits forests, wetlands, agricultural land, suburbs, and cities throughout much of North America. Range: Southern Canada & United States.'),
('cancrivorus', 'Procyon', 'Crab-eating Raccoon', 'https://upload.wikimedia.org/wikipedia/commons/5/56/Mano_pelada_%28Procyon_cancrivorus_nigripes%29.JPG', 'Medium', NULL, 'LC', 'Found from Central America into much of South America. It prefers wetlands, mangroves, marshes, and riverbanks where it feeds on crabs, fish, amphibians, and other aquatic prey. Range: Northern South America.'),
('pygmaeus', 'Procyon', 'Cozumel Raccoon', 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cozumel_Raccoon2.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Small', 300, 'CR', 'A critically endangered raccoon found only on Cozumel Island, Mexico. Habitat loss, hurricanes, and introduced predators have reduced its population to only a few hundred individuals. Range: Cozumel Island.'),
('rexroadensis', 'Procyon', 'Procyon rexroadensis', NULL, 'Medium', NULL, 'EX', 'An extinct species of Procyon known from Pliocene fossil deposits in North America. Range: Pliocene North America.'),
-- Ursus
('arctos', 'Ursus', 'Brown Bear', 'https://upload.wikimedia.org/wikipedia/commons/7/71/2010-kodiak-bear-1.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Large', NULL, 'LC', 'A widespread bear species found across North America, Europe, and Asia in forests, mountains, and tundra. Range: Northern Asia.'),
('maritimus', 'Ursus', 'Polar Bear', 'https://upload.wikimedia.org/wikipedia/commons/6/66/Polar_Bear_-_Alaska_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Large', 26000, 'VU', 'The largest living bear species, adapted to Arctic sea ice where it primarily hunts seals. Sea ice loss caused by climate change threatens its survival. Range: Arctic Circle.'),
('americanus', 'Ursus', 'American Black Bear', 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Vancouver_Island_black_bear_%28Ursus_americanus_vancouveri%29_Tofino_4.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Large', 900000, 'LC', 'The most abundant bear in North America. Individuals may be black, brown, cinnamon, or even white. Range: Southern Canada & United States.'),
('thibetanus', 'Ursus', 'Asian Black Bear', 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Ursus_thibetanus_3_%28Wroclaw_zoo%29.JPG?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Large', 50000, 'VU', 'A forest-dwelling bear native to eastern and southern Asia, recognized by the white crescent-shaped marking on its chest. Range: East Asia.'),
('arctos-priscus', 'Ursus', 'Ursus arctos priscus', 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Fossil_theriofauna_from_the_Sudety_Mts_%28SW_Poland%29_%28fig._2%29.png?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Large', NULL, 'EX', 'An extinct subspecies of brown bear that lived throughout Eurasia during the Pleistocene. Range: Pleistocene Eurasia.'),
('etruscus', 'Ursus', 'Ursus etruscus', 'https://upload.wikimedia.org/wikipedia/commons/1/19/Ursus_etruscus_skull.JPG?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Large', NULL, 'EX', 'An extinct species of Ursus that lived during the Pliocene and early Pleistocene and is believed to be ancestral to several modern bear species. Range: Pleistocene Eurasia.'),
('deningeri', 'Ursus', 'Ursus deningeri', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Tautavel_-_Ursus_deningeri_01.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Large', NULL, 'EX', 'An extinct Middle Pleistocene bear regarded as the likely ancestor of the cave bear. Range: Pleistocene Eurasia.'),
('spelaeus', 'Ursus', 'Ursus spelaeus', 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Teufelsh%C3%B6hle-H%C3%B6hlenb%C3%A4r-Dreiviertelprofil.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Large', NULL, 'EX', 'A massive extinct cave-dwelling bear that inhabited Europe during the Ice Age before becoming extinct approximately 24,000 years ago. Range: Pleistocene Eurasia.'),
-- Vulpes
('vulpes', 'Vulpes', 'Red Fox', 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Medium', 45000000, 'LC', 'The most widely distributed carnivore in the world, found across nearly the entire Northern Hemisphere. Range: Holarctic (Global).'),
('lagopus', 'Vulpes', 'Arctic Fox', 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Vulpes_lagopus_in_Iceland_%28cropped_3%29.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Small', 500000, 'LC', 'Adapted to extreme cold, with a coat that shifts from white in winter to brown-grey in summer. Range: Arctic Circle.'),
('macrotis', 'Vulpes', 'Kit Fox', 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Vulpes_macrotis_mutica_sitting.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Small', 50000, 'LC', 'The smallest fox in North America, found in arid scrub across the southwestern US and Mexico. Range: Sonoran Desert.'),
('velox', 'Vulpes', 'Swift Fox', 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Swift_Fox_Colorado_Wolf_and_Wildlife_cropped.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Small', 40000, 'LC', 'Nearly extirpated from the US in the 1930s by predator-control programs; recovered through reintroduction. Range: Great Plains (N. America).'),
('zerda', 'Vulpes', 'Fennec Fox', 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Fennec_Fox_Vulpes_zerda.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Small', 30000, 'LC', 'The smallest canid in the world, with oversized ears that radiate heat. Range: Sahara Desert.'),
('corsac', 'Vulpes', 'Corsac Fox', 'https://upload.wikimedia.org/wikipedia/commons/0/07/Vulpes_corsac.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Medium', 35000, 'LC', 'A steppe-dwelling fox whose population fluctuates with rodent prey cycles. Range: Central Asian Steppe.'),
('skinneri', 'Vulpes', 'Skinner''s Fox', 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Vulpes_skinneri_mandible.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Small', NULL, 'EX', 'Extinct species known only from roughly 2-million-year-old fossils found at the Malapa site in South Africa, the same site famous for early hominin remains. Range: Malapa, South Africa.'),
-- Gorilla (Species_Name normalized to epithet-only, matching every other genus)
('gorilla', 'Gorilla', 'Western Gorilla', 'https://upload.wikimedia.org/wikipedia/commons/5/50/Male_gorilla_in_SF_zoo.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Large', 316000, 'CR', 'A large great ape found in the tropical forests of western and central Africa. The species includes the western lowland gorilla and the rare Cross River gorilla. Range: Western Central Africa.'),
('beringei', 'Gorilla', 'Eastern Gorilla', 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Susa_group%2C_mountain_gorilla.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original', 'Large', 7000, 'CR', 'A large great ape found in eastern Democratic Republic of the Congo, Rwanda, and Uganda. The species includes the mountain gorilla and the eastern lowland or Grauer gorilla. Range: Eastern Central Africa.');
