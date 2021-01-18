# strapi-plugin-i18n

## DB

1. Add a `strapiId` field to the CT & use it as a common id to use as ref for the relations or non localized components
2. Add a `locale` field of type `string` to the CT
3. Add a `localizations` field of type `json` field to the CT
4. Remove Database unique constraints & implement them in the query layer on update & create

## API

- If we consider the entities to be different we can just auto fill the locale & localizations.
- Any localization can be used as root & the non localized fields will be copied from it
- We handle localizations linkage on our side to make it easier for the users (SDK PLEASE)

### Fetch entities

- We auto set the locale query filter so we fetch one locale at a time. => Handled on the core-api or entity-service
- In `strapi.query` we can fetch all or any locale if we want.

**GET /articles**

_Response_

```json
[
  {
    "id": 1,
    "title": "Hello",
    "locale": "en-US",
    "localizations": [
      { "id": 1, "locale": "en-US" },
      { "id": 2, "locale": "fr-FR" }
      { "id": 3, "locale": "en-GB" }
    ]
  }
]
```

### Fetch one

We fetch by id so nothing to change

**GET /articles/1**

_Response_

```json
[
  {
    "id": 1,
    "title": "Hello",
    "locale": "en-US",
    "localizations": [
      { "id": 1, "locale": "en-US" },
      { "id": 2, "locale": "fr-FR" }
      { "id": 3, "locale": "en-GB" }
    ]
  }
]
```

### Create

- Set the `locale` to the default if not provided
- Init the localizations
- Set the entity as `root` entity
  - Use a sub route to create new localizations from this one ? why not use directly the ?locale param ?

**POST /articles**

#### sub route or query param

- Copy the `strapiId` to the new entity to use as a ref for relations
- Use any entity to update the localizations by providing a different locale in the query string
- Only accept localized fields
- use the :id as root entity for the non localized fields
- Create a new entity & link them together

**PUT /articles/:id/localizations/:locale**
**PUT /articles/:id?locale=xxx**

### Update

- Disallow updating the `locale`
- Update the other localizations non localized fields so the fields stay the same => Do that as a reaction (afterUpdate, ignore concurrency pbls)
  - easy on mongo as the data is nested in the object
  - harder on sql with the components will need some custom queries)

**PUT /articles/1**

#### Sub route or query string

- Only allow the localized fields
- Based on the id, find the corresponding locale requested. then update it
- When can you update the non localized fields ? only on the /articles/:id root but from any locale
- Allow the update from any :id

**PUT /articles/:id/localizations/:locale**
**PUT /articles/:id?locale=xxx**

### Delete

- Delete the id & not the linked relations
- Need to update the localizations
- No root needed we use the localizations list of the :id to update the others at once.

**DELETE /articles/:id**

#### sub query or query string

- Use the :id as root to find the corresponding localizations & delete it
- Do the same updates as in the main delete

**DELETE /articles/:id/localizations/:locale**
**DELETE /articles/:id?locale=xx**

## Content manager

- We can have the same logic as with the API.
- Need to allow sending non localized fields -> Will need to update the data for each localizations -> Where do we implement it ?

All the other actions will continue to work like before

Need to just wrap some logic in the CM for the update
