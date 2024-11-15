# Spyne Task

This project is created as a part of selection process for Spyne. It uses Supabase for image storage and retreival. JWT Tokens are used for safe authentication and user management. It implements a car management system and helps perform the following tasks:

- User can login/signup
- Users can add a car with upto 10 images, title, description and tags
- Users can view a list of all their cars.
- Users can global search through all their cars ii.e the keyword searched will list all cars whose
title, description, tags match the keyword.
- Users can click on a car to view particular car’s detail
- Users can update a car’s title, description, tags, or image.
- Users can delete a car.

## Testing out the project

The project is deployed at [https://spyne-backend-six.vercel.app/](https://spyne-backend-six.vercel.app/) .

[Here](https://app.swaggerhub.com/apis-docs/SWETABHSHREYAM333/Makerble/1.0) is the api documentation.



The backend exposes the follwing apis :

### Public Routes

- **`/ping`**
  - **Method:** GET
  - **Description:** To check if the program is alive and running.

### Authentication Routes

- **`/auth/login`**

  - **Method:** POST
  - **Description:** Allows existing users to authenticate into the system.

- **`/auth/register`**
  - **Method:** POST
  - **Description:** Enables new users to create an account.

### Protected Routes

- **`/logout`**

  - **Method:** GET
  - **Description:** Protected Route for user to logout and clear the cookies and tokens used for authentication.

- **`/verify`**

  - **Method:** GET
  - **Description:** Protected Route for checking if the user is authenticated.

- **`/api/cars`**

  - **Method:** POST
  - **Description:** Creates a new car listing with images.Returns created car object with uploaded image URLs. Protected route requiring authentication.

- **`/api/cars`**

  - **Method:** GET
  - **Description:** Retrieves all cars for the authenticated user.Retuns Array of car objects sorted by creation date .Protected route requiring authentication.

- **`/api/cars/:id`**

  - **Method:** GET
  - **Description:** Retrieves details of a specific car. Protected route requiring authentication.

- **`/api/cars/:id`**

  - **Method:** PUT
  - **Description:** Updates car details including images. Protected route requiring authentication.

- **`/api/cars/:id`**

  - **Method:** DELETE
  - **Description:** Deletes a car and its associated images. Protected route requiring authentication.


### Notes
 All car routes are protected and require user authentication via validateAccessToken middleware.

## Setting up the project Locally

 

To set up the project paste the follwing commands in your terminal:

```bash
git clone https://github.com/Swetabh333/Spyne_backend.git
cd Spyne_backend
npm install
```

This will install all the required dependencies for the project.

Next you have to set the environment for the project.

Create a .env file in the root directory

and paste this there

```bash
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_access_secret
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_secret_key
FRONTEND_URL=your_frontend_url
```


Do the above and then in your terminal run

**Note** : Make sure nothing else is running on port 3000.

```bash
npm start
```



**Your backend is now listening at port `3000`**.