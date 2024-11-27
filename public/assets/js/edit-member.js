// Show/hide loader functions
function showLoader() {
  document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

// Function to populate select options
function populateSelectOptions(selectId, data, valueKey, textKey, selectedValue) {
  const selectElement = document.getElementById(selectId);
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item[valueKey];
    option.textContent = item[textKey];
    if (item[valueKey] === selectedValue) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });
}


function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Add leading zero for months < 10
  const day = String(d.getDate()).padStart(2, '0'); // Add leading zero for days < 10
  return `${year}-${month}-${day}`;
}

document.addEventListener('DOMContentLoaded', async function () {
  // Get the member ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const memberId = urlParams.get('member_id');
  console.log(memberId);

  if (!memberId) {
    alert('No member ID provided!');
    return;
  }

  // Show loader
  showLoader();

  try {
    // Fetch member data
    const memberResponse = await fetch(`https://bni-data-backend.onrender.com/api/getMember/${memberId}`);
    if (!memberResponse.ok) throw new Error('Error fetching member data');

    const member = await memberResponse.json(); // Directly get the member object

    console.log(member); // Debug: Check the structure of the response

    // If member data is not found
    if (!member) {
      alert('Member not found!');
      return;
    }

     // Fetch and populate regions
     const regionResponse = await fetch('https://bni-data-backend.onrender.com/api/regions'); // Adjust the endpoint accordingly
     if (!regionResponse.ok) throw new Error('Error fetching regions data');
     const regions = await regionResponse.json();
     populateSelectOptions('region_id', regions, 'region_id', 'region_name', member.region_id);
 
     // Fetch and populate chapters
     const chapterResponse = await fetch('https://bni-data-backend.onrender.com/api/chapters'); // Adjust the endpoint accordingly
     if (!chapterResponse.ok) throw new Error('Error fetching chapters data');
     const chapters = await chapterResponse.json();
     populateSelectOptions('chapter_id', chapters, 'chapter_id', 'chapter_name', member.chapter_id);

      // Fetch all accolades
    const accoladesResponse = await fetch('https://bni-data-backend.onrender.com/api/accolades');
    if (!accoladesResponse.ok) throw new Error('Error fetching accolades');
    
    const accolades = await accoladesResponse.json(); // This should return a list of accolades

    // Populate the accolades (checkboxes or options)
    const accoladesContainer = document.getElementById('accoladesContainer');
    accoladesContainer.innerHTML = ''; // Clear any existing content

    accolades.forEach(accolade => {
      const accoladeId = accolade.accolade_id;
      const accoladeName = accolade.accolade_name;

      // Create a checkbox for each accolade
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `accolade_${accoladeId}`;
      checkbox.name = 'accolades';
      checkbox.value = accoladeId;

      // Check if the member has this accolade
      if (member.accolades_id.includes(accoladeId)) {
        checkbox.checked = true;
      }

      const label = document.createElement('label');
      label.setAttribute('for', `accolade_${accoladeId}`);
      label.innerText = accoladeName;

      // Append checkbox and label to the container
      accoladesContainer.appendChild(checkbox);
      accoladesContainer.appendChild(label);
      accoladesContainer.appendChild(document.createElement('br'));
    });

    // Fetch and populate categories
    const categoryResponse = await fetch('https://bni-data-backend.onrender.com/api/memberCategory');
    if (!categoryResponse.ok) throw new Error('Error fetching categories');
    
    const categories = await categoryResponse.json(); // This should return a list of categories

    // Populate the categories dropdown
    const defaultCategory = "Digital Marketing"; // Default category if no category is selected
    populateSelectOptions('category', categories, 'category_id', 'category_name', member.category_id || defaultCategory);

    // Set the default value of the membership select box to 2 (2 Year)
    const membershipSelect = document.getElementById('member_current_membership');
      
    // Set the selected membership value
    membershipSelect.value = member.member_current_membership || 2; // Default to 2 Year if no value is found

    // Fetch all countries from the API
    const countriesResponse = await fetch('https://restcountries.com/v3.1/all');
    if (!countriesResponse.ok) throw new Error('Error fetching countries data');
    
    const countries = await countriesResponse.json();

    // Get the country select element
    const countrySelect = document.getElementById('country');
    
    // Loop through countries and add them to the select dropdown
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.cca2; // Using the country code as value
      option.textContent = country.name.common; // Country name as text
      countrySelect.appendChild(option);
    });

    // Set default country to India (if available)
    const indiaOption = Array.from(countrySelect.options).find(option => option.textContent === 'India');
    if (indiaOption) {
      indiaOption.selected = true;
    }

    // Populate other member fields
    document.getElementById('member_first_name').value = member.member_first_name || 'Not Found';
    document.getElementById('member_last_name').value = member.member_last_name || 'Not Found';
    document.getElementById('member_date_of_birth').value = formatDate(member.member_date_of_birth);
    document.getElementById('member_phone_number').value = member.member_phone_number || 'Not Found';
    document.getElementById('member_alternate_mobile_numberr').value = member.member_alternate_mobile_number || 'Not Found';
    document.getElementById('member_email_address').value = member.member_email_address || 'Not Found';
    document.getElementById('street_address_line_1').value = member.street_address_line_1 || 'Not Found';
    document.getElementById('street_address_line_2').value = member.street_address_line_2 || 'Not Found';
    document.getElementById('address_pincode').value = member.address_pincode || 'Not Found';
    document.getElementById('address_city').value = member.address_city || 'Not Found';
    document.getElementById('address_state').value = member.address_state || 'Not Found';
    document.getElementById('member_induction_date').value = member.member_induction_date ? member.member_induction_date.substring(0, 10) : 'Not Found';
    document.getElementById('member_renewal_date').value = member.member_renewal_date ? member.member_renewal_date.substring(0, 10) : 'Not Found';
    document.getElementById('member_gst_number').value = member.member_gst_number || 'Not Found';
    document.getElementById('member_company_name').value = member.member_company_name || 'Not Found';
    document.getElementById('member_company_address').value = member.member_company_address || 'Not Found';
    document.getElementById('member_company_state').value = member.member_company_state || 'Not Found';
    document.getElementById('member_company_city').value = member.member_company_city || 'Not Found';
    document.getElementById('member_company_pincode').value = member.member_company_pincode || 'Not Found';
    document.getElementById('member_photo').src = member.member_photo || 'Not Found';
    document.getElementById('member_status').value = member.member_status || 'Not Found';
    document.getElementById('member_website').value = member.member_website || 'Not Found';
    document.getElementById('member_company_logo').src = member.member_company_logo || 'Not Found';

    document.getElementById('member_facebook').value = member.member_facebook || 'Not Found';
    document.getElementById('member_instagram').value = member.member_instagram || 'Not Found';
    document.getElementById('member_linkedin').value = member.member_linkedin || 'Not Found';
    document.getElementById('member_youtube').value = member.member_youtube || 'Not Found';
    document.getElementById('member_sponsored_by').value = member.member_sponsored_by || 'Not Found';
    document.getElementById('date_of_publishing').value = formatDate(member.date_of_publishing);

  } catch (error) {
    console.error('Error fetching member details:', error);
  } finally {
    // Hide loader
    hideLoader();
  }
});
