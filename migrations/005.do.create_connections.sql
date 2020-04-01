CREATE TABLE "connections"(
  "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,  
  "sender_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE NOT NULL ,
"receiver_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE NOT NULL 
);