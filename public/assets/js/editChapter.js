// Function to show the loader
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

// Function to hide the loader
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// Get chapter_id from the URL
const chapter_id = new URLSearchParams(window.location.search).get("chapter_id");

if (!chapter_id) {
  console.error("Error: chapter_id is missing in the URL");
  alert("Invalid chapter ID. Please check the URL.");
}

// Function to populate Chapter Meeting Day
const populateChapterMeetingDay = (currentDay) => {
  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];
  const selectElement = document.getElementById("chapter_meeting_day");

  // Clear any existing options
  selectElement.innerHTML = '<option value="">Select</option>';

  // Add days of the week
  daysOfWeek.forEach(day => {
    const option = document.createElement("option");
    option.value = day;
    option.textContent = day;

    // Auto-select the current day
    if (day === currentDay) {
      option.selected = true;
    }

    selectElement.appendChild(option);
  });
};

// Function to populate Chapter Type
const populateChapterType = (currentType) => {
  const chapterTypes = ["online", "offline", "Hybrid"];
  const selectElement = document.getElementById("chapter_type");

  // Clear any existing options
  selectElement.innerHTML = '<option value="">Select</option>';

  // Add chapter types
  chapterTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize first letter

    // Auto-select the current type
    if (type === currentType) {
      option.selected = true;
    }

    selectElement.appendChild(option);
  });
};
// Fetch chapter details
const fetchChapterDetails = async () => {
  showLoader();
  try {
    const response = await fetch(`https://bni-data-backend.onrender.com/api/getChapter/${chapter_id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    await populateRegions(data.region_id); // Fetch regions and select the current one
    populateChapterFields(data);
    // Populate Chapter Meeting Day
    populateChapterMeetingDay(data.chapter_meeting_day);

    // Populate Chapter Type
    populateChapterType(data.chapter_type);
  } catch (error) {
    console.error("Error fetching chapter details:", error);
    alert("Failed to load chapter details. Please try again.");
  } finally {
    hideLoader();
  }
};

// Fetch and populate regions
const populateRegions = async (currentRegionId) => {
  try {
    const response = await fetch("https://bni-data-backend.onrender.com/api/regions");
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const regions = await response.json();
    const regionSelect = document.getElementById("region_id");

    // Populate the <select> dropdown
    regionSelect.innerHTML = regions
      .map((region) => `<option value="${region.region_id}">${region.region_name}</option>`)
      .join("");

    // Set the current region as selected
    regionSelect.value = currentRegionId || "";
  } catch (error) {
    console.error("Error fetching regions:", error);
    alert("Failed to load regions. Please try again.");
  }
};

// Populate form fields with chapter data
const populateChapterFields = (data) => {
  document.getElementById("chapter_name").value = data.chapter_name || "Not Found";
  document.getElementById("contact_person").value = data.contact_person || "Not Found";
  document.getElementById("contact_number").value = data.contact_number || "Not Found";
  document.getElementById("email_id").value = data.email_id || "Not Found";
  document.getElementById("eoi_link").value = data.eoi_link || "Not Found";
  document.getElementById("member_app_link").value = data.member_app_link || "Not Found";
  document.getElementById("chapter_mission").value = data.chapter_mission || "Not Found";
  document.getElementById("chapter_vision").value = data.chapter_vision || "Not Found";
  document.getElementById("chapter_kitty_fees").value = data.chapter_kitty_fees || "Not Found";
  document.getElementById("chapter_visitor_fees").value = data.chapter_visitor_fees || "Not Found";
  document.getElementById("chapter_logo").src = data.chapter_logo || "";
  document.getElementById("country").value = data.country || "Not Found";
  document.getElementById("state").value = data.state || "Not Found";
  document.getElementById("city").value = data.city || "Not Found";
  document.getElementById("meeting_hotel_name").value = data.meeting_hotel_name || "Not Found";
  document.getElementById("street_address_line").value = data.street_address_line || "Not Found";
  document.getElementById("postal_code").value = data.postal_code || "Not Found";
  document.getElementById("chapter_facebook").value = data.chapter_facebook || "Not Found";
  document.getElementById("chapter_instagram").value = data.chapter_instagram || "Not Found";
  document.getElementById("chapter_linkedin").value = data.chapter_linkedin || "Not Found";
  document.getElementById("chapter_youtube").value = data.chapter_youtube || "Not Found";
  document.getElementById("chapter_website").value = data.chapter_website || "Not Found";
  document.getElementById("one_time_registration_fee").value = data.one_time_registration_fee || "Not Found";
  document.getElementById("chapter_late_fees").value = data.chapter_late_fees || "Not Found";
  document.getElementById("chapter_membership_fee").value = data.chapter_membership_fee || "Not Found";
  document.getElementById("chapter_membership_fee_two_year").value = data.chapter_membership_fee_two_year || "Not Found";
  document.getElementById("chapter_membership_fee_five_year").value = data.chapter_membership_fee_five_year || "Not Found";
  document.getElementById("date_of_publishing").value =
    data.date_of_publishing ? new Date(data.date_of_publishing).toISOString().split("T")[0] : "Not Found";
  document.getElementById("chapter_launched_by").value = data.chapter_launched_by || "Not Found";
};

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  await fetchChapterDetails();
});
