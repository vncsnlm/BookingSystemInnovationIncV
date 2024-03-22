import emailjs from "@emailjs/browser";

export function fetchBookingDetails(
    user,
    setError,
    setTimezone,
    setSchedules,
    setReceiverEmail
) {
    //...data
}

export const sendEmail = (
    receiverEmail,
    email,
    fullName,
    message,
    duration
) => {
    emailjs
        .send(
            //service key
            "service_n0e7iki",
            //template key
            "template_0zy0u7y",
            {
                to_email: receiverEmail,
                from_email: email,
                fullName,
                message,
                duration,
            },
            //public key
            "KF4_mtFDaKvoK1FjO"
        )
        .then(
            (result) => {
                console.log(result.text);
                toast.success("Session booked successfully!");
            },
            (error) => {
                console.log(error.text);
                toast.error(error.text);
            }
        );
};