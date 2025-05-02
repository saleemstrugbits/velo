import { getActiveProperties, deleteProperty } from 'backend/broker/properties.web.js';
import { currentMember } from "wix-members-frontend";
import wixLocation from 'wix-location';
import { openLightbox } from 'wix-window';
let propertyData;
$w.onReady(async function () {
    try {
        const member = await currentMember.getMember();
        const role = await currentMember.getRoles();

        if (!member || !member.loginEmail) {
            console.warn("User not logged in or missing email.");
            wixLocation.to("/");
        }
        if (member) {

            const userId = member._id;
            const getPropertyByBroker = await getActiveProperties();
            console.log("getPropertyByBroker", getPropertyByBroker);
            const items = getPropertyByBroker.items;
            propertyData = items;

            let currentIndex = 0; // Track the current index of items
            const itemsPerPage = 3; // Number of items to show per page
            $w('#allPropertyRepeater').data = items;
        }

    } catch (error) {
        console.error("Error in onReady function:", error);
    }

});

$w('#allPropertyRepeater').onItemReady(($item, itemData) => {
    $item("#coverImage").src = itemData.background
    $item("#title").text = itemData.title
    $item('#price').text = itemData.price
    $item("#address").text = itemData.address;
    $item("#bathrooms").text = itemData.bathrooms;
    $item("#bedrooms").text = itemData.bedrooms;
    $item("#size").text = itemData.size;
    if (itemData.propertyStatus === "sell") {
        $item('#sellTypeTag').src = 'https://static.wixstatic.com/shapes/635f06_5bc21a742ea44c88b8dd1550421b5d53.svg'
    }
    const propertyId = itemData._id

    $item("#deleteProperty").onClick(async () => {
        try {
            openLightbox("Delete", { propertyId }).then(async (result) => {
                console.log(result)
                if (result?.confirmed) {
                    await deleteProperty(propertyId);
                    const updatedData = [...$w('#allPropertyRepeater').data].filter((item) => {
                        console.log(propertyId)
                        console.log(item)
                        return item._id !== propertyId
                    })
                    $w('#allPropertyRepeater').data = updatedData;
                }
            })
        } catch (error) {
            console.log(error);
        }
    })

})

// search functionlity start:

let minValue
let maxValue

$w.onReady(function () {
    minValue = $w("#minValue")
    maxValue = $w("#maxValue")
    const rangeSlider = $w("#rangeSlider");

    rangeSlider.setAttribute("ranges", JSON.stringify([4550, 155000]));

    rangeSlider.on("rangechanger", (data) => {
        const range = JSON.parse(data.detail).range
        minValue.text = "$" + range[0]
        maxValue.text = "$" + range[1]
    });

    console.log(minValue.text);
    console.log(maxValue.text);
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

    const hasFilters = propertyStatus || propertyType || bedrooms || bathrooms

    if (!hasFilters) {
        console.log("Please select at least one filter");
        return;
    }

    // const allData = [...$w('#brokerPropertyRepeater').data];
    const allData = propertyData;
    console.log(propertyData);

    const filteredData = allData.filter(item => {
        const matchesStatus = propertyStatus ? item.propertyStatus == propertyStatus : true;
        const matchesType = propertyType ? item.propertyType == propertyType : true;
        const matchesBedrooms = bedrooms ? item.bedrooms == bedrooms + " Bed" : true;
        const matchesBathrooms = bathrooms ? item.bathrooms == bathrooms + " Bath" : true;
        const itemPrice = parseFloat(item.price.replace("$", ''));
        const matchesPrice = itemPrice >= minValue && itemPrice <= maxValue;
        let matchSnn = true;
        if (snnYes && snnNo) {
            matchSnn = true;
        } else if (snnYes) {
            matchSnn = item.ssn === "true";
        } else if (snnNo) {
            matchSnn = item.ssn === "false";
        } else {
            matchSnn = false;
        }
        // console.log(matchesStatus, matchesType, matchesBedrooms, matchesBathrooms, matchesPrice)

        return matchesStatus && matchesType && matchesBedrooms && matchesBathrooms && matchesPrice && matchSnn;
        // return matchesStatus;
    });
    if (!filteredData.length) {
        $w('#noMatchContainer').expand();
        $w('#pagination1').collapse();
    }
    if (filteredData.length) {
        $w('#noMatchContainer').collapse();
        $w('#pagination1').expand()
    }
    console.log("filteredData", filteredData)
    $w('#allPropertyRepeater').data = [];
    $w('#allPropertyRepeater').data = filteredData;
});

// search functionlity end:

$w('#resetBtn').onClick(() => {
    $w('#noMatchContainer').collapse();
    $w('#pagination1').expand()
    $w("#minValue").text = '$4550'
    $w("#maxValue").text = '$155000'
    $w('#propertyStatusDropdown').value = ''
    $w('#propertyTypeDropdown').value = ''
    $w("#bedroomsDropdown").value = ''
    $w("#bathroomsDropdown").value = ''
    const allData = propertyData;
    $w('#allPropertyRepeater').data = [];
    $w('#allPropertyRepeater').data = allData;
    $w('#snnYes').checked = true
    $w('#snnNo').checked = true;
    const rangeSlider = $w("#rangeSlider");
    rangeSlider.setAttribute("reset", String(Date.now()));

})