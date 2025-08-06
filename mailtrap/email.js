import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { mailTrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipients = [ { email,}]

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: "Email Verification",
        })
    } catch (error) {
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
}

export const sendWelcomeEmail = async (email, name) =>{
    const recipients = [ { email,}]

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: "953c36ee-7842-4ded-b616-c43ee6cff54d",
            template_variables: {
                name: name,
                company_info_name: "Ahsan Company",
            }
        })
    } catch (error) {
        throw new Error(`Failed to send welcome email: ${error.message}`)
    }
}

export const sendResetPasswordEmail = async (email, resetUrl) => {
    const recipients = [ { email } ]

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipients,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetUrl),
            category: "Reset Password",
        })
    } catch (error) {
        throw new Error(`Failed to send reset password email: ${error.message}`);
    }
}

export const sendResetPasswordSuccessEmail = async (email) => {
    const recipients = [ { email } ]

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipients,
            subject: "Reset Password Success",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reset Password",
        })
    } catch (error) {
        throw new Error(`Failed to send reset password email: ${error.message}`);
    }
}