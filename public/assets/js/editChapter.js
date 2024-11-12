
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
    const ChapterId = urlObj.searchParams.get('chapter_id');

    showLoader();


    fetch(`https://bni-data-backend.onrender.com/api/getChapter/${ChapterId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            hideLoader();
            populateData(data || dummyData); // Use fetched data or dummyData if empty
        })
        .catch(error => {
            hideLoader();
            toastr.error("Something went wrong, using fallback data");
            console.error('Error fetching data:', error.message || error);
            populateData(dummyData); // Use dummy data if fetch fails
        });

    function populateData(data) {
        document.getElementById("chapter_name").value = data.chapter_name || "Not Available";
        document.getElementById("region_id").value = data.region_id || "Not Available";
        document.getElementById("contact_person").value = data.contact_person || "Not Available";
        document.getElementById("contact_number").value = data.contact_number || "Not Available";
        document.getElementById("email_id").value = data.email_id || "Not Available";
        document.getElementById("eoi_link").value = data.eoi_link || "Not Available";
        document.getElementById("member_app_link").value = data.member_app_link || "Not Available";
        document.getElementById("chapter_mission").value = data.chapter_mission || "Not Available";
        document.getElementById("chapter_vision").value = data.chapter_vision || "Not Available";
        document.getElementById("chapter_kitty_fees").value = data.chapter_kitty_fees || "Not Available";
        document.getElementById("chapter_visitor_fees").value = data.chapter_visitor_fees || "Not Available";
        document.getElementById("chapter_status").value = data.chapter_status || "Not Available";
        document.getElementById("chapter_logo").src = data.chapter_logo || "Not Available";
        document.getElementById("country").value = data.country || "Not Available";
        document.getElementById("state").value = data.state || "Not Available";
        document.getElementById("city").value = data.city || "Not Available";
        document.getElementById("meeting_hotel_name").value = data.meeting_hotel_name || "Not Available";
        document.getElementById("street_address_line").value = data.street_address_line || "Not Available";
        document.getElementById("postal_code").value = data.postal_code || "Not Available";
        document.getElementById("chapter_location_note").value = data.chapter_location_note || "Not Available";
        document.getElementById("chapter_facebook").value=data? data.chapter_facebook:"Not Available";
        // document.getElementById("chapter_instagram").value=data? data.chapter_instagram:"Not Available";
  document.getElementById("chapter_instagram").value=data? data.chapter_instagram:"Not Available";
    document.getElementById("chapter_linkedin").value=data? data.chapter_linkedin:"Not Available";
   document.getElementById("chapter_youtube").value=data? data.chapter_youtube:"Not Available";
   document.getElementById("chapter_website").value=data? data.chapter_website:"Not Available";
 document.getElementById("one_time_registration_fee").value=data? data.one_time_registration_fee:"Not Available";
   document.getElementById("chapter_late_fees").value=data? data.chapter_late_fees:"Not Available";
   document.getElementById("chapter_membership_fee").value=data? data.chapter_membership_fee:"Not Available";
    document.getElementById("chapter_membership_fee_two_year").value=data? data.chapter_membership_fee_two_year:"Not Available";
 document.getElementById("chapter_membership_fee_five_year").value=data? data.chapter_membership_fee_five_year:"Not Available";
   document.getElementById("date_of_publishing").value=data?formatDateToInputFormat(data.date_of_publishing):"Not Available";
   document.getElementById("chapter_launched_by").value=data? data.chapter_launched_by:"Not Available";
  document.getElementById("formMessage").value=data? data.formMessage:"Not Available";
    }

});

