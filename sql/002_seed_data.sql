-- Seed data: Harvard houses and sample courses
USE facebook_clone;

-- Harvard Houses (12 upperclassman houses + freshman yards)
INSERT INTO houses (name) VALUES
('Adams House'),
('Cabot House'),
('Currier House'),
('Dunster House'),
('Eliot House'),
('Kirkland House'),
('Leverett House'),
('Lowell House'),
('Mather House'),
('Pforzheimer House'),
('Quincy House'),
('Winthrop House'),
('Canaday Hall'),
('Grays Hall'),
('Greenough Hall'),
('Hollis Hall'),
('Holworthy Hall'),
('Hurlbut Hall'),
('Lionel Hall'),
('Matthews Hall'),
('Mower Hall'),
('Stoughton Hall'),
('Straus Hall'),
('Thayer Hall'),
('Weld Hall'),
('Wigglesworth Hall');

-- Sample Spring 2004 courses
INSERT INTO courses (code, title, professor, semester) VALUES
('CS 50', 'Introduction to Computer Science I', 'Michael D. Smith', 'Spring 2004'),
('CS 51', 'Introduction to Computer Science II', 'Greg Morrisett', 'Spring 2004'),
('CS 161', 'Operating Systems', 'Matt Welsh', 'Spring 2004'),
('ECON 10a', 'Principles of Economics', 'N. Gregory Mankiw', 'Spring 2004'),
('ECON 10b', 'Principles of Economics', 'Martin Feldstein', 'Spring 2004'),
('GOV 20', 'Foundations of Comparative Politics', 'James Robinson', 'Spring 2004'),
('MATH 21a', 'Multivariable Calculus', 'Shing-Tung Yau', 'Spring 2004'),
('MATH 21b', 'Linear Algebra and Differential Equations', 'Oliver Knill', 'Spring 2004'),
('MATH 55a', 'Honors Abstract Algebra', 'Dennis Gaitsgory', 'Spring 2004'),
('PSYCH 1', 'Introduction to Psychology', 'Steven Pinker', 'Spring 2004'),
('EXPOS 20', 'Expository Writing', 'Various', 'Spring 2004'),
('HIST 1661', 'The American Revolution', 'Bernard Bailyn', 'Spring 2004'),
('PHIL 1', 'The Good Life', 'Sean Kelly', 'Spring 2004'),
('MUSIC 51', 'Theory I', 'Thomas Forrest Kelly', 'Spring 2004'),
('SPANISH 30', 'Intermediate Spanish', 'Various', 'Spring 2004'),
('BIO 51', 'Integrative Biology of Organisms', 'Andrew Berry', 'Spring 2004'),
('CHEM 5', 'Introduction to Principles of Chemistry', 'James Anderson', 'Spring 2004'),
('PHYSICS 15a', 'Introductory Mechanics and Relativity', 'Howard Georgi', 'Spring 2004'),
('PHYSICS 15b', 'Introductory Electromagnetism', 'Gerald Holton', 'Spring 2004'),
('SOC 10', 'Introduction to Sociology', 'Mary Waters', 'Spring 2004');
