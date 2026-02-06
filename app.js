require('dotenv').config();
require('express-async-errors');
const connectDB = require('./db/connect')
const express = require('express');
const app = express();

const auth = require("./middleware/auth");
const authenticateUser = require('./middleware/authentication')
//routers
const authRouter = require('./routes/auth')
const countriesRouter = require('./routes/countries')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static("public"));
app.set('trust proxy', 1);
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter({
  windowMs: 15*60*1000,
  max: 100,
}));
const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) =>{
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
})
// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/countries', authenticateUser, countriesRouter)
const secretWordRouter = require("./routes/secretWord");
app.use("/secretWord", auth, secretWordRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
