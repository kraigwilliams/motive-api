BEGIN;

TRUNCATE
  "user",
  "topic",
  "thought";

INSERT INTO "user" ("id", "username", "first_name","last_name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder',
    'Mifflin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "topic" ("id", "topic_title", "topic_content","topic_owner")
VALUES
  (1, 'Coronavirus','tips to stay safe during this outbreak' ,1);

INSERT INTO "thought" ("id", "thought_title", "thought_content","thought_owner")
VALUES
  (1, 'life at thinkful','this is a journal of my thinkful journey' ,1)
  ;


COMMIT;