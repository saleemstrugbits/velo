import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';

const dbName = "UserListing" //intrested property user table name

export const addIntrestedProperty = webMethod(
    Permissions.Anyone,
    async (input) => {
        try {
            return await wixData.insert(dbName, input)
        } catch (error) {
            throw new Error(error)
        }
    }
);

//  export const updateIntrestedProperty = webMethod(
//      Permissions.Anyone,
//      async (propertyId, updatedData) => {
//          try {
//              let existingProperty = await wixData.get(dbName, propertyId);

//              if (!existingProperty) {
//                  throw new Error("Property not found.");
//              }

//              // Merge existing data with updated data
//              const updatedProperty = { ...existingProperty, ...updatedData };

//              // Save the updated property
//              await wixData.update(dbName, updatedProperty);

//              return `Property ${propertyId} updated successfully.`;
//          } catch (error) {
//              throw new Error(`Error updating property: ${error.message}`);
//          }
//      }
//  );

//  export const getProperty = webMethod(
//      Permissions.Anyone,
//      async (id) => {
//          try {
//              const res = await wixData.get(dbName, id)
//              if (res) {
//                  return res
//              } else {
//                  throw new Error("Not found")
//              }
//          } catch (error) {
//              throw new Error(error)
//          }
//      }
//  );

export const getIntrestedProperties = webMethod(
    Permissions.Anyone,
    async () => {
        try {
            const res = await wixData.query(dbName)
                .find();

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

//   export const getActiveProperties = webMethod(
//      Permissions.Anyone,
//      async () => {
//          try {
//              const res = await wixData.query(dbName)
//                  .eq("status", "Active")
//                  .find();

//              if (res) {
//                  return res
//              } else {
//                  throw new Error("Not found")
//              }
//          } catch (error) {
//              throw new Error(error)
//          }
//      }
//  );

export const findIntrestedProperty = webMethod(
    Permissions.Anyone,
    async (userId, propertyId) => {
        try {
            const res = await wixData.query(dbName)
                .eq("userId", userId)
                .eq("propertyId", propertyId)
                .find();

            if (res) {
                return res.items[0]
            } else {
                return "not Found"
            }
        } catch (error) {
            throw new Error(error)
        }
    }
);

export const findIntrestedPropertyByBrokerId = webMethod(
    Permissions.Anyone,
    async (brokerId) => {
        try {
            const res = await wixData.query(dbName)
                .eq("brokerId", brokerId)
                .find();

            if (res) {
                return res
            } else {
                return "not Found"
            }
        } catch (error) {
            throw new Error(error)
        }
    }
);

//  export const deleteProperty = webMethod(
//      Permissions.Anyone,
//      async (propertyId) => {
//          try {

//              // delete property record
//              const propertyDeletd = await wixData.remove(dbName, propertyId);
//              return propertyDeletd;

//          } catch (error) {
//              throw new Error(`Error deleteing property: ${error.message}`);
//          }
//      }
//  );