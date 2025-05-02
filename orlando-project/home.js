import wixLocation from 'wix-location';
import { findFavoriteProperties, addFavoriteProperties, deleteFavoriteProperties } from 'backend/user/favoriteProperties.web.js';
import { openLightbox } from 'wix-window';
import { currentMember } from "wix-members-frontend";

// search functionlity start:
let minValue
let maxValue

$w.onReady(async function () {

    const role = await currentMember.getRoles();
    const currentRole = role[0]?.title;
    if (currentRole == "broker" || currentRole === "admin") {
        $w('#likeBtn').collapse();

    }
    minValue = $w("#minValue");
    maxValue = $w("#maxValue");
    const rangeSlider = $w("#rangeSlider");

    rangeSlider.setAttribute("ranges", JSON.stringify([4550, 155000]));

    rangeSlider.on("rangechanger", (data) => {
        const range = JSON.parse(data.detail).range
        minValue.text = "$" + range[0]
        maxValue.text = "$" + range[1]
    });

    // console.log(minValue.text);
    // console.log(maxValue.text);
});

$w('#searchPropertyBtn').onClick(() => {
    const minValue = parseFloat($w("#minValue").text.replace("$", ''));
    const maxValue = parseFloat($w("#maxValue").text.replace("$", ''));

    const propertyStatus = $w('#propertyStatusDropdown').value;
    const propertyType = $w('#propertyTypeDropdown').value;
    const bedrooms = $w("#bedroomsDropdown").value;
    const bathrooms = $w("#bathroomsDropdown").value;
    const snnYes = $w('#snnYes').checked;
    const snnNo = $w('#snnNo').checked;

    console.log(snnYes, "yes value")
    console.log(snnNo, "no value")

    const params = {};

    if (!isNaN(minValue)) params.minValue = minValue;
    if (!isNaN(maxValue)) params.maxValue = maxValue;
    if (propertyStatus) params.status = propertyStatus;
    if (propertyType) params.type = propertyType;
    if (bedrooms) params.bedrooms = bedrooms;
    if (bathrooms) params.bathrooms = bathrooms;
    if (snnYes) params.snnYes = snnYes;
    if (snnNo) params.snnNo = snnNo;

    const hasFilters = Object.keys(params).length > 0;

    if (!hasFilters) {
        console.log("Please select at least one filter");
        return;
    }

    const query = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

    const path = `/all-properties?${query}`;
    // console.log(path);
    wixLocation.to(path);
});

$w('#propertyRepeater').onItemReady(async ($item, itemData) => {
    const member = await currentMember.getMember();
    if (itemData.propertyStatus === "sell") {
        $item('#sellTypeTag').src = 'https://static.wixstatic.com/shapes/635f06_5bc21a742ea44c88b8dd1550421b5d53.svg'
    }

    $item('#likeBtn').onClick(async () => {

        if (!member) {
            openLightbox("Login Popup");
            return;

        }
    })

    if (member) {
        const userContactId = member.contactId;
        const propertyId = itemData._id;

        const getFavoriteData = await findFavoriteProperties(userContactId, propertyId);
        if (getFavoriteData?.propertyId) {
            $item('#likeBtn').icon = "https://static.wixstatic.com/shapes/635f06_fc69be87a5744cef9fd3d2f94aaa373c.svg"
        }

        $item('#likeBtn').onClick(async () => {
            try {
                const userContactId = member.contactId;
                const propertyId = itemData._id;
                const propertyTitle = itemData.title;

                const getFavoriteData = await findFavoriteProperties(userContactId, propertyId);
                if (getFavoriteData?.propertyId) {
                    const deleteData = await deleteFavoriteProperties(getFavoriteData._id);
                    $item('#likeBtn').icon = "https://static.wixstatic.com/shapes/9c1135_8c7484d8961d45f8b82e2f9048fc4e33.svg"
                    openLightbox("success msg", { message: "Property Remove to Your Favorite Listing" })
                }
                if (!getFavoriteData?.propertyId) {
                    const favoriteinput = {
                        userId: userContactId,
                        // brokerId: brokerId,
                        propertyId: propertyId,
                        title: propertyTitle
                    }
                    const addData = await addFavoriteProperties(favoriteinput);
                    openLightbox("success msg", { message: "Property Added to Your Favorite Listing Successfully" })
                    console.log(addData);
                    $item('#likeBtn').icon = "https://static.wixstatic.com/shapes/635f06_fc69be87a5744cef9fd3d2f94aaa373c.svg"

                }
            } catch (error) {
                console.log(error);
            }
        })
    }

})