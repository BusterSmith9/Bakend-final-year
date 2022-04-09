const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./config/db.config");
const auth = require("./middlewares/auth.js");
const errors = require("./middlewares/errors.js");
const cors = require("cors");
const app = express();
const unless = require("express-unless");
const categoryRoutes = require("./routes/categories.routes");
const placeRoutes = require("./routes/places.routes");
const bookingRoutes = require("./routes/booking.routes");
const reviewRoutes = require("./routes/reviews.routes");
const blogRoutes = require("./routes/blog.routes");

const morgan = require("morgan");
const bodyParser = require("body-parser");




// connect to mongodb

/**
 * With useNewUrlParser: The underlying MongoDB driver has deprecated their current connection string parser. 
 * Because this is a major change, they added the useNewUrlParser flag to allow users to fall back to the old parser if they find a bug in the new parser. 
 * You should set useNewUrlParser: true unless that prevents you from connecting.
 * 
 * With useUnifiedTopology, the MongoDB driver sends a heartbeat every heartbeatFrequencyMS to check on the status of the connection. 
 * A heartbeat is subject to serverSelectionTimeoutMS , so the MongoDB driver will retry failed heartbeats for up to 30 seconds by default.
 */
 mongoose.Promise = global.Promise;
 mongoose.connect(dbConfig.db, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   })
   .then(
     () => {
       console.log("Database connected");
     },
     (error) => {
       console.log("Database can't be connected: " + error);
     }
   );

   
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
 

 // middleware for authenticating token submitted with requests
 /**
  * Conditionally skip a middleware when a condition is met.
  */

 

 app.use(express.json());
 
 app.use(cors());
 app.options('*', cors())

 // initialize routes
 app.use("/users", require("./routes/user.routes"));
 app.use("/categories", categoryRoutes);
 app.use("/places", placeRoutes);
 app.use("/booking", bookingRoutes);
 app.use("/reviews", reviewRoutes);
 app.use("/blog", blogRoutes);
// middleware for error responses
 app.use(errors.errorHandler);
 
 // listen for requests
 app.listen(process.env.port || 3000, function () {
   console.log("Ready to Go!");
 });