# EcoCycle API Documentation

## Overview

The EcoCycle API provides endpoints for managing users, waste tracking, communities, eco-friendly businesses, and environmental challenges.

## Base URL

```
https://ecocycle-api.example.com/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

## User Endpoints

### Register a new user

```
POST /users
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "ecoScore": 0,
  "token": "jwt_token"
}
```

### Login

```
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "ecoScore": 0,
  "token": "jwt_token"
}
```

### Get user profile

```
GET /users/profile
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "location": "New York, NY",
    "bio": "Environmental enthusiast"
  },
  "ecoScore": 150,
  "wasteLog": [...],
  "communityMemberships": [...]
}
```

### Update user profile

```
PUT /users/profile
```

**Request Body:**
```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "location": "New York, NY",
    "bio": "Environmental enthusiast"
  }
}
```

## Waste Log Endpoints

### Create a waste log entry

```
POST /waste-logs
```

**Request Body:**
```json
{
  "category": "food",
  "amount": 500,
  "unit": "grams",
  "description": "Food scraps from dinner"
}
```

### Get all waste logs for user

```
GET /waste-logs
```

### Get a specific waste log

```
GET /waste-logs/:id
```

### Update a waste log

```
PUT /waste-logs/:id
```

### Delete a waste log

```
DELETE /waste-logs/:id
```

## Community Endpoints

### Create a community

```
POST /communities
```

**Request Body:**
```json
{
  "name": "Green Neighborhood",
  "description": "Community for eco-friendly living",
  "location": "San Francisco, CA"
}
```

### Get all communities

```
GET /communities
```

### Get a specific community

```
GET /communities/:id
```

### Join a community

```
POST /communities/:id/join
```

### Leave a community

```
DELETE /communities/:id/leave
```

## Business Endpoints

### Create a business

```
POST /businesses
```

**Request Body:**
```json
{
  "name": "Green Restaurant",
  "description": "Organic and sustainable dining",
  "category": "restaurant",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "USA"
  },
  "contact": {
    "phone": "555-1234",
    "email": "info@greenrestaurant.com",
    "website": "https://greenrestaurant.com"
  },
  "ecoCertifications": ["organic", "zero-waste"],
  "sustainabilityPractices": ["composting", "solar energy"]
}
```

### Get all businesses

```
GET /businesses
```

### Get a specific business

```
GET /businesses/:id
```

### Update a business

```
PUT /businesses/:id
```

### Delete a business

```
DELETE /businesses/:id
```

### Add a business review

```
POST /businesses/:id/reviews
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great eco-friendly restaurant!"
}
```

## Challenge Endpoints

### Create a challenge

```
POST /challenges
```

**Request Body:**
```json
{
  "title": "Zero Waste Week",
  "description": "Produce no waste for a week",
  "category": "waste-reduction",
  "difficulty": "medium",
  "points": 50,
  "duration": 7
}
```

### Get all challenges

```
GET /challenges
```

### Get a specific challenge

```
GET /challenges/:id
```

### Join a challenge

```
POST /challenges/:id/join
```

### Complete a challenge

```
PUT /challenges/:id/complete
```