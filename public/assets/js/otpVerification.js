// Extract email from query params
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
console.log(email);

document.getElementById('otpVerificationForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const otpInputs = document.querySelectorAll('.otp-input');
  const otpCode = Array.from(otpInputs).map(input => input.value).join('');

  if (otpCode.length !== 6) {
    alert('Please enter a 6-digit OTP');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: otpCode }),
    });

    const result = await response.json();

    if (result.success) {
      alert('Login successful!');
      window.location.href = '/d/ro-dashboard'; // Redirect to dashboard
    } else {
      alert(result.message || 'OTP verification failed');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
  }
});
