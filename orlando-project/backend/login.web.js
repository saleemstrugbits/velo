
import { Permissions, webMethod } from "wix-web-module";
import { authentication } from "wix-members-backend";


export const getLoginToken = webMethod(
  Permissions.Anyone,
  async (email, password) => {
    let sessionToken;

    try {
      sessionToken = await authentication.login(email, password);

      // If the promise resolves, the member is authenticated and can be logged in
      return {
        sessionToken: sessionToken,
        approved: true,
      };
    } catch (error) {
      // If the promise is rejected, the member is not authenticated
      // and cannot be logged in
      console.error(error);
      return {
        approved: false,
        error: error,
      };
    }
  },
);

/*************
 * Page code *
 ************/

// import { getLoginToken } from "backend/login.web";
// import { authentication } from "wix-members-frontend";

// $w("#login").onClick(async () => {
//   const email = $w("#email").value;
//   const password = $w("#password").value;

//   // Call the backend function to get the session token
//   const loginResult = await getLoginToken(email, password);

//   if (loginResult.approved) {
//     // If approved, log the member in using the returned session token
//     authentication.applySessionToken(loginResult.sessionToken);
//   } else {
//     // If not approved, log a message
//     console.error("Login not approved.");
//   }
// });
