function displayCompanyInfo() {
    const userEmail = localStorage.getItem('loggedInEmail');
    
    console.log('Attempting to fetch data for email:', userEmail);
    
    fetch('https://bni-data-backend.onrender.com/api/members')
        .then(response => response.json())
        .then(members => {
            const member = members.find(m => m.member_email_address === userEmail);
            
            console.log('Found member data:', member);
            
            if (member) {
                // Update basic company information
                document.getElementById('company-name-input').value = member.member_company_name || 'Not Available';
                document.getElementById('company-address-input').value = member.member_company_address || 'Not Available';
                document.getElementById('company-gstin-input').value = member.member_gst_number || 'Not Available';

                // Add phone number and email address
                document.getElementById('phone-number-input').value = member.member_phone_number || 'Not Available';
                document.getElementById('email-address-input').value = member.member_email_address || 'Not Available';

                // Update new fields
                document.getElementById('current-membership-input').value = member.member_current_membership || 'Not Available';
                
                // Format and display renewal date
                const renewalDate = member.member_renewal_date ? 
                    new Date(member.member_renewal_date).toLocaleDateString() : 'Not Available';
                document.getElementById('renewal-date-input').value = renewalDate;

                // Handle company logo
                const logoPreview = document.getElementById('company-logo-preview');
                const noLogoMessage = document.getElementById('no-logo-message');
                
                if (member.member_company_logo && member.member_company_logo !== '{}') {
                    logoPreview.src = member.member_company_logo;
                    logoPreview.style.display = 'block';
                    noLogoMessage.style.display = 'none';
                } else {
                    logoPreview.style.display = 'none';
                    noLogoMessage.style.display = 'block';
                }

               

                // Update social media links
                document.getElementById('facebook').value = member.member_facebook || 'Not Available';
                document.getElementById('Instagram').value = member.member_instagram || 'Not Available';
                document.getElementById('Youtube').value = member.member_youtube || 'Not Available';
                document.getElementById('Linkedin').value = member.member_linkedin || 'Not Available';

                // Add debug logs for social links
                console.log('Facebook:', member.member_facebook);
                console.log('Instagram:', member.member_instagram);
                console.log('Youtube:', member.member_youtube);
                console.log('LinkedIn:', member.member_linkedin);
            } else {
                console.error('Member not found with email:', userEmail);
            }
        })
        .catch(error => {
            console.error('Error fetching member data:', error);
        });
}

// Handle company logo upload
document.getElementById('company-logo-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const logoPreview = document.getElementById('company-logo-preview');
    const noLogoMessage = document.getElementById('no-logo-message');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            logoPreview.src = e.target.result;
            logoPreview.style.display = 'block';
            noLogoMessage.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', displayCompanyInfo);

// Add event listener for the Save Changes button
document.querySelector('.btn-danger').addEventListener('click', function() {
    // Here you can add code to save the updated information
    console.log('Save changes clicked');
    showSuccessToast();
});