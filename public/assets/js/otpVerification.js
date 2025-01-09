// Extract email and login_type from query params
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const login_type = urlParams.get('login_type');

document.querySelector('.email b').textContent = email;

console.log(email);
console.log(login_type);

document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
  input.addEventListener('input', () => {
      if (input.value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
      }
  });
});

document.getElementById('otpVerificationForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const otpInputs = document.querySelectorAll('.otp-input');
  const otpCode = Array.from(otpInputs).map(input => input.value).join('');

  if (otpCode.length !== 6) {
    Swal.fire({
        icon: 'warning',
        title: 'Invalid OTP',
        text: 'Please enter a 6-digit OTP',
        confirmButtonText: 'OK'
    });
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
      localStorage.setItem('loggedInEmail', email);
      localStorage.setItem('loginType', login_type);
      Swal.fire({
          icon: 'success',
          title: 'Login successful!',
          text: 'You are being redirected...',
          confirmButtonText: 'OK'
      }).then(() => {
          // Redirect based on login_type
          let redirectUrl = '/';
          if (login_type === 'ro_admin') {
              redirectUrl = '/d/ro-dashboard';
          } else if (login_type === 'chapter') {
              redirectUrl = '/d/chapter-dashboard';
          } else if (login_type === 'member') {
              redirectUrl = '/d/member-dashboard';
          }
  
          window.location.href = redirectUrl;
      });
  }  else {
    Swal.fire({
        icon: 'error',
        title: 'OTP Verification Failed',
        text: result.message || 'OTP verification failed',
        confirmButtonText: 'OK'
    });
}
  } catch (error) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.',
        confirmButtonText: 'OK'
    });
}
});


