import { registerMemberByUser, registerMemberByBroker, myAssignRoleFunction, myApproveByTokenFunction } from 'backend/register.web.js';
import { createUser } from 'backend/members.web.js';
import wixLocationFrontend from "wix-location-frontend";
import { openLightbox } from 'wix-window-frontend'

$w.onReady(function () {
    const userRegisterBtn = $w('#userRegisterBtn');
    const brokerRegisterBtn = $w('#brokerRegisterBtn');
    const registerState = $w('#registerState');

    function updateRegisterState(activeState) {
        if (activeState === 'brokerRegisterState') {
            registerState.changeState('brokerRegisterState');
            brokerRegisterBtn.style.backgroundColor = '#4FC1E9FF';
            brokerRegisterBtn.style.color = 'white';
            userRegisterBtn.style.backgroundColor = 'white';
            userRegisterBtn.style.color = 'black';
        } else {
            registerState.changeState('userRegisterState');
            brokerRegisterBtn.style.backgroundColor = 'white';
            brokerRegisterBtn.style.color = 'black';
            userRegisterBtn.style.backgroundColor = '#4FC1E9FF';
            userRegisterBtn.style.color = 'white';
        }
    }

    userRegisterBtn.onClick(() => {
        console.log("User button clicked");
        updateRegisterState('userRegisterState');

    });

    brokerRegisterBtn.onClick(() => {
        updateRegisterState('brokerRegisterState');
        console.log("Broker button clicked");
    });

    updateRegisterState('userRegisterState');
});

// Signup using User 

$w('#userSignupBtn').onClick(async () => {
    const userName = $w('#userName').value;
    const email = $w('#userEmail').value;
    const password = $w('#userPassword').value;
    const userConfirmPassword = $w('#userConfirmPassword').value;
    const userCheckBox = $w("#checkAgreeWithTerms").checked;
    const userProfilePhoto = $w('#userProfilePhoto');
    const userSignupBtn = $w('#userSignupBtn');

    try {
        if (!email || !password || !userConfirmPassword || !userCheckBox) {
            throw new Error("Please fill in all required fields.");
        }

        if (!userProfilePhoto.value.length) {
            throw new Error("Please upload the Profile.");
        }

         if (!email.includes('@')) {
            throw new Error("Email must contain @ symbol.");
        }

        if (!email.includes('@') || !email.includes('.')) {
            throw new Error("Please enter a valid email address.");
        }

        if (password.length < 8) {
            throw new Error("Minimum length is 8 characters.");
        }

        if (password !== userConfirmPassword) {
            throw new Error("Password Must Be Same..");
        }

        $w('#userSignupBtn').label = "LOADING...";
        $w('#userSignupBtn').disable;

        // Upload profile photo if validation passes
        let imageSRC = "";

        const uploadedFiles = await $w('#userProfilePhoto')?.uploadFiles();

        if (uploadedFiles.length > 0 || !uploadedFiles) {
            imageSRC = uploadedFiles[0].fileName;
        } else {
            throw new Error("Please Upload Your Profile");
        }

        const options = {
            contactInfo: {
                firstName: userName,
                picture: "https://static.wixstatic.com/media/" + imageSRC,
            },
            customFields: {
                "custom_role": "USER",
            }
        };

        const registerUser = await registerMemberByUser(email, password, options);
        if (registerUser?.error) {
            throw new Error(registerUser.error);
        }
        await myApproveByTokenFunction(registerUser.approvalToken);
        const roleId = 'b8a462dd-42fb-4564-91e0-6e2b943ebd8a';
        const memberId = registerUser.member.id;
        await myAssignRoleFunction(roleId, memberId);
        const authOptions = {
            firstName: userName,
            email: email,
            profilePhoto: "https://static.wixstatic.com/media/" + imageSRC,
            phone: "No Information",
            userType: "user",
            status: "APPROVED",
            contactId: registerUser.member.contactId

        }
        await createUser(authOptions)
        wixLocationFrontend.to("/login");

    } catch (error) {
        let errorMessage = error?.message || "An unknown error occurred";
        if (errorMessage.toLowerCase().includes("already exists")) {
            $w("#userErrorMessage1").text = "User with this email already exists. Please use a different email.";
            openLightbox("Failed", "User with this email already exists. Please use a different email.");
        } else {
            openLightbox("Failed", { message: error.message || "An unexpected error occurred." });
        }

    } finally {
        userSignupBtn.enable();
        userSignupBtn.label = "SIGNUP"
    }

});

// Signup uisng Broker

$w('#brokerSignupBtn').onClick(async () => {
    console.log("broker button click")
    const name = $w('#brokerName').value;
    const email = $w('#brokerEmail').value;
    const phone = $w('#brokerPhone').value;
    const brokerId = $w('#brokerId').value;
    const password = $w('#brokerPassword').value;
    const brokerConfirmPassword = $w('#brokerConfirmPassword').value;
    const brokerCheckBox = $w("#brokerCheckAgreeWithTerms").checked;
    const brokerProfilePhoto = $w('#brokerProfilePhoto').value;
    const brokerSignupBtn = $w('#brokerSignupBtn');


    try {
        if (!email || !password || !brokerConfirmPassword || !brokerCheckBox || !brokerId || !phone) {
            throw new Error("Please fill in all required fields.");
        }

        if (!brokerProfilePhoto.length) {
            throw new Error("Please upload the Profile.");
        }


        if (!email.includes('@')) {
            throw new Error("Email must contain @ symbol.");
        }

        if (!email.includes('@') || !email.includes('.')) {
            throw new Error("Please enter a valid email address.");
        }

        if (password.length < 8) {
            throw new Error("Minimum length is 8 characters.");
        }

        if (password !== brokerConfirmPassword) {
            throw new Error("Password Must Be Same..");
        }

        

        $w('#brokerSignupBtn').label = "LOADING...";
        $w('#brokerSignupBtn').disable;

        // Upload profile photo if validation passes
        let imageSRC = "";

        const uploadedFiles = await $w('#brokerProfilePhoto').uploadFiles();

        if (uploadedFiles.length > 0) {
            imageSRC = uploadedFiles[0].fileName;
            console.log("File uploaded:", imageSRC);
        } else {
            throw new Error("Please Upload Your Profile");
        }

        const options = {
            contactInfo: {
                firstName: name,
                picture: "https://static.wixstatic.com/media/" + imageSRC,
                phones: [phone]
            },
            customFields: {
                "custom_broker-id": brokerId,
            }
        };

        const registerBroker = await registerMemberByBroker(email, password, options);
        console.log("registerBroker:", registerBroker);
        const roleId = '90bc8034-40f5-4fbe-ade4-c69941e160a0';
        if (registerBroker.member) {
            const memberId = registerBroker.member.id;
            await myAssignRoleFunction(roleId, memberId);
            $w('#brokerSignupBtn').label = "SIGNUP";
            $w('#brokerSignupBtn').disable;
            const authOptions = {
                firstName: name,
                email: email,
                profilePhoto: "https://static.wixstatic.com/media/" + imageSRC,
                brokerId: brokerId,
                phone: phone,
                userType: "broker",
                status: "PENDING",
                contactId: registerBroker.member.contactId

            }
            await createUser(authOptions)
            // wixLocationFrontend.to("/login");
            openLightbox("Register Popup", { message: "Thanks for signup your process in review" });
        }

    } catch (error) {
        let errorMessage = error?.message || "An unknown error occurred";
        if (errorMessage.toLowerCase().includes("already exists")) {
            $w("#userErrorMessage1").text = "User with this email already exists. Please use a different email.";
            openLightbox("Failed", "User with this email already exists. Please use a different email.");
        } else {
            openLightbox("Failed", { message: error.message || "An unexpected error occurred." });
        }

    } finally {
        brokerSignupBtn.enable();
        brokerSignupBtn.label = "SIGNUP"
    }

});
