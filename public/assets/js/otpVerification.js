document.addEventListener("DOMContentLoaded", () => {
    const otpInputs = document.querySelectorAll(".otp-input");
    const form = document.getElementById("otpForm");
    const verifyBtn = document.getElementById("verifyBtn");
    const resendOtp = document.getElementById("resendOtp");

    let otpCode = ''; // Store the OTP code temporarily

    // Focus on the next input after typing
    otpInputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && index > 0 && !input.value) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // Handle form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get the entered OTP
        const enteredOtp = Array.from(otpInputs)
            .map((input) => input.value)
            .join("");

        console.log("Entered OTP:", enteredOtp);

        // Simulate OTP API verification
        verifyBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Verifying...`;
        verifyBtn.disabled = true;

        // Get the user from localStorage and parse it
        const user = JSON.parse(localStorage.getItem("user")); // Parse the user data
      
      
        
        // Assuming user has a 'userId' field
        const userId=user.userId;
        console.log(userId)
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, otp: enteredOtp }),
            });

            const data = await response.json();

            if (data.success) {
                verifyBtn.innerHTML = "OTP Verified";
                alert(data.message);
                window.location.href = "/d/ro-dashboard"; 
                // You could redirect to another page if OTP is verified successfully
            } else {
                verifyBtn.innerHTML = "Verify OTP";
                alert(data.message);
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            verifyBtn.innerHTML = "Verify OTP";
            alert("An error occurred while verifying the OTP.");
        }
    });

    // Handle Resend OTP
    resendOtp.addEventListener("click", async (e) => {
        e.preventDefault();
        alert("OTP Resent!");

        // You could trigger an API call to resend the OTP here
    });
});