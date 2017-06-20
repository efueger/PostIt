import ModelService from '../services/ModelService';
import AdhocModelService from '../services/AdhocModelService';
import AuthService from '../services/AuthService';
import models from '../models';

const userModel = models.User;

/**
 * @class GroupController
 */
class UserController {
  /**
   * Check if authentication request is valid
   * @method
   * @memberof UserController
   * @static
   * @return {function} Express middleware function that checks
   * request method and payload for every authentication request
   */
  static validateRequest() {
    return (req, res, next) => {
      if (req.method !== 'POST') {
        res.status(400).send('POST request method expected');
      } else if (!req.body.username || !req.body.password) {
        res.status(400).send('non-empty username and password expected');
      } else {
        next();
      }
    };
  }

  /**
   * Authenticate a user with username and password
   * @method
   * @memberof UserController
   * @static
   * @return {function} Express middleware function that
   * validates username and password  and sends token to client
   */
  static authenticateUser() {
    return (req, res) => {
      const username = req.body.username;
      ModelService.getModelInstance(userModel, { username })
      .then((user) => {
        user.verifyPassword(req.body.password)
        .then((passwordIsValid) => {
          if (passwordIsValid) {
            const rsaKey = process.env.PRIVATE_KEY;
            return AuthService.generateToken(user, rsaKey);
          }
          return res.status(401).send('Invalid Password');
        })
        .then((token) => {
          return res.status(200).json(token);
        })
        .catch((err) => {
          return res.status(401).send(err.message);
        });
      })
      .catch((err) => {
        return res.status(401).send(err.message);
      });
    };
  }

  /**
   * Create a user
   * @method
   * @memberof UserController
   * @static
   * @return {function} Express middleware function that creates
   * new user and sends response to client
   */
  static createUser() {
    return (req, res) => {
      ModelService.createModelInstance(userModel, req.body)
      .then((user) => {
        if (user) {
          res.status(201).send(user);
        }
      })
      .catch((err) => {
        res.status(400).send(err.message);
      });
    };
  }

  /**
   * Delete a user
   * @method
   * @memberof ModelService
   * @static
   * @returns {function} Express middleware function which deletes
   * user and sends response to client
   */
  static deleteUser() {
    return (req, res) => {
      ModelService.deleteModelInstance(userModel, {
        username: req.params.username
      })
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        res.status(400).send(err.message);
      });
    };
  }

  /**
   * Update user profile
   * @method
   * @memberof ModelService
   * @static
   * @returns {function} Express middleware function which updates
   * user details and sends response to client
   */
  static updateUser() {
    return (req, res) => {
      ModelService.updateModelInstance(userModel, {
        username: req.params.username
      }, req.body)
      .then((user) => {
        res.status(200).send(user);
      })
      .catch((err) => {
        res.status(400).send(err.message);
      });
    };
  }

  /**
   * Get a user
   * @method
   * @memberof ModelService
   * @static
   * @returns {function} Express middleware function which gets
   * a user and sends response to client
   */
  static getUser() {
    return (req, res) => {
      ModelService.getModelInstance(userModel, {
        username: req.params.username
      })
      .then((user) => {
        res.status(200).send(user);
      })
      .catch((err) => {
        res.status(400).send(err.message);
      });
    };
  }

  /**
   * Get all the groups a user belong to
   * @method
   * @memberof ModelService
   * @static
   * @returns {function} Express middleware function which gets
   * user's groups and sends response to client
   */
  static getUserGroups() {
    return (req, res) => {
      AdhocModelService.getUserGroups(req.params.username)
      .then((groups) => {
        res.status(200).send(groups);
      })
      .catch((err) => {
        res.status(400).send(err.message);
      });
    };
  }
}
export default UserController;