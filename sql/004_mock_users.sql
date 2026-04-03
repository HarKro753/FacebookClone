-- Mock Users: Authentic Harvard Class of 2004-2007 profiles
-- All names are fictional. Photos are AI-generated (thispersondoesnotexist.com).
-- Profiles reflect the real 2004 Harvard experience: houses, courses, interests, culture.
USE facebook_clone;

-- Password for all mock users: "harvard2004" (bcrypt hash)
SET @pw = '$2y$10$8KzQZx1G5XbKJqMmX8VQxOuY4QXZJH1ROy1G5XbKJqMmX8VQxOuY4';

-- Generate the actual bcrypt hash via PHP; we'll use a placeholder and update via setup
-- For now we insert a known hash that the setup script will generate

-- ============================================================
-- 20 MOCK USERS
-- ============================================================

INSERT INTO users (email, password_hash, first_name, last_name, sex, birthday, phone, photo, relationship_status, interested_in, interests, favorite_music, favorite_movies, favorite_books, favorite_quotes, about_me, house_id, class_year, concentration, political_views) VALUES

-- 1. Mark (Kirkland, CS, '06)
('mark.e@harvard.edu', @pw, 'Mark', 'Ellison', 'Male', '1984-05-14', '617-555-0101',
 'mock_user_1.jpg', 'Single', 'Women',
 'Programming, fencing, Classics, pranking the Crimson',
 'Green Day, The Strokes, Jay-Z, Linkin Park',
 'The Social Network (ironic, right?), Fight Club, Gladiator, The Matrix',
 'The Iliad, Ender''s Game, The Art of War',
 '"Move fast and break things." - someone, probably',
 'CS nerd who somehow ended up in Kirkland. Building random websites when I should be writing my thesis. Hit me up if you want to hack on something.',
 6, 2006, 'Computer Science', 'Libertarian'),

-- 2. Priya (Eliot, Econ, '05)
('priya.s@harvard.edu', @pw, 'Priya', 'Shankar', 'Female', '1983-09-22', '617-555-0102',
 'mock_user_2.jpg', 'In a Relationship', 'Men',
 'Bhangra, debate, The Economist, hiking',
 'Norah Jones, Outkast, A.R. Rahman, Coldplay',
 'Lost in Translation, Monsoon Wedding, Amelie',
 'Freakonomics, A Fine Balance, The Fountainhead',
 '"Be the change you wish to see in the world." - Gandhi',
 'Econ concentrator dreaming of Wall Street. VP of Harvard Bhangra. Will argue about monetary policy at dinner.',
 5, 2005, 'Economics', 'Moderate'),

-- 3. Tyler (Adams, Gov, '04)
('tyler.w@harvard.edu', @pw, 'Tyler', 'Whitfield', 'Male', '1982-03-11', '617-555-0103',
 'mock_user_3.jpg', 'Single', 'Women',
 'Rowing, politics, sailing, Vineyard summers',
 'Dave Matthews Band, Jack Johnson, U2, Dispatch',
 'Braveheart, Top Gun, Old School, Wedding Crashers',
 'Profiles in Courage, The Prince, Atlas Shrugged',
 '"Ask not what your country can do for you..." - JFK',
 'Varsity crew. Porcellian. Running for UC president next semester. Let''s grab a drink at Grendel''s.',
 1, 2004, 'Government', 'Republican'),

-- 4. Jessica (Lowell, English, '06)
('jessica.m@harvard.edu', @pw, 'Jessica', 'Morrison', 'Female', '1984-12-03', '617-555-0104',
 'mock_user_4.jpg', 'Single', 'Men',
 'Writing, theater, poetry slams, vintage shopping',
 'Elliott Smith, Fiona Apple, Radiohead, Death Cab for Cutie',
 'Eternal Sunshine of the Spotless Mind, Garden State, Royal Tenenbaums',
 'The Bell Jar, On the Road, Mrs. Dalloway',
 '"I took the one less traveled by, and that has made all the difference." - Frost',
 'Aspiring novelist trapped in a pre-med parent''s nightmare. Performing at the Signet Society every Tuesday. Currently workshopping a one-act play.',
 8, 2006, 'English and American Literature', 'Liberal'),

-- 5. David (Dunster, Math, '05)
('david.k@harvard.edu', @pw, 'David', 'Kim', 'Male', '1983-07-19', '617-555-0105',
 'mock_user_5.jpg', 'Single', 'Women',
 'Math Olympiad, chess, piano, StarCraft',
 'Chopin, Beethoven, Eminem, Kanye West',
 'A Beautiful Mind, Good Will Hunting, Pi',
 'Gödel Escher Bach, Surely You''re Joking Mr. Feynman, The Art of Problem Solving',
 '"Mathematics is the queen of the sciences." - Gauss',
 'Putnam fellow. Teaching section for Math 55. If you need help with p-sets, I''m in Dunster common room most nights.',
 4, 2005, 'Mathematics', NULL),

-- 6. Sarah (Pforzheimer, History, '07)
('sarah.c@harvard.edu', @pw, 'Sarah', 'Chen', 'Female', '1985-04-28', '617-555-0106',
 'mock_user_6.jpg', 'It''s Complicated', 'Men',
 'Crimson reporter, Model UN, running, dim sum',
 'Beyoncé, No Doubt, Missy Elliott, OutKast',
 'Kill Bill, Mean Girls, Spirited Away, 13 Going on 30',
 'A People''s History of the United States, Wild Swans, Beloved',
 '"Well-behaved women seldom make history." - Laurel Thatcher Ulrich',
 'Freshman in the Quad (send help). Writing for the Crimson arts section. Survived Expos 20 and lived to tell the tale.',
 10, 2007, 'History', 'Democrat'),

-- 7. James (Leverett, Biology, '05)
('james.r@harvard.edu', @pw, 'James', 'Robinson', 'Male', '1983-11-15', '617-555-0107',
 'mock_user_7.jpg', 'In a Relationship', 'Women',
 'Pre-med, intramural basketball, Habitat for Humanity, cooking',
 'John Mayer, Maroon 5, Usher, 50 Cent',
 'Finding Nemo, Lord of the Rings, Memento',
 'The Double Helix, Mountains Beyond Mountains, Gray''s Anatomy',
 '"The good physician treats the disease; the great physician treats the patient." - Osler',
 'Pre-med grind is real. Organic chem is destroying me but I''m still smiling. Leverett is the best house and I will die on that hill.',
 7, 2005, 'Human Evolutionary Biology', 'Moderate'),

-- 8. Emily (Winthrop, Social Studies, '06)
('emily.b@harvard.edu', @pw, 'Emily', 'Brooks', 'Female', '1984-08-07', '617-555-0108',
 'mock_user_8.jpg', 'Single', 'Both',
 'A cappella, social justice, Amnesty International, yoga',
 'Ani DiFranco, Bright Eyes, The Shins, Modest Mouse',
 'Donnie Darko, American Beauty, City of God',
 'The Communist Manifesto, Gender Trouble, Pedagogy of the Oppressed',
 '"Injustice anywhere is a threat to justice everywhere." - MLK',
 'Singing with the Callbacks. Spending way too much time in Lamont Library. Ask me about my thesis on Foucault.',
 12, 2006, 'Social Studies', 'Very Liberal'),

-- 9. Andrew (Quincy, Physics, '04)
('andrew.l@harvard.edu', @pw, 'Andrew', 'Liu', 'Male', '1982-01-30', '617-555-0109',
 'mock_user_9.jpg', 'Single', 'Women',
 'Physics, rock climbing, Linux, photography',
 'Radiohead, Tool, Pink Floyd, Massive Attack',
 'The Matrix, 2001: A Space Odyssey, Primer',
 'The Feynman Lectures, A Brief History of Time, Zen and the Art of Motorcycle Maintenance',
 '"Not only is the universe stranger than we imagine, it is stranger than we can imagine." - Eddington',
 'Senior thesis on quantum entanglement. You can find me in the Science Center basement or on the rock wall at the MAC. Graduating in June — terrifying.',
 11, 2004, 'Physics', NULL),

-- 10. Lauren (Cabot, Psychology, '06)
('lauren.d@harvard.edu', @pw, 'Lauren', 'Davis', 'Female', '1984-10-12', '617-555-0110',
 'mock_user_10.jpg', 'Single', 'Men',
 'Psych experiments, dance, The OC (guilty pleasure), baking',
 'Britney Spears, Justin Timberlake, Dashboard Confessional, Postal Service',
 'Mean Girls, 10 Things I Hate About You, Legally Blonde, Love Actually',
 'Blink, The Tipping Point, Reviving Ophelia',
 '"The unexamined life is not worth living." - Socrates',
 'Quad life chose me. Running studies in William James Hall. Will psychoanalyze you for free (whether you like it or not).',
 2, 2006, 'Psychology', 'Liberal'),

-- 11. Christopher (Mather, Applied Math, '05)
('chris.p@harvard.edu', @pw, 'Christopher', 'Park', 'Male', '1983-06-25', '617-555-0111',
 'mock_user_11.jpg', 'Single', 'Women',
 'Finance club, poker, squash, BBQ',
 'Jay-Z, Kanye West, Blink-182, Red Hot Chili Peppers',
 'Boiler Room, Wall Street, Ocean''s Eleven, Anchorman',
 'Liar''s Poker, When Genius Failed, Moneyball',
 '"Greed, for lack of a better word, is good." - Gordon Gekko',
 'Applied math but let''s be real, I''m going into banking. HFI member. Beat me at poker and I''ll buy you Felipe''s.',
 9, 2005, 'Applied Mathematics', 'Republican'),

-- 12. Amanda (Eliot, VES, '06)
('amanda.j@harvard.edu', @pw, 'Amanda', 'Johnson', 'Female', '1984-02-14', '617-555-0112',
 'mock_user_12.jpg', 'In a Relationship', 'Men',
 'Filmmaking, photography, Hasty Pudding, travel',
 'The White Stripes, Yeah Yeah Yeahs, LCD Soundsystem, Le Tigre',
 'Rushmore, Lost in Translation, Mulholland Drive, City of God',
 'On Photography by Sontag, Story by McKee, The Stranger',
 '"A photograph is a secret about a secret." - Diane Arbus',
 'Making short films and pretending I''m in the French New Wave. Eliot House film screenings every Friday.',
 5, 2006, 'Visual and Environmental Studies', 'Liberal'),

-- 13. Daniel (Adams, Classics, '04)
('daniel.g@harvard.edu', @pw, 'Daniel', 'Garcia', 'Male', '1982-08-09', '617-555-0113',
 'mock_user_13.jpg', 'Single', 'Women',
 'Latin, ancient Greek, ultimate frisbee, wine',
 'Buena Vista Social Club, Manu Chao, The Clash, Bob Dylan',
 'Gladiator, Y Tu Mamá También, Amores Perros',
 'The Aeneid, One Hundred Years of Solitude, Meditations by Marcus Aurelius',
 '"Carpe diem, quam minimum credula postero." - Horace',
 'Yes, I''m a Classics concentrator. No, I don''t know what I''m doing after graduation. Semper ubi sub ubi.',
 1, 2004, 'The Classics', 'Apathetic'),

-- 14. Rachel (Currier, Sociology, '07)
('rachel.t@harvard.edu', @pw, 'Rachel', 'Thompson', 'Female', '1985-11-20', '617-555-0114',
 'mock_user_14.jpg', 'Single', 'Men',
 'Community service, tutoring, spoken word, cooking',
 'Alicia Keys, Lauryn Hill, Common, Erykah Badu',
 'Crash, Hotel Rwanda, The Notebook, Love & Basketball',
 'The Souls of Black Folk, Their Eyes Were Watching God, Nickel and Dimed',
 '"Education is the most powerful weapon which you can use to change the world." - Mandela',
 'Freshman year and already in love with Harvard. PBHA volunteer. Currier has the best dining hall and that''s facts.',
 3, 2007, 'Sociology', 'Democrat'),

-- 15. Michael (Kirkland, CS, '05)
('michael.z@harvard.edu', @pw, 'Michael', 'Zhang', 'Male', '1983-04-02', '617-555-0115',
 'mock_user_15.jpg', 'Single', 'Women',
 'Hacking, startups, ping pong, ramen',
 'Linkin Park, System of a Down, Daft Punk, The Neptunes',
 'Office Space, Hackers, WarGames, Napoleon Dynamite',
 'Hackers & Painters, The Pragmatic Programmer, Cryptonomicon',
 '"The best way to predict the future is to invent it." - Alan Kay',
 'Building web apps when I should be doing problem sets. CS 51 TF. Someday I''ll start a company, but first I need to finish this p-set.',
 6, 2005, 'Computer Science', 'Libertarian'),

-- 16. Katherine (Lowell, Art History, '06)
('katherine.w@harvard.edu', @pw, 'Katherine', 'Walsh', 'Female', '1984-07-31', '617-555-0116',
 'mock_user_16.jpg', 'In a Relationship', 'Men',
 'Museum hopping, sketching, wine & cheese, field hockey',
 'Norah Jones, Jack Johnson, Simon & Garfunkel, Joni Mitchell',
 'Girl with a Pearl Earring, Frida, The Hours, Before Sunset',
 'Ways of Seeing by Berger, The Story of Art, A Room of One''s Own',
 '"Art is the lie that enables us to realize the truth." - Picasso',
 'You''ll find me in the Fogg Museum or sketching in the Yard. Lowell house bells at 1pm are the best part of my day.',
 8, 2006, 'History of Art and Architecture', 'Moderate'),

-- 17. Robert (Winthrop, Philosophy, '04)
('robert.h@harvard.edu', @pw, 'Robert', 'Hayes', 'Male', '1982-12-18', '617-555-0117',
 'mock_user_17.jpg', 'It''s Complicated', 'Women',
 'Philosophy, jazz piano, existential crises, coffee',
 'Miles Davis, John Coltrane, Thelonious Monk, also Radiohead',
 'Waking Life, Barton Fink, Being John Malkovich, Wings of Desire',
 'Being and Time, Critique of Pure Reason, Infinite Jest',
 '"He who has a why to live can bear almost any how." - Nietzsche',
 'Writing my senior thesis on Heidegger and already having an existential crisis about it. Frequent Algiers Coffee House.',
 12, 2004, 'Philosophy', NULL),

-- 18. Michelle (Leverett, Neuroscience, '07)
('michelle.n@harvard.edu', @pw, 'Michelle', 'Nakamura', 'Female', '1985-03-15', '617-555-0118',
 'mock_user_18.jpg', 'Single', 'Men',
 'Neuroscience, ballet, volunteering at MGH, origami',
 'Coldplay, Keane, Snow Patrol, Enya',
 'Eternal Sunshine of the Spotless Mind, Big Fish, Finding Nemo',
 'Phantoms in the Brain, The Man Who Mistook His Wife for a Hat, Neuromancer',
 '"The brain is wider than the sky." - Emily Dickinson',
 'Freshman pre-med trying to figure out how the brain works. Leverett dining hall breakfast crew. Looking for study buddies for Chem 5!',
 7, 2007, 'Neurobiology', 'Moderate'),

-- 19. William (Dunster, History, '05)
('william.o@harvard.edu', @pw, 'William', 'O''Brien', 'Male', '1983-09-08', '617-555-0119',
 'mock_user_19.jpg', 'Single', 'Women',
 'Irish dancing, rugby, pubs, American history',
 'U2, The Pogues, Dropkick Murphys, Bruce Springsteen',
 'Braveheart, Gangs of New York, In the Name of the Father, Boondock Saints',
 'Team of Rivals, Angela''s Ashes, A Separate Peace',
 '"Those who cannot remember the past are condemned to repeat it." - Santayana',
 'History concentrator specializing in the American Revolution. Rugby forward. If you see me at Tommy Doyle''s, buy me a Guinness.',
 4, 2005, 'History', 'Democrat'),

-- 20. Olivia (Adams, Music, '07)
('olivia.f@harvard.edu', @pw, 'Olivia', 'Fischer', 'Female', '1985-06-21', '617-555-0120',
 'mock_user_20.jpg', 'Single', 'Both',
 'Cello, chamber music, composing, ice cream',
 'Yo-Yo Ma, Debussy, Bjork, Sufjan Stevens, also a lot of indie stuff',
 'Amadeus, The Pianist, School of Rock (don''t judge)',
 'The Rest Is Noise, Musicophilia, Norwegian Wood',
 '"Without music, life would be a mistake." - Nietzsche',
 'Freshman cellist. HRO member. Practice rooms in Paine Hall are my second home. Adams House is amazing — did you know they have a pool?',
 1, 2007, 'Music', 'Liberal');
