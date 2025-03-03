const express = require("express");
const router = express.Router();
const axios = require("axios");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
const querystring = require("querystring");
require("dotenv").config();
require("dotenv").config({ path: "../.env" });

const FATSECRET_API_URL = "https://platform.fatsecret.com/rest/server.api";

const oauth = OAuth({
  consumer: {
    key: process.env.FATSECRET_CONSUMER_KEY,
    secret: process.env.FATSECRET_CONSUMER_SECRET,
  },
  signature_method: "HMAC-SHA1",
  hash_function(baseString, key) {
    return crypto.createHmac("sha1", key).update(baseString).digest("base64");
  },
});

// Function to generate OAuth headers
const getOAuthHeaders = (method, url, params = {}) => {
  const requestData = {
    url,
    method,
    data: params,
  };
  return oauth.authorize(requestData);
};

// Route for generating a meal plan
router.post("/", async (req, res) => {
  const { calories, mealsCount, mealTypes } = req.body;

  if (!calories || !mealsCount || !mealTypes || !Array.isArray(mealTypes)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const mealPlan = {};

    for (const mealType of mealTypes) {
      try {
        const params = {
          method: "recipes.search.v3",
          format: "json",
          recipe_types: mealType,
        };

        const oauthHeaders = getOAuthHeaders("GET", FATSECRET_API_URL, params);

        const authParams = {
          oauth_consumer_key: process.env.FATSECRET_CONSUMER_KEY,
          oauth_signature_method: "HMAC-SHA1",
          oauth_timestamp: oauthHeaders.oauth_timestamp,
          oauth_nonce: oauthHeaders.oauth_nonce,
          oauth_version: "1.0",
          oauth_signature: oauthHeaders.oauth_signature,
        };

        const queryString = querystring.stringify({ ...params, ...authParams });

        const response = await axios.get(`${FATSECRET_API_URL}?${queryString}`);

        console.log("API Response for", mealType, response.data.recipes);

        if (!response.data.recipes || !response.data.recipes.recipe) {
          throw new Error("Invalid response structure from FatSecret API");
        }

        const recipes = Array.isArray(response.data.recipes.recipe)
          ? response.data.recipes.recipe.slice(0, 5)
          : [response.data.recipes.recipe];

        mealPlan[mealType] = recipes.map((recipe) => ({
          title: recipe.recipe_name,
          description: recipe.recipe_description || "No description available.",
          ingredients: recipe.recipe_ingredients?.ingredient || [],
          image: recipe.recipe_image || "",
          calories: recipe.recipe_nutrition?.calories || "N/A",
          carbohydrate: recipe.recipe_nutrition?.carbohydrate || "N/A",
          protein: recipe.recipe_nutrition?.protein || "N/A",
          fat: recipe.recipe_nutrition?.fat || "N/A",
        }));
      } catch (error) {
        console.error(`Error fetching recipes for ${mealType}:`, error.message);
        mealPlan[mealType] = [];
      }
    }

    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meal plan." });
  }
});

module.exports = router;
