// import { getUser } from 'backend/members.web.js'
import { authentication, currentMember } from "wix-members-frontend";
import { openLightbox } from 'wix-window-frontend'
import { to } from 'wix-location-frontend'
import { getLoginToken } from "backend/login.web";
import wixLocation from 'wix-location';

$w.onReady(async function () {

    const member = await currentMember.getMember();
    if (member) {
        wixLocation.to("/");
    }
});

$w('#submit').onClick(async (event) => {
    console.log("login button clicked")
    const submitBtn = $w('#submit');

    try {
        submitBtn.label = "Logging In...";
        const email = $w("#email").value;
        const password = $w("#password").value;

        if (!email || !password) {
            throw new Error("Please fill in all required fields.");
        }

        submitBtn.disable();

        let loginRes;
        const loginResult = await getLoginToken(email, password);
        console.log(loginResult)

        if (loginResult?.approved == true) {
            // If approved, log the member in using the returned session token
            loginRes = await authentication.applySessionToken(loginResult.sessionToken);
            console.log("loginRes==", loginRes);
        } else if (loginResult?.approved == false && loginResult.error.details.applicationError.description.includes("member is pending")) {
            // If not approved, log a message
            throw new Error("login failed, member is pending activation");
        } else if (loginResult?.approved == false && loginResult.error.details.applicationError.description.includes("not found")) {
            throw new Error("User Not Found Please Signup First.")
        } else {
            throw new Error("Invalid email or password.");
        }

        const member = await currentMember.getRoles();
        if (member) {
            // Redirect user based on role
            if (member[0].title === 'user') {
                to("/");
            } else if (member[0].title === 'broker') {
                to("/broker-dashboard");
            } else if (member[0].title === 'admin') {
                to("/admin-dashboard");
            }
        }

    } catch (error) {
        console.error("Error======:", error);
        openLightbox("Failed", { message: error.message || "An unexpected error occurred." });

    } finally {
        submitBtn.enable();
        submitBtn.label = "LOGIN"
    }
});
