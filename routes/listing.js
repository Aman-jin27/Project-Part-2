const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/") //Index Route - show all listings
.get(wrapAsync(listingController.index))
//Create Route - create new listing and save 
.post(                            
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.createListing)
);

//New Route - form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm );

router
.route("/:id")
//Show Route - show detail of one listing
.get(wrapAsync(listingController.showListing)) 
//Update Route - update listing
.put(     
    isLoggedIn,
    isOwner, 
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
)
//Delete Route
.delete(
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.destroyListing)
);


//Edit Route - form to edit listing
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;
