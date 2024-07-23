import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import session from "express-session";
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';

import { initPassport, isAuthenticated } from "./middleware/passport";
import api from './routes/api';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport middleware
app.use(session({
  secret: "This is a secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 // 1 hour
  }
}));
initPassport(app);

// api routes for testing

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // only error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;