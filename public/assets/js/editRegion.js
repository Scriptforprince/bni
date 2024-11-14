function showLoader() { 
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

const dummyData = {};

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
    const regionId = urlObj.searchParams.get('region_id');

    showLoader();

    fetch(`https://bni-data-backend.onrender.com/api/getRegion/${regionId}`)
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
            // Use optional chaining and null checks to prevent errors if elements are missing
            document.getElementById("region_name").value = data?.region_name || "Not Available";
            document.getElementById("late_fees").value = data?.late_fees || "Not Available";
            document.getElementById("contact_person").value = data?.contact_person || "Not Available";
            document.getElementById("contact_number").value = data?.contact_number || "Not Available";
            document.getElementById("email_id").value = data?.email_id || "Not Available";
            document.getElementById("mission").value = data?.mission || "Not Available";
            document.getElementById("vision").value = data?.vision || "Not Available";
            document.getElementById("region_status").value = data?.region_status || "Not Available";
            document.getElementById("region_logo").src = data?.region_logo || "Not Available";
            document.getElementById("country").value = data?.country || "IN";
            document.getElementById("state").value = data?.state || "Not Available";
            document.getElementById("city").value = data?.city || "Not Available";
            const daysOfChapter = data?.days_of_chapter || [];
    const dayCheckboxes = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    dayCheckboxes.forEach(day => {
        const checkbox = document.getElementById(`day${day}`);
        if (checkbox) {
            checkbox.checked = daysOfChapter.includes(day);
        }
    });


    const regionTypes = data?.chapter_type || [];
    
    // Define an array of checkbox elements with corresponding values
    const statusCheckboxes = [
        { id: "statusRunning", value: "running" },
        { id: "statusPreLaunch", value: "pre-launch" },
        { id: "statusReLaunch", value: "re-launch" }
    ];

    // Loop through each checkbox and check it if its value is in the chapterTypes array
    const chapterTypes = data?.chapter_type || []; // ["Online", "Offline", "Hybrid"]

    // Define the array of checkbox elements with corresponding values
    const typeCheckboxes = [
        { id: "typeOnline", value: "Online" },
        { id: "typeOffline", value: "Offline" },
        { id: "typeHybrid", value: "Hybrid" }
    ];

    // Loop through each checkbox and check it if its value is in the chapterTypes array
    typeCheckboxes.forEach(type => {
        const checkbox = document.getElementById(type.id);
        if (checkbox) {
            // Check if the chapter type exists in the data array and check the checkbox
            checkbox.checked = chapterTypes.includes(type.value);
        }
    });
    
            document.getElementById("street_address_line_1").value = data?.street_address_line_1 || "Not Available";
            document.getElementById("street_address_line_2").value = data?.street_address_line_2 || "Not Available";
            document.getElementById("postal_code").value = data?.postal_code || "Not Available";
            document.getElementById("social_facebook").value = data?.social_facebook || "Not Available";
            document.getElementById("social_instagram").value = data?.social_instagram || "Not Available";
            document.getElementById("social_linkedin").value = data?.social_linkedin || "Not Available";
            document.getElementById("social_youtube").value = data?.social_youtube || "Not Available";
            document.getElementById("website_link").value = data?.website_link || "Not Available";
            document.getElementById("one_time_registration_fee").value = data?.one_time_registration_fee || "Not Available";
            // document.getElementById("region_late_fees").value = data?.late_fees || "Not Available";
            // document.getElementById("region_membership_fee").value = data?.one_year_fee || "Not Available";
            // document.getElementById("region_membership_fee_two_year").value = data?.two_year_fee || "Not Available";
            // document.getElementById("region_membership_fee_five_year").value = data?.five_year_fee || "Not Available";
            document.getElementById("date_of_publishing").value = formatDateToInputFormat(data?.date_of_publishing) || "Not Available";
            document.getElementById("region_launched_by").value = data?.region_launched_by || "Not Available";
            
            // If formMessage is not directly in data, ensure it is accessible
            document.getElementById("formMessage").value = data?.formMessage || "Not Available";
        }
});
