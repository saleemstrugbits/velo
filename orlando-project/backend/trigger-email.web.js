import { Permissions, webMethod } from "wix-web-module";
import { triggeredEmails } from "wix-crm-backend";

export const sendTriggerEmail = webMethod(
    Permissions.Anyone,
    (emailId, memberSiteId) => {

        //  const adminSiteId = "b1b14533-70ce-4e03-a532-a8f2466fffe7"
        //                 await sendTriggerEmail("UcmAAn8", adminSiteId, "tenantSaveRes")

        // console.log('userData from trigger email>>', userData);
        // const options = {
        //     variables: { name: userData.fullName, email: userData.email, phone: userData.phone, resume: userData.resume }
        // }
        //         import { triggeredEmails } from 'wix-crm';
        // //...
        return triggeredEmails.emailMember(emailId, memberSiteId);
        // career:5cae0965-55af-498d-aa6a-2fae1709e758
        // atta: 0f4e2253-f2f4-44e0-b5a7-b4cbb4bc8ac2
        //     return triggeredEmails
        //         .emailContact("Ucm1IWs", "0f4e2253-f2f4-44e0-b5a7-b4cbb4bc8ac2", options)
        //         .then(() => {
        //             console.log("Email was sent to contact");
        //         })
        //         .catch((error) => {
        //             console.error(error);
        //         });
    },
);