-- Additional indexes for performance
USE facebook_clone;

-- FULLTEXT index for user search
ALTER TABLE users ADD FULLTEXT INDEX ft_user_names (first_name, last_name);

-- Indexes for friend lookups
CREATE INDEX idx_friends_requested ON friends (requested_id, status);
CREATE INDEX idx_friends_requester ON friends (requester_id, status);

-- Index for wall posts by profile
CREATE INDEX idx_wall_profile ON wall_posts (profile_id, created_at DESC);

-- Index for pokes lookup
CREATE INDEX idx_pokes_poked ON pokes (poked_id, seen);

-- Index for course lookups
CREATE INDEX idx_courses_code ON courses (code);

-- Index for user house/year browsing
CREATE INDEX idx_users_house ON users (house_id);
CREATE INDEX idx_users_year ON users (class_year);
