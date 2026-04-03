import { Database } from 'bun:sqlite';
import path from 'path';
import fs from 'fs';
import { hashSync } from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'facebook.db');

// Ensure data directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Delete existing DB for clean seed
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('Deleted existing database.');
}

const db = new Database(DB_PATH);
db.run('PRAGMA journal_mode = WAL');
db.run('PRAGMA foreign_keys = ON');

// Load and execute schema
const schema = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'schema.sql'), 'utf-8');
db.exec(schema);
console.log('Schema created.');

// Hash password
const pw = hashSync('harvard2004', 10);

// ============================================================
// HOUSES
// ============================================================
const houses = [
  'Adams House', 'Cabot House', 'Currier House', 'Dunster House',
  'Eliot House', 'Kirkland House', 'Leverett House', 'Lowell House',
  'Mather House', 'Pforzheimer House', 'Quincy House', 'Winthrop House',
  'Canaday Hall', 'Grays Hall', 'Greenough Hall', 'Hollis Hall',
  'Holworthy Hall', 'Hurlbut Hall', 'Lionel Hall', 'Matthews Hall',
  'Mower Hall', 'Stoughton Hall', 'Straus Hall', 'Thayer Hall',
  'Weld Hall', 'Wigglesworth Hall',
];

const insertHouse = db.prepare('INSERT INTO houses (name) VALUES (?)');
for (const h of houses) insertHouse.run(h);
console.log(`Inserted ${houses.length} houses.`);

// ============================================================
// COURSES
// ============================================================
const courses = [
  ['CS 50', 'Introduction to Computer Science I', 'Michael D. Smith', 'Spring 2004'],
  ['CS 51', 'Introduction to Computer Science II', 'Greg Morrisett', 'Spring 2004'],
  ['CS 161', 'Operating Systems', 'Matt Welsh', 'Spring 2004'],
  ['ECON 10a', 'Principles of Economics', 'N. Gregory Mankiw', 'Spring 2004'],
  ['ECON 10b', 'Principles of Economics', 'Martin Feldstein', 'Spring 2004'],
  ['GOV 20', 'Foundations of Comparative Politics', 'James Robinson', 'Spring 2004'],
  ['MATH 21a', 'Multivariable Calculus', 'Shing-Tung Yau', 'Spring 2004'],
  ['MATH 21b', 'Linear Algebra and Differential Equations', 'Oliver Knill', 'Spring 2004'],
  ['MATH 55a', 'Honors Abstract Algebra', 'Dennis Gaitsgory', 'Spring 2004'],
  ['PSYCH 1', 'Introduction to Psychology', 'Steven Pinker', 'Spring 2004'],
  ['EXPOS 20', 'Expository Writing', 'Various', 'Spring 2004'],
  ['HIST 1661', 'The American Revolution', 'Bernard Bailyn', 'Spring 2004'],
  ['PHIL 1', 'The Good Life', 'Sean Kelly', 'Spring 2004'],
  ['MUSIC 51', 'Theory I', 'Thomas Forrest Kelly', 'Spring 2004'],
  ['SPANISH 30', 'Intermediate Spanish', 'Various', 'Spring 2004'],
  ['BIO 51', 'Integrative Biology of Organisms', 'Andrew Berry', 'Spring 2004'],
  ['CHEM 5', 'Introduction to Principles of Chemistry', 'James Anderson', 'Spring 2004'],
  ['PHYSICS 15a', 'Introductory Mechanics and Relativity', 'Howard Georgi', 'Spring 2004'],
  ['PHYSICS 15b', 'Introductory Electromagnetism', 'Gerald Holton', 'Spring 2004'],
  ['SOC 10', 'Introduction to Sociology', 'Mary Waters', 'Spring 2004'],
];

const insertCourse = db.prepare('INSERT INTO courses (code, title, professor, semester) VALUES (?, ?, ?, ?)');
for (const c of courses) insertCourse.run(...c);
console.log(`Inserted ${courses.length} courses.`);

// ============================================================
// USERS
// ============================================================
interface UserData {
  email: string; first_name: string; last_name: string; sex: string; birthday: string;
  phone: string; photo: string; relationship_status: string; interested_in: string;
  interests: string; favorite_music: string; favorite_movies: string; favorite_books: string;
  favorite_quotes: string; about_me: string; house_id: number; class_year: number;
  concentration: string; political_views: string | null;
}

const users: UserData[] = [
  { email: 'mark.e@harvard.edu', first_name: 'Mark', last_name: 'Ellison', sex: 'Male', birthday: '1984-05-14', phone: '617-555-0101', photo: 'mock_user_1.jpg', relationship_status: 'Single', interested_in: 'Women', interests: 'Programming, fencing, Classics, pranking the Crimson', favorite_music: 'Green Day, The Strokes, Jay-Z, Linkin Park', favorite_movies: 'The Social Network (ironic, right?), Fight Club, Gladiator, The Matrix', favorite_books: "The Iliad, Ender's Game, The Art of War", favorite_quotes: '"Move fast and break things." - someone, probably', about_me: 'CS nerd who somehow ended up in Kirkland. Building random websites when I should be writing my thesis. Hit me up if you want to hack on something.', house_id: 6, class_year: 2006, concentration: 'Computer Science', political_views: 'Libertarian' },
  { email: 'priya.s@harvard.edu', first_name: 'Priya', last_name: 'Shankar', sex: 'Female', birthday: '1983-09-22', phone: '617-555-0102', photo: 'mock_user_2.jpg', relationship_status: 'In a Relationship', interested_in: 'Men', interests: 'Bhangra, debate, The Economist, hiking', favorite_music: 'Norah Jones, Outkast, A.R. Rahman, Coldplay', favorite_movies: 'Lost in Translation, Monsoon Wedding, Amelie', favorite_books: 'Freakonomics, A Fine Balance, The Fountainhead', favorite_quotes: '"Be the change you wish to see in the world." - Gandhi', about_me: "Econ concentrator dreaming of Wall Street. VP of Harvard Bhangra. Will argue about monetary policy at dinner.", house_id: 5, class_year: 2005, concentration: 'Economics', political_views: 'Moderate' },
  { email: 'tyler.w@harvard.edu', first_name: 'Tyler', last_name: 'Whitfield', sex: 'Male', birthday: '1982-03-11', phone: '617-555-0103', photo: 'mock_user_3.jpg', relationship_status: 'Single', interested_in: 'Women', interests: 'Rowing, politics, sailing, Vineyard summers', favorite_music: 'Dave Matthews Band, Jack Johnson, U2, Dispatch', favorite_movies: 'Braveheart, Top Gun, Old School, Wedding Crashers', favorite_books: 'Profiles in Courage, The Prince, Atlas Shrugged', favorite_quotes: '"Ask not what your country can do for you..." - JFK', about_me: "Varsity crew. Porcellian. Running for UC president next semester. Let's grab a drink at Grendel's.", house_id: 1, class_year: 2004, concentration: 'Government', political_views: 'Republican' },
  { email: 'jessica.m@harvard.edu', first_name: 'Jessica', last_name: 'Morrison', sex: 'Female', birthday: '1984-12-03', phone: '617-555-0104', photo: 'mock_user_4.jpg', relationship_status: 'Single', interested_in: 'Men', interests: 'Writing, theater, poetry slams, vintage shopping', favorite_music: 'Elliott Smith, Fiona Apple, Radiohead, Death Cab for Cutie', favorite_movies: 'Eternal Sunshine of the Spotless Mind, Garden State, Royal Tenenbaums', favorite_books: 'The Bell Jar, On the Road, Mrs. Dalloway', favorite_quotes: '"I took the one less traveled by, and that has made all the difference." - Frost', about_me: "Aspiring novelist trapped in a pre-med parent's nightmare. Performing at the Signet Society every Tuesday. Currently workshopping a one-act play.", house_id: 8, class_year: 2006, concentration: 'English and American Literature', political_views: 'Liberal' },
  { email: 'david.k@harvard.edu', first_name: 'David', last_name: 'Kim', sex: 'Male', birthday: '1983-07-19', phone: '617-555-0105', photo: 'mock_user_5.jpg', relationship_status: 'Single', interested_in: 'Women', interests: 'Math Olympiad, chess, piano, StarCraft', favorite_music: 'Chopin, Beethoven, Eminem, Kanye West', favorite_movies: 'A Beautiful Mind, Good Will Hunting, Pi', favorite_books: "Gödel Escher Bach, Surely You're Joking Mr. Feynman, The Art of Problem Solving", favorite_quotes: '"Mathematics is the queen of the sciences." - Gauss', about_me: "Putnam fellow. Teaching section for Math 55. If you need help with p-sets, I'm in Dunster common room most nights.", house_id: 4, class_year: 2005, concentration: 'Mathematics', political_views: null },
  { email: 'sarah.c@harvard.edu', first_name: 'Sarah', last_name: 'Chen', sex: 'Female', birthday: '1985-04-28', phone: '617-555-0106', photo: 'mock_user_6.jpg', relationship_status: "It's Complicated", interested_in: 'Men', interests: 'Crimson reporter, Model UN, running, dim sum', favorite_music: 'Beyoncé, No Doubt, Missy Elliott, OutKast', favorite_movies: 'Kill Bill, Mean Girls, Spirited Away, 13 Going on 30', favorite_books: "A People's History of the United States, Wild Swans, Beloved", favorite_quotes: '"Well-behaved women seldom make history." - Laurel Thatcher Ulrich', about_me: 'Freshman in the Quad (send help). Writing for the Crimson arts section. Survived Expos 20 and lived to tell the tale.', house_id: 10, class_year: 2007, concentration: 'History', political_views: 'Democrat' },
  { email: 'james.r@harvard.edu', first_name: 'James', last_name: 'Robinson', sex: 'Male', birthday: '1983-11-15', phone: '617-555-0107', photo: 'mock_user_7.jpg', relationship_status: 'In a Relationship', interested_in: 'Women', interests: 'Pre-med, intramural basketball, Habitat for Humanity, cooking', favorite_music: 'John Mayer, Maroon 5, Usher, 50 Cent', favorite_movies: 'Finding Nemo, Lord of the Rings, Memento', favorite_books: "The Double Helix, Mountains Beyond Mountains, Gray's Anatomy", favorite_quotes: '"The good physician treats the disease; the great physician treats the patient." - Osler', about_me: "Pre-med grind is real. Organic chem is destroying me but I'm still smiling. Leverett is the best house and I will die on that hill.", house_id: 7, class_year: 2005, concentration: 'Human Evolutionary Biology', political_views: 'Moderate' },
  { email: 'emily.b@harvard.edu', first_name: 'Emily', last_name: 'Brooks', sex: 'Female', birthday: '1984-08-07', phone: '617-555-0108', photo: 'mock_user_8.jpg', relationship_status: 'Single', interested_in: 'Both', interests: 'A cappella, social justice, Amnesty International, yoga', favorite_music: 'Ani DiFranco, Bright Eyes, The Shins, Modest Mouse', favorite_movies: 'Donnie Darko, American Beauty, City of God', favorite_books: 'The Communist Manifesto, Gender Trouble, Pedagogy of the Oppressed', favorite_quotes: '"Injustice anywhere is a threat to justice everywhere." - MLK', about_me: 'Singing with the Callbacks. Spending way too much time in Lamont Library. Ask me about my thesis on Foucault.', house_id: 12, class_year: 2006, concentration: 'Social Studies', political_views: 'Very Liberal' },
  { email: 'andrew.l@harvard.edu', first_name: 'Andrew', last_name: 'Liu', sex: 'Male', birthday: '1982-01-30', phone: '617-555-0109', photo: 'mock_user_9.jpg', relationship_status: 'Single', interested_in: 'Women', interests: 'Physics, rock climbing, Linux, photography', favorite_music: 'Radiohead, Tool, Pink Floyd, Massive Attack', favorite_movies: 'The Matrix, 2001: A Space Odyssey, Primer', favorite_books: 'The Feynman Lectures, A Brief History of Time, Zen and the Art of Motorcycle Maintenance', favorite_quotes: '"Not only is the universe stranger than we imagine, it is stranger than we can imagine." - Eddington', about_me: "Senior thesis on quantum entanglement. You can find me in the Science Center basement or on the rock wall at the MAC. Graduating in June — terrifying.", house_id: 11, class_year: 2004, concentration: 'Physics', political_views: null },
  { email: 'lauren.d@harvard.edu', first_name: 'Lauren', last_name: 'Davis', sex: 'Female', birthday: '1984-10-12', phone: '617-555-0110', photo: 'mock_user_10.jpg', relationship_status: 'Single', interested_in: 'Men', interests: 'Psych experiments, dance, The OC (guilty pleasure), baking', favorite_music: 'Britney Spears, Justin Timberlake, Dashboard Confessional, Postal Service', favorite_movies: 'Mean Girls, 10 Things I Hate About You, Legally Blonde, Love Actually', favorite_books: 'Blink, The Tipping Point, Reviving Ophelia', favorite_quotes: '"The unexamined life is not worth living." - Socrates', about_me: 'Quad life chose me. Running studies in William James Hall. Will psychoanalyze you for free (whether you like it or not).', house_id: 2, class_year: 2006, concentration: 'Psychology', political_views: 'Liberal' },
  { email: 'chris.p@harvard.edu', first_name: 'Christopher', last_name: 'Park', sex: 'Male', birthday: '1983-06-25', phone: '617-555-0111', photo: 'mock_user_11.jpg', relationship_status: 'Single', interested_in: 'Women', interests: 'Finance club, poker, squash, BBQ', favorite_music: 'Jay-Z, Kanye West, Blink-182, Red Hot Chili Peppers', favorite_movies: "Boiler Room, Wall Street, Ocean's Eleven, Anchorman", favorite_books: "Liar's Poker, When Genius Failed, Moneyball", favorite_quotes: '"Greed, for lack of a better word, is good." - Gordon Gekko', about_me: "Applied math but let's be real, I'm going into banking. HFI member. Beat me at poker and I'll buy you Felipe's.", house_id: 9, class_year: 2005, concentration: 'Applied Mathematics', political_views: 'Republican' },
  { email: 'amanda.j@harvard.edu', first_name: 'Amanda', last_name: 'Johnson', sex: 'Female', birthday: '1984-02-14', phone: '617-555-0112', photo: 'mock_user_12.jpg', relationship_status: 'In a Relationship', interested_in: 'Men', interests: 'Filmmaking, photography, Hasty Pudding, travel', favorite_music: 'The White Stripes, Yeah Yeah Yeahs, LCD Soundsystem, Le Tigre', favorite_movies: 'Rushmore, Lost in Translation, Mulholland Drive, City of God', favorite_books: 'On Photography by Sontag, Story by McKee, The Stranger', favorite_quotes: '"A photograph is a secret about a secret." - Diane Arbus', about_me: "Making short films and pretending I'm in the French New Wave. Eliot House film screenings every Friday.", house_id: 5, class_year: 2006, concentration: 'Visual and Environmental Studies', political_views: 'Liberal' },
  { email: 'daniel.g@harvard.edu', first_name: 'Daniel', last_name: 'Garcia', sex: 'Male', birthday: '1982-08-09', phone: '617-555-0113', photo: 'mock_user_13.jpg', relationship_status: 'Single', interested_in: 'Women', interests: 'Latin, ancient Greek, ultimate frisbee, wine', favorite_music: 'Buena Vista Social Club, Manu Chao, The Clash, Bob Dylan', favorite_movies: 'Gladiator, Y Tu Mamá También, Amores Perros', favorite_books: 'The Aeneid, One Hundred Years of Solitude, Meditations by Marcus Aurelius', favorite_quotes: '"Carpe diem, quam minimum credula postero." - Horace', about_me: "Yes, I'm a Classics concentrator. No, I don't know what I'm doing after graduation. Semper ubi sub ubi.", house_id: 1, class_year: 2004, concentration: 'The Classics', political_views: 'Apathetic' },
  { email: 'rachel.t@harvard.edu', first_name: 'Rachel', last_name: 'Thompson', sex: 'Female', birthday: '1985-11-20', phone: '617-555-0114', photo: 'mock_user_14.jpg', relationship_status: 'Single', interested_in: 'Men', interests: 'Community service, tutoring, spoken word, cooking', favorite_music: 'Alicia Keys, Lauryn Hill, Common, Erykah Badu', favorite_movies: 'Crash, Hotel Rwanda, The Notebook, Love & Basketball', favorite_books: 'The Souls of Black Folk, Their Eyes Were Watching God, Nickel and Dimed', favorite_quotes: '"Education is the most powerful weapon which you can use to change the world." - Mandela', about_me: "Freshman year and already in love with Harvard. PBHA volunteer. Currier has the best dining hall and that's facts.", house_id: 3, class_year: 2007, concentration: 'Sociology', political_views: 'Democrat' },
  { email: 'michael.z@harvard.edu', first_name: 'Michael', last_name: 'Zhang', sex: 'Male', birthday: '1983-04-02', phone: '617-555-0115', photo: 'mock_user_15.jpg', relationship_status: 'Single', interested_in: 'Women', interests: 'Hacking, startups, ping pong, ramen', favorite_music: 'Linkin Park, System of a Down, Daft Punk, The Neptunes', favorite_movies: 'Office Space, Hackers, WarGames, Napoleon Dynamite', favorite_books: 'Hackers & Painters, The Pragmatic Programmer, Cryptonomicon', favorite_quotes: '"The best way to predict the future is to invent it." - Alan Kay', about_me: "Building web apps when I should be doing problem sets. CS 51 TF. Someday I'll start a company, but first I need to finish this p-set.", house_id: 6, class_year: 2005, concentration: 'Computer Science', political_views: 'Libertarian' },
  { email: 'katherine.w@harvard.edu', first_name: 'Katherine', last_name: 'Walsh', sex: 'Female', birthday: '1984-07-31', phone: '617-555-0116', photo: 'mock_user_16.jpg', relationship_status: 'In a Relationship', interested_in: 'Men', interests: 'Museum hopping, sketching, wine & cheese, field hockey', favorite_music: 'Norah Jones, Jack Johnson, Simon & Garfunkel, Joni Mitchell', favorite_movies: 'Girl with a Pearl Earring, Frida, The Hours, Before Sunset', favorite_books: "Ways of Seeing by Berger, The Story of Art, A Room of One's Own", favorite_quotes: '"Art is the lie that enables us to realize the truth." - Picasso', about_me: "You'll find me in the Fogg Museum or sketching in the Yard. Lowell house bells at 1pm are the best part of my day.", house_id: 8, class_year: 2006, concentration: 'History of Art and Architecture', political_views: 'Moderate' },
  { email: 'robert.h@harvard.edu', first_name: 'Robert', last_name: 'Hayes', sex: 'Male', birthday: '1982-12-18', phone: '617-555-0117', photo: 'mock_user_17.jpg', relationship_status: "It's Complicated", interested_in: 'Women', interests: 'Philosophy, jazz piano, existential crises, coffee', favorite_music: 'Miles Davis, John Coltrane, Thelonious Monk, also Radiohead', favorite_movies: 'Waking Life, Barton Fink, Being John Malkovich, Wings of Desire', favorite_books: 'Being and Time, Critique of Pure Reason, Infinite Jest', favorite_quotes: '"He who has a why to live can bear almost any how." - Nietzsche', about_me: 'Writing my senior thesis on Heidegger and already having an existential crisis about it. Frequent Algiers Coffee House.', house_id: 12, class_year: 2004, concentration: 'Philosophy', political_views: null },
  { email: 'michelle.n@harvard.edu', first_name: 'Michelle', last_name: 'Nakamura', sex: 'Female', birthday: '1985-03-15', phone: '617-555-0118', photo: 'mock_user_18.jpg', relationship_status: 'Single', interested_in: 'Men', interests: 'Neuroscience, ballet, volunteering at MGH, origami', favorite_music: 'Coldplay, Keane, Snow Patrol, Enya', favorite_movies: 'Eternal Sunshine of the Spotless Mind, Big Fish, Finding Nemo', favorite_books: 'Phantoms in the Brain, The Man Who Mistook His Wife for a Hat, Neuromancer', favorite_quotes: '"The brain is wider than the sky." - Emily Dickinson', about_me: 'Freshman pre-med trying to figure out how the brain works. Leverett dining hall breakfast crew. Looking for study buddies for Chem 5!', house_id: 7, class_year: 2007, concentration: 'Neurobiology', political_views: 'Moderate' },
  { email: 'william.o@harvard.edu', first_name: 'William', last_name: "O'Brien", sex: 'Male', birthday: '1983-09-08', phone: '617-555-0119', photo: 'mock_user_19.jpg', relationship_status: 'Single', interested_in: 'Women', interests: 'Irish dancing, rugby, pubs, American history', favorite_music: 'U2, The Pogues, Dropkick Murphys, Bruce Springsteen', favorite_movies: 'Braveheart, Gangs of New York, In the Name of the Father, Boondock Saints', favorite_books: "Team of Rivals, Angela's Ashes, A Separate Peace", favorite_quotes: '"Those who cannot remember the past are condemned to repeat it." - Santayana', about_me: "History concentrator specializing in the American Revolution. Rugby forward. If you see me at Tommy Doyle's, buy me a Guinness.", house_id: 4, class_year: 2005, concentration: 'History', political_views: 'Democrat' },
  { email: 'olivia.f@harvard.edu', first_name: 'Olivia', last_name: 'Fischer', sex: 'Female', birthday: '1985-06-21', phone: '617-555-0120', photo: 'mock_user_20.jpg', relationship_status: 'Single', interested_in: 'Both', interests: 'Cello, chamber music, composing, ice cream', favorite_music: 'Yo-Yo Ma, Debussy, Bjork, Sufjan Stevens, also a lot of indie stuff', favorite_movies: "Amadeus, The Pianist, School of Rock (don't judge)", favorite_books: 'The Rest Is Noise, Musicophilia, Norwegian Wood', favorite_quotes: '"Without music, life would be a mistake." - Nietzsche', about_me: 'Freshman cellist. HRO member. Practice rooms in Paine Hall are my second home. Adams House is amazing — did you know they have a pool?', house_id: 1, class_year: 2007, concentration: 'Music', political_views: 'Liberal' },
];

const insertUser = db.prepare(`
  INSERT INTO users (email, password_hash, first_name, last_name, sex, birthday, phone, photo,
    relationship_status, interested_in, interests, favorite_music, favorite_movies, favorite_books,
    favorite_quotes, about_me, house_id, class_year, concentration, political_views)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const u of users) {
  insertUser.run(
    u.email, pw, u.first_name, u.last_name, u.sex, u.birthday, u.phone, u.photo,
    u.relationship_status, u.interested_in, u.interests, u.favorite_music, u.favorite_movies,
    u.favorite_books, u.favorite_quotes, u.about_me, u.house_id, u.class_year, u.concentration, u.political_views
  );
}
console.log(`Inserted ${users.length} users.`);

// Helper to get user ID by email
function uid(email: string): number {
  const row = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number };
  return row.id;
}

// Helper to get course ID by code
function cid(code: string): number {
  const row = db.prepare('SELECT id FROM courses WHERE code = ?').get(code) as { id: number };
  return row.id;
}

// ============================================================
// PRIVACY SETTINGS
// ============================================================
const insertPrivacy = db.prepare(`
  INSERT INTO privacy_settings (user_id, show_email, show_phone, show_birthday, show_courses, show_interests, show_wall, allow_wall_posts, allow_pokes)
  VALUES (?, 'friends', 'friends', 'friends', 'everyone', 'everyone', 'everyone', 'friends', 'everyone')
`);
for (const u of users) {
  insertPrivacy.run(uid(u.email));
}
console.log('Inserted privacy settings.');

// ============================================================
// COURSE ENROLLMENTS
// ============================================================
const insertEnrollment = db.prepare('INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)');

const enrollments: [string, string][] = [
  ['mark.e@harvard.edu', 'CS 50'], ['mark.e@harvard.edu', 'CS 51'], ['mark.e@harvard.edu', 'MATH 21a'],
  ['priya.s@harvard.edu', 'ECON 10a'], ['priya.s@harvard.edu', 'ECON 10b'], ['priya.s@harvard.edu', 'MATH 21b'],
  ['tyler.w@harvard.edu', 'GOV 20'], ['tyler.w@harvard.edu', 'ECON 10a'],
  ['jessica.m@harvard.edu', 'EXPOS 20'], ['jessica.m@harvard.edu', 'PHIL 1'],
  ['david.k@harvard.edu', 'MATH 55a'], ['david.k@harvard.edu', 'MATH 21a'], ['david.k@harvard.edu', 'CS 51'],
  ['sarah.c@harvard.edu', 'HIST 1661'], ['sarah.c@harvard.edu', 'EXPOS 20'], ['sarah.c@harvard.edu', 'SPANISH 30'],
  ['james.r@harvard.edu', 'BIO 51'], ['james.r@harvard.edu', 'CHEM 5'],
  ['emily.b@harvard.edu', 'GOV 20'], ['emily.b@harvard.edu', 'PHIL 1'], ['emily.b@harvard.edu', 'SOC 10'],
  ['andrew.l@harvard.edu', 'PHYSICS 15a'], ['andrew.l@harvard.edu', 'PHYSICS 15b'], ['andrew.l@harvard.edu', 'MATH 55a'],
  ['lauren.d@harvard.edu', 'PSYCH 1'], ['lauren.d@harvard.edu', 'SOC 10'],
  ['chris.p@harvard.edu', 'MATH 21a'], ['chris.p@harvard.edu', 'MATH 21b'], ['chris.p@harvard.edu', 'ECON 10a'],
  ['amanda.j@harvard.edu', 'MUSIC 51'], ['amanda.j@harvard.edu', 'PHIL 1'],
  ['michael.z@harvard.edu', 'CS 50'], ['michael.z@harvard.edu', 'CS 51'], ['michael.z@harvard.edu', 'CS 161'],
  ['michelle.n@harvard.edu', 'CHEM 5'], ['michelle.n@harvard.edu', 'BIO 51'], ['michelle.n@harvard.edu', 'PSYCH 1'],
  ['william.o@harvard.edu', 'HIST 1661'], ['william.o@harvard.edu', 'GOV 20'],
  ['olivia.f@harvard.edu', 'MUSIC 51'], ['olivia.f@harvard.edu', 'EXPOS 20'],
];

for (const [email, code] of enrollments) {
  insertEnrollment.run(uid(email), cid(code));
}
console.log(`Inserted ${enrollments.length} course enrollments.`);

// ============================================================
// FRIENDSHIPS
// ============================================================
const insertFriend = db.prepare('INSERT INTO friends (requester_id, requested_id, status) VALUES (?, ?, ?)');

const friendships: [string, string, string][] = [
  ['mark.e@harvard.edu', 'michael.z@harvard.edu', 'accepted'],
  ['mark.e@harvard.edu', 'david.k@harvard.edu', 'accepted'],
  ['mark.e@harvard.edu', 'andrew.l@harvard.edu', 'accepted'],
  ['mark.e@harvard.edu', 'jessica.m@harvard.edu', 'accepted'],
  ['mark.e@harvard.edu', 'chris.p@harvard.edu', 'accepted'],
  ['priya.s@harvard.edu', 'chris.p@harvard.edu', 'accepted'],
  ['priya.s@harvard.edu', 'amanda.j@harvard.edu', 'accepted'],
  ['priya.s@harvard.edu', 'tyler.w@harvard.edu', 'accepted'],
  ['priya.s@harvard.edu', 'emily.b@harvard.edu', 'accepted'],
  ['tyler.w@harvard.edu', 'daniel.g@harvard.edu', 'accepted'],
  ['tyler.w@harvard.edu', 'robert.h@harvard.edu', 'accepted'],
  ['tyler.w@harvard.edu', 'william.o@harvard.edu', 'accepted'],
  ['tyler.w@harvard.edu', 'katherine.w@harvard.edu', 'accepted'],
  ['tyler.w@harvard.edu', 'james.r@harvard.edu', 'accepted'],
  ['tyler.w@harvard.edu', 'mark.e@harvard.edu', 'accepted'],
  ['jessica.m@harvard.edu', 'emily.b@harvard.edu', 'accepted'],
  ['jessica.m@harvard.edu', 'amanda.j@harvard.edu', 'accepted'],
  ['jessica.m@harvard.edu', 'katherine.w@harvard.edu', 'accepted'],
  ['jessica.m@harvard.edu', 'robert.h@harvard.edu', 'accepted'],
  ['david.k@harvard.edu', 'andrew.l@harvard.edu', 'accepted'],
  ['david.k@harvard.edu', 'michael.z@harvard.edu', 'accepted'],
  ['david.k@harvard.edu', 'chris.p@harvard.edu', 'accepted'],
  ['sarah.c@harvard.edu', 'jessica.m@harvard.edu', 'accepted'],
  ['sarah.c@harvard.edu', 'rachel.t@harvard.edu', 'accepted'],
  ['sarah.c@harvard.edu', 'olivia.f@harvard.edu', 'accepted'],
  ['sarah.c@harvard.edu', 'william.o@harvard.edu', 'accepted'],
  ['james.r@harvard.edu', 'michelle.n@harvard.edu', 'accepted'],
  ['james.r@harvard.edu', 'lauren.d@harvard.edu', 'accepted'],
  ['james.r@harvard.edu', 'emily.b@harvard.edu', 'accepted'],
  ['emily.b@harvard.edu', 'lauren.d@harvard.edu', 'accepted'],
  ['emily.b@harvard.edu', 'rachel.t@harvard.edu', 'accepted'],
  ['emily.b@harvard.edu', 'amanda.j@harvard.edu', 'accepted'],
  ['amanda.j@harvard.edu', 'olivia.f@harvard.edu', 'accepted'],
  ['katherine.w@harvard.edu', 'lauren.d@harvard.edu', 'accepted'],
  ['robert.h@harvard.edu', 'daniel.g@harvard.edu', 'accepted'],
  ['robert.h@harvard.edu', 'andrew.l@harvard.edu', 'accepted'],
  ['michael.z@harvard.edu', 'andrew.l@harvard.edu', 'accepted'],
  ['william.o@harvard.edu', 'daniel.g@harvard.edu', 'accepted'],
  ['michelle.n@harvard.edu', 'olivia.f@harvard.edu', 'accepted'],
  ['rachel.t@harvard.edu', 'olivia.f@harvard.edu', 'accepted'],
  ['chris.p@harvard.edu', 'tyler.w@harvard.edu', 'accepted'],
  ['lauren.d@harvard.edu', 'michelle.n@harvard.edu', 'accepted'],
  ['sarah.c@harvard.edu', 'mark.e@harvard.edu', 'pending'],
  ['olivia.f@harvard.edu', 'katherine.w@harvard.edu', 'pending'],
  ['rachel.t@harvard.edu', 'priya.s@harvard.edu', 'pending'],
];

for (const [from, to, status] of friendships) {
  insertFriend.run(uid(from), uid(to), status);
}
console.log(`Inserted ${friendships.length} friendships.`);

// ============================================================
// WALL POSTS
// ============================================================
const insertWallPost = db.prepare('INSERT INTO wall_posts (profile_id, author_id, body, created_at) VALUES (?, ?, ?, ?)');

const wallPosts: [string, string, string, string][] = [
  ['mark.e@harvard.edu', 'michael.z@harvard.edu', 'Dude, your CS 51 section was brutal today. Can we go over the recursion stuff at dinner?', '2004-02-05 14:23:00'],
  ['mark.e@harvard.edu', 'jessica.m@harvard.edu', 'Nice website you built! But when are you going to finish our Gov study guide? Priorities man.', '2004-02-06 19:45:00'],
  ['mark.e@harvard.edu', 'david.k@harvard.edu', "Math 21a p-set 4 solutions are on my door. You owe me Felipe's.", '2004-02-07 22:10:00'],
  ['priya.s@harvard.edu', 'emily.b@harvard.edu', 'Bhangra practice was amazing tonight!! You choreographed that last number so well.', '2004-02-05 23:15:00'],
  ['priya.s@harvard.edu', 'chris.p@harvard.edu', 'Are you going to the Econ 10 review session tomorrow? Mankiw said there might be a pop quiz Friday...', '2004-02-06 11:30:00'],
  ['tyler.w@harvard.edu', 'william.o@harvard.edu', "Great race on Saturday! We crushed Yale. Drinks at Grendel's?", '2004-02-08 16:00:00'],
  ['tyler.w@harvard.edu', 'daniel.g@harvard.edu', 'Your UC campaign poster in the dining hall is hilarious. You have my vote.', '2004-02-09 09:20:00'],
  ['jessica.m@harvard.edu', 'emily.b@harvard.edu', 'Your poem at the open mic last night was incredible. Seriously, you need to submit to the Advocate.', '2004-02-07 01:30:00'],
  ['jessica.m@harvard.edu', 'amanda.j@harvard.edu', 'Thanks for the Garden State soundtrack! Been listening on repeat in the darkroom.', '2004-02-08 20:45:00'],
  ['david.k@harvard.edu', 'andrew.l@harvard.edu', "HOW did you solve problem 7 on the Math 55 p-set? I've been staring at it for 3 hours.", '2004-02-06 02:15:00'],
  ['david.k@harvard.edu', 'michael.z@harvard.edu', "Chess Club tournament bracket is up. You're seeded #1 obviously. See you there.", '2004-02-09 14:00:00'],
  ['sarah.c@harvard.edu', 'rachel.t@harvard.edu', 'THE QUAD BUS IS THE WORST THING ABOUT HARVARD. That is all. Miss you neighbor!', '2004-02-05 08:45:00'],
  ['sarah.c@harvard.edu', 'olivia.f@harvard.edu', 'Your article about the dining hall food was SO funny. The Crimson is lucky to have you!', '2004-02-07 17:30:00'],
  ['emily.b@harvard.edu', 'lauren.d@harvard.edu', 'Callbacks concert was beautiful. Your solo gave me chills. Seriously.', '2004-02-08 23:00:00'],
  ['emily.b@harvard.edu', 'robert.h@harvard.edu', 'Can we talk about your Foucault thesis? I think Heidegger has something to say about it...', '2004-02-09 10:30:00'],
  ['james.r@harvard.edu', 'michelle.n@harvard.edu', 'ORGO EXAM IS OVER!! We survived!! Celebratory dinner at Hong Kong?', '2004-02-06 17:00:00'],
  ['james.r@harvard.edu', 'tyler.w@harvard.edu', "Intramural game at 4pm tomorrow. Don't be late this time.", '2004-02-08 21:15:00'],
  ['andrew.l@harvard.edu', 'mark.e@harvard.edu', 'Your senior thesis presentation was mind-blowing. Quantum entanglement explained so even I could follow.', '2004-02-09 15:45:00'],
  ['robert.h@harvard.edu', 'daniel.g@harvard.edu', 'Algiers last night was perfect. I think we solved the mind-body problem over Turkish coffee.', '2004-02-07 11:00:00'],
  ['robert.h@harvard.edu', 'jessica.m@harvard.edu', "Your jazz set at the Winthrop formal was incredible. When's the next one?", '2004-02-08 14:20:00'],
  ['katherine.w@harvard.edu', 'lauren.d@harvard.edu', "Field hockey practice at 3! Also the Fogg has a new Impressionist exhibit — want to go this weekend?", '2004-02-06 12:00:00'],
  ['olivia.f@harvard.edu', 'amanda.j@harvard.edu', 'Your cello piece at the HRO concert was stunning!! Adams is so lucky to have you.', '2004-02-09 22:30:00'],
  ['amanda.j@harvard.edu', 'katherine.w@harvard.edu', 'Film screening Friday was awesome. Your short about the Charles River was beautiful.', '2004-02-08 10:00:00'],
  ['chris.p@harvard.edu', 'mark.e@harvard.edu', "You owe me $20 from poker night. Don't think I forgot.", '2004-02-07 13:45:00'],
  ['chris.p@harvard.edu', 'priya.s@harvard.edu', 'HFI meeting moved to Thursday. Also Goldman info session is next week — you going?', '2004-02-09 16:30:00'],
  ['william.o@harvard.edu', 'tyler.w@harvard.edu', "RUGBY RUGBY RUGBY. Spring season starts next week. Let's gooooo.", '2004-02-05 19:00:00'],
  ['michelle.n@harvard.edu', 'james.r@harvard.edu', "Chem 5 study group tonight in Lamont? I'll bring the flashcards if you bring the Red Bull.", '2004-02-06 15:30:00'],
  ['rachel.t@harvard.edu', 'emily.b@harvard.edu', 'Your spoken word piece at Passim was EVERYTHING. You need to perform more!!', '2004-02-08 00:15:00'],
];

for (const [profile, author, body, created] of wallPosts) {
  insertWallPost.run(uid(profile), uid(author), body, created);
}
console.log(`Inserted ${wallPosts.length} wall posts.`);

// ============================================================
// POKES
// ============================================================
const insertPoke = db.prepare('INSERT INTO pokes (poker_id, poked_id, seen, created_at) VALUES (?, ?, ?, ?)');

const pokes: [string, string, number, string][] = [
  ['mark.e@harvard.edu', 'jessica.m@harvard.edu', 0, '2004-02-09 20:00:00'],
  ['tyler.w@harvard.edu', 'katherine.w@harvard.edu', 0, '2004-02-09 21:00:00'],
  ['emily.b@harvard.edu', 'jessica.m@harvard.edu', 1, '2004-02-08 18:00:00'],
  ['david.k@harvard.edu', 'mark.e@harvard.edu', 0, '2004-02-09 23:30:00'],
  ['lauren.d@harvard.edu', 'james.r@harvard.edu', 0, '2004-02-09 19:15:00'],
  ['sarah.c@harvard.edu', 'olivia.f@harvard.edu', 1, '2004-02-07 14:00:00'],
  ['chris.p@harvard.edu', 'priya.s@harvard.edu', 0, '2004-02-09 22:00:00'],
  ['michael.z@harvard.edu', 'mark.e@harvard.edu', 0, '2004-02-09 17:45:00'],
  ['amanda.j@harvard.edu', 'jessica.m@harvard.edu', 1, '2004-02-06 22:30:00'],
  ['rachel.t@harvard.edu', 'sarah.c@harvard.edu', 0, '2004-02-09 12:00:00'],
];

for (const [poker, poked, seen, created] of pokes) {
  insertPoke.run(uid(poker), uid(poked), seen, created);
}
console.log(`Inserted ${pokes.length} pokes.`);

db.close();
console.log('\nDatabase seeded successfully at:', DB_PATH);
