
function showLoader() { 
    document.getElementById('loader').style.display = 'flex';
  }
  
  function hideLoader() {
    document.getElementById('loader').style.display = 'none';
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
// Create an object to hold all chapter data
const chapterData = {
    chapter_name: document.getElementById("chapter_name")?.value,
    region_id: document.getElementById("region_id")?.value,
    accolades_list: document.getElementById("accolades-list")?.value,
    chapter_meeting_day: document.getElementById("chapter_meeting_day")?.value,
    chapter_type: document.getElementById("chapter_type")?.value,
    contact_person: document.getElementById("contact_person")?.value,
    contact_number: document.getElementById("contact_number")?.value,
    email_id: document.getElementById("email_id")?.value,
    taxType1: document.getElementById("taxType1")?.value,
    taxOptions1: document.getElementById("taxOptions1")?.value,
    taxType2: document.getElementById("taxType2")?.value,
    taxOptions2: document.getElementById("taxOptions2")?.value,
    taxType3: document.getElementById("taxType3")?.value,
    taxOptions3: document.getElementById("taxOptions3")?.value,
    eoi_link: document.getElementById("eoi_link")?.value,
    member_app_link: document.getElementById("member_app_link")?.value,
    chapter_mission: document.getElementById("chapter_mission")?.value,
    chapter_vision: document.getElementById("chapter_vision")?.value,
    chapter_kitty_fees: document.getElementById("chapter_kitty_fees")?.value,
    taxable1: document.getElementById("taxable1")?.value,
    chapter_visitor_fees: document.getElementById("chapter_visitor_fees")?.value,
    chapter_status: document.getElementById("chapter_status")?.value,
    chapter_logo: document.getElementById("chapter_logo")?.value,
    country: document.getElementById("country")?.value,
    state: document.getElementById("state")?.value,
    city: document.getElementById("city")?.value,
    meeting_hotel_name: document.getElementById("meeting_hotel_name")?.value,
    street_address_line: document.getElementById("street_address_line")?.value,
    postal_code: document.getElementById("postal_code")?.value,
    chapter_location_note: document.getElementById("chapter_location_note")?.value,
    chapter_facebook: document.getElementById("chapter_facebook")?.value,
    chapter_instagram_link: document.getElementById("chapter_instagram-link")?.value,
    chapter_instagram: document.getElementById("chapter_instagram")?.value,
    chapter_linkedin: document.getElementById("chapter_linkedin")?.value,
    chapter_youtube: document.getElementById("chapter_youtube")?.value,
    chapter_website: document.getElementById("chapter_website")?.value,
    one_time_registration_fee: document.getElementById("one_time_registration_fee")?.value,
    chapter_late_fees: document.getElementById("chapter_late_fees")?.value,
    chapter_membership_fee: document.getElementById("chapter_membership_fee")?.value,
    chapter_membership_fee_two_year: document.getElementById("chapter_membership_fee_two_year")?.value,
    chapter_membership_fee_five_year: document.getElementById("chapter_membership_fee_five_year")?.value,
    date_of_publishing: document.getElementById("date_of_publishing")?.value,
    chapter_launched_by: document.getElementById("chapter_launched_by")?.value,
    formMessage: document.getElementById("formMessage")?.value,
};

// Log the data for debugging
console.log(chapterData);

        })
        .catch(error => {
            hideLoader()
            toastr.error(error.message);
            console.error('Error fetching data:', error.message || error);
            // Optionally, you could add additional error handling here
          });
});


