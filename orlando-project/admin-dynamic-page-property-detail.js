import { deleteProperty } from 'backend/broker/properties.web.js';
import { currentMember, authentication } from "wix-members-frontend";
import wixLocation from 'wix-location';
import { openLightbox } from 'wix-window';

$w.onReady(async function () {
    try {
        const member = await currentMember.getMember();
        const role = await currentMember.getRoles();
        const item = $w('#brokerPropertyDetailsDynamicData').getCurrentItem();
        console.log("current item", item)

        if (!member || !member.loginEmail) {
            console.warn("User not logged in or missing email.");
            wixLocation.to("/");
        }
        if (member) {

            let currentIndex = 0; // Track the current index of items
            const itemsPerPage = 3; // Number of items to show per page

        }

    } catch (error) {
        console.error("Error in onReady function:", error);
    }

});

$w("#deleteProperty").onClick(async () => {
    const item = $w('#brokerPropertyDetailsDynamicData').getCurrentItem();
    const propertyId = item._id;
    try {
        openLightbox("Delete", { propertyId }).then(async (result) => {
            console.log(result)
            if (result?.confirmed) {
                await deleteProperty(propertyId);
                wixLocation.to("/broker-dashboard");
            }
        })
    } catch (error) {
        console.log(error);
    }
})

// edit property

$w('#editPropertyBtn').onClick(async (event) => {
    const item = $w('#brokerPropertyDetailsDynamicData').getCurrentItem();
    const propertyId = item._id;
    try {
        openLightbox("Edit Property Broker", { propertyId }).then(async (result) => {
            console.log(result)
            if (result?.confirmed) {
                console.log("update done")
                // wixLocation.to("/broker-dashboard");
            }
        })
    } catch (error) {
        console.log(error);
    }

});