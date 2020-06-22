const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function(){
    ac.grant("employee").readOwn(['profile', 'skills']);

    ac.grant("admin")
    .extend("employee")
    .readAny("skills")
    .updateAny("skills")
    .deleteAny("skills")
  return ac;
})();