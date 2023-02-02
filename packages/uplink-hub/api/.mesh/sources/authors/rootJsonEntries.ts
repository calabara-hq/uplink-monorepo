// @ts-nocheck
export default [

  {
    name: "Root0",
    rootJson: {
  "nested": {
    "authors": {
      "nested": {
        "v1": {
          "nested": {
            "AuthorsService": {
              "methods": {
                "GetAuthor": {
                  "requestType": "GetAuthorRequest",
                  "responseType": "Author",
                  "comment": null
                },
                "ListAuthors": {
                  "requestType": "ListAuthorsRequest",
                  "responseType": "ListAuthorsResponse",
                  "comment": null
                }
              },
              "comment": null
            },
            "ListAuthorsRequest": {
              "fields": {},
              "comment": null
            },
            "GetAuthorRequest": {
              "fields": {
                "id": {
                  "type": "string",
                  "id": 1,
                  "comment": null
                }
              },
              "comment": null
            },
            "ListAuthorsResponse": {
              "fields": {
                "items": {
                  "rule": "repeated",
                  "type": "Author",
                  "id": 1,
                  "comment": null
                }
              },
              "comment": null
            },
            "Author": {
              "fields": {
                "id": {
                  "type": "string",
                  "id": 1,
                  "comment": null
                },
                "name": {
                  "type": "string",
                  "id": 2,
                  "comment": null
                },
                "editor": {
                  "type": "string",
                  "id": 3,
                  "comment": null
                }
              },
              "comment": null
            }
          }
        }
      }
    }
  }
},
  },

];