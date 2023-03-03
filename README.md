# Linguistic Backend Challenge: Writeup

The takehome challenge specification provides a pretty clear implementation roadmap, so I followed the specification pretty closely though I'll discuss a few instances below where continued discussion of the specification might lead to some different design decisions depending on product need.

<b>Data Type for body column in document model:</b> The specification doesn't list any size limit for this field, and if users are submitting large documents for translation (e.g. the text of a project Gutenberg book) then this column could run out of space. Some alternative schemes that avoid this issue:
  - Store the raw data in block storage which has much larger maximum sizes, and only store a link in the document table. This creates a tradeoff at retrieval time.
  - Switch the String type to Bytes and then serialize/deserialize the data before placing it in the database. This adds some overhead, but for Postgress expands the storage limit a good bit.
For my implementation, I erred on the side of simplicity since it's easy for users to understand why a large raw document might be rejected, and with the context of the project giant documents seem unlikely.

<b>saveDocument update lookup:</b> As discussed with Tyler over chat, the preference for this implementation is to update an existing entry if the title/authorID already exists in the database. In more distributed systems an alternative is to always write a new instance and then at retrieval just take the latest update written. 

For this implementation the lookup requires two queries of the database - the first query uses title/author to find the document ID, and the second query creates or updates based on the ID. It would be better to do the update with a single database access, but the <i>upsert</i> command requires a unique key to perform this operation in one step. Some options to improve this process include:
- Separate the create and update document APIs, and have the update require a documentID from the user
- Let API users cache the documentID and include it instead of title/author for updates
- Create a new column in the table that is a unique key constructed from authorID and title. This could be a hash or string concatenation depending on concerns of hash conflicts. While this speeds up updates and reduces database query load, it does make the database fragile to changes in the typescript code that constructs the unique identifier.

## Meta Observations

 - npm run test: In the base repository commit the existing tests don't pass. Perhaps this is intentional as part of the take home test, but I broke out a fix commit for base repository formatting and text runs in case it's helpful to merge back into the base repository
 - npm install vs npm ci: Current challenge instructions suggest using npm install, which causes a lot of extra changes to the package-lock.json file. Perhaps npm ci will keep code submissions cleaner
 - Public Github Repository: Currently the coding challenge base repository is publicly available, which means this fork with my implementation is also public facing. Perhaps it's unlikely that others taking the challenge would track down existing forks, but may be worth moving the challenge to a private repository so participant forks are also forced private.


## Test Queries

The following can be used to test graphQL once the server is running http://localhost:3000/graphql

query{
  user(id:8){
    id
    name
    email
    documents{
      title
      author {
        name
      }
    }
  }
}


mutation{
  saveDocument(saveDocumentData: {
    title: "Test"
    text: "Test Body"
    userID: 8
  }){
    title
    authorId
    creation_date
  }
}