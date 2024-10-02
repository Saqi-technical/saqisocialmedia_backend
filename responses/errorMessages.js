const errorMessages = {
    User: {
        createError: "Error creating user",
        updateError: "Error updating user",
        loginError: "Error logging in user",
        logoutError: "Error logging out user",
        deleteError: "Error deleting user",
        resetPasswordError: "Error resetting password",
        alreadyExist:"User already exist",
        notFound:"User not found",
        tokenNotFound:"Token not found",

    },
    invalidPassword:"Invalid Password",
    emailNotValid:"Email not valid",

    Admin: {
        createError: "Error creating admin",
        updateError: "Error updating admin",
        loginError: "Error logging in admin",
        logoutError: "Error logging out admin",
        deleteError: "Error deleting admin",
        resetPasswordError: "Error resetting admin password",
        alreadyExist:"Admin already exist",
        notFound:"Admin not found",
        tokenNotFound:"Token not found"
    },

    Order: {
        createError: "Error creating order",
        updateError: "Error updating order",
        deleteError: "Error deleting order",
        cancelError: "Error cancelling order",
        completeError: "Error completing order",
        notFound:"Error finding order"
    }
}

module.exports = errorMessages;
