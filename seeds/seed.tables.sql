BEGIN;

-- TRUNCATE
--   "user",
--   "topic",
--   "thought";

INSERT INTO "user" ("id", "username", "first_name","last_name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder',
    'Mifflin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
  (
    2,
    'kwill',
    'Kraig',
    'Williams',
    '1@Thinkful'
  );

  INSERT INTO "share_level"("id","shared_level","active")
  VALUES
  (1,'private',TRUE),
  ( 2,'collaboration',TRUE),
  (3,'shared',TRUE),
  (4,'public',FALSE);

INSERT INTO "topic" ("id", "topic_title", "topic_content","topic_owner","level")
VALUES
  (1, 'Coronavirus','tips to stay safe during this outbreak' ,1,1);

INSERT INTO "thought" ("id", "thought_title", "thought_content","thought_owner","level")
VALUES
  (1, 'life at thinkful','this is a journal of my thinkful journey' ,1,1);

  INSERT INTO "connections" ("id","sender_id","receiver_id")
  VALUES(
    1,1,2
  );
  
  INSERT INTO "thought_connections"("id","owner_id","shared_userId","thought_id","level")
  VALUES(
    1,1,2,1,3
  );
 INSERT INTO "topic_connections"("id","owner_id","shared_userId","topic_id","level")
  VALUES(
    1,1,2,1,3
  );
COMMIT;