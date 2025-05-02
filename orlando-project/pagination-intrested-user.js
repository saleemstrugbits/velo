import { findIntrestedPropertyByBrokerId } from 'backend/broker/intrestedUser.web.js';
import { currentMember } from "wix-members-frontend";
import wixLocation from 'wix-location';

let intrestedUserData = [];
let currentPage = 1;
const itemsPerPage = 5;
let debounceTimeout;
let allIntrestedUserData = [];

$w.onReady(async function () {
    try {
        const member = await currentMember.getMember();

        if (!member || !member.loginEmail) {
            console.warn("User not logged in or missing email.");
            wixLocation.to("/");
        }

        const brokerId = member._id;
        const getIntrestedUserByBroker = await findIntrestedPropertyByBrokerId(brokerId);
        console.log("get data ", getIntrestedUserByBroker)
        intrestedUserData = getIntrestedUserByBroker.items;
        allIntrestedUserData = getIntrestedUserByBroker.items || [];

        renderPage();
    } catch (error) {
        console.error("Error in onReady function:", error);
    }
});

$w('#intrestedUserRepeater').onItemReady(($item, itemData) => {
    $item("#profile").src = itemData.background;
    $item("#userName").text = itemData.title;
    $item('#userEmail').text = itemData.price;
    $item("#propertyTitle").text = itemData.address;

});

function renderPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = intrestedUserData.slice(startIndex, endIndex);
    const total = totalPages();

    $w('#intrestedUserRepeater').data = pageData;

    $w('#prevBtn').enable();
    $w('#nextBtn').enable();

    if (currentPage === 1) $w('#prevBtn').disable();
    if (currentPage >= total) $w('#nextBtn').disable();

    let basePage = Math.max(1, Math.min(currentPage - 1, total - 3));
    if (total <= 4) basePage = 1;

    const pageLabels = [basePage, basePage + 1, basePage + 2, basePage + 3];

    // Dynamically update labels
    [$w('#btnOne'), $w('#btnTwo'), $w('#btnThree'), $w('#btnFour')].forEach((btn, i) => {
        if (pageLabels[i] <= total) {
            btn.label = String(pageLabels[i]);
            btn.expand();
        } else {
            btn.collapse();
        }
    });

    // Reset all button styles
    ['#btnOne', '#btnTwo', '#btnThree', '#btnFour'].forEach(id => {
        $w(id).style.backgroundColor = "#ffffff";
        $w(id).style.color = "#4fc1e9";
        $w(id).style.borderColor = "#4fc1e9";
    });

    // Highlight current page
    [$w('#btnOne'), $w('#btnTwo'), $w('#btnThree'), $w('#btnFour')].forEach((btn, i) => {
        if (parseInt(btn.label) === currentPage) {
            btn.style.backgroundColor = "#4fc1e9";
            btn.style.color = "#ffffff";
            btn.style.borderColor = "#4fc1e9";
        }
    });
}

function totalPages() {
    return Math.ceil(intrestedUserData.length / itemsPerPage);
}

// Pagination: Prev/Next buttons
$w('#nextBtn').onClick(() => {
    if (currentPage < totalPages()) {
        currentPage++;
        renderPage();
    }
});

$w('#prevBtn').onClick(() => {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    }
});

['#btnOne', '#btnTwo', '#btnThree', '#btnFour'].forEach(id => {
    $w(id).onClick(() => {
        const pageNum = parseInt($w(id).label);
        if (!isNaN(pageNum)) {
            currentPage = pageNum;
            renderPage();
        }
    });
});

// Search Functionality
$w('#searchByNameOrId').onInput((event) => {
    const value = event.target.value.trim().toLowerCase();

    // Clear previous debounce timer
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
        if (value.length === 0) {
            intrestedUserData = allIntrestedUserData;
            currentPage = 1;
            renderPage();
            return;
        }

        // Filter based on firstName or Property Title
        const filteredData = allIntrestedUserData.filter(item => {
            const propertyTitle = item["propertyTitle"] ? item["propertyTitle"].toLowerCase() : "";
            const firstNameField = item.fullName ? item.fullName.toLowerCase() : "";
            return propertyTitle.includes(value) || firstNameField.includes(value);
        });

        intrestedUserData = filteredData;
        currentPage = 1;
        renderPage();
    }, 300);
});