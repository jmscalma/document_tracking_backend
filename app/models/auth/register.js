const registerSchema =
{
    title: "Register schema",
    type: "object",
    required:["user_name", "user_email", "password", "user_role"],
    properties: {
        user_name: {
            type: "string",
            minLength: 10,
            maxLength: 50,
            pattern: `[^<>"']+$`
        },
        user_email: {
            type: "string",
            minLength: 10,
            maxLength: 50,
            pattern: "^[a-zA-Z0-9!@#.$%^&]+@[a-z.]+.[a-z]{2,3}$"
        },
        password: {
            type: "string",
            minLength: 2,
            maxLength: 255,
            pattern: `[^<>"']+$`
        },
        user_role:{
            type: "string",
            minLength: 2,
            maxLength: 20,
            pattern: `[^<>"']+$`
        },
    }

};

module.exports = registerSchema;