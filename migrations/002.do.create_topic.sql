

CREATE TABLE "topic" (
  "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "topic_title" TEXT NOT NULL UNIQUE,
  "topic_content" TEXT NOT NULL,
  "topic_owner" INTEGER REFERENCES user(id) NOT NULL
 

  
  );

   -- "topic_owner" INTEGER NOT NULL