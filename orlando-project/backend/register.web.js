import { Permissions, webMethod } from "wix-web-module";
import { authentication } from "wix-members-backend";
import { authorization } from "wix-members-backend";



// reginter a user 
export const registerMemberByUser = webMethod(
  Permissions.Anyone,
  (email, password, options) => {
    return authentication
      .register(email, password, options)
      .then((registrationResult) => {
        return registrationResult;
      })
      .catch((error) => {
        console.error(error);
        let errorMessage = error?.message || "An unknown error occurred";
        return { error: errorMessage };
      });
  },
);

//approve by token

export const myApproveByTokenFunction = webMethod(
  Permissions.Anyone,
  (token) => {
    return authentication
      .approveByToken(token)
      .then((sessionToken) => {
        return {
          sessionToken: sessionToken,
          approved: true,
        };
      })
      .catch((error) => {
        return {
          approved: false,
          reason: error,
        };
      });
  },
);



// reginter a broker 
export const registerMemberByBroker = webMethod(
  Permissions.Anyone,
  (email, password, options) => {
    return authentication
      .register(email, password, options)
      .then((registrationResult) => {
        return registrationResult;
      })
      .catch((error) => {
        console.error(error);
      });
  },
);


// assign the role to the member which can be user or broker
export const myAssignRoleFunction = webMethod(Permissions.Anyone, (roleId,memberId) => {
  const options = {
    suppressAuth: false,
  };

  return authorization
    .assignRole(roleId, memberId, options)
    .then(() => {
      console.log("Role assigned to member");
    })
    .catch((error) => {
      console.error(error);
    });
});




