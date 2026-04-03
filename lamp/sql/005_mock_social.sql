-- Mock Social Data: friendships, wall posts, pokes, course enrollments, privacy settings
-- Creates an authentic, lived-in feel for the 2004 Harvard experience
USE facebook_clone;

-- ============================================================
-- PRIVACY SETTINGS (so profiles are visible)
-- ============================================================
INSERT INTO privacy_settings (user_id, show_email, show_phone, show_birthday, show_courses, show_interests, show_wall, allow_wall_posts, allow_pokes)
SELECT id, 'friends', 'friends', 'friends', 'everyone', 'everyone', 'everyone', 'friends', 'everyone'
FROM users WHERE email LIKE '%@harvard.edu'
ON DUPLICATE KEY UPDATE show_courses = 'everyone', show_interests = 'everyone', show_wall = 'everyone';

-- ============================================================
-- COURSE ENROLLMENTS
-- ============================================================

-- Mark Ellison (CS)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'mark.e@harvard.edu' AND c.code = 'CS 50';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'mark.e@harvard.edu' AND c.code = 'CS 51';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'mark.e@harvard.edu' AND c.code = 'MATH 21a';

-- Priya Shankar (Econ)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'priya.s@harvard.edu' AND c.code = 'ECON 10a';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'priya.s@harvard.edu' AND c.code = 'ECON 10b';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'priya.s@harvard.edu' AND c.code = 'MATH 21b';

-- Tyler Whitfield (Gov)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'tyler.w@harvard.edu' AND c.code = 'GOV 20';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'tyler.w@harvard.edu' AND c.code = 'ECON 10a';

-- Jessica Morrison (English)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'jessica.m@harvard.edu' AND c.code = 'EXPOS 20';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'jessica.m@harvard.edu' AND c.code = 'PHIL 1';

-- David Kim (Math)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'david.k@harvard.edu' AND c.code = 'MATH 55a';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'david.k@harvard.edu' AND c.code = 'MATH 21a';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'david.k@harvard.edu' AND c.code = 'CS 51';

-- Sarah Chen (History)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'sarah.c@harvard.edu' AND c.code = 'HIST 1661';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'sarah.c@harvard.edu' AND c.code = 'EXPOS 20';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'sarah.c@harvard.edu' AND c.code = 'SPANISH 30';

-- James Robinson (Bio/Pre-med)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'james.r@harvard.edu' AND c.code = 'BIO 51';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'james.r@harvard.edu' AND c.code = 'CHEM 5';

-- Emily Brooks (Social Studies)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'emily.b@harvard.edu' AND c.code = 'GOV 20';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'emily.b@harvard.edu' AND c.code = 'PHIL 1';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'emily.b@harvard.edu' AND c.code = 'SOC 10';

-- Andrew Liu (Physics)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'andrew.l@harvard.edu' AND c.code = 'PHYSICS 15a';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'andrew.l@harvard.edu' AND c.code = 'PHYSICS 15b';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'andrew.l@harvard.edu' AND c.code = 'MATH 55a';

-- Lauren Davis (Psych)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'lauren.d@harvard.edu' AND c.code = 'PSYCH 1';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'lauren.d@harvard.edu' AND c.code = 'SOC 10';

-- Christopher Park (Applied Math)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'chris.p@harvard.edu' AND c.code = 'MATH 21a';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'chris.p@harvard.edu' AND c.code = 'MATH 21b';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'chris.p@harvard.edu' AND c.code = 'ECON 10a';

-- Amanda Johnson (VES)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'amanda.j@harvard.edu' AND c.code = 'MUSIC 51';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'amanda.j@harvard.edu' AND c.code = 'PHIL 1';

-- Michael Zhang (CS)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'michael.z@harvard.edu' AND c.code = 'CS 50';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'michael.z@harvard.edu' AND c.code = 'CS 51';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'michael.z@harvard.edu' AND c.code = 'CS 161';

-- Michelle Nakamura (Neuro)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'michelle.n@harvard.edu' AND c.code = 'CHEM 5';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'michelle.n@harvard.edu' AND c.code = 'BIO 51';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'michelle.n@harvard.edu' AND c.code = 'PSYCH 1';

-- William O'Brien (History)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'william.o@harvard.edu' AND c.code = 'HIST 1661';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'william.o@harvard.edu' AND c.code = 'GOV 20';

-- Olivia Fischer (Music)
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'olivia.f@harvard.edu' AND c.code = 'MUSIC 51';
INSERT INTO user_courses (user_id, course_id) SELECT u.id, c.id FROM users u, courses c WHERE u.email = 'olivia.f@harvard.edu' AND c.code = 'EXPOS 20';

-- ============================================================
-- FRIENDSHIPS (accepted = established friends)
-- Using subqueries to get user IDs by email
-- ============================================================

-- Mark's friend group (CS nerds + Kirkland)
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'mark.e@harvard.edu' AND b.email = 'michael.z@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'mark.e@harvard.edu' AND b.email = 'david.k@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'mark.e@harvard.edu' AND b.email = 'andrew.l@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'mark.e@harvard.edu' AND b.email = 'jessica.m@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'mark.e@harvard.edu' AND b.email = 'chris.p@harvard.edu';

-- Priya's connections
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'priya.s@harvard.edu' AND b.email = 'chris.p@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'priya.s@harvard.edu' AND b.email = 'amanda.j@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'priya.s@harvard.edu' AND b.email = 'tyler.w@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'priya.s@harvard.edu' AND b.email = 'emily.b@harvard.edu';

-- Tyler knows everyone (social butterfly)
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'tyler.w@harvard.edu' AND b.email = 'daniel.g@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'tyler.w@harvard.edu' AND b.email = 'robert.h@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'tyler.w@harvard.edu' AND b.email = 'william.o@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'tyler.w@harvard.edu' AND b.email = 'katherine.w@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'tyler.w@harvard.edu' AND b.email = 'james.r@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'tyler.w@harvard.edu' AND b.email = 'mark.e@harvard.edu';

-- Jessica + Emily friendship (literary/artsy group)
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'jessica.m@harvard.edu' AND b.email = 'emily.b@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'jessica.m@harvard.edu' AND b.email = 'amanda.j@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'jessica.m@harvard.edu' AND b.email = 'katherine.w@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'jessica.m@harvard.edu' AND b.email = 'robert.h@harvard.edu';

-- David + Andrew (math/science crew)
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'david.k@harvard.edu' AND b.email = 'andrew.l@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'david.k@harvard.edu' AND b.email = 'michael.z@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'david.k@harvard.edu' AND b.email = 'chris.p@harvard.edu';

-- Sarah (freshman connecting with upperclassmen)
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'sarah.c@harvard.edu' AND b.email = 'jessica.m@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'sarah.c@harvard.edu' AND b.email = 'rachel.t@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'sarah.c@harvard.edu' AND b.email = 'olivia.f@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'sarah.c@harvard.edu' AND b.email = 'william.o@harvard.edu';

-- James + Michelle (pre-med bond)
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'james.r@harvard.edu' AND b.email = 'michelle.n@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'james.r@harvard.edu' AND b.email = 'lauren.d@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'james.r@harvard.edu' AND b.email = 'emily.b@harvard.edu';

-- Emily + Lauren (social science crew)
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'emily.b@harvard.edu' AND b.email = 'lauren.d@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'emily.b@harvard.edu' AND b.email = 'rachel.t@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'emily.b@harvard.edu' AND b.email = 'amanda.j@harvard.edu';

-- More cross-connections
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'amanda.j@harvard.edu' AND b.email = 'olivia.f@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'katherine.w@harvard.edu' AND b.email = 'lauren.d@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'robert.h@harvard.edu' AND b.email = 'daniel.g@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'robert.h@harvard.edu' AND b.email = 'andrew.l@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'michael.z@harvard.edu' AND b.email = 'andrew.l@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'william.o@harvard.edu' AND b.email = 'daniel.g@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'michelle.n@harvard.edu' AND b.email = 'olivia.f@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'rachel.t@harvard.edu' AND b.email = 'olivia.f@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'chris.p@harvard.edu' AND b.email = 'tyler.w@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'accepted' FROM users a, users b WHERE a.email = 'lauren.d@harvard.edu' AND b.email = 'michelle.n@harvard.edu';

-- A few pending requests (for realism)
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'pending' FROM users a, users b WHERE a.email = 'sarah.c@harvard.edu' AND b.email = 'mark.e@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'pending' FROM users a, users b WHERE a.email = 'olivia.f@harvard.edu' AND b.email = 'katherine.w@harvard.edu';
INSERT INTO friends (requester_id, requested_id, status) SELECT a.id, b.id, 'pending' FROM users a, users b WHERE a.email = 'rachel.t@harvard.edu' AND b.email = 'priya.s@harvard.edu';

-- ============================================================
-- WALL POSTS (authentic 2004 college banter)
-- ============================================================

-- Posts on Mark's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Dude, your CS 51 section was brutal today. Can we go over the recursion stuff at dinner?', '2004-02-05 14:23:00' FROM users p, users a WHERE p.email = 'mark.e@harvard.edu' AND a.email = 'michael.z@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Nice website you built! But when are you going to finish our Gov study guide? Priorities man.', '2004-02-06 19:45:00' FROM users p, users a WHERE p.email = 'mark.e@harvard.edu' AND a.email = 'jessica.m@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Math 21a p-set 4 solutions are on my door. You owe me Felipe''s.', '2004-02-07 22:10:00' FROM users p, users a WHERE p.email = 'mark.e@harvard.edu' AND a.email = 'david.k@harvard.edu';

-- Posts on Priya's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Bhangra practice was amazing tonight!! You choreographed that last number so well.', '2004-02-05 23:15:00' FROM users p, users a WHERE p.email = 'priya.s@harvard.edu' AND a.email = 'emily.b@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Are you going to the Econ 10 review session tomorrow? Mankiw said there might be a pop quiz Friday...', '2004-02-06 11:30:00' FROM users p, users a WHERE p.email = 'priya.s@harvard.edu' AND a.email = 'chris.p@harvard.edu';

-- Posts on Tyler's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Great race on Saturday! We crushed Yale. Drinks at Grendel''s?', '2004-02-08 16:00:00' FROM users p, users a WHERE p.email = 'tyler.w@harvard.edu' AND a.email = 'william.o@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Your UC campaign poster in the dining hall is hilarious. You have my vote.', '2004-02-09 09:20:00' FROM users p, users a WHERE p.email = 'tyler.w@harvard.edu' AND a.email = 'daniel.g@harvard.edu';

-- Posts on Jessica's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Your poem at the open mic last night was incredible. Seriously, you need to submit to the Advocate.', '2004-02-07 01:30:00' FROM users p, users a WHERE p.email = 'jessica.m@harvard.edu' AND a.email = 'emily.b@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Thanks for the Garden State soundtrack! Been listening on repeat in the darkroom.', '2004-02-08 20:45:00' FROM users p, users a WHERE p.email = 'jessica.m@harvard.edu' AND a.email = 'amanda.j@harvard.edu';

-- Posts on David's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'HOW did you solve problem 7 on the Math 55 p-set? I''ve been staring at it for 3 hours.', '2004-02-06 02:15:00' FROM users p, users a WHERE p.email = 'david.k@harvard.edu' AND a.email = 'andrew.l@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Chess Club tournament bracket is up. You''re seeded #1 obviously. See you there.', '2004-02-09 14:00:00' FROM users p, users a WHERE p.email = 'david.k@harvard.edu' AND a.email = 'michael.z@harvard.edu';

-- Posts on Sarah's wall (freshmen energy)
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'THE QUAD BUS IS THE WORST THING ABOUT HARVARD. That is all. Miss you neighbor!', '2004-02-05 08:45:00' FROM users p, users a WHERE p.email = 'sarah.c@harvard.edu' AND a.email = 'rachel.t@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Your article about the dining hall food was SO funny. The Crimson is lucky to have you!', '2004-02-07 17:30:00' FROM users p, users a WHERE p.email = 'sarah.c@harvard.edu' AND a.email = 'olivia.f@harvard.edu';

-- Posts on Emily's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Callbacks concert was beautiful. Your solo gave me chills. Seriously.', '2004-02-08 23:00:00' FROM users p, users a WHERE p.email = 'emily.b@harvard.edu' AND a.email = 'lauren.d@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Can we talk about your Foucault thesis? I think Heidegger has something to say about it...', '2004-02-09 10:30:00' FROM users p, users a WHERE p.email = 'emily.b@harvard.edu' AND a.email = 'robert.h@harvard.edu';

-- Posts on James's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'ORGO EXAM IS OVER!! We survived!! Celebratory dinner at Hong Kong?', '2004-02-06 17:00:00' FROM users p, users a WHERE p.email = 'james.r@harvard.edu' AND a.email = 'michelle.n@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Intramural game at 4pm tomorrow. Don''t be late this time.', '2004-02-08 21:15:00' FROM users p, users a WHERE p.email = 'james.r@harvard.edu' AND a.email = 'tyler.w@harvard.edu';

-- Posts on Andrew's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Your senior thesis presentation was mind-blowing. Quantum entanglement explained so even I could follow.', '2004-02-09 15:45:00' FROM users p, users a WHERE p.email = 'andrew.l@harvard.edu' AND a.email = 'mark.e@harvard.edu';

-- Posts on Robert's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Algiers last night was perfect. I think we solved the mind-body problem over Turkish coffee.', '2004-02-07 11:00:00' FROM users p, users a WHERE p.email = 'robert.h@harvard.edu' AND a.email = 'daniel.g@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Your jazz set at the Winthrop formal was incredible. When''s the next one?', '2004-02-08 14:20:00' FROM users p, users a WHERE p.email = 'robert.h@harvard.edu' AND a.email = 'jessica.m@harvard.edu';

-- Posts on Katherine's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Field hockey practice at 3! Also the Fogg has a new Impressionist exhibit — want to go this weekend?', '2004-02-06 12:00:00' FROM users p, users a WHERE p.email = 'katherine.w@harvard.edu' AND a.email = 'lauren.d@harvard.edu';

-- Posts on Olivia's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Your cello piece at the HRO concert was stunning!! Adams is so lucky to have you.', '2004-02-09 22:30:00' FROM users p, users a WHERE p.email = 'olivia.f@harvard.edu' AND a.email = 'amanda.j@harvard.edu';

-- Posts on Amanda's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Film screening Friday was awesome. Your short about the Charles River was beautiful.', '2004-02-08 10:00:00' FROM users p, users a WHERE p.email = 'amanda.j@harvard.edu' AND a.email = 'katherine.w@harvard.edu';

-- Posts on Chris's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'You owe me $20 from poker night. Don''t think I forgot.', '2004-02-07 13:45:00' FROM users p, users a WHERE p.email = 'chris.p@harvard.edu' AND a.email = 'mark.e@harvard.edu';
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'HFI meeting moved to Thursday. Also Goldman info session is next week — you going?', '2004-02-09 16:30:00' FROM users p, users a WHERE p.email = 'chris.p@harvard.edu' AND a.email = 'priya.s@harvard.edu';

-- Posts on William's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'RUGBY RUGBY RUGBY. Spring season starts next week. Let''s gooooo.', '2004-02-05 19:00:00' FROM users p, users a WHERE p.email = 'william.o@harvard.edu' AND a.email = 'tyler.w@harvard.edu';

-- Posts on Michelle's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Chem 5 study group tonight in Lamont? I''ll bring the flashcards if you bring the Red Bull.', '2004-02-06 15:30:00' FROM users p, users a WHERE p.email = 'michelle.n@harvard.edu' AND a.email = 'james.r@harvard.edu';

-- Posts on Rachel's wall
INSERT INTO wall_posts (profile_id, author_id, body, created_at) SELECT p.id, a.id, 'Your spoken word piece at Passim was EVERYTHING. You need to perform more!!', '2004-02-08 00:15:00' FROM users p, users a WHERE p.email = 'rachel.t@harvard.edu' AND a.email = 'emily.b@harvard.edu';

-- ============================================================
-- POKES (the iconic feature)
-- ============================================================

INSERT INTO pokes (poker_id, poked_id, seen, created_at) SELECT a.id, b.id, 0, '2004-02-09 20:00:00' FROM users a, users b WHERE a.email = 'mark.e@harvard.edu' AND b.email = 'jessica.m@harvard.edu';
INSERT INTO pokes (poker_id, poked_id, seen, created_at) SELECT a.id, b.id, 0, '2004-02-09 21:00:00' FROM users a, users b WHERE a.email = 'tyler.w@harvard.edu' AND b.email = 'katherine.w@harvard.edu';
INSERT INTO pokes (poker_id, poked_id, seen, created_at) SELECT a.id, b.id, 1, '2004-02-08 18:00:00' FROM users a, users b WHERE a.email = 'emily.b@harvard.edu' AND b.email = 'jessica.m@harvard.edu';
INSERT INTO pokes (poker_id, poked_id, seen, created_at) SELECT a.id, b.id, 0, '2004-02-09 23:30:00' FROM users a, users b WHERE a.email = 'david.k@harvard.edu' AND b.email = 'mark.e@harvard.edu';
INSERT INTO pokes (poker_id, poked_id, seen, created_at) SELECT a.id, b.id, 0, '2004-02-09 19:15:00' FROM users a, users b WHERE a.email = 'lauren.d@harvard.edu' AND b.email = 'james.r@harvard.edu';
INSERT INTO pokes (poker_id, poked_id, seen, created_at) SELECT a.id, b.id, 1, '2004-02-07 14:00:00' FROM users a, users b WHERE a.email = 'sarah.c@harvard.edu' AND b.email = 'olivia.f@harvard.edu';
INSERT INTO pokes (poker_id, poked_id, seen, created_at) SELECT a.id, b.id, 0, '2004-02-09 22:00:00' FROM users a, users b WHERE a.email = 'chris.p@harvard.edu' AND b.email = 'priya.s@harvard.edu';
INSERT INTO pokes (poker_id, poked_id, seen, created_at) SELECT a.id, b.id, 0, '2004-02-09 17:45:00' FROM users a, users b WHERE a.email = 'michael.z@harvard.edu' AND b.email = 'mark.e@harvard.edu';
INSERT INTO pokes (poker_id, poked_id, seen, created_at) SELECT a.id, b.id, 1, '2004-02-06 22:30:00' FROM users a, users b WHERE a.email = 'amanda.j@harvard.edu' AND b.email = 'jessica.m@harvard.edu';
INSERT INTO pokes (poker_id, poked_id, seen, created_at) SELECT a.id, b.id, 0, '2004-02-09 12:00:00' FROM users a, users b WHERE a.email = 'rachel.t@harvard.edu' AND b.email = 'sarah.c@harvard.edu';
