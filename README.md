# MyReads

This is the starter template for the second assessment project for Udacity's React Fundamentals course, developed by [React Training](https://reacttraining.com). The goal of this template is to save you time by providing a static example of the CSS and HTML markup that may be used, but without any of the React code that is needed to complete the project. If you choose to start with this template, your job will be to add interactivity to the app by refactoring the static code in this template.

Of course, you are free to start this project from scratch if you wish! Just be sure to use [Create React App](https://github.com/facebookincubator/create-react-app) to bootstrap the project.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

NodeJS

```
node version 8.0.0 or above
```

### Installing

Install dependencies with

```
npm install
npm install --prefix client
```

then run the development server

```
npm run dev
```

finaly hit 

```
http://localhost:3000/
```

## Built With

* [React](https://facebook.github.io/react/docs/hello-world.html) - A JavaScript library for building user interfaces

# Readable API Server

## API
Use an Authorization header to work with your own data:

`fetch(url, { headers: { 'Authorization': 'whatever-you-want' }})`

The following endpoints are available:  

`GET /categories`  
  **USAGE:**   
    Get all of the categories available for the app. List is found in categories.js.
    Feel free to extend this list as you desire.    

`GET /:category/posts`  
  **USAGE:**    
    Get all of the posts for a particular category   

`GET /posts`  
  **USAGE:**    
    Get all of the posts. Useful for the main page when no category is selected.  

`POST /posts`  
  **USAGE:**  
    Add a new post  
  
  **PARAMS:**   
    id - UUID should be fine, but any unique id will work  
    timestamp - timestamp in whatever format you like, you can use Date.now() if you like  
    title - String  
    body - String  
    author - String  
    category: Any of the categories listed in categories.js. Feel free to extend this list as you desire.  

`GET /posts/:id`  
  **USAGE:**  
    Get the details of a single post  

`POST /posts/:id`  
  **USAGE:**  
    Used for voting on a post  

  **PARAMS:**  
    option - String: Either "upVote" or "downVote"  
    
`PUT /posts/:id`  
  **USAGE:**  
    Edit the details of an existing post  

  **PARAMS:**  
    title - String  
    body - String  

`DELETE /posts/:id`  
  **USAGE:**  
    Sets the deleted flag for a post to 'true'.   
    Sets the parentDeleted flag for all child comments to 'true'.  
  
`GET /posts/:id/comments`  
  **USAGE:**  
    Get all the comments for a single post  

`POST /comments`  
  **USAGE:**  
    Add a comment to a post  

  **PARAMS:**  
    id: Any unique ID. As with posts, UUID is probably the best here.  
    timestamp: timestamp. Get this however you want.  
    body: String  
    owner: String  
    parentId: Should match a post id in the database.  

`GET /comments/:id`  
  **USAGE:**  
    Get the details for a single comment  

`POST /comments/:id`  
  **USAGE:**  
    Used for voting on a comment.  

`PUT /comments/:id`  
  **USAGE:**  
    Edit the details of an existing comment  
  
  **PARAMS:**  
    timestamp: timestamp. Get this however you want.  
    body: String  

`DELETE /comments/:id`  
  **USAGE:**  
    Sets a comment's deleted flag to 'true'  

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Guillaume Maka** - *Initial work* - [Richard Kalehoff II](https://github.com/richardkalehoff)

See also the list of [contributors](https://github.com/udacity/reactnd-contacts-complete/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details