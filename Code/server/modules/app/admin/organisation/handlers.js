/* eslint-disable */
const User = require('../../models/user');
const createMiddleware = require("../../../common/jwt");
const Organisation = require("../../models/organisation");

const getListOrganisation = async (req, res, next) => {
  try {
      const runsheetUrl = req.query.url;
      let query = null;
      if(runsheetUrl){
          query = {
              "runsheet.url": runsheetUrl,
          };
      }
      const result = await Organisation.find(query);
      return res.json(result);
  } catch (err) {
      return next(err);
  }
}

const checkUserAuthenticated = createMiddleware(
    "jwtCustomer",
    async (jwtPayload) => {
        const user = await User.findOne({
            _id: jwtPayload.userId,
            // roles: { $in: [User.ROLE_ADMIN] },
            status: User.STATUS_ACTIVE,
        });
        return user;
    }
);

module.exports = {
  getListOrganisation,
  checkUserAuthenticated
};
