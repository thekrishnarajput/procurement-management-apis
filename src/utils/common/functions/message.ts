export const messages = {

    notAuthorized: () => {
        return "You are not authorized to perform this action!";
    },

    noTokenProvided: () => {
        return "Authorization failed, no token provided!";
    },

    invalidOrExpiredToken: () => {
        return "Authorization failed, token is invalid!";
    },

    checklistNotSaved: () => {
        return "Item could not be saved!";
    },

    checklistSaved: () => {
        return "Item saved successfully!";
    },

    checklistNotAdded: () => {
        return "Item could not be saved!";
    },

    checklistAdded: () => {
        return "Item saved successfully!";
    },

    checklistNotRemoved: () => {
        return "Item could not be removed!";
    },

    checklistRemoved: () => {
        return "Item removed successfully!";
    },

    checklistNotUpdated: () => {
        return "Item quantity could not be updated!";
    },

    checklistUpdated: () => {
        return "Item quantity updated successfully!";
    },

    clientNotSaved: () => {
        return "Client could not be created!";
    },

    clientSaved: () => {
        return "Client account is created successfully!";
    },

    updatedSuccess: () => {
        return `Data updated successfully!`;
    },

    updatedFailed: () => {
        return `Data couldn't be updated!`;
    },

    deletedSuccess: () => {
        return `Deleted successfully!`;
    },

    deletedFailed: () => {
        return `Sorry, couldn't be deleted!`;
    },

    savedSuccess: () => {
        return `Data saved successfully!`;
    },

    savedFailed: () => {
        return `Data couldn't be saved!`;
    },

    noDataFound: () => {
        return `Sorry, no data found!`;
    },

    dataFound: () => {
        return `Data found!`;
    },

    loginSuccess: () => {
        return `Logged in successfully!`;
    },

    incorrectPassword: () => {
        return `Incorrect password, please enter a correct password!`;
    },

    errorMessage: () => {
        return `Oops! something went wrong, please try again.`;
    },

    blockedOrDeletedMessage: () => {
        return `Oops! looks like this account is blocked or deleted, please contact to the site admin.`;
    },

    alreadyExists: (params: string) => {
        return `Sorry, this ${params} is already linked with another account.`;
    },

    oldPasswordExists: () => {
        return `Sorry, this password is already exists, please choose another password.`;
    },

    validationError: () => {
        return `Please check field's validation!`;
    },

    notFileUploadedError: () => {
        return `No file uploaded!`;
    },

    procurementNotSaved: () => {
        return "Procurement manager could not be created!";
    },

    procurementSaved: () => {
        return "Procurement manager account is created successfully!";
    },  

    inspectionNotSaved: () => {
        return "Inspection manager could not be created!";
    },

    inspectionSaved: () => {
        return "Inspection manager account is created successfully!";
    },
}