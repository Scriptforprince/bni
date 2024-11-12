
function showLoader() { 
    document.getElementById('loader').style.display = 'flex';
  }
  
  function hideLoader() {
    document.getElementById('loader').style.display = 'none';
  }
  
  function formatDateToInputFormat(date) {
    if (!date) return ''; // Return empty string if no date is provided
  
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }



document.addEventListener('DOMContentLoaded', () => {

    const url = window.location.href;
    const urlObj = new URL(url);
    const memberId = urlObj.searchParams.get('member_id');

    showLoader();
    fetch(`https://bni-data-backend.onrender.com/api/getMember/${memberId}`)
        .then(response => {
            if (!response.ok) {
                toastr.error("Something went again try again")
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)   
            // const memberPrefix = document.getElementById("memberPrefix").textContent = data.memberPrefix ;
const memberFirstName = document.getElementById("member_first_name").value = data.member_first_name || 'Not Available';
const memberLastName = document.getElementById("member_last_name").value = data.member_last_name || 'Not Available';
const gender = data.gender || 'male';

const genderSelect = document.getElementById("gender");
genderSelect.value = gender;  
if (!['male', 'female', 'neutral'].includes(gender)) {
    genderSelect.value = 'male';  // Or handle it by setting a default value, like 'male'
}
// Assuming `data.member_date_of_birth` is provided
const memberDateOfBirth = document.getElementById("member_date_of_birth").value = formatDateToInputFormat(data.member_date_of_birth) || '';
const memberPhoneNumber = document.getElementById("member_phone_number").value = data.member_phone_number || 'Not Available';
const memberAlternateMobileNumber = document.getElementById("member_alternate_mobile_number").value = data.member_alternate_mobile_number || 'Not Available';
const memberEmailAddress = document.getElementById("member_email_address").value = data.member_email_address || 'Not Available';
const memberPhoto = document.getElementById("member_photo").src = data.member_photo || 'Not Available'; // Assuming it's an image
const country = data.country || 'Not Available';

// Get the select element
const countrySelect = document.getElementById("country").value="IN";

const addressState = document.getElementById("address_state").value = data.address_state || 'Not Available';
const addressCity = document.getElementById("address_city").value = data.address_city || 'Not Available';
const streetAddressLine1 = document.getElementById("street_address_line_1").value = data.street_address_line_1 || 'Not Available';
const streetAddressLine2 = document.getElementById("street_address_line_2").value = data.street_address_line_2 || 'Not Available';
const addressPincode = document.getElementById("address_pincode").value = data.address_pincode || 'Not Available';
const companyPincode = document.getElementById("address_pincode2").value = data.company_address_pincode || 'Not Available';

const memberGstNumber = document.getElementById("member_gst_number").value = data.member_gst_number || 'Not Available';
const memberCompanyName = document.getElementById("member_company_name").value = data.member_company_name || 'Not Available';
const memberCompanyState = document.getElementById("member_company_state").value = data.member_company_state || 'Not Available';
const memberCompanyCity = document.getElementById("member_company_city").value = data.member_company_city || 'Not Available';
const memberCompanyAddress = document.getElementById("member_company_address").value = data.member_company_address || 'Not Available';
const memberCompanyLogo = document.getElementById("member_company_logo").src = data.member_company_logo || 'Not Available'; // Assuming it's an image
const regionId = document.getElementById("region_id").value = data.region_id || 'Not Available';
const chapterId = document.getElementById("chapter_id").value = data.chapter_id || 'Not Available';
const accoladesContainer = document.getElementById("accoladesContainer").textContent = data.accoladesContainer || 'Not Available';
const category = document.getElementById("category").value = data.member_company_name || 'Not Available';
const memberCurrentMembership = document.getElementById("member_current_membership").value = data.member_current_membership || 'Not Available';
const memberInductionDate = document.getElementById("member_induction_date").value = formatDateToInputFormat(data.member_induction_date)  ;
const memberRenewalDate = document.getElementById("member_renewal_date").value = formatDateToInputFormat(data.member_renewal_date);
const memberFacebook = document.getElementById("member_facebook").value = data.member_facebook || 'Not Available';
const memberInstagram = document.getElementById("member_instagram").value = data.member_instagram || 'Not Available';
const memberLinkedin = document.getElementById("member_linkedin").value = data.member_linkedin || 'Not Available';
const memberYoutube = document.getElementById("member_youtube").value = data.member_youtube || 'Not Available';
const memberWebsite = document.getElementById("member_website").value = data.member_website || 'Not Available';
const memberStatus = document.getElementById("member_status").value = data.member_status || 'Not Available';
const notificationConsent = document.getElementById("notification_consent").checked = data.notification_consent || false;
const dateOfPublishing = document.getElementById("date_of_publishing").value = formatDateToInputFormat(data.date_of_publishing) || 'Not Available';
const memberSponsoredBy = document.getElementById("member_sponsored_by").value = data.member_sponsored_by || 'Not Available';
const formMessage = document.getElementById("formMessage").textContent = data.formMessage || 'Not Available';


        })
        .catch(error => {
            hideLoader()
            toastr.error(error.message);
            console.error('Error fetching data:', error.message || error);
            // Optionally, you could add additional error handling here
          });
});


