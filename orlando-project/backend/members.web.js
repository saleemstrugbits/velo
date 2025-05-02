import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';
import { members } from 'wix-members-backend';
import { sendTriggerEmail } from "backend/trigger-email.web.js"

const dbName = "auth"

export const approveMember = webMethod(
    Permissions.Anyone,
    async (contactId) => {
        try {
            //  let existingProperty = await wixData.get(dbName, memberId);
            const response = await wixData.query(dbName).eq("contactId", contactId).find();
            const usersData = response.items[0]
           //  console.log ("userData=============", usersData);

            if (!usersData) {
                throw new Error("user not found.");
            }

            const updatedData= {
               status: "APPROVED"
            }

            // Merge existing data with updated data
            const updatedUser = { ...usersData, ...updatedData };

            // Save the updated property
            await wixData.update(dbName, updatedUser);

            return `Property ${updatedUser} updated successfully.`;
        } catch (error) {
            throw new Error(`Error updating property: ${error.message}`);
        }
    }
);

 export const blockMember = webMethod(
    Permissions.Anyone,
    async (contactId) => {
        try {
            //  let existingProperty = await wixData.get(dbName, memberId);
            const response = await wixData.query(dbName).eq("contactId", contactId).find();
            const usersData = response.items[0]
           //  console.log ("userData=============", usersData);

            if (!usersData) {
                throw new Error("user not found.");
            }

            const updatedData= {
               status: "BLOCKED"
            }

            // Merge existing data with updated data
            const updatedUser = { ...usersData, ...updatedData };

            // Save the updated property
            await wixData.update(dbName, updatedUser);

            return `Property ${updatedUser} updated successfully.`;
        } catch (error) {
            throw new Error(`Error updating property: ${error.message}`);
        }
    }
);

export const getMembers = webMethod(
    Permissions.Anyone,
    async () => {
        try {
            const usersData = await wixData.query(dbName).eq("status", "PENDING").find()
            return usersData
        } catch (error) {
            console.log("error", error)
            throw new Error(error)
        }
    }
);

export const createUser = webMethod(
    Permissions.Anyone,
    async (input) => {
        try {
            return await wixData.insert(dbName, input)
        } catch (error) {
            console.log("error", error)
            throw new Error(error)
        }
    }
);

export const getUser = webMethod(
    Permissions.Anyone,
    async (contactId) => {
        try {
            const res = await wixData.query(dbName).eq("contactId", contactId).find()
            const userData = res.items[0];
            if (!res.items.length) {
                throw new Error("User not found");
            }
            return userData;
        } catch (error) {
            console.log("error", error)
            throw new Error(error)
        }
    }

);

export const updateUser = webMethod(
    Permissions.Anyone,
    async (id, member) => {
        try {
            console.log("member", member)
            let result = await members.updateMember(id, member);

            if (!result) {
                throw new Error("User not found");
            }

            return result;
        } catch (error) {
            console.error("Failed to update user:", error);
            throw new Error(error);
        }
    }
);

export const getRole = webMethod(
    Permissions.Anyone,
    async (email) => {
        try {
            const userData = await wixData.query(dbName).eq("email", email).find()
            return userData.items[0].isAdmin
        } catch (error) {
            console.log("error", error)
            throw new Error(error)
        }
    });

export const getUserProperty = webMethod(
    Permissions.Anyone,
    async (memberSiteId) => {
        try {
            // Fetch user data and include referenced property data
            const tenantData = await wixData.query("Tenants")
                .eq("memberSiteId", memberSiteId) // Match by userId
                .include("propertyRented", "tenant") // Ensure property reference is included
                .find();
            if (tenantData.items.length === 0) {
                return { message: "No Tenant found" };
            }

            let propertyData = tenantData.items[0].propertyRented;

            return { propertyData, tenantData: tenantData.items[0] };
        } catch (error) {
            console.error("Error fetching user or property data:", error);
            throw new Error(error);
        }
    }
);

export const deleteUser = webMethod(
    Permissions.Anyone,
    async (userId) => {
        try {

            // delete property record
            const userDeletd = await wixData.remove(dbName, userId);
            return userDeletd;

        } catch (error) {
            throw new Error(`Error deleteing user: ${error.message}`);
        }
    }
);


export const totalUserRegistered = webMethod(
    Permissions.Anyone,
    async () => {
        try {
            const res = await wixData.query(dbName).eq("status", "APPROVED").eq("userType", "user")
                .count();

            if (res) {
                return res
            } else {
                throw new Error("Not found")
            }
        } catch (error) {
            throw new Error(error)
        }
    }
);

export const totalBrokerRegistered = webMethod(
    Permissions.Anyone,
    async () => {
        try {
            const res = await wixData.query(dbName).eq("status", "APPROVED").eq("userType", "broker")
                .count();

            if (res) {
                return res
            } else {
                throw new Error("Not found")
            }
        } catch (error) {
            throw new Error(error)
        }
    }
);